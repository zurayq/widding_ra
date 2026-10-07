import {spawn} from 'node:child_process';
for(const args of [['node_modules/typescript/bin/tsc','--noEmit'],['scripts/check-configuration.mjs'],['scripts/check-assets.mjs'],['node_modules/next/dist/bin/next','build']]){
 const code=await new Promise(resolve=>spawn(process.execPath,args,{stdio:'inherit'}).once('exit',resolve));
 if(code!==0)process.exit(code||1);
}
