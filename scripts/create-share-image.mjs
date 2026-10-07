import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
const art=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#fbf8f0"/><rect x="35" y="35" width="1130" height="560" rx="5" fill="none" stroke="#d9c6a0"/><path d="M535 280C505 253 480 228 480 204C480 175 515 170 534 195C553 170 587 181 585 208C583 237 553 262 535 280Z" fill="#ad5261"/><path d="M640 287C617 266 596 243 596 225C596 201 624 195 640 218C656 195 685 204 683 227C681 251 655 275 640 287Z" fill="#cb8c91"/><g font-family="Georgia,serif" text-anchor="middle" fill="#59492f"><text x="600" y="370" font-size="65">Amir &amp; Raghed</text><text x="600" y="437" font-size="29">17 October 2026 · 15:00</text><text x="600" y="484" font-size="25" fill="#806946">İzmit, Kocaeli · Türkiye</text><text x="600" y="560" font-size="19" fill="#806946">widding.ly</text></g></svg>`);
await sharp(art).jpeg({quality:94}).toFile('public/share-preview.jpg');
await sharp(art).png().toFile('app/opengraph-image.png');
const icon=await sharp(await readFile('app/icon.svg')).resize(64,64).png().toBuffer();
const header=Buffer.alloc(22);header.writeUInt16LE(1,2);header.writeUInt16LE(1,4);header[6]=64;header[7]=64;header.writeUInt16LE(1,10);header.writeUInt16LE(32,12);header.writeUInt32LE(icon.length,14);header.writeUInt32LE(22,18);
await writeFile('app/favicon.ico',Buffer.concat([header,icon]));
