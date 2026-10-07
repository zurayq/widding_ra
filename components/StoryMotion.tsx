'use client';
import {useLayoutEffect,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Artwork} from './Artwork';
import {assets,visibleWindow} from '../lib/assets';
import {buildJourney,sampleJourney,type Box,type Pose,type StoryGeometry,type Knot} from '../lib/choreography';
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
  ScrollTrigger.config({ignoreMobileResize:true,autoRefreshEvents:'visibilitychange,DOMContentLoaded,load'});
  const root=document.querySelector<HTMLElement>('#invitation')!,media=matchMedia('(prefers-reduced-motion: reduce)');
  let trigger:ScrollTrigger|undefined,disposed=false,queued=0,currentWidth=0,currentHeight=0;
  let viewportHeight=innerHeight,windowWidth=innerWidth,buildCount=0;
  let previousGeometry:StoryGeometry|undefined,previousKnots:Knot[]|undefined,lastNative=scrollY;
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
   root.style.setProperty('--story-viewport-height',viewportHeight+'px');
   const mapGeometry=configureMapGeometry(root,viewportHeight),main=root.getBoundingClientRect(),w=main.width;
   layer.current!.dataset.buildCount=String(++buildCount);
   currentWidth=w;currentHeight=root.offsetHeight;
   const box=(selector:string):Box=>{const b=root.querySelector(selector)!.getBoundingClientRect();return{x:b.left-main.left,y:b.top-main.top,width:b.width,height:b.height};};
   const initial=origins(main);
   initial.forEach((p,i)=>{markers.current[i]?.setAttribute('cx',String(p.x));markers.current[i]?.setAttribute('cy',String(p.y));});
   if(media.matches){place(initial);svg.current!.style.opacity='0';showFinalMap(root);return;}
   const endViewport=matchMedia('(pointer: coarse)').matches?Math.max(viewportHeight,screen.availHeight):viewportHeight;
   const height=root.offsetHeight,maxScroll=Math.max(1,height-endViewport),map=box('[data-scene="map"]');
   const g:StoryGeometry={width:w,height,maxScroll,viewportHeight,origins:initial,verse:box('.verse-composition'),childhood:box('.childhood-slot'),adult:box('.adult-slot'),countdown:box('.countdown-card'),map,pinHeight:mapGeometry.pinHeight,mapFrame:mapGeometry.frame,note:mapGeometry.note,cityAnchor:{x:mapGeometry.frame.x+mapGeometry.cityAnchor.x,y:mapGeometry.cityAnchor.y},rest:box('.resting-place')};
   if(!Number.isFinite(g.rest.y)||g.rest.y<map.y+map.height)throw Error('Invalid ending geometry');
   const clearance:Box[]=Array.from(root.querySelectorAll('[data-clearance]')).map(el=>{const b=el.getBoundingClientRect();return{x:b.left-main.left,y:b.top-main.top,width:b.width,height:b.height};});
   const ink:Box[]=[];
   for(const selector of ['.verse-text','.invitation-copy','.portrait-caption','.couple-names','.countdown-card .eyebrow','.countdown-card h2','.countdown-grid span','.countdown-grid small','.wedding-date','.celebration','.ending-line']){
    for(const el of root.querySelectorAll(selector)){
     const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node:Node|null;
     while((node=walker.nextNode())){if(!node.textContent?.trim())continue;const r=document.createRange();r.selectNodeContents(node);for(const b of r.getClientRects()){const item={x:b.left-main.left,y:b.top-main.top,width:b.width,height:b.height};clearance.push(item);ink.push(item);}}
    }
   }
   for(const el of root.querySelectorAll('.flourish')){const b=el.querySelector('span')!.getBoundingClientRect();const item={x:w/2-60,y:b.top-main.top,width:120,height:b.height};ink.push(item);clearance.push(item);}
   g.clearance=ink;
   const knots=buildJourney(g),routes=buildRouteNetwork(knots);
   if(previousGeometry&&previousKnots&&(Math.abs(previousGeometry.width-w)>.5||Math.abs(previousGeometry.height-height)>.5||previousGeometry.viewportHeight!==viewportHeight)){
    // Preserve the current dance/map beat through meaningful layout changes.
    let index=0;while(index<previousKnots.length-2&&lastNative>previousKnots[index+1].scroll)index++;
    if(knots[index]?.beat===previousKnots[index].beat&&knots[index+1]?.beat===previousKnots[index+1].beat){
     const a=previousKnots[index],b=previousKnots[index+1],amount=clamp((lastNative-a.scroll)/(b.scroll-a.scroll));
     const target=knots[index].scroll+amount*(knots[index+1].scroll-knots[index].scroll);
     window.scrollTo({top:Math.min(maxScroll,target),behavior:'instant'});
    }
   }
   previousGeometry=g;previousKnots=knots;
   svg.current!.setAttribute('viewBox','0 0 '+w+' '+height);svg.current!.style.height=height+'px';
   defs.current!.replaceChildren();paths.current!.replaceChildren();
   const element=(tag:string,attributes:Record<string,string|number>)=>{const el=document.createElementNS(ns,tag);for(const [key,value]of Object.entries(attributes))el.setAttribute(key,String(value));return el;};
   const contentMask=element('mask',{id:'route-content-clearance',maskUnits:'userSpaceOnUse',x:0,y:0,width:w,height});
   contentMask.append(element('rect',{x:0,y:0,width:w,height,fill:'white'}));
   for(const b of clearance)contentMask.append(element('rect',{x:b.x-3,y:b.y-3,width:b.width+6,height:b.height+6,fill:'black'}));
   const ending=box('.ending-line');contentMask.append(element('rect',{x:15,y:ending.y-7,width:w-30,height:ending.height+14,fill:'black'}));
   const mapHeading=element('rect',{x:15,y:map.y,width:w-30,height:Math.max(120,g.mapFrame.y-17),fill:'black'}),noteMask=element('rect',{x:0,y:0,width:0,height:0,fill:'black'});
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
   const revealElements=new Map(Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).map(el=>[el.dataset.reveal!,el]));
   const originElement=root.querySelector('.origins'),headingElement=root.querySelector('.opening-heading'),patterns=Array.from(root.querySelectorAll('.edge-pattern'));
   const decorations=Array.from(root.querySelectorAll<HTMLElement>('[data-decoration]')).map((el,index)=>({el,index,y:el.getBoundingClientRect().top-main.top,sway:Number(el.dataset.sway),tilt:Number(el.dataset.tilt)}));
   const reveal=(key:string,p:number,tilt=0)=>gsap.set(revealElements.get(key)!,{opacity:p,y:(1-p)*11,scale:.984+.016*p,rotation:tilt*(1-p)});
   const draw=(s:number)=>{
    const p=sampleJourney(knots,s);place([p.a,p.b]);
    for(const {route,mask,path}of rendered){const visible=routeLengthAt(route,Math.max(0,s-6));mask.style.strokeDashoffset=String(Math.max(0,route.length-visible));path.style.opacity=visible>.05?'1':'0';}
    svg.current!.style.opacity=s<=routes[0].start?'0':'1';
    for(const decoration of decorations){const influence=Math.exp(-Math.abs(p.route.y-decoration.y)/230),phase=s/115+decoration.index;gsap.set(decoration.el,{x:Math.sin(phase)*decoration.sway*influence,y:Math.cos(phase*.8)*decoration.sway*influence,rotation:Math.sin(phase+.5)*decoration.tilt*influence});}
    const departure=range(s,58,285);gsap.set(originElement,{opacity:1-departure,y:-20*departure,scale:1-.06*departure});
    for(const pattern of patterns)gsap.set(pattern,{opacity:.11*(1-departure),y:-18*departure});
    gsap.set(headingElement,{opacity:1-range(s,70,290),y:-9*range(s,70,290)});
    const focus=Math.min(370,viewportHeight*.43),verseIn=range(s,g.verse.y-focus-135,g.verse.y-focus-5),verseOut=range(s,g.verse.y+g.verse.height-focus+50,g.verse.y+g.verse.height-focus+155);
    reveal('verse',verseIn*(1-verseOut));
    // Introduce the next composition while it enters the lower screen, so the
    // short spaces between the supplied artwork never turn into an empty swipe.
    const incoming=(y:number)=>range(s,y-viewportHeight+60,y-viewportHeight+210);
    reveal('invitation',incoming(g.childhood.y-42));
    reveal('childhood',incoming(g.childhood.y),-.8);
    reveal('adult',incoming(g.adult.y),.6);
    reveal('countdown',incoming(g.countdown.y),-1);
    const u=clamp((s-map.y)/mapGeometry.duration),camera=drawMapCamera(root,u),pinned=Math.max(0,Math.min(mapGeometry.duration,s-map.y));
    mapHeading.setAttribute('y',String(map.y+pinned+17));
    if(camera.noteRect&&camera.noteReveal>.01){const b=camera.noteRect;for(const [key,value]of Object.entries({x:g.mapFrame.x+b.x-7,y:map.y+pinned+g.mapFrame.y+b.y-7,width:b.width+14,height:b.height+16}))noteMask.setAttribute(key,String(value));}else noteMask.setAttribute('width','0');
    layer.current!.dataset.scroll=String(s);layer.current!.dataset.mapProgress=String(u);
   };
   const mainTop=root.getBoundingClientRect().top+scrollY;
   // Read the same physical source after updates and refreshes. Restored trigger
   // progress during a lifecycle refresh must never substitute an older pose.
   const drawNative=()=>{lastNative=Math.max(0,Math.min(maxScroll,window.scrollY-mainTop));draw(lastNative);};
   drawNative();
   trigger=ScrollTrigger.create({trigger:root,start:'top top',end:'bottom bottom',onUpdate:drawNative,onRefresh:drawNative});
   if(new URLSearchParams(location.search).has('inspect'))(window as Window&{__weddingMotion?:unknown}).__weddingMotion={geometry:g,knots,clearance,ink,routes,sample:(s:number)=>sampleJourney(knots,s)};
  };
  const schedule=()=>{if(disposed||queued)return;queued=requestAnimationFrame(()=>{queued=0;try{build();ScrollTrigger.refresh();}catch(error){console.error('Invitation motion could not initialize',error);staticFallback();}});};
  try{build();}catch(error){console.error('Invitation motion could not initialize',error);staticFallback();}
  const noteElement=root.querySelector<HTMLElement>('[data-map-note]')!;
  const observer=new ResizeObserver(()=>{if(Math.abs(root.getBoundingClientRect().width-currentWidth)>.5||Math.abs(root.offsetHeight-currentHeight)>.5||(previousGeometry&&Math.abs(noteElement.offsetHeight-previousGeometry.note.height)>.5))schedule();});observer.observe(root);observer.observe(noteElement);
  const resize=()=>{if(Math.abs(innerWidth-windowWidth)>.5){windowWidth=innerWidth;viewportHeight=innerHeight;schedule();}};
  const orient=()=>{windowWidth=innerWidth;viewportHeight=innerHeight;schedule();};
  window.addEventListener('resize',resize);window.addEventListener('invitation-countdown-layout',schedule);screen.orientation?.addEventListener('change',orient);media.addEventListener('change',schedule);document.fonts.ready.then(schedule);
  setCalibration(process.env.NODE_ENV==='development'&&new URLSearchParams(location.search).has('anchors'));
  return()=>{disposed=true;cancelAnimationFrame(queued);trigger?.kill();observer.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('invitation-countdown-layout',schedule);screen.orientation?.removeEventListener('change',orient);media.removeEventListener('change',schedule);root.classList.remove('enhanced','calm');clear();delete(window as Window&{__weddingMotion?:unknown}).__weddingMotion;};
 },[]);
 return <div className="motion-layer" ref={layer} aria-hidden="true"><svg className="route-svg" ref={svg}><defs ref={defs}/><g ref={paths}/>{calibration&&[0,1].map(i=><circle key={i}ref={node=>{markers.current[i]=node;}}r="15"stroke="#477f67"fill="none"/>)}</svg>{[0,1].map(i=><div className="traveller" data-heart={i}key={i}ref={node=>{hearts.current[i]=node;}}><Artwork id="palastine_small_hart"/></div>)}{calibration&&<p className="anchor-calibration">PNG anchor calibration · lib/assets.ts</p>}</div>;
}
