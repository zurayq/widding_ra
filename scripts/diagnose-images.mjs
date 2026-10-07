import { chromium } from 'playwright';
const browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_EXECUTABLE_PATH || (process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined)});
const page=await browser.newPage();
page.on('console',m=>{if(m.type()==='error') console.log(m.text());});
page.on('requestfailed',r=>console.log('FAILED '+r.url()+' '+r.failure()?.errorText));
await page.goto(process.env.INVITATION_REVIEW_URL || `http://localhost:${process.env.PORT || 3000}`);
await page.waitForTimeout(1500);
console.log(await page.evaluate(async()=>{
 const urls=[...new Set([...document.querySelectorAll('svg image')].map(e=>e.getAttribute('href')).concat([...document.images].map(e=>e.src)).filter(Boolean))];
 return Promise.all(urls.map(async url=>{const response=await fetch(url);const blob=await response.blob();try {const bitmap=await createImageBitmap(blob);return{url,status:response.status,width:bitmap.width,height:bitmap.height,decoded:true};}catch{return{url,status:response.status,decoded:false,bytes:blob.size};}}));
}));
await browser.close();
