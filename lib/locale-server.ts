import { headers } from 'next/headers';
import { selectLocaleFromAcceptLanguage } from './i18n';

export async function getInitialLocale() {
  const requestHeaders = await headers();
  return selectLocaleFromAcceptLanguage(requestHeaders.get('accept-language'));
}
