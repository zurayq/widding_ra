import { seekMapVideo, stopMapVideo } from './map-video';
import { mapVideo } from './map-video-config';
type Point = { x: number; y: number };
export const mapCameraConfig = {
  scrollDistance: 180, arrival: mapVideo.arrival,
  noteStart: .82, noteEnd: .95, destinationY: .85,
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

/** Feature tracking uses the same camera as the approved video renderer.
 * This is an illustrated shore point, never a real venue coordinate. */
export function videoAnchor(u: number): Point {
  const t = clamp(u / mapCameraConfig.arrival) * mapVideo.duration;
  const q = clamp((t-.35)/5.25);
  const progress = q*q*q*(10+q*(-15+6*q));
  const z = Math.exp(Math.log(17)*progress), pan = 1-Math.pow(1-progress,1.8);
  const cx = 836+(655-836)*pan, cy = 470.5+(394-470.5)*pan;
  const roll = -.9*Math.PI/180*progress, pitch = .055*progress;
  const c = Math.cos(roll), sn = Math.sin(roll);
  const sx = 1672/(mapVideo.width*z), sy = 941/(mapVideo.height*z);
  const den = 1-pitch/2, h = pitch/mapVideo.height;
  const a = c*sx, b = -sn*sy+cx*h, d = sn*sx, e = c*sy+cy*h;
  const ox = cx*den-c*sx*mapVideo.width/2+sn*sy*mapVideo.height/2;
  const oy = cy*den-sn*sx*mapVideo.width/2-c*sy*mapVideo.height/2;
  const source = { x: 669.6, y: 384 };
  const by = b-source.x*h, ey = e-source.y*h;
  const rx = source.x*den-ox, ry = source.y*den-oy, det = a*ey-by*d;
  return { x: (rx*ey-by*ry)/det/mapVideo.width, y: (a*ry-rx*d)/det/mapVideo.height };
}

export function sampleMapCamera(u: number, width: number, height: number): MapCameraPose[] {
  const anchor = videoAnchor(u);
  const fit = Math.max(width/mapVideo.width, height/mapVideo.height);
  const amount = between(u,.69,mapCameraConfig.arrival);
  // Leave room for the illustrated paper above the tracked shore pin.
  const finalScale = mapCameraConfig.destinationY/videoAnchor(1).y;
  const scale = mix(1,finalScale,amount);
  const sw = mapVideo.width*fit, sh = mapVideo.height*fit;
  const x = clamp(width*.5-sw*scale*anchor.x,width-sw*scale,0);
  const y = clamp(height*mix(.42,mapCameraConfig.destinationY,amount)-sh*scale*anchor.y,height-sh*scale,0);
  return [{width:sw,height:sh,x,y,scale,opacity:1}];
}

/** Illustration shore point, independent of the real venue coordinates. */
export function cameraAnchor(u: number, width: number, height: number): Point {
  const pose = sampleMapCamera(u,width,height)[0], anchor = videoAnchor(u);
  return {x:pose.x+anchor.x*pose.width*pose.scale,y:pose.y+anchor.y*pose.height*pose.scale};
}

function applyPose(plane: HTMLElement, pose: MapCameraPose) {
  plane.style.width=pose.width+'px'; plane.style.height=pose.height+'px';
  plane.style.left='0px'; plane.style.top='0px';
  plane.style.transform='translate('+pose.x+'px,'+pose.y+'px) scale('+pose.scale+')';
  plane.style.opacity=String(pose.opacity);
}

/** Called by the invitation's one controller after width/fonts/locale/image changes. */
export function configureMapGeometry(root: HTMLElement, viewportHeight=window.innerHeight): MapGeometry {
  const section = root.querySelector<HTMLElement>('[data-scene="map"]');
  const pin = section?.querySelector<HTMLElement>('.map-pin');
  const frame = section?.querySelector<HTMLElement>('[data-map-frame]');
  const note = section?.querySelector<HTMLElement>('[data-map-note]');
  if (!section || !pin || !frame || !note) throw new Error('Map stage is incomplete');
  const frameTop=frame.offsetTop;
  const pinHeight = Math.max(Math.min(740, viewportHeight),frameTop+260+35);
  const frameHeight = Math.min(580, Math.max(260, pinHeight-frameTop-35));
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
  const finalPose=sampleMapCamera(1,geometry.frame.width,geometry.frame.height)[0];
  root.querySelectorAll<HTMLElement>('[data-map-static]').forEach(plane=>applyPose(plane,finalPose));
  measured.set(root, geometry);
  elements.set(root,{planes:Array.from(root.querySelectorAll<HTMLElement>('[data-map-fallback]')),marker:root.querySelector<HTMLElement>('.venue-pin'),note});
  return geometry;
}

/** Pure progress-to-DOM draw: no timer, inertia, tween, or independent trigger. */
export function drawMapCamera(root: HTMLElement, u: number) {
  seekMapVideo(root,clamp(u/mapCameraConfig.arrival));
  const geometry = measured.get(root) || configureMapGeometry(root);
  const { width, height } = geometry.frame;
  const poses = sampleMapCamera(u, width, height);
  const cached=elements.get(root)!;
  cached.planes.forEach((plane,index)=>applyPose(plane,poses[index]));
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
