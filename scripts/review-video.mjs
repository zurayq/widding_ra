import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {mapVideo} from '../lib/map-video-config.ts';
const base=process.env.INVITATION_REVIEW_URL||`http://localhost:${process.env.PORT||3000}`;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||(process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined)});
await mkdir('.verification/video',{recursive:true});
async function seek(page,progress){
  await page.evaluate(u=>{const g=window.__weddingMotion.geometry;scrollTo(0,g.map.y+u*(g.map.height-g.pinHeight));},progress);
  await page.waitForFunction(u=>{const v=document.querySelector('[data-map-video] video');return v.readyState>=2&&!v.seeking&&Math.abs(v.currentTime-Math.min(v.duration-1/30,Math.min(1,u/.82)*v.duration))<.04;},progress,{timeout:30000});
}
try{
 for(const width of [320,390,1440]){
  const context=await browser.newContext({viewport:{width,height:844}}),page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/?inspect=1');await page.waitForFunction(()=>window.__weddingMotion?.geometry);
  assert.equal(await page.locator('[data-map-video] video').getAttribute('src'),null,'Do not download video at the opening');
  for(const u of [.05,.3,.6,.9,1,.7,.25,.9]){
    await seek(page,u);
    assert.equal(await page.locator('[data-map-video]').getAttribute('data-video-state'),'ready');
    assert(await page.locator('video').evaluate((v,width)=>v.videoWidth===width && Math.abs(v.duration-6.4)<.05,mapVideo.width),'Lighter 720p clip decodes');
    assert(await page.locator('video').evaluate(v=>v.paused&&!v.autoplay&&v.muted&&v.playsInline),'Scroll-only, silent inline video');
  }
  const time=await page.locator('video').evaluate(v=>v.currentTime);
  await page.waitForTimeout(300);assert.equal(await page.locator('video').evaluate(v=>v.currentTime),time,'Pause holds exact frame');
  await page.evaluate(()=>{const g=window.__weddingMotion.geometry;for(const u of [.2,.9,.1,.8])scrollTo(0,g.map.y+u*(g.map.height-g.pinHeight));});
  await seek(page,.8);
  await seek(page,1);await page.screenshot({path:'.verification/video/final-'+width+'.png'});
  const destination=await page.locator('.directions').getAttribute('href');assert.equal(new URL(destination).searchParams.get('destination'),'40.7603888,29.7847177');
  assert(await page.evaluate(()=>{const pin=document.querySelector('.venue-pin').getBoundingClientRect(),note=document.querySelector('[data-map-note]').getBoundingClientRect();return note.bottom<pin.top;}),'Paper sits above the destination pin');
  assert.deepEqual(errors,[]);await context.close();
 }
 const blocked=await browser.newContext({viewport:{width:390,height:844}});await blocked.route('**'+mapVideo.src,route=>route.abort());
 const page=await blocked.newPage();await page.goto(base+'/?inspect=1');await page.waitForFunction(()=>window.__weddingMotion?.geometry);
 await page.evaluate(()=>{const g=window.__weddingMotion.geometry;scrollTo(0,g.map.y+1050);});await page.waitForFunction(()=>document.querySelector('[data-map-video]').dataset.videoState==='error');
 assert(await page.locator('[data-map-static] img').evaluate((image,width)=>image.complete&&image.naturalWidth===width,mapVideo.width),'Video failure uses corrected final frame');
 assert(await page.locator('[data-map-note]').isVisible());await page.screenshot({path:'.verification/video/video-failure.png'});await blocked.close();
 // A request that stays pending emits no media error. Reaching the venue
 // must still replace the opening frame, and a late download cannot undo it.
 const delayed=await browser.newContext({viewport:{width:390,height:844}});
 let release; const hold=new Promise(resolve=>{release=resolve;});
 await delayed.route('**'+mapVideo.src,async route=>{await hold;await route.continue().catch(()=>{});});
 const delayedPage=await delayed.newPage();await delayedPage.goto(base+'/?inspect=1');await delayedPage.waitForFunction(()=>window.__weddingMotion?.geometry);
 await delayedPage.evaluate(()=>{const g=window.__weddingMotion.geometry;scrollTo(0,g.map.y+(g.map.height-g.pinHeight)*.99);});
 await delayedPage.waitForFunction(()=>document.querySelector('[data-map-video]').dataset.videoState==='error',{},{timeout:5000});
 assert(await delayedPage.locator('[data-map-static] img').evaluate(image=>image.complete&&image.naturalWidth>0));
 release();await delayedPage.waitForTimeout(500);assert.equal(await delayedPage.locator('[data-map-video]').getAttribute('data-video-state'),'error','Late video cannot replace the correct final still');
 await delayedPage.evaluate(()=>{const g=window.__weddingMotion.geometry;scrollTo(0,g.map.y+50);});await delayedPage.waitForTimeout(100);
 assert.equal(await delayedPage.locator('[data-map-video]').getAttribute('data-video-state'),'error');await delayed.close();
 const reduced=await browser.newContext({reducedMotion:'reduce'}),reducedPage=await reduced.newPage();await reducedPage.goto(base);await reducedPage.locator('[data-map-video]').scrollIntoViewIfNeeded();await reducedPage.waitForTimeout(200);
 assert.equal(await reducedPage.locator('video').getAttribute('src'),null,'Reduced motion does not load the video');assert(await reducedPage.locator('[data-map-note]').isVisible());await reduced.close();
 console.log('Video browser checks passed: loading, forward/reverse/rapid seeking, pause, coordinates, note position and reduced/error fallbacks.');
}finally{await browser.close();}
