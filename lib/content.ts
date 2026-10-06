export const wedding = {
  names: { bride: 'Raghed', groom: 'Amir' },
  dateISO: '2026-10-17T15:00:00+03:00', timezone: 'Europe/Istanbul',
  dateLabel: '17 October 2026', timeLabel: '15:00',
  city: 'İzmit', region: 'Kocaeli', country: 'Türkiye',
  venueName: '', address: '', latitude: '', longitude: '',
  verse: 'وجعلناكم شعوبًا وقبائل لتعارفوا', useVerseArtwork: false,
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
