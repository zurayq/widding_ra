import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try {
  const failedAssets=await browser.newContext({viewport:{width:390,height:844}});
  await failedAssets.route('**/assets/*.png',route=>route.abort());
  const page=await failedAssets.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelectorAll('[data-composition][data-asset-state="error"]').length===2);
  assert.equal(await page.locator('[data-artwork] image').count(),0);
  assert.equal(await page.locator('.traveller svg').count(),2);
  assert.equal(await page.locator('.landscape-preview').count(),4);
  assert.equal(await page.locator('[data-composition] img').count(),0);
  assert.deepEqual(errors,[]);
  await page.screenshot({path:'.verification/missing-artwork.png'});
  await failedAssets.close();
  const failedMotion=await browser.newContext({viewport:{width:390,height:844}});
  await failedMotion.addInitScript(()=>{
    const original=Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect=function(){
      const box=original.call(this);
      // Deliberately invalid geometry exercises initialization and rebuild recovery.
      return this.matches('.resting-place') ? new DOMRect(box.x,0,box.width,box.height) : box;
    };
  });
  const fallback=await failedMotion.newPage();fallback.on('pageerror',error=>errors.push(error.message));
  await fallback.goto('http://localhost:3000/',{waitUntil:'networkidle'});
  assert.equal(await fallback.locator('main').evaluate(el=>el.classList.contains('calm')),true);
  assert.equal(await fallback.locator('.location-note').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await fallback.locator('.route-svg').evaluate(el=>getComputedStyle(el).opacity),'0');
  assert.ok((await fallback.locator('.traveller').evaluateAll(els=>els.map(el=>el.getBoundingClientRect()))).every(b=>b.width>20&&b.y>300&&b.y<550));
  assert.equal(await fallback.locator('.directions').isDisabled(),true);
  assert.deepEqual(errors,[]);
  await fallback.locator('.location-note').scrollIntoViewIfNeeded();
  await fallback.screenshot({path:'.verification/motion-failure.png'});
  await failedMotion.close();
  console.log('Missing-artwork and forced motion-failure fallbacks passed.');
} finally {await browser.close();}
