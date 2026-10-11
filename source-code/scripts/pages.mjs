import {copyFile,readFile,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {resolve} from 'node:path';

const dist=resolve('dist');
const mode=process.argv[2];
const validBase=base=>/^\/(?:[A-Za-z0-9._~-]+\/)*$/.test(base);

function run(command,args,env=process.env){
  return new Promise((resolveRun,reject)=>{
    const child=spawn(command,args,{stdio:'inherit',env});
    child.on('error',reject);
    child.on('exit',(code,signal)=>{
      if(code===0)resolveRun();
      else reject(new Error(`${command} failed (${signal??code})`));
    });
  });
}

try{
  if(mode==='build'){
    const base=process.env.VITE_BASE;
    if(!base||!validBase(base))throw new Error('VITE_BASE is required and must be wrapped in slashes, for example /my-repo/.');
    await run('npm',['run','build']);
    await copyFile(resolve(dist,'index.html'),resolve(dist,'404.html'));
    await writeFile(resolve(dist,'.nojekyll'),'');
    await writeFile(resolve(dist,'.pages-base'),base);
  }else if(mode==='preview'){
    const base=(await readFile(resolve(dist,'.pages-base'),'utf8')).trim();
    if(!validBase(base))throw new Error('The Pages build has an invalid base path. Run build:pages again.');
    await run(process.execPath,[resolve('node_modules/vite/bin/vite.js'),'preview','--host','127.0.0.1',...process.argv.slice(3)],{...process.env,VITE_BASE:base});
  }else throw new Error('Use pages.mjs build or pages.mjs preview.');
}catch(error){
  console.error(error instanceof Error?error.message:error);
  process.exitCode=1;
}
