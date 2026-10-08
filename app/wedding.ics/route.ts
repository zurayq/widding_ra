import { weddingCalendar } from '../../lib/calendar';
import { wedding, buildDirectionsUrl } from '../../lib/content';
export const dynamic = 'force-static';
export function GET() {
  return new Response(weddingCalendar(wedding, buildDirectionsUrl()), { headers: {
    'Content-Type': 'text/calendar; charset=utf-8',
    'Content-Disposition': 'attachment; filename="amir-raghed-wedding.ics"',
  } });
}
