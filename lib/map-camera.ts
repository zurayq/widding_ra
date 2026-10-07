import { seekMapVideo, stopMapVideo } from './map-video';
type Point = { x: number; y: number };
export const mapCameraConfig = {
  scrollDistance: 1100,
  noteStart: .82, noteEnd: .95,
};
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (v: number) => { const t = clamp(v); return t*t*(3-2*t); };
const between = (v: number, a: number, b: number) => ease((v-a)/(b-a));
const mix = (a: number, b: number, t: number) => a+(b-a)*t;
export type MapCameraPose = { width: number; height: number; x: number; y: number; scale: number; opacity: number };
export type MapGeometry = {
  frame: { x: number; y: number; width: number; height: number };
  pinHeight: number; duration: number;
  note: { x: number; y: number; width: number; height: number };
  cityAnchor: Point;
};
const measured = new WeakMap<HTMLElement, MapGeometry>();
const elements = new WeakMap<HTMLElement,{planes:HTMLElement[];marker:HTMLElement|null;note:HTMLElement|null}>();

function annotationRect(anchor: Point, width: number, height: number, noteWidth: number, noteHeight: number) {
  return {
    x: clamp(anchor.x-noteWidth/2, 12, width-noteWidth-12),
    y: clamp(anchor.y-noteHeight-46, 10, height-noteHeight-38),
    width: noteWidth, height: noteHeight,
  };
}

export function sampleMapCamera(u: number, width: number, height: number): MapCameraPose[] {
  // Exactly the approved single-scene camera, also used when video fails.
  const t=clamp(u*12/11.4), amount=t*t*t*(t*(t*6-15)+10);
  const scale=Math.exp(Math.log(3.3)*amount), fit=Math.max(width/1280,height/720);
  const sw=1280*fit,sh=720*fit;
  const cx=mix(.5,.390,amount),cy=mix(.5,.448,amount);
  return [{width:sw,height:sh,x:width/2-cx*sw*scale,y:height/2-cy*sh*scale,scale,opacity:1}];
}

/** Frame-local illustration anchor; intentionally separate from real directions. */
export function cameraAnchor(u: number, width: number, height: number): Point {
  // The paper art is not georeferenced. This illustration point is independent
  // of the actual coordinates used by the directions link.
  const layer = sampleMapCamera(u, width, height)[0];
  return { x: layer.x+.390*layer.width*layer.scale, y: layer.y+.490*layer.height*layer.scale };
}

/** Called by the invitation's one controller after width/fonts/locale/image changes. */
export function configureMapGeometry(root: HTMLElement, viewportHeight=window.innerHeight): MapGeometry {
  const section = root.querySelector<HTMLElement>('[data-scene="map"]');
  const pin = section?.querySelector<HTMLElement>('.map-pin');
  const frame = section?.querySelector<HTMLElement>('[data-map-frame]');
  const note = section?.querySelector<HTMLElement>('[data-map-note]');
  if (!section || !pin || !frame || !note) throw new Error('Map stage is incomplete');
  const frameTop=frame.offsetTop;
  const pinHeight = Math.max(Math.min(650, viewportHeight),frameTop+260+35);
  const frameHeight = Math.min(480, Math.max(260, pinHeight-frameTop-35));
  section.style.setProperty('--map-pin-height', pinHeight+'px');
  section.style.setProperty('--map-frame-height', frameHeight+'px');
  section.style.setProperty('--map-note-max-height',Math.max(110,cameraAnchor(1,frame.clientWidth,frameHeight).y-60)+'px');
  section.style.setProperty('--map-scroll-distance', mapCameraConfig.scrollDistance+'px');
  // offsetLeft/Top are local to map-pin, including during a sticky restoration.
  const finalAnchor = cameraAnchor(1, frame.clientWidth, frame.clientHeight);
  const paper=section.querySelector<HTMLElement>('.location-paper')!;
  const scrollable=paper.scrollHeight>paper.clientHeight+1;
  paper.classList.toggle('note-scrollable',scrollable);paper.tabIndex=scrollable?0:-1;
  const geometry = {
    frame: { x: frame.offsetLeft, y: frame.offsetTop, width: frame.clientWidth, height: frame.clientHeight },
    pinHeight, duration: mapCameraConfig.scrollDistance,
    note: annotationRect(finalAnchor, frame.clientWidth, frame.clientHeight, note.offsetWidth, note.offsetHeight),
    cityAnchor: finalAnchor,
  };
  measured.set(root, geometry);
  elements.set(root,{planes:Array.from(root.querySelectorAll<HTMLElement>('[data-map-fallback]')),marker:root.querySelector<HTMLElement>('.venue-pin'),note});
  return geometry;
}

/** Pure progress-to-DOM draw: no timer, inertia, tween, or independent trigger. */
export function drawMapCamera(root: HTMLElement, u: number) {
  seekMapVideo(root,u);
  const geometry = measured.get(root) || configureMapGeometry(root);
  const { width, height } = geometry.frame;
  const poses = sampleMapCamera(u, width, height);
  const cached=elements.get(root)!;
  cached.planes.forEach((plane, index) => {
    const pose = poses[index];
    plane.style.width = pose.width+'px'; plane.style.height = pose.height+'px';
    plane.style.left = '0px'; plane.style.top = '0px';
    plane.style.transform = 'translate('+pose.x+'px,'+pose.y+'px) scale('+pose.scale+')';
    plane.style.opacity = String(pose.opacity);
  });
  const anchor = cameraAnchor(u, width, height);
  const {marker,note}=cached;
  const noteReveal = between(u, mapCameraConfig.noteStart, mapCameraConfig.noteEnd);
  const pinReveal = between(u, .77, .82);
  if (marker) {
    marker.style.left = anchor.x+'px'; marker.style.top = anchor.y+'px';
    marker.style.opacity = String(pinReveal); marker.style.visibility = pinReveal > 0 ? 'visible' : 'hidden';
  }
  let noteRect: { x: number; y: number; width: number; height: number } | undefined;
  if (note) {
    const { x, y } = annotationRect(anchor, width, height, geometry.note.width, geometry.note.height);
    note.style.left = x+'px'; note.style.top = y+'px';
    note.style.bottom = 'auto';
    note.style.setProperty('--note-pointer-x', clamp(anchor.x-x, 18, geometry.note.width-18)+'px');
    note.style.setProperty('--note-pointer-height', Math.max(12, anchor.y-y-geometry.note.height-32)+'px');
    note.style.opacity = String(noteReveal);
    note.style.visibility = noteReveal > 0 ? 'visible' : 'hidden';
    note.style.pointerEvents = noteReveal > .6 ? 'auto' : 'none';
    note.style.transform = 'translateY('+(6*(1-noteReveal))+'px) rotate('+(-1*(1-noteReveal))+'deg) scale('+( .98+.02*noteReveal)+')';
    noteRect = { ...geometry.note, x, y };
  }
  root.dataset.mapProgress = clamp(u).toFixed(4);
  return { anchor, noteRect, noteReveal, poses, geometry };
}

/** Shared static/reduced/error presentation with useful practical information. */
export function showFinalMap(root: HTMLElement) {
  configureMapGeometry(root);
  stopMapVideo(root);
  return drawMapCamera(root, 1);
}
