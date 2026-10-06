'use client';

import { useLocale } from './LocaleProvider';

export function LocaleSwitch() {
  const { locale, copy, setLocale } = useLocale();
  return <div className="locale-switch" role="group" aria-label={copy.languageLabel}>
    <button type="button" lang="en" aria-label={copy.english} aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>EN</button>
    <span aria-hidden="true">/</span>
    <button type="button" lang="tr" aria-label={copy.turkish} aria-pressed={locale === 'tr'} onClick={() => setLocale('tr')}>TR</button>
  </div>;
}
