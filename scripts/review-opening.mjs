import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {translations} from '../lib/i18n.ts';
const base=process.env.INVITATION_REVIEW_URL||`http://localhost:${process.env.PORT||3000}`;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
await mkdir('.verification/opening',{recursive:true});
try{
 for(const width of [320,390,430,1440]){
  const page=await browser.newPage({viewport:{width,height:844}});
  await page.goto(base+'/?inspect=1');await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>window.__weddingMotion?.knots?.length>2);
  await page.waitForFunction(()=>document.querySelector('[data-artwork="openingComposition"]').dataset.assetState==='ready');
  assert(await page.evaluate(()=>{
   const root=document.querySelector('#invitation').getBoundingClientRect();
   return Math.abs(document.querySelector('.edge-left').getBoundingClientRect().left-root.left)<.5&&Math.abs(document.querySelector('.edge-right').getBoundingClientRect().right-root.right)<.5;
  }),'Both traditional borders touch the invitation edges at '+width);
  assert(await page.evaluate(()=>{
   const root=document.querySelector('#invitation').getBoundingClientRect(),homes=[...document.querySelectorAll('.heart-home')],poses=window.__weddingMotion.geometry.origins;
   return homes.every((el,i)=>{const b=el.getBoundingClientRect(),p=poses[i];return Math.abs(b.left-root.left+b.width/2-p.x)<.5&&Math.abs(b.top-root.top+b.height/2-p.y)<.5&&Math.abs(b.width-p.width)<.5&&Math.abs(b.height-p.height)<.5;});
  }),'Live hearts fit the measured map cut-outs at '+width);
  assert.equal(await page.locator('.traveller').count(),2);
  assert.equal(await page.locator('.origin-labels span').count(),2);
  const requests=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
  assert(!requests.some(url=>/\/(algeria_hart_map|palastine_hart_map|openingPatternAlgeria|openingPatternPalestine)\.webp/.test(url)),'Legacy maps/patterns are not downloaded');
  await page.screenshot({path:'.verification/opening/approved-'+width+'.png'});
  await page.evaluate(()=>scrollTo(0,320));await page.waitForTimeout(200);
  assert(Number(await page.locator('.origins').evaluate(e=>e.style.opacity))<.01,'No baked hearts remain after departure');
  await page.close();
 }
 for(const options of [{javaScriptEnabled:false},{reducedMotion:'reduce'}]){
  const page=await browser.newPage({viewport:{width:390,height:844},...options});await page.goto(base);
  assert(await page.locator('.origin-labels').isVisible());
  if(options.javaScriptEnabled===false){assert.equal(await page.locator('.heart-home [data-artwork="palastine_small_hart"]').count(),2);assert(await page.locator('.heart-home .artwork').first().isVisible());}
  else{await page.waitForTimeout(250);assert(await page.locator('.traveller').first().isVisible());}
  await page.screenshot({path:'.verification/opening/'+(options.reducedMotion?'reduced':'nojs')+'.png'});await page.close();
 }
 for(const [locale,device]of [['en','en-US'],['tr','tr-TR'],['ar','ar-DZ']])for(const width of [320,390]){
  const page=await browser.newPage({viewport:{width,height:844},locale:device});await page.goto(base+'/?inspect=1');await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>window.__weddingMotion?.knots?.length>2);
  const copy=translations[locale];
  assert.equal((await page.locator('h1').textContent()).replace(/\s+/g,' ').trim(),copy.titleFirst+' '+copy.titleSecond);
  assert.equal(await page.locator('.intro-subtitle').textContent(),copy.subtitle);
  assert.equal(await page.locator('.invitation-copy').textContent(),copy.invitation);
  assert((await page.title()).includes(copy.invitationTitle),'Browser/share title is localized');
  assert.equal(await page.locator('.opening .wedding-date').count(),0,'Date and time stay below');
  assert(await page.locator('h1').evaluate(el=>{const r=document.createRange();r.selectNodeContents(el);const root=document.querySelector('#invitation').getBoundingClientRect();return [...r.getClientRects()].every(b=>b.left>=root.left-1&&b.right<=root.right+1);}), 'Opening headline fits '+locale+' '+width);
  await page.screenshot({path:'.verification/opening/copy-'+locale+'-'+width+'.png'});await page.close();
 }
 console.log('Approved opening checked: flush borders, fitted live hearts, one optimized map composition, and static fallbacks.');
}finally{await browser.close();}
