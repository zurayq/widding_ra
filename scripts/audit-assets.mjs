import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
for (const folder of ['Assets', 'public/assets']) {
  for (const name of await readdir(folder)) {
    if (!/\.(png|webp|avif)$/i.test(name)) continue;
    try {
      const m = await sharp(`${folder}/${name}`).metadata();
      await sharp(`${folder}/${name}`).raw().toBuffer();
      console.log(JSON.stringify({ folder, name, width: m.width, height: m.height, bytes: (await stat(`${folder}/${name}`)).size, valid: true }));
    } catch (error) { console.log(JSON.stringify({ folder, name, valid: false, error: error.message })); }
  }
}
