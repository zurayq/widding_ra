import { assets } from './assets';
type Point = { x: number; y: number };
type MapAssetId = 'mapWide' | 'mapCloser' | 'mapRegional' | 'mapCity';
export type MapLayerConfig = { asset: MapAssetId; focal: Point; focalEnd?: Point; zoomStart: number; zoomEnd: number; start: number; end: number };
// Foci identify illustration features, not latitude/longitude. The originals have
// different perspective/framing, so every layer has its own fit and camera.
export const mapCameraConfig = {
  scrollDistance: 1100,
  noteStart: .82, noteEnd: .95,
  layers: [
    { asset: 'mapWide', focal: { x: .390, y: .448 }, zoomStart: 1, zoomEnd: 1.95, start: 0, end: .27 },
    { asset: 'mapCloser', focal: { x: .350, y: .530 }, focalEnd: { x: .360, y: .450 }, zoomStart: 1, zoomEnd: 1.6, start: .23, end: .50 },
    { asset: 'mapRegional', focal: { x: .458, y: .348 }, focalEnd: { x: .439, y: .370 }, zoomStart: 1.4, zoomEnd: 1.85, start: .46, end: .73 },
    { asset: 'mapCity', focal: { x: .676, y: .269 }, zoomStart: 1.52, zoomEnd: 1.6, start: .69, end: .82 },
  ] satisfies MapLayerConfig[],
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

function annotationRect(anchor: Point, width: number, height: number, noteWidth: number, noteHeight: number) {
  return {
    x: clamp(anchor.x-noteWidth/2, 12, width-noteWidth-12),
    y: clamp(anchor.y-noteHeight-46, 10, height-noteHeight-38),
    width: noteWidth, height: noteHeight,
  };
}

export function sampleMapCamera(u: number, width: number, height: number): MapCameraPose[] {
  const progress = clamp(u);
  return mapCameraConfig.layers.map((layer, index) => {
    const asset = assets[layer.asset];
    const source = asset.sourceSize;
    const fit = Math.max(width/source.width, height/source.height);
    const amount = between(progress, layer.start, layer.end);
    const shortFrame = height < 340;
    // A short orientation has ample source resolution for a closer crop, which
    // leaves room above the marker for the compact, readable annotation.
    const finalZoom = index === 3 && shortFrame ? 1.96 : layer.zoomEnd;
    const scale = mix(layer.zoomStart, finalZoom, amount);
    const sw = source.width*fit, sh = source.height*fit;
    const sourceFocal = asset.cameraFocalAnchor || layer.focal;
    const destination = index === 3 ? asset.destinationAnchor || { x: .60, y: .49 } : ('focalEnd' in layer ? layer.focalEnd : undefined) || sourceFocal;
    const focal = { x: mix(sourceFocal.x, destination.x, amount), y: mix(sourceFocal.y, destination.y, amount) };
    const targetX = mix(.51, .54, index === 3 ? amount : .35);
    const targetY = index === 3 ? mix(.40, shortFrame ? .95 : .76, amount) : index === 2 ? mix(.49, .41, amount) : .49;
    // Clamp the actual art bounds so a pan cannot expose an empty strip.
    const x = clamp(width*targetX-sw*scale*focal.x, width-sw*scale, 0);
    const y = clamp(height*targetY-sh*scale*focal.y, height-sh*scale, 0);
    const entered = index === 0 ? 1 : between(progress, layer.start, layer.start+.04);
    const following = mapCameraConfig.layers[index+1];
    const exited = following ? between(progress, following.start, following.start+.04) : 0;
    return { width: sw, height: sh, x, y, scale, opacity: entered*(1-exited) };
  });
}

/** Frame-local illustration anchor; intentionally separate from real directions. */
export function cameraAnchor(u: number, width: number, height: number): Point {
  const layer = sampleMapCamera(u, width, height)[3];
  const asset = assets.mapCity;
  const anchor = asset.destinationAnchor || asset.cameraFocalAnchor || mapCameraConfig.layers[3].focal;
  return { x: layer.x+anchor.x*layer.width*layer.scale, y: layer.y+anchor.y*layer.height*layer.scale };
}

/** Called by the invitation's one controller after width/fonts/locale/image changes. */
export function configureMapGeometry(root: HTMLElement): MapGeometry {
  const section = root.querySelector<HTMLElement>('[data-scene="map"]');
  const pin = section?.querySelector<HTMLElement>('.map-pin');
  const frame = section?.querySelector<HTMLElement>('[data-map-frame]');
  const note = section?.querySelector<HTMLElement>('[data-map-note]');
  if (!section || !pin || !frame || !note) throw new Error('Map stage is incomplete');
  const pinHeight = Math.min(650, window.innerHeight);
  const frameHeight = Math.min(480, Math.max(260, pinHeight-150));
  section.style.setProperty('--map-pin-height', pinHeight+'px');
  section.style.setProperty('--map-frame-height', frameHeight+'px');
  section.style.setProperty('--map-scroll-distance', mapCameraConfig.scrollDistance+'px');
  // offsetLeft/Top are local to map-pin, including during a sticky restoration.
  const finalAnchor = cameraAnchor(1, frame.clientWidth, frame.clientHeight);
  const geometry = {
    frame: { x: frame.offsetLeft, y: frame.offsetTop, width: frame.clientWidth, height: frame.clientHeight },
    pinHeight, duration: mapCameraConfig.scrollDistance,
    note: annotationRect(finalAnchor, frame.clientWidth, frame.clientHeight, note.offsetWidth, note.offsetHeight),
    cityAnchor: finalAnchor,
  };
  measured.set(root, geometry);
  return geometry;
}

/** Pure progress-to-DOM draw: no timer, inertia, tween, or independent trigger. */
export function drawMapCamera(root: HTMLElement, u: number) {
  const geometry = measured.get(root) || configureMapGeometry(root);
  const { width, height } = geometry.frame;
  const poses = sampleMapCamera(u, width, height);
  root.querySelectorAll<HTMLElement>('[data-map-layer]').forEach((plane, index) => {
    const pose = poses[index];
    plane.style.width = pose.width+'px'; plane.style.height = pose.height+'px';
    plane.style.left = '0px'; plane.style.top = '0px';
    plane.style.transform = 'translate('+pose.x+'px,'+pose.y+'px) scale('+pose.scale+')';
    plane.style.opacity = String(pose.opacity);
  });
  const anchor = cameraAnchor(u, width, height);
  const marker = root.querySelector<HTMLElement>('.venue-pin');
  const note = root.querySelector<HTMLElement>('[data-map-note]');
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
  return drawMapCamera(root, 1);
}
