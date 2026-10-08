import sharp from 'sharp';
import {mkdir,stat,writeFile} from 'node:fs/promises';
const files={
 openingComposition:['opening-keepsake.png',1000],
 algeria_hart_map:['algeria_hart_map.png',650], palastine_hart_map:['palastine_hart_map.png',350], travellingHeart:['matte-travelling-heart.png',400],
 childhoodComposition:['ChatGPT Image Oct 6, 2026, 07_51_13 PM.png',900], adultComposition:['ChatGPT Image Oct 6, 2026, 08_33_05 PM.png',1000],
 openingPatternAlgeria:['ChatGPT Image Oct 6, 2026, 07_51_03 PM.png',600], openingPatternPalestine:['ChatGPT Image Oct 6, 2026, 07_51_09 PM.png',500],
 mapWide:['ChatGPT Image Oct 6, 2026, 07_50_39 PM.png',1600],mapCloser:['ChatGPT Image Oct 6, 2026, 07_50_49 PM.png',1600],mapRegional:['ChatGPT Image Oct 6, 2026, 07_50_54 PM.png',1600],mapCity:['ChatGPT Image Oct 6, 2026, 07_50_58 PM.png',1600],
};
await mkdir('public/assets',{recursive:true});
const report=[];
for(const [id,[name,width]]of Object.entries(files)){
 const source='Assets/'+name,output='public/assets/'+(id==='travellingHeart'?'travelling-heart':id==='openingComposition'?'opening-keepsake':id)+'.webp';
 // Full decode rejects damaged inputs before creating any production derivative.
 await sharp(source).raw().toBuffer();
 await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:id.includes('Composition')?94:88,alphaQuality:100,effort:6}).toFile(output);
 const metadata=await sharp(output).metadata();await sharp(output).raw().toBuffer();
 report.push({id,original:source,output,originalBytes:(await stat(source)).size,optimizedBytes:(await stat(output)).size,width:metadata.width,height:metadata.height,alpha:metadata.hasAlpha});
}
await mkdir('.verification',{recursive:true});
await writeFile('.verification/asset-sizes.json',JSON.stringify(report,null,2));
const original=report.reduce((n,a)=>n+a.originalBytes,0),optimized=report.reduce((n,a)=>n+a.optimizedBytes,0);
console.log(JSON.stringify({original,optimized,saved:original-optimized,reduction:((original-optimized)/original*100).toFixed(1)+'%'}));
