import { mapVideo } from './map-video-config';
/** Preload near the map, then play silently once during its two-second reveal. */
type Controller = { seek: (progress: number) => void; play: () => void; static: () => void };
const controllers = new WeakMap<HTMLElement, Controller>();
const targets = new WeakMap<HTMLElement, number>();
export function seekMapVideo(root: HTMLElement, progress: number) {
  targets.set(root, progress);
  controllers.get(root)?.seek(progress);
}
export function stopMapVideo(root: HTMLElement) { controllers.get(root)?.static(); }
export function playMapVideo(root: HTMLElement) { controllers.get(root)?.play(); }

export function attachMapVideo(root: HTMLElement, video: HTMLVideoElement, container: HTMLElement) {
  let disposed = false, started = false, failed = false, frame = 0, playing = false, staticMode = false;
  let target = targets.get(root) ?? 0;
  let loadTimer = 0, arrivalTimer = 0, stallTimer = 0;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const expectedTime = () => Math.min(Math.max(0, video.duration - 1 / mapVideo.fps), target * video.duration);
  const isCurrent = () => video.readyState >= 2 && !video.seeking && Number.isFinite(video.duration)
    && Math.abs(video.currentTime - expectedTime()) <= 1 / mapVideo.fps;
  const clearTimers = () => {
    clearTimeout(loadTimer); clearTimeout(arrivalTimer); clearTimeout(stallTimer);
    loadTimer = arrivalTimer = stallTimer = 0;
  };
  const fail = () => {
    if (disposed || failed || media.matches) return;
    failed = true; clearTimers(); video.pause(); container.dataset.videoState = 'error';
    root.dispatchEvent(new Event('invitation-map-failed'));
  };
  const guardArrival = () => {
    // Allow a normal decoder seek to finish; never leave the arrival card on the
    // opening map when a request or seek is stuck without emitting an error.
    if (target < .95 || isCurrent()) { clearTimeout(arrivalTimer); arrivalTimer = 0; }
    else if (started && !failed && !media.matches && !arrivalTimer) {
      arrivalTimer = window.setTimeout(() => { arrivalTimer = 0; if (target >= .95 && !isCurrent()) fail(); }, 1200);
    }
  };
  const update = () => {
    frame = 0;
    if (disposed || !started || failed || media.matches || playing || staticMode) return;
    guardArrival();
    if (video.readyState < 1 || video.seeking) return;
    if (Math.abs(video.currentTime - expectedTime()) > 1 / (mapVideo.fps * 2)) {
      try { video.currentTime = expectedTime(); } catch { fail(); }
    } else if (isCurrent()) container.dataset.videoState = 'ready';
  };
  const schedule = () => { if (!frame && !disposed && !failed) frame = requestAnimationFrame(update); };
  const start = () => {
    if (started || disposed || failed || media.matches || staticMode) return;
    started = true; container.dataset.videoState = 'loading';
    loadTimer = window.setTimeout(() => { if (video.readyState < 2) fail(); }, 10000);
    video.src = mapVideo.src; video.preload = 'auto'; video.load(); guardArrival();
  };
  const settled = () => {
    if (disposed || failed || media.matches || staticMode) return;
    if (video.readyState >= 2) { clearTimeout(loadTimer); loadTimer = 0; }
    if (isCurrent()) {
      clearTimeout(stallTimer); stallTimer = 0; container.dataset.videoState = 'ready';
    }
    guardArrival(); schedule();
  };
  const stalled = () => {
    if (!failed && !disposed && !media.matches && !stallTimer) {
      stallTimer = window.setTimeout(() => { stallTimer = 0; if (!isCurrent()) fail(); }, 3000);
    }
  };
  const controller: Controller = {
    seek(progress) {
      target = Math.max(0, Math.min(1, progress));
      if (playing && target < 1) return;
      if (playing) { playing = false; video.pause(); }
      guardArrival(); schedule();
    },
    play() {
      if (disposed || media.matches) return;
      if (failed || video.readyState < 2 || !Number.isFinite(video.duration)) { fail(); return; }
      staticMode = false; playing = true; clearTimers(); container.dataset.videoState = 'ready';
      video.playbackRate = video.duration / (2 * mapVideo.arrival);
      void video.play().catch(fail);
    },
    static() { staticMode = true; playing = false; clearTimers(); video.pause(); container.dataset.videoState = 'static'; },
  };
  controllers.set(root, controller);
  video.addEventListener('loadedmetadata', schedule);
  video.addEventListener('loadeddata', settled);
  video.addEventListener('seeked', settled);
  video.addEventListener('error', fail);
  video.addEventListener('stalled', stalled); video.addEventListener('waiting', stalled);
  const change = () => {
    if (media.matches || staticMode) controller.static();
    else if (!failed) {
      container.dataset.videoState = 'loading';
      if (!started) start(); else if (video.readyState < 2) loadTimer = window.setTimeout(fail, 10000);
      guardArrival(); schedule();
    }
  };
  media.addEventListener('change', change);
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) start(); }, { rootMargin: '600px' });
  observer.observe(container);
  if (media.matches) controller.static();
  return () => {
    disposed = true; clearTimers(); cancelAnimationFrame(frame); observer.disconnect(); controllers.delete(root);
    media.removeEventListener('change', change);
    video.removeEventListener('loadedmetadata', schedule); video.removeEventListener('loadeddata', settled);
    video.removeEventListener('seeked', settled); video.removeEventListener('error', fail);
    video.removeEventListener('stalled', stalled); video.removeEventListener('waiting', stalled);
    video.pause(); video.removeAttribute('src'); video.load();
  };
}
