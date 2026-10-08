import type { wedding as weddingData } from './content';
const escapeText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/[,;]/g, '\\$&');
/** Fold at UTF-8 character boundaries, with a maximum of 75 octets per line. */
function fold(value: string): string {
  const encoder = new TextEncoder(); let line = '', bytes = 0, result = '';
  for (const character of value) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) { result += line + '\r\n'; line = ' '; bytes = 1; }
    line += character; bytes += size;
  }
  return result + line;
}
export function weddingCalendar(wedding: typeof weddingData, directions: string): string {
  const names = wedding.names.groom + ' & ' + wedding.names.bride;
  const utc = new Date(wedding.dateISO).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const location = [wedding.venueName, wedding.address, wedding.city, wedding.region, wedding.country].filter(Boolean).join(', ');
  // Only the confirmed ceremony start is published; no guessed duration/end.
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//URAR Space//Wedding Invitation//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', 'UID:amir-raghed-20261017@zurayq.lol', 'DTSTAMP:20261008T000000Z',
    'DTSTART:' + utc, 'SUMMARY:' + escapeText(names + ' — Wedding'), 'LOCATION:' + escapeText(location),
    'DESCRIPTION:' + escapeText(names + '\n' + location + '\n' + directions),
    'GEO:' + wedding.latitude + ';' + wedding.longitude, 'URL:' + wedding.placeUrl,
    'END:VEVENT', 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
}
