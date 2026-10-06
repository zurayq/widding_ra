'use client';
import {useLayoutEffect,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Artwork} from './Artwork';
import {assets,visibleWindow} from '../lib/assets';
import {buildJourney,sampleJourney,type Box,type Pose,type StoryGeometry} from '../lib/choreography';
import {buildRouteNetwork,routeLengthAt,type RouteSpan} from '../lib/trails';
import {configureMapGeometry,drawMapCamera,showFinalMap} from '../lib/map-camera';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
const range=(s:number,a:number,b:number)=>ease((s-a)/(b-a));
const ns='http://www.w3.org/2000/svg';
export function StoryMotion(){
 const layer=useRef<HTMLDivElement>(null),svg=useRef<SVGSVGElement>(null),defs=useRef<SVGDefsElement>(null),paths=useRef<SVGGElement>(null);
 const hearts=useRef<(HTMLDivElement|null)[]>([]),markers=useRef<(SVGCircleElement|null)[]>([]);
 const [calibration,setCalibration]=useState(false);
 useLayoutEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  const root=document.querySelector<HTMLElement>('#invitation')!,media=matchMedia('(prefers-reduced-motion: reduce)');
  let trigger:ScrollTrigger|undefined,disposed=false,queued=0,currentWidth=0,currentHeight=0;
  const animated=Array.from(root.querySelectorAll<HTMLElement>('[data-reveal],.origins,.opening-heading,.edge-pattern'));
  const clear=()=>animated.forEach(el=>{el.style.opacity='';el.style.transform='';});
  const origins=(main:DOMRect):[Pose,Pose]=>{
   const measure=(id:'algeria_hart_map'|'palastine_hart_map'):Pose=>{
    const b=root.querySelector('[data-origin="'+id+'"] .artwork')!.getBoundingClientRect(),a=assets[id],v=visibleWindow(a);
    const ratio=a.sourceSize.width*v.width/(a.sourceSize.height*v.height),dw=Math.min(b.width,b.height*ratio),dh=dw/ratio;
    return{x:b.left-main.left+(b.width-dw)/2+dw*a.anchor!.x,y:b.top-main.top+(b.height-dh)/2+dh*a.anchor!.y,width:dw*a.cutoutSize!.width,height:dh*a.cutoutSize!.height,rotation:0,depth:2};
   };return[measure('algeria_hart_map'),measure('palastine_hart_map')];
  };
  const place=(poses:[Pose,Pose])=>poses.forEach((p,i)=>gsap.set(hearts.current[i],{x:p.x-p.width/2,y:p.y-p.height/2,width:p.width,height:p.height,rotation:p.rotation,zIndex:p.depth}));
  const staticFallback=()=>{trigger?.kill();root.classList.remove('enhanced');root.classList.add('calm');clear();place(origins(root.getBoundingClientRect()));svg.current!.style.opacity='0';showFinalMap(root);};
  const build=()=>{
   if(disposed)return;trigger?.kill();clear();
   root.classList.toggle('enhanced',!media.matches);root.classList.toggle('calm',media.matches);
   const mapGeometry=configureMapGeometry(root),main=root.getBoundingClientRect(),w=main.width;
   currentWidth=w;currentHeight=root.scrollHeight;
   const box=(selector:string):Box=>{const b=root.querySelector(selector)!.getBoundingClientRect();return{x:b.left-main.left,y:b.top-main.top,width:b.width,height:b.height};};
   const initial=origins(main);
   initial.forEach((p,i)=>{markers.current[i]?.setAttribute('cx',String(p.x));markers.current[i]?.setAttribute('cy',String(p.y));});
   if(media.matches){place(initial);svg.current!.style.opacity='0';showFinalMap(root);return;}
   const height=root.scrollHeight,maxScroll=Math.max(1,height-innerHeight),map=box('[data-scene="map"]');
   const g:StoryGeometry={width:w,height,maxScroll,viewportHeight:innerHeight,origins:initial,verse:box('.verse-composition'),childhood:box('.childhood-slot'),adult:box('.adult-slot'),countdown:box('.countdown-card'),map,pinHeight:mapGeometry.pinHeight,mapFrame:mapGeometry.frame,note:mapGeometry.note,cityAnchor:{x:mapGeometry.frame.x+mapGeometry.cityAnchor.x,y:mapGeometry.cityAnchor.y},rest:box('.resting-place')};
   const clearance:Box[]=Array.from(root.querySelectorAll('[data-clearance]')).map(el=>{const b=el.getBoundingClientRect();return{x:b.left-main.left,y:b.top-main.top,width:b.width,height:b.height};});
   for(const selector of ['.verse-text','.invitation-copy','.portrait-caption','.couple-names','.countdown-grid span','.countdown-grid small','.wedding-date']){
    for(const el of root.querySelectorAll(selector)){
     const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node:Node|null;
     while((node=walker.nextNode())){if(!node.textContent?.trim())continue;const r=document.createRange();r.selectNodeContents(node);for(const b of r.getClientRects())clearance.push({x:b.left-main.left,y:b.top-main.top,width:b.width,height:b.height});}
    }
   }
   const knots=buildJourney(g),routes=buildRouteNetwork(knots);
   svg.current!.setAttribute('viewBox','0 0 '+w+' '+height);svg.current!.style.height=height+'px';
   defs.current!.replaceChildren();paths.current!.replaceChildren();
   const element=(tag:string,attributes:Record<string,string|number>)=>{const el=document.createElementNS(ns,tag);for(const [key,value]of Object.entries(attributes))el.setAttribute(key,String(value));return el;};
   const contentMask=element('mask',{id:'route-content-clearance',maskUnits:'userSpaceOnUse',x:0,y:0,width:w,height});
   contentMask.append(element('rect',{x:0,y:0,width:w,height,fill:'white'}));
   for(const b of clearance)contentMask.append(element('rect',{x:b.x-3,y:b.y-3,width:b.width+6,height:b.height+6,fill:'black'}));
   const ending=box('.ending-line');contentMask.append(element('rect',{x:15,y:ending.y-7,width:w-30,height:ending.height+14,fill:'black'}));
   const mapHeading=element('rect',{x:15,y:map.y,width:w-30,height:120,fill:'black'}),noteMask=element('rect',{x:0,y:0,width:0,height:0,fill:'black'});
   contentMask.append(mapHeading,noteMask);defs.current!.append(contentMask);paths.current!.setAttribute('mask','url(#route-content-clearance)');
   const rendered: {route:RouteSpan;mask:SVGPathElement;path:SVGPathElement}[]=routes.map(route=>{
    const id='reveal-'+route.id,mask=element('mask',{id,maskUnits:'userSpaceOnUse',x:0,y:0,width:w,height});
    const solid=element('path',{d:route.d,fill:'none',stroke:'white','stroke-width':5,'stroke-linecap':'round','data-reveal-route':route.id})as SVGPathElement;
    mask.append(solid);defs.current!.append(mask);
    const path=element('path',{d:route.d,fill:'none',stroke:'#a75156','stroke-width':1.15,'stroke-linecap':'round','stroke-dasharray':'3 7',mask:'url(#'+id+')','data-route':route.id,'data-route-kind':route.kind})as SVGPathElement;
    paths.current!.append(path);
    const measuredLength=solid.getTotalLength(),factor=measuredLength/route.length;route.lengths=route.lengths.map(n=>n*factor);route.length=measuredLength;
    solid.style.strokeDasharray=measuredLength+' '+measuredLength;solid.style.strokeDashoffset=String(measuredLength);
    return{route,mask:solid,path};
   });
   const reveal=(selector:string,p:number,tilt=0)=>{const el=root.querySelector<HTMLElement>(selector)!;gsap.set(el,{opacity:p,y:(1-p)*11,scale:.984+.016*p,rotation:tilt*(1-p)});};
   const draw=(s:number)=>{
    const p=sampleJourney(knots,s);place([p.a,p.b]);
    for(const {route,mask,path}of rendered){const visible=routeLengthAt(route,Math.max(0,s-6));mask.style.strokeDashoffset=String(Math.max(0,route.length-visible));path.style.opacity=visible>.05?'1':'0';}
    svg.current!.style.opacity=s<=7?'0':'1';
    const departure=range(s,58,285);gsap.set(root.querySelector('.origins'),{opacity:1-departure,y:-20*departure,scale:1-.06*departure});
    for(const pattern of root.querySelectorAll('.edge-pattern'))gsap.set(pattern,{opacity:.11*(1-departure),y:-18*departure});
    gsap.set(root.querySelector('.opening-heading'),{opacity:1-range(s,70,290),y:-9*range(s,70,290)});
    const focus=Math.min(370,innerHeight*.43),verseIn=range(s,g.verse.y-focus-135,g.verse.y-focus-5),verseOut=range(s,g.verse.y+g.verse.height-focus+50,g.verse.y+g.verse.height-focus+155);
    reveal('[data-reveal="verse"]',verseIn*(1-verseOut));
    // Introduce the next composition while it enters the lower screen, so the
    // short spaces between the supplied artwork never turn into an empty swipe.
    const incoming=(y:number)=>range(s,y-innerHeight+60,y-innerHeight+210);
    reveal('[data-reveal="invitation"]',incoming(g.childhood.y-42));
    reveal('[data-reveal="childhood"]',incoming(g.childhood.y),-.8);
    reveal('[data-reveal="adult"]',incoming(g.adult.y),.6);
    reveal('[data-reveal="countdown"]',incoming(g.countdown.y),-1);
    const u=clamp((s-map.y)/mapGeometry.duration),camera=drawMapCamera(root,u),pinned=Math.max(0,Math.min(mapGeometry.duration,s-map.y));
    mapHeading.setAttribute('y',String(map.y+pinned+17));
    if(camera.noteRect&&camera.noteReveal>.01){const b=camera.noteRect;for(const [key,value]of Object.entries({x:g.mapFrame.x+b.x-7,y:map.y+pinned+g.mapFrame.y+b.y-7,width:b.width+14,height:b.height+16}))noteMask.setAttribute(key,String(value));}else noteMask.setAttribute('width','0');
    layer.current!.dataset.scroll=String(s);layer.current!.dataset.mapProgress=String(u);
   };
   const mainTop=root.getBoundingClientRect().top+scrollY;
   // Read the same physical source after updates and refreshes. Restored trigger
   // progress during a lifecycle refresh must never substitute an older pose.
   const drawNative=()=>draw(Math.max(0,Math.min(maxScroll,window.scrollY-mainTop)));
   drawNative();
   trigger=ScrollTrigger.create({trigger:root,start:'top top',end:'bottom bottom',onUpdate:drawNative,onRefresh:drawNative});
   if(process.env.NODE_ENV==='development'&&new URLSearchParams(location.search).has('inspect'))(window as Window&{__weddingMotion?:unknown}).__weddingMotion={geometry:g,knots,clearance,routes,sample:(s:number)=>sampleJourney(knots,s)};
  };
  const schedule=()=>{if(disposed||queued)return;queued=requestAnimationFrame(()=>{queued=0;try{build();ScrollTrigger.refresh();}catch(error){console.error('Invitation motion could not initialize',error);staticFallback();}});};
  try{build();}catch(error){console.error('Invitation motion could not initialize',error);staticFallback();}
  const observer=new ResizeObserver(()=>{if(Math.abs(root.getBoundingClientRect().width-currentWidth)>.5||Math.abs(root.scrollHeight-currentHeight)>.5)schedule();});observer.observe(root);
  root.addEventListener('load',schedule,true);root.addEventListener('invitation-artwork-ready',schedule,true);window.addEventListener('resize',schedule);window.addEventListener('invitation-locale-change',schedule);media.addEventListener('change',schedule);document.fonts.ready.then(schedule);
  setCalibration(process.env.NODE_ENV==='development'&&new URLSearchParams(location.search).has('anchors'));
  return()=>{disposed=true;cancelAnimationFrame(queued);trigger?.kill();observer.disconnect();root.removeEventListener('load',schedule,true);root.removeEventListener('invitation-artwork-ready',schedule,true);window.removeEventListener('resize',schedule);window.removeEventListener('invitation-locale-change',schedule);media.removeEventListener('change',schedule);root.classList.remove('enhanced','calm');clear();delete(window as Window&{__weddingMotion?:unknown}).__weddingMotion;};
 },[]);
 return <div className="motion-layer" ref={layer} aria-hidden="true"><svg className="route-svg" ref={svg}><defs ref={defs}/><g ref={paths}/>{calibration&&[0,1].map(i=><circle key={i}ref={node=>{markers.current[i]=node;}}r="15"stroke="#477f67"fill="none"/>)}</svg>{[0,1].map(i=><div className="traveller" data-heart={i}key={i}ref={node=>{hearts.current[i]=node;}}><Artwork id="palastine_small_hart"/></div>)}{calibration&&<p className="anchor-calibration">PNG anchor calibration · lib/assets.ts</p>}</div>;
}
