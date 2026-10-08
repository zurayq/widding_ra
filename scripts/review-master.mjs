import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {assets} from '../lib/assets.ts';
const base=process.env.INVITATION_REVIEW_URL||`http://localhost:${process.env.PORT||3000}`;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||(process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined)});
const output='.verification/refinement';await mkdir(output,{recursive:true});
const report={widths:[],locales:[],clock:[],fallbacks:[],errors:[]};
const diagnostic=process.env.INVITATION_REVIEW_DIAGNOSTIC==='1';
function check(value,message){if(!value){report.errors.push(message);if(!diagnostic)assert(value,message);}}
async function ready(page){await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>window.__weddingMotion?.knots?.length>2);await page.waitForTimeout(200);}
async function move(page,y){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForFunction(()=>Math.abs(Number(document.querySelector('.motion-layer').dataset.scroll)-scrollY)<.6);await page.waitForTimeout(40);}
async function snapshot(page){return page.evaluate(()=>({scroll:scrollY,hearts:[...document.querySelectorAll('.traveller')].map(e=>e.style.cssText),heartLayer:document.querySelector('.traveller-group').style.cssText,routes:[...document.querySelectorAll('[data-reveal-route]')].map(e=>e.style.strokeDashoffset),camera:[...document.querySelectorAll('[data-map-fallback]')].map(e=>e.style.cssText),note:document.querySelector('[data-map-note]').style.cssText,decorations:[...document.querySelectorAll('[data-decoration]')].map(e=>e.style.cssText)}));}
try{
 for(const width of [320,390,430,1440]){
  const context=await browser.newContext({viewport:{width,height:844},locale:'en-US'}),page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/?inspect=1');await ready(page);
  check(await page.locator('.traveller').count()===2,'Exactly two main hearts');check(await page.locator('.locale-switch').count()===0,'No visible language switch');
  check(await page.locator('[data-route]').count()===1,'Exactly one shared trail');check(await page.locator('.directions').count()===1,'Configured destination enables directions');check(await page.locator('.landmark').count()===0,'Unfinished skylines hidden');
  check(await page.locator('.verse-text').getAttribute('dir')==='rtl'&&await page.locator('.verse-text').getAttribute('lang')==='ar','Arabic keeps correct direction and language');
  check(await page.locator('.wordmark').textContent()==='URAR Space','Studio credit uses the approved name');
  check(await page.locator('.wordmark').getAttribute('href')==='mailto:studio@zurayq.lol','Studio credit opens the supplied email');
  const initialRequests=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.includes('/assets/')).map(r=>r.name));
  check(!initialRequests.some(url=>/mapCity.webp/.test(url)),'Final map is not eagerly downloaded on opening');
  for(const asset of Object.values(assets)){
   if(asset.enabled===false)continue;
   const decoded=await page.evaluate(async src=>{const r=await fetch(src),b=await r.blob();try{const image=await createImageBitmap(b);return{status:r.status,width:image.width,height:image.height};}catch{return{status:r.status,width:0};}},asset.src);
   check(decoded.status===200&&decoded.width>0,'Browser decodes '+asset.src);
  }
  const geometry=await page.evaluate(()=>window.__weddingMotion.geometry);
  const math=await page.evaluate(()=>{
   const m=window.__weddingMotion,hits=[];let separation=0,jump=0,minSeparation=Infinity;
   for(let s=240;s<m.geometry.maxScroll;s+=3){const p=m.sample(s),next=m.sample(s+.1);const distance=Math.hypot(p.a.x-p.b.x,p.a.y-p.b.y);separation=Math.max(separation,distance);minSeparation=Math.min(minSeparation,distance);jump=Math.max(jump,Math.hypot(next.a.x-p.a.x,next.a.y-p.a.y));
    for(const [i,h]of [p.a,p.b].entries())for(const [j,b]of m.ink.entries())if(h.x+h.width/2>b.x+1&&h.x-h.width/2<b.x+b.width-1&&h.y+h.height/2>b.y+1&&h.y-h.height/2<b.y+b.height-1)hits.push({s,heart:i,box:j,h,b});
   }return{hits:hits.slice(0,20),hitCount:hits.length,separation,minSeparation,jump};
  });
  check(await page.evaluate(()=>{const m=window.__weddingMotion;return getComputedStyle(document.querySelector('.traveller-group')).clipPath.includes('heart-content-clearance')&&m.ink.every(b=>m.heartClearance.some(h=>h.x<=b.x-4&&h.y<=b.y-4&&h.x+h.width>=b.x+b.width+4&&h.y+h.height>=b.y+b.height+4));}),'All readable ink has a heart occlusion hole at '+width);
  check(await page.evaluate(()=>{const m=window.__weddingMotion;for(let s=240;s<m.geometry.map.y;s+=3){const p=m.sample(s);if(Math.abs(p.route.x-m.geometry.width/2)>13)return false;}return true;}),'Pair stays on the central dance curve '+width);
  check(await page.evaluate(()=>{const m=window.__weddingMotion;let last=0,exchanges=0;for(let s=240;s<m.geometry.map.y;s+=3){const p=m.sample(s),lead=Math.sign(p.a.y-p.b.y);if(last&&lead&&last!==lead)exchanges++;if(lead)last=lead;}return exchanges>=3;}),'Hearts repeatedly exchange the lead instead of freezing '+width);
  check(math.separation<65,'Main pair stays close at '+width);check(math.jump<3,'Continuous small scroll movements at '+width);
  check(math.minSeparation>19,'Main hearts remain distinct at '+width);check(math.jump<.65,'Restrained per-scroll movement at '+width);
  check(await page.evaluate(()=>{const m=window.__weddingMotion,p=m.sample(m.geometry.maxScroll);return Math.abs(p.route.x-m.geometry.width/2)<1;}),'Final pair rests at centre '+width);
  await page.screenshot({path:output+'/opening-'+width+'.png'});
  for(const [name,y]of [['verse',geometry.verse.y-180],['childhood',geometry.childhood.y-140],['adult',geometry.adult.y-130],['countdown',geometry.countdown.y-120],['city',geometry.map.y+1050],['rest',geometry.maxScroll]]){await move(page,y);await page.screenshot({path:output+'/'+name+'-'+width+'.png'});}
  const local=await page.evaluate(()=>[...document.querySelectorAll('[data-decoration]')].map(el=>{const b=el.getBoundingClientRect(),parent=el.closest('section').getBoundingClientRect();return{x:b.x-parent.x,y:b.y-parent.y,width:b.width,height:b.height,parentWidth:parent.width,parentHeight:parent.height,transform:el.style.transform};}));
  check(local.every(b=>b.x>=-1&&b.y>=-1&&b.x+b.width<=b.parentWidth+1&&b.y+b.height<=b.parentHeight+1),'Decorations stay inside their own sections '+width);
  check(await page.locator('.verse-paper-art').evaluate(async image=>{await image.decode();return image.naturalWidth===1000&&image.naturalHeight===563;}),'Pressed-flower verse artwork decodes at '+width);
  check(await page.locator('.skyline-art').evaluate(async image=>{await image.decode();return image.naturalWidth===1000&&image.naturalHeight===500;}),'Approved skyline decodes at '+width);
  check(await page.evaluate(()=>{const m=window.__weddingMotion,p=m.sample(m.geometry.maxScroll),b=document.querySelector('.resting-place').getBoundingClientRect();return Math.abs(p.route.y-(b.y+scrollY))<1;}),'Pair settles into the skyline anchor '+width);
  await move(page,geometry.countdown.y-160);const saved=await snapshot(page);await page.waitForTimeout(250);assert.deepEqual(await snapshot(page),saved,'Stopped story freezes');
  await move(page,geometry.maxScroll);await move(page,geometry.countdown.y-160);assert.deepEqual(await snapshot(page),saved,'Rapid reverse restores every visual');
  const builds=await page.locator('.motion-layer').getAttribute('data-build-count');const savedHeight=await snapshot(page);
  await page.setViewportSize({width,height:744});await page.waitForTimeout(250);check(await page.locator('.motion-layer').getAttribute('data-build-count')===builds,'Height-only resize does not rebuild '+width);assert.deepEqual(await snapshot(page),savedHeight,'Height-only resize preserves poses');
  await page.setViewportSize({width,height:844});await page.waitForTimeout(150);
  await page.reload();await ready(page);check(Math.abs((await snapshot(page)).scroll-saved.scroll)<2,'Reload preserves scroll');
  if(width===390){const g=await page.evaluate(()=>window.__weddingMotion.geometry);await move(page,g.map.y+550);const oldU=Number(await page.locator('.motion-layer').getAttribute('data-map-progress'));await page.setViewportSize({width:844,height:390});await page.waitForTimeout(400);check(Math.abs(Number(await page.locator('.motion-layer').getAttribute('data-map-progress'))-oldU)<.002,'Orientation preserves current map progress');await page.setViewportSize({width:390,height:844});await page.waitForTimeout(400);check(Math.abs(Number(await page.locator('.motion-layer').getAttribute('data-map-progress'))-oldU)<.002,'Return orientation preserves map progress');}
  await move(page,0);check(await page.locator('.route-svg').evaluate(e=>e.style.opacity==='0'),'No trail at top');
  check(errors.length===0,'No browser JS errors at '+width+': '+errors.join(';'));
  report.widths.push({width,math,initialRequests});await context.close();
 }
 const landscape=await browser.newContext({viewport:{width:844,height:390}}),landscapePage=await landscape.newPage();await landscapePage.goto(base+'/?inspect=1');await ready(landscapePage);
 const landG=await landscapePage.evaluate(()=>window.__weddingMotion.geometry);await move(landscapePage,landG.map.y+1050);
 const noteFit=await landscapePage.evaluate(()=>{const note=document.querySelector('[data-map-note]').getBoundingClientRect(),frame=document.querySelector('[data-map-frame]').getBoundingClientRect();return note.left>=frame.left&&note.right<=frame.right&&note.top>=frame.top&&note.bottom<=frame.bottom;});
 check(noteFit,'Landscape location card remains inside city frame');await landscapePage.screenshot({path:output+'/landscape.png'});await landscape.close();
 const largeLandscape=await browser.newContext({viewport:{width:844,height:390}}),largePage=await largeLandscape.newPage();await largePage.goto(base+'/?inspect=1');await ready(largePage);await largePage.addStyleTag({content:'html{font-size:200% !important}'});await largePage.waitForTimeout(350);const largeG=await largePage.evaluate(()=>window.__weddingMotion.geometry);await move(largePage,largeG.map.y+1050);
 const largeFit=await largePage.evaluate(()=>{const note=document.querySelector('[data-map-note]').getBoundingClientRect(),frame=document.querySelector('[data-map-frame]').getBoundingClientRect(),paper=document.querySelector('.location-paper');return note.top>=frame.top&&note.bottom<=frame.bottom&&paper.scrollHeight>paper.clientHeight&&paper.tabIndex===0;});check(largeFit,'Large landscape card fits map with keyboard-accessible overflow');await largePage.locator('.location-paper').focus();await largePage.keyboard.press('End');await largePage.waitForTimeout(250);check(await largePage.locator('.location-paper').evaluate(e=>e.scrollTop>0),'Keyboard reaches enlarged landscape details');await largePage.screenshot({path:output+'/landscape-enlarged.png'});await largeLandscape.close();
 const headingContext=await browser.newContext({viewport:{width:844,height:390}}),headingPage=await headingContext.newPage();await headingPage.goto(base+'/?inspect=1');await ready(headingPage);await headingPage.addStyleTag({content:'html{font-size:200% !important}'});await headingPage.waitForTimeout(350);check(await headingPage.evaluate(()=>document.querySelector('.destination-heading').getBoundingClientRect().bottom+12<=document.querySelector('[data-map-frame]').getBoundingClientRect().top),'Enlarged map heading stays above frame');await headingContext.close();
 const mobile=await browser.newContext({viewport:{width:390,height:740},screen:{width:390,height:844},hasTouch:true,isMobile:true}),mobilePage=await mobile.newPage();await mobilePage.goto(base+'/?inspect=1');await ready(mobilePage);const mobileG=await mobilePage.evaluate(()=>window.__weddingMotion.geometry);await move(mobilePage,mobileG.maxScroll);const mobileState=await snapshot(mobilePage),mobileBuild=await mobilePage.locator('.motion-layer').getAttribute('data-build-count');await mobilePage.setViewportSize({width:390,height:830});await mobilePage.waitForTimeout(300);assert.deepEqual(await snapshot(mobilePage),mobileState,'Mobile end stays settled through address-bar-height simulation');check(await mobilePage.locator('.motion-layer').getAttribute('data-build-count')===mobileBuild,'Mobile height-only change does not rebuild');await mobile.close();
 for(const [device,stored,override,expected]of [['tr-TR','en','', 'tr'],['en-US','tr','', 'en'],['fr-FR','tr','', 'en'],['tr-TR','en','en','en'],['en-US','tr','tr','tr']]){
  const context=await browser.newContext({viewport:{width:390,height:844},locale:device});
  await context.addCookies([{name:'invitation-language',value:stored,url:base}]);await context.addInitScript(value=>localStorage.setItem('invitation-language',value),stored);
  const page=await context.newPage();await page.goto(base+'/?inspect=1'+(override?'&lang='+override:''));await ready(page);
  check(await page.locator('html').getAttribute('lang')===expected,'Automatic language '+device+' ignores '+stored);
  const g=await page.evaluate(()=>window.__weddingMotion.geometry);await move(page,g.childhood.y-110);await page.screenshot({path:output+'/caption-'+expected+'-'+override+'.png'});
  await move(page,g.maxScroll);await page.screenshot({path:output+'/footer-'+expected+'-'+override+'.png'});
  await page.addStyleTag({content:'html{font-size:200% !important}'});await page.waitForTimeout(350);
  const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth>innerWidth,captions:[...document.querySelectorAll('[data-portrait-caption]')].some(e=>e.scrollWidth>e.clientWidth+1)}));
  check(!overflow.page&&!overflow.captions,'200% text wraps without horizontal clipping '+expected);
  await page.screenshot({path:output+'/enlarged-'+expected+'.png'});
  const verseG=await page.evaluate(()=>window.__weddingMotion.geometry);await move(page,verseG.verse.y-100);
  check(await page.locator('.verse-text').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'Enlarged Arabic fits the paper');
  await page.screenshot({path:output+'/enlarged-verse-'+expected+'.png'});
  const enlarged=await page.evaluate(()=>window.__weddingMotion.geometry);await move(page,enlarged.countdown.y-30);
  const counterOverlap=await page.evaluate(()=>{const boxes=[...document.querySelectorAll('.countdown-grid span,.countdown-grid small')].map(el=>{const range=document.createRange();range.selectNodeContents(el);return range.getBoundingClientRect();});return boxes.some((a,i)=>boxes.some((b,j)=>j>i&&a.right>b.left+1&&a.left<b.right-1&&a.bottom>b.top+1&&a.top<b.bottom-1));});
  check(!counterOverlap,'Enlarged countdown digits/labels do not overlap '+expected);
  await page.screenshot({path:output+'/enlarged-countdown-'+expected+'.png'});
  const boundaries=await page.evaluate(()=>{const root=document.querySelector('#invitation').getBoundingClientRect(),ending=document.querySelector('.ending').getBoundingClientRect(),word=document.querySelector('.wordmark').getBoundingClientRect(),opening=document.querySelector('.opening').getBoundingClientRect(),prompt=document.querySelector('.scroll-invitation').getBoundingClientRect();return{footer:word.bottom<=ending.bottom-12&&word.right<=root.right,opening:prompt.bottom<=opening.bottom-20};});
  check(boundaries.footer&&boundaries.opening,'Enlarged opening and footer remain contained '+expected);
  report.locales.push({device,stored,override,expected,overflow});await context.close();
 }
 for(const [now,state]of [['2026-10-17T14:59:58+03:00','before'],['2026-10-17T15:00:00+03:00','celebration'],['2026-10-17T23:59:59+03:00','celebration'],['2026-10-18T00:00:00+03:00','thanks']]){
  const context=await browser.newContext();const page=await context.newPage();await page.clock.install({time:new Date(now)});await page.goto(base);
  await page.locator(state==='before'?'.countdown-grid':'[data-countdown-state="'+state+'"]').waitFor({state:'attached'});
  check(state==='before'?await page.locator('.countdown-grid').count()===1:await page.locator('[data-countdown-state="'+state+'"]').count()===1,'Countdown state '+now);
  check((await page.locator('.countdown-paper h2').textContent())===(state==='before'?'Until the special day':state==='celebration'?'Our wedding day':'With love and gratitude'),'Correct countdown heading '+state);
  if(now.includes('23:59:59')){await page.clock.runFor(2000);check(await page.locator('[data-countdown-state="thanks"]').count()===1,'Wedding-day midnight transitions to thanks');}
  report.clock.push({now,state});await context.close();
 }
 for(const options of [{reducedMotion:'reduce'},{javaScriptEnabled:false}]){
  const context=await browser.newContext({viewport:{width:390,height:844},...options}),page=await context.newPage();await page.goto(base);
  check(await page.locator('[data-map-note]').isVisible(),'Static practical information');check(await page.locator('.wedding-date').isVisible(),'Static date');await page.screenshot({path:output+'/static-'+(options.reducedMotion?'reduced':'nojs')+'.png'});await context.close();
 }
 const context=await browser.newContext();await context.route('**/assets/*.webp',r=>r.abort());const page=await context.newPage();await page.goto(base);
 await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(500);
 check(await page.locator('[data-asset-state="error"]').count()>0,'Real image failure shows artwork fallbacks');check(await page.locator('[data-map-frame]').isVisible(),'Map remains present despite poster failures');check(await page.locator('[data-map-note]').isVisible(),'Image failure preserves location information');await context.close();
 const failure=await browser.newContext();await failure.addInitScript(()=>{const original=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){const box=original.call(this);return this.matches('.resting-place')?new DOMRect(box.x,0,box.width,box.height):box;};});
 const failedPage=await failure.newPage();await failedPage.goto(base);await failedPage.waitForTimeout(300);check(await failedPage.locator('#invitation.calm').count()===1,'Initialization failure keeps static invitation');check(await failedPage.locator('[data-map-note]').isVisible(),'Failure keeps location information');await failure.close();
 console.log('Browser refinement review complete; '+report.errors.length+' errors.');
}finally{await writeFile(output+'/report.json',JSON.stringify(report,null,2));await browser.close();}
