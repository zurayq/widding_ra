import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.INVITATION_REVIEW_URL||'http://localhost:3000';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,args:['--autoplay-policy=no-user-gesture-required']});
await mkdir('.verification/audio',{recursive:true});
try{
 for(const lang of ['en','tr','ar']){
  const context=await browser.newContext({viewport:{width:320,height:844}});
  await context.addInitScript(()=>{const original=HTMLMediaElement.prototype.play;let blocked=true;HTMLMediaElement.prototype.play=function(){if(this instanceof HTMLAudioElement&&blocked){blocked=false;return Promise.reject(new DOMException('Gesture required','NotAllowedError'));}return original.call(this);};});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/?lang='+lang);await page.waitForTimeout(200);
  const control=page.locator('[data-invitation-audio]'),button=control.locator('button');
  assert.equal(await control.getAttribute('data-audio-state'),'idle');
  await control.locator('img').evaluate(image=>image.decode());
  assert.equal(await page.locator('[data-audio-hint]').textContent(),lang==='en'?'Press me':lang==='tr'?'Bana dokun':'اضغط هنا');
  await page.screenshot({path:'.verification/audio/opening-'+lang+'.png'});
  assert(!(await page.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.includes('wedding-ar101.mp3')))),'Audio does not download on opening');
  await page.evaluate(()=>scrollTo(0,80));await page.waitForFunction(()=>document.querySelector('[data-invitation-audio]').dataset.audioState==='blocked');
  assert(await button.getAttribute('aria-label'),'Blocked playback has an accessible tap fallback');
  assert(await page.locator('[data-audio-hint]').isVisible(),'Blocked playback keeps the paper arrow prompt');
  await button.click();await page.waitForFunction(()=>document.querySelector('[data-invitation-audio] audio').currentTime>0);
  assert.equal(await button.getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('[data-audio-hint]').count(),0,'Prompt clears while audio plays');
  assert(await control.locator('audio').evaluate(a=>Math.abs(a.duration-39.445)<.1&&!a.loop),'Supplied recording plays once');
  await button.click();await page.waitForFunction(()=>document.querySelector('[data-invitation-audio]').dataset.audioState==='paused');
  const time=await control.locator('audio').evaluate(a=>a.currentTime);await page.evaluate(()=>scrollTo(0,180));await page.waitForTimeout(200);
  assert.equal(await control.locator('audio').evaluate(a=>a.currentTime),time,'Scrolling never overrides a manual pause');
  await button.click();await page.waitForFunction(()=>document.querySelector('[data-invitation-audio]').dataset.audioState==='playing');
  const box=await button.boundingBox();assert(box.x>=0&&box.x+box.width<=320&&box.width>=44&&box.height>=44,'Side button fits narrow phones with a full touch target');
  await page.screenshot({path:'.verification/audio/'+lang+'.png'});assert.deepEqual(errors,[]);await context.close();
 }
 const context=await browser.newContext(),page=await context.newPage();await page.goto(base);await page.evaluate(()=>scrollTo(0,80));
 await page.waitForFunction(()=>document.querySelector('[data-invitation-audio]').dataset.audioState==='playing');
 assert(await page.locator('audio').evaluate(a=>a.currentTime>=0),'Scroll starts audio when policy permits');await context.close();
 const broken=await browser.newContext();await broken.route('**/assets/wedding-ar101.mp3',r=>r.abort());const errorPage=await broken.newPage();await errorPage.goto(base);await errorPage.evaluate(()=>scrollTo(0,80));await errorPage.waitForFunction(()=>document.querySelector('[data-invitation-audio]').dataset.audioState==='error');
 assert.equal(await errorPage.locator('[data-invitation-audio] button').getAttribute('aria-label'),'Retry audio');await broken.close();
 console.log('Audio checks passed: no eager download, scroll attempt, blocked-to-tap recovery, native file decoding, pause/resume, no scroll restart, EN/TR/AR side control and media failure.');
}finally{await browser.close();}
