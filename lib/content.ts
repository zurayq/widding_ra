const verseLines=['وَجَعَلْنَاكُمْ شُعُوبًا','وَقَبَائِلَ لِتَعَارَفُوا'];
export const wedding = {
  names: { bride: 'Raghed', groom: 'Amir' },
  dateISO: '2026-10-17T15:00:00+03:00', timezone: 'Europe/Istanbul',
  dateLabel: '17 October 2026', timeLabel: '15:00',
  city: 'Körfez', region: 'Kocaeli', country: 'Türkiye',
  venueName: 'Tütünçiftlik Kültür Merkezi', address: '', latitude: '40.7603888', longitude: '29.7847177',
  placeUrl: 'https://www.google.com/maps/place/T%C3%BCt%C3%BCn%C3%A7iftlik+Cultural+Center/@40.7603928,29.7821428,628m/data=!3m2!1e3!4b1!4m6!3m5!1s0x14cb389cb5498c6d:0x13f7f8fa75999222!8m2!3d40.7603888!4d29.7847177!16s%2Fg%2F11c0vqbxpq?entry=ttu',
  verse: verseLines.join(' '), verseLines, useVerseArtwork: false,
};
export type VenueData = Pick<typeof wedding, 'venueName' | 'address' | 'latitude' | 'longitude' | 'city' | 'region' | 'country'>;
export function buildDirectionsUrl(venue: VenueData = wedding): string {
  const lat = Number(venue.latitude), lng = Number(venue.longitude);
  const validCoordinates = venue.latitude.trim() !== '' && venue.longitude.trim() !== ''
    && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  const destination = validCoordinates ? lat + ',' + lng
    : venue.address.trim() ? [venue.venueName, venue.address, venue.city, venue.region, venue.country].filter(Boolean).join(', ') : '';
  return destination ? 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destination) : '';
}
