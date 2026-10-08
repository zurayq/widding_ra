'use client';
import { useId } from 'react';
import { useArtworkLoad } from './useArtworkLoad';
import {useLocale} from './LocaleProvider';
import { assets, visibleWindow, type AssetId } from '../lib/assets';
import { wedding } from '../lib/content';
export function OliveSprig({ className = '' }: { className?: string }) {
  return <svg className={'olive-sprig ' + className} viewBox="0 0 100 150" fill="none" aria-hidden="true">
    <path d="M32 145C55 109 63 67 70 9" stroke="#777c5a" strokeWidth="1.4"/>
    <g fill="#8b8e68" opacity=".8">
      <path d="M52 105Q17 109 23 81Q45 76 52 105Z"/><path d="M59 82Q87 67 87 43Q61 46 59 82Z"/>
      <path d="M64 57Q39 47 44 25Q67 28 64 57Z"/><path d="M70 29Q95 17 86 0Q69 5 70 29Z"/>
    </g>
  </svg>;
}
function Preview({ kind }: { kind: typeof assets[AssetId]['fallback'] }) {
  const uid = useId().replaceAll(':', '');
  const {copy}=useLocale();
  if (kind === 'heart') return <svg viewBox="0 0 100 86" aria-hidden="true"><path d="M50 84C41 74 3 50 3 27C3 1 37-8 50 18C65-8 97 1 97 27C97 50 58 77 50 84Z" fill="#8f3945" stroke="#6b3432" strokeWidth="1.5"/><path d="M12 29C12 45 39 67 50 77M62 12Q80 5 88 22" fill="none" stroke="#b66869" strokeWidth="1" opacity=".35"/></svg>;
  if (kind === 'map') return <svg viewBox="0 0 1600 900" className="landscape-preview" aria-hidden="true">
    <defs><linearGradient id={uid + 'sea'} x2="0" y2="1"><stop stopColor="#dbe0d8"/><stop offset="1" stopColor="#bfcfc8"/></linearGradient><linearGradient id={uid + 'land'} x2="1" y2="1"><stop stopColor="#e7d6ae"/><stop offset="1" stopColor="#f0e4cd"/></linearGradient></defs>
    <rect width="1600" height="900" fill="#f2e8d2"/>
    <path d="M0 195L190 246L340 270L462 323L644 300L790 350L951 373L1130 450L1275 468L1438 424L1600 430V637L1380 595L1225 550L1120 532L963 570L823 534L665 580L486 641L264 652L0 688Z" fill={'url(#' + uid + 'sea)'} />
    <path d="M0 0H1600V421L1438 417L1275 457L1134 441L954 364L792 341L646 291L464 314L341 261L194 237L0 186Z" fill={'url(#' + uid + 'land)'} />
    <g stroke="#bca878" fill="none" strokeWidth="3" opacity=".55">
      <path d="M-50 80C238 123 369 117 626 217S1003 292 1241 354S1476 252 1640 239"/>
      <path d="M77 33Q185 121 136 252M362 10Q489 120 461 311M785 24Q842 216 792 342M1147 60Q1122 228 1120 412M1472 1Q1462 202 1499 413"/>
      <path d="M0 783Q349 690 674 727T1110 691T1600 803"/>
    </g>
    <g fill="#c2ad80" opacity=".4">{Array.from({length:24},(_,i)=><rect key={i} x={850 + (i%8)*66} y={240+Math.floor(i/8)*58} width={27+i%3*9} height={18+i%4*5} rx="4" transform={'rotate(-10 ' + (864+(i%8)*66) + ' ' + (249+Math.floor(i/8)*58) + ')'}/>)}</g>
    <path d="M1160 620Q1410 550 1530 598" stroke="#e6ece5" strokeWidth="5" fill="none"/>
    <g fill="#746446" fontFamily="Georgia,serif" textAnchor="middle"><text x="535" y="494" fontSize="33" fontStyle="italic" fill="#788d87">{copy.marmaraSea}</text><text x="1144" y="352" fontSize="35" letterSpacing="8">İZMİT</text><text x="915" y="157" fontSize="24" letterSpacing="10" opacity=".7">KOCAELİ</text></g>
    <circle cx="1120" cy="414" r="11" fill="#a1814f"/><circle cx="1120" cy="414" r="25" fill="none" stroke="#a1814f" opacity=".3" strokeWidth="2"/>
  </svg>;
  if (kind === 'pattern') return <svg viewBox="0 0 180 1200" aria-hidden="true"><g fill="none" stroke="#b69c6b" strokeWidth="3" opacity=".45">{Array.from({length:12},(_,i)=><g key={i} transform={'translate(90 ' + (50+i*100) + ')'}><path d="M0-36L30 0L0 36L-30 0Z"/><path d="M0-16L14 0L0 16L-14 0Z"/><path d="M-58-45V45M58-45V45"/></g>)}</g></svg>;
  if (kind === 'monument') return <svg viewBox="0 0 600 400" aria-hidden="true"><g fill="#bea77a" opacity=".42"><path d="M215 360Q310 175 276 65L298 48Q322 226 365 360Z"/><path d="M190 362Q265 294 275 110L286 48Q289 251 244 362Z"/><path d="M360 362Q317 250 316 66L330 67Q333 254 421 362Z"/><path d="M145 365H448V381H145Z"/></g><g stroke="#8e946c" opacity=".35" fill="none" strokeWidth="3"><path d="M100 383V275M100 279L70 266M100 279L130 264M100 280L88 242M100 280L113 241M502 383V311M502 311L482 301M502 311L520 295"/></g></svg>;
  if (kind === 'dome') return <svg viewBox="0 0 600 400" aria-hidden="true"><g fill="#bea77a" opacity=".42"><path d="M120 258H477V376H120Z"/><path d="M194 257Q199 149 298 142Q399 150 406 257Z"/><path d="M298 142V121H305V142Z"/><path d="M480 374V206H496V154H506V206H521V374Z"/></g><g fill="#f8f2e6" opacity=".9">{[160,217,276,335,394].map(x=><path key={x} d={'M'+x+' 368V314Q'+(x+16)+' 284 '+(x+32)+' 314V368Z'}/>)}</g><path d="M105 377H535" stroke="#baa071" opacity=".5" strokeWidth="2"/></svg>;
  if (kind === 'verse') return <div className="verse-text" lang="ar" dir="rtl">{wedding.verse}</div>;
  if (kind === 'memory') return <div className="memory-empty"><OliveSprig/><p>{copy.assetUnavailable}</p></div>;
  return <svg viewBox="0 0 300 360" aria-hidden="true"><path d={kind==='algeria'?'M90 25L239 34L232 119L283 180L235 277L145 338L56 258L14 178L71 152Z':'M178 18L195 23L178 114L144 181L122 272L91 345L79 263L56 222L103 140L116 69Z'} fill="#d6bb87" stroke="#b69864" strokeWidth="2"/><path d="M93 54L227 200M64 194L217 280" stroke="#f5e9ce" strokeWidth="4" opacity=".6"/></svg>;
}
export function Artwork({ id, className = '', alt }: { id: AssetId; className?: string; alt?: string }) {
  const asset = assets[id];
  const priority=['algeria_hart_map','palastine_hart_map','palastine_small_hart','openingPatternAlgeria','openingPatternPalestine'].includes(id);
  const {ref,status,setStatus,requested}=useArtworkLoad(asset.src,priority,asset.enabled!==false);
  const v = visibleWindow(asset), size = asset.sourceSize;
  const viewBox = [v.x*size.width,v.y*size.height,v.width*size.width,v.height*size.height].join(' ');
  return <div ref={ref} className={'artwork ' + className} data-artwork={id} data-asset-state={status} role={asset.decorative ? undefined : 'img'}
    aria-label={asset.decorative ? undefined : alt ?? asset.alt} aria-hidden={asset.decorative || undefined}
    style={{ aspectRatio: v.width*size.width/(v.height*size.height) }}>
    {status === 'error' ? <Preview kind={asset.fallback}/> : <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <image href={requested?asset.src:undefined} width={size.width} height={size.height} onError={()=>setStatus('error')}/>
    </svg>}
    {!priority && <noscript><svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet"><image href={asset.src} width={size.width} height={size.height}/></svg></noscript>}
  </div>;
}
