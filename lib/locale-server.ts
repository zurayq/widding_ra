import { cookies, headers } from 'next/headers';
import { LOCALE_COOKIE, selectLocaleFromAcceptLanguage } from './i18n';

export async function getInitialLocale() {
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  return selectLocaleFromAcceptLanguage(requestHeaders.get('accept-language'), cookieStore.get(LOCALE_COOKIE)?.value);
}
