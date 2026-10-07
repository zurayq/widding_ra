import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.INVITATION_REVIEW_URL||`http://localhost:${process.env.PORT||3000}`;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||(process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined)});
await mkdir('.verification/video',{recursive:true});
async function seek(page,progress){
  await page.evaluate(u=>{const g=window.__weddingMotion.geometry;scrollTo(0,g.map.y+u*(g.map.height-g.pinHeight));},progress);
  await page.waitForFunction(u=>{const v=document.querySelector('[data-map-video] video');return v.readyState>=2&&!v.seeking&&Math.abs(v.currentTime-Math.min(v.duration-1/60,u*v.duration))<.04;},progress,{timeout:30000});
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
    assert(await page.locator('video').evaluate(v=>v.paused&&!v.autoplay&&v.muted&&v.playsInline),'Scroll-only, silent inline video');
  }
  const time=await page.locator('video').evaluate(v=>v.currentTime);
  await page.waitForTimeout(300);assert.equal(await page.locator('video').evaluate(v=>v.currentTime),time,'Pause holds exact frame');
  await page.evaluate(()=>{const g=window.__weddingMotion.geometry;for(const u of [.2,.9,.1,.8])scrollTo(0,g.map.y+u*(g.map.height-g.pinHeight));});
  await seek(page,.8);
  await seek(page,1);await page.screenshot({path:'.verification/video/final-'+width+'.png'});
  const destination=await page.locator('.directions').getAttribute('href');assert.equal(new URL(destination).searchParams.get('destination'),'40.7583737692164,29.796404809521622');
  assert(await page.evaluate(()=>{const pin=document.querySelector('.venue-pin').getBoundingClientRect(),note=document.querySelector('[data-map-note]').getBoundingClientRect();return note.bottom<pin.top;}),'Paper sits above the destination pin');
  assert.deepEqual(errors,[]);await context.close();
 }
 const blocked=await browser.newContext({viewport:{width:390,height:844}});await blocked.route('**/assets/map-zoom.mp4',route=>route.abort());
 const page=await blocked.newPage();await page.goto(base+'/?inspect=1');await page.waitForFunction(()=>window.__weddingMotion?.geometry);
 await page.evaluate(()=>{const g=window.__weddingMotion.geometry;scrollTo(0,g.map.y+1050);});await page.waitForFunction(()=>document.querySelector('[data-map-video]').dataset.videoState==='error');
 assert(await page.locator('[data-map-fallback] img').evaluate(image=>image.complete&&image.naturalWidth>0),'Video failure uses approved single-image fallback');
 assert(await page.locator('[data-map-note]').isVisible());await page.screenshot({path:'.verification/video/video-failure.png'});await blocked.close();
 const reduced=await browser.newContext({reducedMotion:'reduce'}),reducedPage=await reduced.newPage();await reducedPage.goto(base);await reducedPage.locator('[data-map-video]').scrollIntoViewIfNeeded();await reducedPage.waitForTimeout(200);
 assert.equal(await reducedPage.locator('video').getAttribute('src'),null,'Reduced motion does not load the video');assert(await reducedPage.locator('[data-map-note]').isVisible());await reduced.close();
 console.log('Video browser checks passed: loading, forward/reverse/rapid seeking, pause, coordinates, note position and reduced/error fallbacks.');
}finally{await browser.close();}
