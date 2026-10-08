import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.INVITATION_REVIEW_URL||`http://localhost:${process.env.PORT||3000}`;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
await mkdir('.verification/video',{recursive:true});
async function ready(page){await page.goto(base+'/?inspect=1');await page.waitForFunction(()=>window.__weddingMotion?.geometry);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(200);}
async function approach(page){await page.evaluate(()=>scrollTo(0,window.__weddingMotion.geometry.map.y-500));}
async function enter(page){await page.evaluate(()=>scrollTo(0,window.__weddingMotion.geometry.map.y-100));}
try{
 for(const width of [320,390,1440]){
  const context=await browser.newContext({viewport:{width,height:844}}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));await ready(page);
  assert.equal(await page.locator('video').getAttribute('src'),null,'Opening does not download the map clip');
  assert(await page.evaluate(()=>{const g=window.__weddingMotion.geometry;return g.map.height-g.pinHeight<=181;}),'Long scroll runway removed');
  await approach(page);await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
  await page.evaluate(()=>{window.__mapHeartFrames=[];const track=now=>{window.__mapHeartFrames.push({now,scroll:scrollY,u:Number(document.querySelector('#invitation').dataset.mapProgress),pair:[...document.querySelectorAll('.traveller')].map(el=>{const b=el.getBoundingClientRect();return{x:b.x,y:b.y};})});if(window.__mapHeartFrames.length<160)requestAnimationFrame(track);};requestAnimationFrame(track);});
  await enter(page);const y=await page.evaluate(()=>scrollY);
  await page.waitForTimeout(650);
  const mid=await page.evaluate(()=>({u:Number(document.querySelector('#invitation').dataset.mapProgress),time:document.querySelector('video').currentTime,paused:document.querySelector('video').paused}));
  assert(mid.u>.15&&mid.u<.75,'Zoom advances without scrolling');assert(mid.time>0&&!mid.paused,'Video plays rather than seeking every frame');
  await page.waitForFunction(()=>Number(document.querySelector('#invitation').dataset.mapProgress)===1,null,{timeout:2300});
  assert.equal(await page.evaluate(()=>scrollY),y,'Never scroll the page automatically');
  // Normalize to timeline progress, so a busy headless decoder skipping
  // presentation frames does not masquerade as a discontinuous heart curve.
  const largestStep=await page.evaluate(()=>{const frames=window.__mapHeartFrames;let largest=0;for(let j=1;j<frames.length;j++){const a=frames[j-1],b=frames[j];if(a.scroll!==b.scroll||a.u<.01||b.u<=a.u)continue;for(let i=0;i<2;i++)largest=Math.max(largest,Math.hypot(b.pair[i].x-a.pair[i].x,b.pair[i].y-a.pair[i].y)*.008335/(b.u-a.u));}return largest;});
  assert(largestStep<12,'Restrained continuous heart curve during the two-second zoom: '+largestStep);
  assert(await page.locator('[data-map-note]').isVisible());
  assert(await page.evaluate(()=>{const note=document.querySelector('[data-map-note]').getBoundingClientRect(),pin=document.querySelector('.venue-pin').getBoundingClientRect();return note.bottom<pin.top;}),'Venue paper is above its pin');
  assert.equal(new URL(await page.locator('.directions').getAttribute('href')).searchParams.get('destination'),'40.7603888,29.7847177');
  await page.screenshot({path:'.verification/video/final-'+width+'.png'});
  await approach(page);await enter(page);await page.waitForTimeout(200);
  assert.equal(await page.locator('#invitation').getAttribute('data-map-progress'),'1.0000','Return visits do not replay');
  if(width===390){await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(100);assert.equal(await page.locator('#invitation').getAttribute('data-map-progress'),'1.0000','Motion preference changes retain the final destination');assert(await page.locator('[data-map-static]').isVisible(),'Final still remains visible after motion preference changes');}
  assert.deepEqual(errors,[]);await context.close();
 }
 for(const mode of ['blocked','pending','play-rejected','fast']){
  const context=await browser.newContext({viewport:{width:390,height:844}});
  if(mode==='blocked')await context.route('**/assets/map-zoom-mobile.mp4',r=>r.abort());
  if(mode==='pending')await context.route('**/assets/map-zoom-mobile.mp4',()=>{});
  if(mode==='play-rejected')await context.addInitScript(()=>{HTMLMediaElement.prototype.play=()=>Promise.reject(new Error('Playback blocked'));});
  const page=await context.newPage();await ready(page);await approach(page);
  if(mode==='play-rejected')await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
  if(mode==='fast')await page.evaluate(()=>scrollTo(0,window.__weddingMotion.geometry.map.y+190));else await enter(page);
  await page.waitForFunction(()=>Number(document.querySelector('#invitation').dataset.mapProgress)===1,null,{timeout:2500});
  assert(await page.locator('[data-map-note]').isVisible(),mode+' keeps practical details');
  assert(await page.locator('[data-map-static]').isVisible(),mode+' selects the final still');await context.close();
 }
 const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();await page.goto(base);await page.locator('[data-map-video]').scrollIntoViewIfNeeded();
 assert.equal(await page.locator('video').getAttribute('src'),null);assert(await page.locator('[data-map-note]').isVisible());await context.close();
 console.log('Automatic map checks passed: two-second playback, short section, no page scrolling/replay, directions, pin placement, blocked/pending/rejected/fast and reduced-motion fallbacks.');
}finally{await browser.close();}
