export type Locale = 'en' | 'tr' | 'ar';

const en = {
  intro: 'Amir & Raghed', invitationTitle: 'Wedding invitation',
  titleFirst: 'You’re', titleSecond: 'invited',
  subtitle: 'to celebrate our wedding.',
  scroll: 'Want to see more?', invitation: 'Our story',
  childhood: 'Once,\nwe were two little hearts\nin two different homes.',
  adult: 'Now, together,\nwe begin a new chapter.',
  countdown: 'Until our wedding', countdownLabel: 'Time until our wedding',
  celebrationHeading: 'Our wedding day',thankYouHeading: 'With love and gratitude',
  days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds',
  celebration: 'Today is our wedding day!', thankYou: 'Thank you for celebrating with us.', datePending: 'Wedding date to be announced',
  destination: 'Come celebrate with us', mapHeading: 'Meet us in Körfez',
  mapSceneLabel: 'Journey toward Tütünçiftlik, Körfez', venuePinLabel: 'Wedding venue on the illustrated map',
  mapCaption: 'Körfez, Kocaeli · Türkiye', ceremony: 'The wedding', addCalendar: 'Add to calendar',
  date: 'Date', time: 'Time', city: 'City', venue: 'Venue', address: 'Address',
  venuePending: 'Venue details to be announced', directions: 'Get directions', viewPlace: 'View the venue on Google Maps',
  directionsPending: 'Directions will be available once the venue is confirmed',
  ending: 'Two hearts. One new beginning.', closing: 'Made with love',
  verseLabel: 'Quran verse in Arabic',
  marmaraSea: 'Marmara Sea',
  algeria: 'Algeria', palestine: 'Palestine',
  assetUnavailable: 'This artwork is currently unavailable.',
  alt: {
    algeria: 'Golden outline of Algeria, where one heart begins',
    palestine: 'Golden outline of Palestine, where another heart begins',
    heart: 'A small burgundy paper heart',
    childhoodComposition: 'Childhood photos of Amir and Raghed on floral paper',
    adultComposition: 'Photos of Amir and Raghed as adults, with their names on floral paper',
    openingPatternAlgeria: 'The decorative pattern placed beside Algeria',
    openingPatternPalestine: 'The decorative pattern placed beside Palestine',
    mapWide: 'The broad geographic view at the start of the journey toward Körfez',
    mapCloser: 'A closer geographic view toward Körfez',
    mapRegional: 'The regional view of the journey toward Körfez',
    mapCity: 'The final illustrated city-area view of Körfez, Kocaeli',
    algerianLandmark: 'The Algerian skyline artwork',
    palestinianLandmark: 'The Palestinian skyline artwork',
    verse: 'The Arabic calligraphy of the Quran verse',
  },
};

export type InvitationCopy = typeof en;
const tr: InvitationCopy = {
  intro: 'Amir & Raghed', invitationTitle: 'Düğün davetiyesi',
  titleFirst: 'Düğünümüze', titleSecond: 'davetlisiniz',
  subtitle: 'Mutluluğumuzu birlikte kutlayalım.',
  scroll: 'Devamını görmek ister misin?', invitation: 'Hikâyemiz',
  childhood: 'Bir zamanlar,\niki ayrı yuvadaki\niki küçük kalptik.',
  adult: 'Şimdi birlikte,\nyeni bir hayata başlıyoruz.',
  countdown: 'Düğünümüze kalan süre', countdownLabel: 'Düğünümüze kalan süre',
  celebrationHeading: 'Düğün günümüz',thankYouHeading: 'Sevgi ve minnetle',
  days: 'Gün', hours: 'Saat', minutes: 'Dakika', seconds: 'Saniye',
  celebration: 'Bugün düğün günümüz!', thankYou: 'Mutluluğumuzu paylaştığınız için teşekkür ederiz.', datePending: 'Düğün tarihi yakında duyurulacak',
  destination: 'Birlikte kutlayalım', mapHeading: 'Körfez’de buluşalım',
  mapSceneLabel: 'Tütünçiftlik, Körfez’e yolculuk', venuePinLabel: 'Resimli haritada düğün mekânı',
  mapCaption: 'Körfez, Kocaeli · Türkiye', ceremony: 'Düğün', addCalendar: 'Takvime ekle',
  date: 'Tarih', time: 'Saat', city: 'Şehir', venue: 'Mekân', address: 'Adres',
  venuePending: 'Mekân bilgileri yakında paylaşılacak', directions: 'Yol tarifi al', viewPlace: 'Mekânı Google Haritalar’da gör',
  directionsPending: 'Mekân kesinleştiğinde yol tarifi paylaşılacak',
  ending: 'İki kalp. Yeni bir başlangıç.', closing: 'Made with love',
  verseLabel: 'Arapça Kur’an ayeti',
  marmaraSea: 'Marmara Denizi',
  algeria: 'Cezayir', palestine: 'Filistin',
  assetUnavailable: 'Bu görsel şu anda kullanılamıyor.',
  alt: {
    algeria: 'Bir kalbin yolculuğa başladığı Cezayir’in altın renkli haritası',
    palestine: 'Diğer kalbin yolculuğa başladığı Filistin’in altın renkli haritası',
    heart: 'Bordo renkli küçük bir kâğıt kalp',
    childhoodComposition: 'Amir ve Raghed’in çiçekli kâğıt üzerindeki çocukluk fotoğrafları',
    adultComposition: 'Amir ve Raghed’in çiçekli kâğıt üzerindeki yetişkinlik fotoğrafları ve adları',
    openingPatternAlgeria: 'Cezayir’in yanına yerleştirilen dekoratif desen',
    openingPatternPalestine: 'Filistin’in yanına yerleştirilen dekoratif desen',
    mapWide: 'Körfez yolculuğunun başlangıcındaki en geniş coğrafi görünüm',
    mapCloser: 'Körfez’e doğru daha yakın bir coğrafi görünüm',
    mapRegional: 'Körfez yolculuğunun bölgesel görünümü',
    mapCity: 'Körfez, Kocaeli şehir bölgesinin son resimli görünümü',
    algerianLandmark: 'Cezayir silüeti görseli',
    palestinianLandmark: 'Filistin silüeti görseli',
    verse: 'Kur’an ayetinin Arapça hat kompozisyonu',
  },
};

const ar: InvitationCopy = {
  intro: 'أمير ورغد', invitationTitle: 'دعوة زفاف', titleFirst: 'أنتم', titleSecond: 'مدعوون',
  subtitle: 'لتشاركونا فرحة زفافنا.', scroll: 'حابين تعرفوا أكثر؟', invitation: 'حكايتنا',
  childhood: 'كنا يومًا،\nقلبين صغيرين\nفي بيتين مختلفين.', adult: 'واليوم معًا،\nنبدأ فصلًا جديدًا.',
  countdown: 'حتى يوم زفافنا', countdownLabel: 'الوقت المتبقي حتى زفافنا',
  celebrationHeading: 'يوم زفافنا', thankYouHeading: 'بكل الحب والامتنان',
  days: 'أيام', hours: 'ساعات', minutes: 'دقائق', seconds: 'ثوانٍ',
  celebration: 'اليوم يوم زفافنا!', thankYou: 'شكرًا لمشاركتنا فرحتنا.', datePending: 'سيُعلن موعد الزفاف قريبًا',
  destination: 'شاركونا فرحتنا', mapHeading: 'نلتقي في كورفز',
  mapSceneLabel: 'رحلتنا إلى توتون تشيفتليك في كورفز', venuePinLabel: 'مكان الزفاف على الخريطة المرسومة',
  mapCaption: 'كورفز، كوجالي · تركيا', ceremony: 'الزفاف', addCalendar: 'أضف إلى التقويم',
  date: 'التاريخ', time: 'الوقت', city: 'المدينة', venue: 'المكان', address: 'العنوان',
  venuePending: 'سنعلن تفاصيل المكان قريبًا', directions: 'احصل على الاتجاهات', viewPlace: 'عرض المكان على خرائط جوجل',
  directionsPending: 'ستتوفر الاتجاهات بعد تأكيد المكان',
  ending: 'قلبان وبداية تجمعنا.', closing: 'Made with love', verseLabel: 'آية قرآنية بالعربية',
  marmaraSea: 'بحر مرمرة', algeria: 'الجزائر', palestine: 'فلسطين', assetUnavailable: 'هذا الرسم غير متاح حاليًا.',
  alt: {
    algeria: 'خريطة الجزائر الذهبية، حيث تبدأ رحلة قلب', palestine: 'خريطة فلسطين الذهبية، حيث تبدأ رحلة القلب الآخر',
    heart: 'قلب صغير بلون أحمر داكن', childhoodComposition: 'صور أمير ورغد في طفولتهما على ورقة مزخرفة',
    adultComposition: 'صور أمير ورغد مع اسميهما على ورقة مزخرفة',
    openingPatternAlgeria: 'زخرفة تقليدية بجانب الجزائر', openingPatternPalestine: 'زخرفة تقليدية بجانب فلسطين',
    mapWide: 'الخريطة الواسعة في بداية الرحلة إلى كورفز', mapCloser: 'خريطة أقرب إلى كورفز',
    mapRegional: 'خريطة المنطقة المحيطة بكورفز', mapCity: 'الخريطة المرسومة النهائية لمنطقة كورفز في كوجالي',
    algerianLandmark: 'رسم أفق المدينة الجزائرية', palestinianLandmark: 'رسم أفق المدينة الفلسطينية', verse: 'رسم الآية القرآنية بالعربية',
  },
};

export const translations: Record<Locale, InvitationCopy> = { en, tr, ar };

/** Only the user's supported language preference matters; geography is never consulted. */
export function supportedLocale(language: string | null | undefined): Locale | null {
  const base = language?.trim().toLowerCase().split('-')[0];
  return base === 'tr' || base === 'en' || base === 'ar' ? base : null;
}

export function selectLocale(preferences: readonly string[], manual?: string | null): Locale {
  // Legacy stored selections are intentionally ignored. Primary device language
  // governs the invitation; unsupported languages receive English.
  void manual;
  return supportedLocale(preferences[0]) ?? 'en';
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
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone,
  }).format(new Date(dateISO));
}

export function formatWeddingTime(locale: Locale, dateISO: string, timeZone = 'Europe/Istanbul'): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar' : 'en-GB', {
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone,
  }).format(new Date(dateISO));
}
