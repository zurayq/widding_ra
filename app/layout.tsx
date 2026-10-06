import './globals.css';
import { LocaleProvider } from '../components/LocaleProvider';
import { getInitialLocale } from '../lib/locale-server';
import { formatWeddingDate } from '../lib/i18n';
import { wedding } from '../lib/content';

export async function generateMetadata() {
  const locale=await getInitialLocale(),names=wedding.names.groom+' & '+wedding.names.bride;
  return { title:names+' — widding.ly',description:names+' · '+formatWeddingDate(locale,wedding.dateISO,wedding.timezone)+' · '+wedding.city+', '+wedding.country };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const initialLocale = await getInitialLocale();
  return <html lang={initialLocale} dir="ltr"><body>
    <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
  </body></html>;
}
