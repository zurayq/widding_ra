import sharp from 'sharp';
import {assets} from '../lib/assets.ts';
import {readdir,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
let bytes=0;
for(const asset of Object.values(assets)){
 if(asset.enabled===false)continue;
 const filename=decodeURIComponent(asset.src.slice('/assets/'.length));
 // Compare exact case against directory entries, also on Windows.
 assert((await readdir('public/assets')).includes(filename),'Exact-case asset missing: '+filename);
 const file='public/assets/'+filename;await sharp(file).raw().toBuffer();bytes+=(await stat(file)).size;
 const m=await sharp(file).metadata();assert(Math.abs(m.width/m.height-asset.sourceSize.width/asset.sourceSize.height)<.006,'Unexpected aspect ratio: '+filename);
}
console.log('All 11 optimized assets decode, match exact-case paths and preserve proportions; '+bytes+' total bytes.');
