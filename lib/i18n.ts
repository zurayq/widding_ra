export type Locale = 'en' | 'tr';
export const LOCALE_COOKIE = 'invitation-language';
export const LOCALE_STORAGE = 'invitation-language';

const en = {
  intro: 'A little story of us',
  titleFirst: 'Two origins.', titleSecond: 'One journey.',
  subtitle: 'From two homes, toward one beginning.',
  scroll: 'Scroll to follow our story', invitation: 'You’re invited',
  childhood: 'Once\nThey were just\nTwo little hearts',
  adult: 'And they grew\nInto a love story',
  countdown: 'Until the special day', countdownLabel: 'Time until the wedding',
  days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds',
  celebration: 'Today, our next chapter begins.', datePending: 'Wedding date to be confirmed',
  destination: 'A place for our next chapter', mapHeading: 'Meet us in İzmit.',
  mapSceneLabel: 'Journey toward İzmit', venuePinLabel: 'İzmit on the illustrated map',
  mapCaption: 'İzmit, Kocaeli · Türkiye', ceremony: 'The wedding',
  date: 'Date', time: 'Time', city: 'City', venue: 'Venue', address: 'Address',
  venuePending: 'Venue details to be added', directions: 'Get directions',
  directionsPending: 'Directions available when the venue is confirmed',
  ending: 'Two homes. One new beginning.', closing: 'Made with love',
  verseLabel: 'Quran verse in Arabic',
  languageLabel: 'Invitation language', english: 'English', turkish: 'Turkish',
  algeria: 'Algeria', palestine: 'Palestine',
  assetUnavailable: 'This artwork is currently unavailable.',
  alt: {
    algeria: 'Golden outline of Algeria, where one heart begins',
    palestine: 'Golden outline of Palestine, where another heart begins',
    heart: 'A small red heart',
    childhoodComposition: 'Childhood portraits of Amir and Raghed on a decorated torn-paper composition',
    adultComposition: 'Adult portraits of Amir and Raghed with their names on a decorated torn-paper composition',
    openingPatternAlgeria: 'The decorative pattern placed beside Algeria',
    openingPatternPalestine: 'The decorative pattern placed beside Palestine',
    mapWide: 'The broad geographic view at the start of the journey toward İzmit',
    mapCloser: 'A closer geographic view toward İzmit',
    mapRegional: 'The regional view of the journey toward İzmit',
    mapCity: 'The final illustrated city-area view of İzmit, Kocaeli',
    algerianLandmark: 'The Algerian skyline artwork',
    palestinianLandmark: 'The Palestinian skyline artwork',
    verse: 'The Arabic calligraphy of the Quran verse',
  },
};

export type InvitationCopy = typeof en;
const tr: InvitationCopy = {
  intro: 'Bizim küçük hikâyemiz',
  titleFirst: 'İki köken.', titleSecond: 'Tek yolculuk.',
  subtitle: 'İki yuvadan, ortak bir başlangıca.',
  scroll: 'Hikâyemizi takip etmek için kaydırın', invitation: 'Düğünümüze davetlisiniz',
  childhood: 'Bir\nzamanlar sadece\niki küçük kalptiler',
  adult: 'Ve büyüyüp\nBir aşk hikâyesine dönüştüler',
  countdown: 'Büyük güne kalan süre', countdownLabel: 'Düğüne kalan süre',
  days: 'Gün', hours: 'Saat', minutes: 'Dakika', seconds: 'Saniye',
  celebration: 'Bugün, yeni hikâyemiz başlıyor.', datePending: 'Düğün tarihi yakında duyurulacak',
  destination: 'Yeni hikâyemizin başlayacağı yer', mapHeading: 'İzmit’te buluşalım.',
  mapSceneLabel: 'İzmit’e yolculuk', venuePinLabel: 'Resimli haritada İzmit',
  mapCaption: 'İzmit, Kocaeli · Türkiye', ceremony: 'Düğün',
  date: 'Tarih', time: 'Saat', city: 'Şehir', venue: 'Mekân', address: 'Adres',
  venuePending: 'Mekân bilgileri yakında eklenecek', directions: 'Yol tarifi al',
  directionsPending: 'Mekân kesinleştiğinde yol tarifi eklenecek',
  ending: 'İki yuva. Yeni bir başlangıç.', closing: 'Sevgiyle hazırlandı',
  verseLabel: 'Arapça Kur’an ayeti',
  languageLabel: 'Davetiyenin dili', english: 'İngilizce', turkish: 'Türkçe',
  algeria: 'Cezayir', palestine: 'Filistin',
  assetUnavailable: 'Bu görsel şu anda kullanılamıyor.',
  alt: {
    algeria: 'Bir kalbin yolculuğa başladığı Cezayir’in altın renkli haritası',
    palestine: 'Diğer kalbin yolculuğa başladığı Filistin’in altın renkli haritası',
    heart: 'Küçük kırmızı bir kalp',
    childhoodComposition: 'Amir ve Raghed’in süslenmiş yırtık kâğıt üzerindeki çocukluk portreleri',
    adultComposition: 'Amir ve Raghed’in adlarıyla birlikte süslenmiş yırtık kâğıt üzerindeki yetişkin portreleri',
    openingPatternAlgeria: 'Cezayir’in yanına yerleştirilen dekoratif desen',
    openingPatternPalestine: 'Filistin’in yanına yerleştirilen dekoratif desen',
    mapWide: 'İzmit yolculuğunun başlangıcındaki en geniş coğrafi görünüm',
    mapCloser: 'İzmit’e doğru daha yakın bir coğrafi görünüm',
    mapRegional: 'İzmit yolculuğunun bölgesel görünümü',
    mapCity: 'İzmit, Kocaeli şehir bölgesinin son resimli görünümü',
    algerianLandmark: 'Cezayir silüeti görseli',
    palestinianLandmark: 'Filistin silüeti görseli',
    verse: 'Kur’an ayetinin Arapça hat kompozisyonu',
  },
};

export const translations: Record<Locale, InvitationCopy> = { en, tr };

/** Only the user's supported language preference matters; geography is never consulted. */
export function supportedLocale(language: string | null | undefined): Locale | null {
  const base = language?.trim().toLowerCase().split('-')[0];
  return base === 'tr' || base === 'en' ? base : null;
}

export function selectLocale(preferences: readonly string[], manual?: string | null): Locale {
  const explicit = supportedLocale(manual);
  if (explicit) return explicit;
  for (const preference of preferences) {
    const match = supportedLocale(preference);
    if (match) return match;
  }
  return 'en';
}

/** Accept-Language quality weights define the requested order; q=0 entries are unavailable. */
export function selectLocaleFromAcceptLanguage(header: string | null, manual?: string | null): Locale {
  const preferences = (header ?? '').split(',').map((entry, index) => {
    const [language, ...parameters] = entry.trim().split(';');
    const qualityParameter = parameters.find(parameter => parameter.trim().startsWith('q='));
    const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
    return { language, quality, index };
  }).filter(entry => Number.isFinite(entry.quality) && entry.quality > 0 && entry.quality <= 1)
    .sort((a, b) => b.quality - a.quality || a.index - b.index)
    .map(entry => entry.language);
  return selectLocale(preferences, manual);
}

export function formatWeddingDate(locale: Locale, dateISO: string, timeZone = 'Europe/Istanbul'): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone,
  }).format(new Date(dateISO));
}

export function formatWeddingTime(locale: Locale, dateISO: string, timeZone = 'Europe/Istanbul'): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone,
  }).format(new Date(dateISO));
}
