export type Box = { x: number; y: number; width: number; height: number };
export type Pose = { x: number; y: number; width: number; height: number; rotation: number; depth: number };
type Dance = { phase: number; radiusX: number; radiusY: number; tilt: number };
export type Knot = {
  scroll: number; a: Pose; b: Pose; route: { x: number; y: number }; beat: string; dance?: Dance;
};
export type StoryGeometry = {
  width: number; height: number; maxScroll: number; viewportHeight: number;
  origins: [Pose, Pose]; verse: Box; childhood: Box; adult: Box; countdown: Box;
  map: Box; pinHeight: number; mapFrame: Box; note: Box;
  cityAnchor: { x: number; y: number }; rest: Box;
  clearance?:Box[];
};
type Avoidance={top:number;bottom:number;left:number;right:number;phase?:number};
const avoidance=new WeakMap<Knot[],{width:number;groups:Avoidance[]}>();
export const choreography = {
  visibleHeartWidth: 24, visibleHeartRatio: 297 / 253, tiltLimit: 8,
  mapScrollDistance: 1120, centreSway: 12, halfSeparation: 20, leadDistance: 11,
};
const clip = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const ease = (n: number) => { const t = clip(n, 0, 1); return t * t * (3 - 2 * t); };
const distinctOffset=(dx:number,dy:number)=>{
 const length=Math.hypot(dx,dy),minimum=12.5;
 const safe=minimum+(length-minimum+Math.sqrt((length-minimum)**2+.04))/2;
 const factor=safe/Math.max(.000001,length);return{dx:dx*factor,dy:dy*factor};
};

/** The route moves through the centre; only the small pair offset performs the dance. */
export function buildJourney(g: StoryGeometry): Knot[] {
  const w = g.width, centre = w / 2, focus = Math.min(370, g.viewportHeight * .43);
  const size = w < 350 ? 22 : 24, height = size / choreography.visibleHeartRatio;
  const knots: Knot[] = [];
  const pose = (x: number, y: number, rotation = 0, depth = 2): Pose => ({ x, y, width: size, height, rotation, depth });
  const add = (scroll: number, a: Pose, b: Pose, beat: string, dance?: Dance) => {
    if (knots.length && scroll <= knots.at(-1)!.scroll) throw Error('Non-continuous choreography range: ' + beat);
    knots.push({ scroll, a, b, route: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, beat, dance });
  };
  const pair = (scroll: number, x: number, y: number, phase: number, beat: string, calm = 1) => {
    const dance = { phase, radiusX: 17 + 3 * calm, radiusY: choreography.leadDistance * Math.min(1,calm/.15), tilt: 6 * calm };
    const dx = Math.cos(phase) * dance.radiusX, dy = Math.sin(phase) * dance.radiusY;
    add(scroll, pose(x - dx, y - dy, -Math.sin(phase) * dance.tilt), pose(x + dx, y + dy, Math.sin(phase) * dance.tilt, 3), beat, dance);
  };
  const at = (y: number) => y - focus;

  add(0, ...g.origins, 'home');
  add(55,
    { ...g.origins[0], x: g.origins[0].x - 6, y: g.origins[0].y - 12, rotation: -5 },
    { ...g.origins[1], x: g.origins[1].x + 6, y: g.origins[1].y - 10, rotation: 5 },
    'outward leap');
  pair(130, centre, focus + 130, 0, 'join');
  // Phases advance at different rates around the scenes. There are no edge
  // detours, phase resets, or repeated self-spins when a composition appears.
  const v = g.verse, c = g.childhood, a = g.adult, paper = g.countdown;
  const beat = (y: number, sway: number, phase: number, name: string, calm = 1) => pair(at(y), centre + sway, y, phase * Math.PI, name, calm);
  beat(v.y - 65, 8, .25, 'verse approach');
  beat(v.y + v.height * .5, 12, .52, 'verse beside');
  beat(v.y + v.height + 36, 4, .78, 'verse onward');
  beat(c.y + 58, -6, 1.05, 'childhood approach');
  beat(c.y + c.height * .45, -12, 1.58, 'childhood lead exchange');
  beat(c.y + c.height + 24, 5, 2.04, 'childhood onward');
  beat(a.y + 95, 9, 2.25, 'adult approach');
  beat(a.y + a.height * .48, 4, 2.70, 'adult lead exchange');
  beat(a.y + a.height + 78, -10, 3.10, 'adult onward');
  beat(paper.y + 28, -12, 3.28, 'paper approach');
  beat(paper.y + paper.height * .57, -3, 3.65, 'paper lead exchange');
  beat(paper.y + paper.height + 31, 9, 4.06, 'paper onward');
  pair(g.map.y - 155, centre + 10, g.map.y + 36, Math.PI * 4.18, 'map approach', .7);

  const duration = g.map.height - g.pinHeight, top = g.mapFrame.y;
  pair(g.map.y, centre + 6, g.map.y + top + 80, Math.PI * 4.32, 'pin entry', .6);
  pair(g.map.y + duration * .22, centre - 4, g.map.y + duration * .22 + top + 112, Math.PI * 4.64, 'map closer', .55);
  pair(g.map.y + duration * .46, centre - 7, g.map.y + duration * .46 + top + 143, Math.PI * 4.96, 'map regional', .45);
  pair(g.map.y + duration * .81, g.cityAnchor.x, g.map.y + duration * .81 + top + g.cityAnchor.y + 24, Math.PI * 5.4, 'city arrival', .3);
  const noteScroll = g.map.y + duration * .90, noteY = noteScroll + top + g.note.y + g.note.height + 22;
  pair(noteScroll, g.cityAnchor.x, noteY, Math.PI * 5.62, 'presenting note', .2);
  const below = g.map.y + duration * .955;
  pair(below, centre + 4, below + top + g.note.y + g.note.height + 46, Math.PI * 5.8, 'below the note', .15);
  const releaseY = Math.min(g.pinHeight - 42, top + g.note.y + g.note.height + 78);
  pair(g.map.y + duration, centre, g.map.y + duration + releaseY, Math.PI * 6, 'pin release', 0);
  const release=g.map.y+duration;
  const restScroll=Math.max(release+80,Math.min(g.maxScroll-40,g.rest.y-focus));
  const releaseDocY=knots.at(-1)!.route.y;
  pair(release+(restScroll-release)*.48,centre+4,releaseDocY+(g.rest.y-releaseDocY)*.48,Math.PI*6,'quiet descent',0);
  pair(restScroll,centre,g.rest.y,Math.PI*6,'rest',0);
  if (g.maxScroll > knots.at(-1)!.scroll) {
    const last = knots.at(-1)!;
    add(g.maxScroll, last.a, last.b, 'rest hold', last.dance);
  }
  const groups:Avoidance[]=[];
  // Copy below the resting point is never crossed; its approach envelope must
  // not pull the settled pair away from the invitation's centre.
  const boxes=(g.clearance||[]).filter(b=>b.y>g.verse.y-45&&b.y<g.rest.y-20&&(b.y<g.map.y-35||b.y>=g.map.y+g.map.height)).sort((a,b)=>a.y-b.y);
  for(const box of boxes){
   // Include complete rows, including the leftmost countdown digit and label.
   // The shared bypass must not encounter copy outside the original centre lane.
   const last=groups.at(-1);
   if(last&&box.y-last.bottom<105){last.bottom=Math.max(last.bottom,box.y+box.height);last.left=Math.min(last.left,box.x);last.right=Math.max(last.right,box.x+box.width);}
   else groups.push({top:box.y,bottom:box.y+box.height,left:box.x,right:box.x+box.width});
  }
  for(const group of groups){const phase=sampleJourney(knots,Math.max(231,group.top-focus-130)).dance?.phase||0;group.phase=Math.round((phase-Math.PI/2)/Math.PI)*Math.PI+Math.PI/2;}
  avoidance.set(knots,{width:w,groups});
  return knots;
}

/** Shape-preserving cubic interpolation supplies a continuous shared route. */
export function sampleJourney(knots: Knot[], scroll: number): Omit<Knot, 'beat' | 'scroll'> {
  let i = 0;
  while (i < knots.length - 2 && scroll > knots[i + 1].scroll) i++;
  const a = knots[i], b = knots[i + 1], span = b.scroll - a.scroll;
  const t = clip((scroll - a.scroll) / span, 0, 1);
  const field = (read: (k: Knot) => number) => {
    const derivative = (j: number) => {
      if (j === 0 || j === knots.length - 1) return 0;
      const before = knots[j].scroll - knots[j - 1].scroll, after = knots[j + 1].scroll - knots[j].scroll;
      const left = (read(knots[j]) - read(knots[j - 1])) / before, right = (read(knots[j + 1]) - read(knots[j])) / after;
      if (left * right <= 0) return 0;
      const wa = 2 * after + before, wb = after + 2 * before;
      return (wa + wb) / (wa / left + wb / right);
    };
    const p = read(a), q = read(b), m = derivative(i) * span, n = derivative(i + 1) * span, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * p + (t3 - 2 * t2 + t) * m + (-2 * t3 + 3 * t2) * q + (t3 - t2) * n;
  };
  const body = (which: 'a' | 'b'): Pose => ({
    x: field(k => k[which].x), y: field(k => k[which].y),
    width: field(k => k[which].width), height: field(k => k[which].height),
    rotation: clip(field(k => k[which].rotation), -choreography.tiltLimit, choreography.tiltLimit), depth: which === 'a' ? 2 : 3,
  });
  const route = { x: field(k => k.route.x), y: field(k => k.route.y) };
  const poses: [Pose, Pose] = [body('a'), body('b')];
  let dance:Dance|undefined;
  const join = knots.find(k => k.beat === 'join')!.scroll;
  if (scroll > join) {
    const phase = field(k => k.dance?.phase ?? 0);
    const rx = field(k => k.dance?.radiusX ?? choreography.halfSeparation);
    const ry = field(k => k.dance?.radiusY ?? choreography.leadDistance);
    const tilt = field(k => k.dance?.tilt ?? 6);
    dance={phase,radiusX:rx,radiusY:ry,tilt};
    // Blend out the measured country anchors with a zero-slope envelope. The
    // analytic orbit thereafter keeps both hearts beside one shared curve.
    const joined = ease((scroll - join) / 100);
    const {dx,dy}=distinctOffset(Math.cos(phase)*rx,Math.sin(phase)*ry);
    const depthA = Math.sin(phase) >= 0 ? 2 : 3;
    poses.forEach((pose, index) => {
      const sign = index === 0 ? -1 : 1;
      pose.x += (route.x + sign * dx - pose.x) * joined;
      pose.y += (route.y + sign * dy - pose.y) * joined;
      pose.rotation += (sign * Math.sin(phase) * tilt - pose.rotation) * joined;
      pose.depth = index === 0 ? depthA : 5 - depthA;
    });
  }
  // The departure blend interpolates two measured poses, so its exact average
  // can differ slightly from interpolating their centre independently. Trace
  // the actual pair centre throughout, including that short handoff.
  const plan=avoidance.get(knots);
  if(plan&&scroll>join+100){
   const cy=(poses[0].y+poses[1].y)/2,cx=(poses[0].x+poses[1].x)/2;
   let offsetPower=0,narrowPower=0,phaseSum=0;const half=poses[0].width/2;
   for(const group of plan.groups){
    const amount=ease((cy-(group.top-130))/100)*(1-ease((cy-(group.bottom+30))/100));
    const narrow=group.left-half-5<37,lane=Math.max(half+5,group.left-half-(narrow?7:24));
    offsetPower+=Math.max(0,(cx-lane)*amount)**4;
    if(narrow){const power=amount**4;narrowPower+=power;phaseSum+=power*group.phase!;}
   }
   if(offsetPower>0&&dance){
    // Smoothly combine overlapping bypasses instead of switching winners.
    // Blend orbit angles into a stable slim formation, avoiding merged bodies.
    const compression=Math.min(1,narrowPower**.25);
    const angle=dance.phase*(1-compression)+(narrowPower?phaseSum/narrowPower:0)*compression;
    const {dx,dy}=distinctOffset(((1-compression)*dance.radiusX+3*compression)*Math.cos(angle),((1-compression)*dance.radiusY+14*compression)*Math.sin(angle));
    const x=Math.max(half+Math.abs(dx)+2,cx-offsetPower**.25);
    poses[0].x=x-dx;poses[1].x=x+dx;poses[0].y=cy-dy;poses[1].y=cy+dy;
   }
  }
  return { a: poses[0], b: poses[1], dance, route: { x: (poses[0].x + poses[1].x) / 2, y: (poses[0].y + poses[1].y) / 2 } };
}
