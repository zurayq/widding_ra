import sharp from 'sharp';
import {assets} from '../lib/assets.ts';
import {mapVideo} from '../lib/map-video-config.ts';
import {readdir,stat,readFile} from 'node:fs/promises';
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
for(const name of [mapVideo.startPoster.split('/').pop(),mapVideo.poster.split('/').pop()]){
 const image=sharp('public/assets/'+name);await image.raw().toBuffer();const m=await image.metadata();assert.equal(m.width,mapVideo.width);assert.equal(m.height,mapVideo.height);
}
const keepsake=sharp('public/assets/venue-keepsake.webp');
await keepsake.raw().toBuffer();
const keepsakeMeta=await keepsake.metadata();
assert.equal(keepsakeMeta.width,800);assert.equal(keepsakeMeta.height,887);assert(keepsakeMeta.hasAlpha,'Venue paper has transparent edges');
const skyline=sharp('public/assets/skyline-keepsake.webp');
await skyline.raw().toBuffer();
const skylineMeta=await skyline.metadata();assert.equal(skylineMeta.width,1000);assert.equal(skylineMeta.height,500);assert(skylineMeta.hasAlpha,'Skyline has transparent surroundings');
const verse=sharp('public/assets/verse-keepsake.webp');await verse.raw().toBuffer();
const verseMeta=await verse.metadata();assert.equal(verseMeta.width,1000);assert.equal(verseMeta.height,563);assert(verseMeta.hasAlpha,'Verse paper has transparent edges');
const counter=await sharp('public/assets/countdown-keepsake.webp').metadata();assert(counter.hasAlpha);assert.equal(counter.width,800);assert.equal(counter.height,1200);
const video=await readFile('public'+mapVideo.src);
assert.equal(video.toString('ascii',4,8),'ftyp','Map video has a valid MP4 file-type box');
assert(video.indexOf(Buffer.from('moov'))<video.indexOf(Buffer.from('mdat')),'Map video metadata precedes media for fast loading');
assert(video.length<4_000_000,'Mobile map video stays below 4 MB');
console.log('All 11 optimized artworks and both video stills decode; fast-start MP4 verified ('+video.length+' bytes).');
