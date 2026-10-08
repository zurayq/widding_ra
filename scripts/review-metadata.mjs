import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=process.env.INVITATION_REVIEW_URL||`http://localhost:${process.env.PORT||3000}`;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||(process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined)});
try{
 const page=await browser.newPage();await page.goto(base);await page.evaluate(async()=>{for(const element of [document.body,document.querySelector('.verse-text')])await document.fonts.load('16px '+getComputedStyle(element).fontFamily.split(',')[0]);await document.fonts.ready;});
 assert(await page.evaluate(()=>{const body=getComputedStyle(document.body).fontFamily.split(',')[0],arabic=getComputedStyle(document.querySelector('.verse-text')).fontFamily.split(',')[0];return document.fonts.check('16px '+body)&&document.fonts.check('16px '+arabic)&&[body.replaceAll('"',''),arabic.replaceAll('"','')].every(family=>[...document.fonts].some(face=>face.family===family&&face.status==='loaded'));}),'Self-hosted serif and Arabic fonts load');
 const metadata=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('meta[property],meta[name]')].map(el=>[el.getAttribute('property')||el.name,el.content])));
 assert.equal(await page.locator('meta[property="og:image"]').count(),1,'Only one preview image');
 assert(metadata['og:image'].endsWith('/share-preview.jpg'));assert(metadata['og:image:alt'].includes('Körfez'));assert(!metadata['og:title'].includes('widding.ly'));
 const calendar=await page.request.get(base+'/wedding.ics');assert.equal(calendar.status(),200);assert(calendar.headers()['content-type'].startsWith('text/calendar'));assert(calendar.headers()['content-disposition'].includes('attachment'));assert((await calendar.text()).includes('DTSTART:20261017T120000Z'));
 assert.equal(metadata['theme-color'],'#fbf8f0');assert.equal(metadata['twitter:card'],'summary_large_image');
 for(const field of ['og:image','twitter:image']){assert(metadata[field]?.startsWith(base),'Share image uses actual request origin');const response=await page.request.get(metadata[field]);assert.equal(response.status(),200);}
 for(const path of ['/favicon.ico','/icon.svg','/share-preview.jpg'])assert.equal((await page.request.get(base+path)).status(),200,path);
 const crawler=await page.request.get(base,{headers:{'User-Agent':'WhatsApp/2.26.0'}});const head=(await crawler.text()).split('</head>')[0];assert(head.includes('property="og:image"')&&head.includes('share-preview.jpg'),'WhatsApp crawler gets the preview in its initial head');
 const context=await browser.newContext({javaScriptEnabled:false,locale:'tr-TR'}),staticPage=await context.newPage();await staticPage.goto(base);
 assert.equal(await staticPage.locator('html').getAttribute('lang'),'tr');
 assert.equal(await staticPage.locator('[data-composition] noscript svg').count(),2,'Localized source-caption masks exist without JavaScript');
 assert((await staticPage.locator('[data-portrait-caption="childhood"]').textContent()).includes('küçük'));
 await staticPage.locator('[data-composition="childhood"]').screenshot({path:'.verification/refinement/nojs-turkish-portrait.png'});
 await context.close();console.log('Production metadata, real-origin share images, favicon, fonts and Turkish no-JS caption masks passed.');
}finally{await browser.close();}
