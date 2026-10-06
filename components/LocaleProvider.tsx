'use client';

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { LOCALE_COOKIE, LOCALE_STORAGE, selectLocale, supportedLocale, translations, type InvitationCopy, type Locale } from '../lib/i18n';

type LocaleContextValue = { locale: Locale; copy: InvitationCopy; setLocale: (locale: Locale) => void };
const LocaleContext = createContext<LocaleContextValue | null>(null);

function readManualLocale(): Locale | null {
  const cookie = document.cookie.split(';').find(entry => entry.trim().startsWith(LOCALE_COOKIE + '='));
  if (cookie) {
    const selected = supportedLocale(cookie.trim().slice(LOCALE_COOKIE.length + 1));
    if (selected) return selected;
  }
  try { return supportedLocale(localStorage.getItem(LOCALE_STORAGE)); } catch { return null; }
}

function persistLocale(locale: Locale) {
  document.cookie = LOCALE_COOKIE + '=' + locale + '; Path=/; Max-Age=31536000; SameSite=Lax';
  try { localStorage.setItem(LOCALE_STORAGE, locale); } catch { /* Cookie remains usable when storage is blocked. */ }
}

export function LocaleProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const [locale, updateLocale] = useState<Locale>(initialLocale);
  const scrollPosition = useRef<number | null>(null);
  const previousLocale = useRef(initialLocale);

  useLayoutEffect(() => {
    const manual = readManualLocale();
    if (manual) persistLocale(manual);
    const preferred = selectLocale(navigator.languages?.length ? navigator.languages : [navigator.language], manual);
    if (preferred !== initialLocale) {
      scrollPosition.current = window.scrollY;
      updateLocale(preferred);
    }
  }, [initialLocale]);

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next);
    scrollPosition.current = window.scrollY;
    updateLocale(next);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = 'ltr';
    if (previousLocale.current === locale) return;
    previousLocale.current = locale;
    if (scrollPosition.current !== null) window.scrollTo({ top: scrollPosition.current, behavior: 'instant' });
    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('invitation-locale-change', { detail: { locale, scrollY: window.scrollY } }));
      scrollPosition.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  const value = useMemo(() => ({ locale, copy: translations[locale], setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be rendered inside LocaleProvider');
  return context;
}
