import './globals.css';
import { LocaleProvider } from '../components/LocaleProvider';
import { getInitialLocale } from '../lib/locale-server';
import { formatWeddingDate } from '../lib/i18n';
import { wedding } from '../lib/content';
import localFont from 'next/font/local';
import type {Metadata,Viewport} from 'next';
import {headers} from 'next/headers';
const serif=localFont({src:'./fonts/lora.ttf',variable:'--font-serif',display:'swap',weight:'400 700'});
const arabic=localFont({src:'./fonts/noto-naskh-arabic.ttf',variable:'--font-arabic',display:'swap',weight:'400 700',preload:false});
export const viewport:Viewport={themeColor:'#fbf8f0'};

export async function generateMetadata():Promise<Metadata> {
  const locale=await getInitialLocale(),names=wedding.names.groom+' & '+wedding.names.bride;
  const title=names+' — widding.ly',description=names+' · '+formatWeddingDate(locale,wedding.dateISO,wedding.timezone)+' · '+wedding.city+', '+wedding.country;
  const configured=process.env.NEXT_PUBLIC_SITE_URL;
  const request=await headers(),host=request.get('x-forwarded-host')||request.get('host');
  const protocol=request.get('x-forwarded-proto')?.split(',')[0]||(host&&/^(localhost|127\.0\.0\.1)(:|$)/.test(host)?'http':undefined);
  const actualOrigin=host&&/^[a-z\d.:[\]-]+$/i.test(host)&&(protocol==='http'||protocol==='https')?protocol+'://'+host:undefined;
  const metadataBase=configured&&/^https?:\/\//.test(configured)?new URL(configured):actualOrigin?new URL(actualOrigin):undefined;
  return {title,description,metadataBase,openGraph:{title,description,type:'website',locale:locale==='tr'?'tr_TR':'en_GB',...(metadataBase?{url:metadataBase,images:[{url:'/share-preview.jpg',width:1200,height:630,alt:names}]}:{})},twitter:{card:'summary_large_image',title,description,...(metadataBase?{images:['/share-preview.jpg']}:{})}};
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const initialLocale = await getInitialLocale();
  return <html lang={initialLocale} dir="ltr" className={serif.variable+' '+arabic.variable}><body>
    <noscript><style>{'.enhanced .map-scene{height:var(--map-pin-height)!important}.enhanced .map-pin{position:relative!important}.motion-layer{display:none}'}</style></noscript>
    <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
  </body></html>;
}
