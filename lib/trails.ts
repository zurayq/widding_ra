import { sampleJourney, type Knot } from './choreography';
type Point = { x: number; y: number };
export type RouteSpan = {
  id: string; kind: 'shared'; start: number; end: number;
  points: Point[]; scrolls: number[]; lengths: number[]; length: number; d: string;
};

/** One trail, beginning only after the pair meets. Never trace either orbit. */
export function buildRouteNetwork(knots: Knot[]): RouteSpan[] {
  const start = knots.find(k => k.beat === 'join')!.scroll;
  const end = knots.find(k => k.beat === 'rest')!.scroll;
  const count = Math.max(8, Math.ceil((end - start) / 3));
  const points: Point[] = [], scrolls: number[] = [], lengths = [0];
  for (let j = 0; j <= count; j++) {
    const s = start + (end - start) * j / count;
    const point = sampleJourney(knots, s).route;
    points.push(point); scrolls.push(s);
    if (j) lengths[j] = lengths[j - 1] + Math.hypot(point.x - points[j - 1].x, point.y - points[j - 1].y);
  }
  return [{
    id: 'shared-journey', kind: 'shared', start, end, points, scrolls, lengths,
    length: lengths.at(-1)!,
    d: points.map((p, j) => (j ? 'L' : 'M') + p.x.toFixed(3) + ',' + p.y.toFixed(3)).join(' '),
  }];
}
export function routeLengthAt(route: RouteSpan, scroll: number): number {
  if (scroll <= route.start) return 0;
  if (scroll >= route.end) return route.length;
  const index = (scroll - route.start) / (route.end - route.start) * (route.points.length - 1);
  const i = Math.min(route.points.length - 2, Math.floor(index)), t = index - i;
  return route.lengths[i] + (route.lengths[i + 1] - route.lengths[i]) * t;
}
