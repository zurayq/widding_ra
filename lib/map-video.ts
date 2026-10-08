import { mapVideo } from './map-video-config';
/** A latest-target seek queue: one decoder seek in flight, never autoplay. */
type Controller = { seek: (progress: number) => void; static: () => void };
const controllers = new WeakMap<HTMLElement, Controller>();
const targets = new WeakMap<HTMLElement, number>();
export function seekMapVideo(root: HTMLElement, progress: number) {
  targets.set(root, progress);
  controllers.get(root)?.seek(progress);
}
export function stopMapVideo(root: HTMLElement) { controllers.get(root)?.static(); }

export function attachMapVideo(root: HTMLElement, video: HTMLVideoElement, container: HTMLElement) {
  let disposed = false, started = false, failed = false, frame = 0;
  let target = targets.get(root) ?? 0;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => {
    frame = 0;
    if (disposed || !started || failed || media.matches || video.readyState < 1 || video.seeking) return;
    const time = Math.min(Math.max(0, video.duration - 1 / 60), target * video.duration);
    if (Math.abs(video.currentTime - time) > 1 / 120) {
      try { video.currentTime = time; } catch { fail(); }
    } else if (video.readyState >= 2) container.dataset.videoState = 'ready';
  };
  const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(update); };
  const fail = () => { failed = true; video.pause(); container.dataset.videoState = 'error'; };
  const start = () => {
    if (started || disposed || media.matches) return;
    started = true; container.dataset.videoState = 'loading';
    video.src = mapVideo.src; video.preload = 'auto'; video.load();
  };
  const settled = () => {
    const expected=Math.min(Math.max(0,video.duration-1/60),target*video.duration);
    if (video.readyState >= 2 && !media.matches && !failed && Math.abs(video.currentTime-expected)<1/30) container.dataset.videoState = 'ready';
    schedule();
  };
  const controller: Controller = {
    seek(progress) { target = Math.max(0, Math.min(1, progress)); schedule(); },
    static() { video.pause(); container.dataset.videoState = 'static'; },
  };
  controllers.set(root, controller);
  video.addEventListener('loadedmetadata', schedule);
  video.addEventListener('loadeddata', settled);
  video.addEventListener('seeked', settled);
  video.addEventListener('error', fail);
  const change = () => { if (media.matches) controller.static(); else { if (!failed) container.dataset.videoState = 'loading'; start(); schedule(); } };
  media.addEventListener('change', change);
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) start(); }, { rootMargin: '600px' });
  observer.observe(container);
  if (media.matches) controller.static();
  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect(); controllers.delete(root);
    media.removeEventListener('change', change);
    video.removeEventListener('loadedmetadata', schedule); video.removeEventListener('loadeddata', settled);
    video.removeEventListener('seeked', settled); video.removeEventListener('error', fail);
    video.pause(); video.removeAttribute('src'); video.load();
  };
}
