import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {wedding} from '../lib/content.ts';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const base=process.env.INVITATION_REVIEW_URL||'http://localhost:3000';
await mkdir('.verification/venue',{recursive:true});
try{
 for(const locale of ['en-US','tr-TR'])for(const width of [320,390]){
  const context=await browser.newContext({viewport:{width,height:844},locale}),page=await context.newPage();
  await page.goto(base+'/?inspect=1');await page.waitForFunction(()=>window.__weddingMotion?.geometry);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(200);
  await page.evaluate(()=>{const g=window.__weddingMotion.geometry;scrollTo(0,g.map.y+1050);});
  await page.waitForFunction(()=>Number(document.querySelector('[data-map-note]').style.opacity)===1);
  await page.locator('img[src="/assets/venue-keepsake.webp"]').evaluate(image=>image.decode());
  assert.equal(await page.locator('#location-heading a').getAttribute('href'),wedding.placeUrl);
  assert.equal(new URL(await page.locator('.directions').getAttribute('href')).searchParams.get('destination'),`${wedding.latitude},${wedding.longitude}`);
  assert(await page.locator('.location-paper').evaluate(paper=>paper.scrollHeight<=paper.clientHeight+1),'Normal mobile card needs no inner scrolling');
  assert(await page.evaluate(()=>{const note=document.querySelector('[data-map-note]').getBoundingClientRect(),frame=document.querySelector('[data-map-frame]').getBoundingClientRect(),pin=document.querySelector('.venue-pin').getBoundingClientRect();return note.top>=frame.top&&note.bottom<pin.top&&note.left>=frame.left&&note.right<=frame.right;}),'Card is contained above the pin');
  await page.screenshot({path:`.verification/venue/${locale}-${width}.png`});await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();
 await context.route('**/assets/venue-keepsake.webp',r=>r.abort());await page.goto(base+'/?inspect=1');await page.waitForFunction(()=>window.__weddingMotion?.geometry);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(200);
 await page.evaluate(()=>{const g=window.__weddingMotion.geometry;scrollTo(0,g.map.y+1050);});
 await page.waitForFunction(()=>Number(document.querySelector('[data-map-note]').style.opacity)===1);
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('img[src="/assets/venue-keepsake.webp"]')).display==='none');
 assert(await page.locator('.directions').isVisible(),'Missing illustration keeps working directions');await context.close();
 console.log('Venue checks passed: English/Turkish, narrow screens, illustration decoding, corrected links, placement and artwork failure.');
}finally{await browser.close();}
