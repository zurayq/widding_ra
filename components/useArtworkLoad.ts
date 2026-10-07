'use client';
import {useEffect,useRef,useState} from 'react';
export function useArtworkLoad(src:string,priority=false,enabled=true){
 const ref=useRef<HTMLDivElement>(null);
 const [requested,setRequested]=useState(priority);
 const [status,setStatus]=useState<'loading'|'ready'|'error'>(enabled?'loading':'error');
 useEffect(()=>{
  if(priority||!enabled)return;
  if(!('IntersectionObserver' in window)){setRequested(true);return;}
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setRequested(true);observer.disconnect();}},{rootMargin:'1000px 0px'});
  if(ref.current)observer.observe(ref.current);
  return()=>observer.disconnect();
 },[priority,enabled]);
 useEffect(()=>{
  if(!requested||!enabled)return;
  let active=true;const image=new Image();image.src=src;
  image.decode().then(()=>{if(active)setStatus('ready');}).catch(()=>{if(active){setStatus('error');console.error('Invitation image could not decode: '+src);}});
  return()=>{active=false;};
 },[src,requested,enabled]);
 return {ref,requested,status,setStatus};
}
