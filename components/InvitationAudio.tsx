'use client';
import {useEffect,useRef,useState} from 'react';
import {useLocale} from './LocaleProvider';
import styles from './InvitationAudio.module.css';
type Status='idle'|'playing'|'paused'|'blocked'|'ended'|'error';
const labels={
 en:{play:'Play invitation audio',pause:'Pause invitation audio',blocked:'Tap for sound',error:'Retry audio'},
 tr:{play:'Davetiyenin sesini aç',pause:'Davetiyenin sesini duraklat',blocked:'Ses için dokun',error:'Sesi yeniden dene'},
 ar:{play:'تشغيل صوت الدعوة',pause:'إيقاف صوت الدعوة مؤقتًا',blocked:'اضغط للصوت',error:'إعادة محاولة تشغيل الصوت'},
};
export function InvitationAudio(){
 const {locale}=useLocale(),copy=labels[locale];
 const audio=useRef<HTMLAudioElement>(null),attempted=useRef(false),mounted=useRef(false);
 const [status,setStatus]=useState<Status>('idle');
 const [artFailed,setArtFailed]=useState(false);
 const play=async()=>{
  const element=audio.current;if(!element)return;
  attempted.current=true;
  try{await element.play();}catch(error){if(mounted.current)setStatus(error instanceof DOMException&&error.name==='NotAllowedError'?'blocked':'error');}
 };
 useEffect(()=>{
  mounted.current=true;
  const onScroll=()=>{if(!attempted.current&&window.scrollY>24)void play();};
  const onVisibility=()=>{if(document.hidden)audio.current?.pause();};
  window.addEventListener('scroll',onScroll,{passive:true});document.addEventListener('visibilitychange',onVisibility);
  const element=audio.current;
  return()=>{mounted.current=false;window.removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',onVisibility);element?.pause();};
 },[]);
 const playing=status==='playing',label=playing?copy.pause:status==='blocked'?copy.blocked:status==='error'?copy.error:copy.play;
 return <div className={styles.control} data-invitation-audio data-audio-state={status}>
  <noscript><style>{'[data-invitation-audio]{display:none!important}'}</style></noscript>
  <audio ref={audio} src="/assets/wedding-ar101.mp3" preload="none" onPlaying={()=>setStatus('playing')} onPause={()=>{if(mounted.current)setStatus(current=>current==='playing'?'paused':current);}} onEnded={()=>setStatus('ended')} onError={()=>setStatus('error')}/>
  <button type="button" className={styles.button} aria-label={label} title={label} aria-pressed={playing} onClick={()=>{attempted.current=true;if(playing)audio.current?.pause();else void play();}}>
   {artFailed?<svg className={styles.fallback} viewBox="0 0 36 36" aria-hidden="true"><path d="M13 26V9l15-4v18M13 13l15-4"/><ellipse cx="8" cy="27" rx="5" ry="3.5"/><ellipse cx="23" cy="24" rx="5" ry="3.5"/></svg>:<>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/assets/music-note.webp" width={240} height={200} alt="" aria-hidden="true" onError={()=>setArtFailed(true)}/>
   </>}
   {!playing&&<svg className={styles.slash} data-audio-off viewBox="0 0 48 48" aria-hidden="true"><path className={styles.slashPaper} d="M10 38 38 10"/><path d="M10 38 38 10"/></svg>}
  </button>
  <span className={styles.status} role="status">{status==='blocked'?copy.blocked:status==='error'?copy.error:''}</span>
 </div>;
}
