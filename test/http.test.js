import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {once} from 'node:events';
test('HTTP: removed routes unavailable, owner protected, idempotent balance and fair case settlement',async()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'cameraman-http-'));
 const server=spawn(process.execPath,['server/index.js'],{cwd:new URL('..',import.meta.url),env:{...process.env,DEV_MODE:'1',BOT_TOKEN:'',PORT:'0',DATABASE_PATH:path.join(dir,'test.db')}});
 let text='';server.stdout.on('data',c=>text+=c);let errors='';server.stderr.on('data',c=>errors+=c);
 // Request an OS-assigned free port, reported by the HTTP server.
 try{
  await new Promise((resolve,reject)=>{server.stdout.on('data',()=>{if(text.includes('порт '))resolve();});server.once('exit',()=>reject(Error(errors||'server stopped')));setTimeout(()=>reject(Error('Server startup timeout')),10000).unref();});
  const port=text.match(/порт (\d+)/)[1],base='http://127.0.0.1:'+port;
  const request=async(p,b,user=8911524524,key=crypto.randomUUID())=>{const r=await fetch(base+p,{method:b===undefined?'GET':'POST',headers:{'X-Dev-User':String(user),'Content-Type':'application/json','Idempotency-Key':key},...(b===undefined?{}:{body:JSON.stringify(b)})});return {status:r.status,data:await r.json()};};
  const state=await request('/api/state');assert.equal(state.data.items.length,41);assert.equal(state.data.cases.length,9);assert.equal(state.data.giveaway,undefined);
  assert.equal((await request('/api/admin/state',undefined,22)).status,400);
  for(const route of ['/api/invoice','/api/dice','/api/mines/start','/api/crash/start','/api/giveaway/join'])assert.equal((await request(route,{})).data.error,'Операция не найдена');
  const key=crypto.randomUUID(),credit={action:'balance',user:8911524524,delta:100000,reason:'HTTP test'};
  assert.equal((await request('/api/admin/action',credit,8911524524,key)).status,200);assert.equal((await request('/api/admin/action',credit,8911524524,key)).status,200);
  assert.equal((await request('/api/state')).data.user.balance,100000);
  const f=await request('/api/fairness/commit',{clientSeed:'http-client'});
  const r=await request('/api/case',{caseId:'case-patrol',quantity:2,fairnessId:f.data.id});assert.equal(r.status,200);assert.equal(r.data.prizes.length,2);
  const after=await request('/api/state');assert.equal(after.data.inventory.length,2);assert.equal(after.data.user.balance,97600);assert.equal(after.data.proofs[0].hash,f.data.hash);
  for(const i of after.data.items){const r=await fetch(base+'/'+i.image);assert.equal(r.status,200,i.name);}
 }finally{server.kill();await once(server,'exit');rmSync(dir,{recursive:true,force:true});}
});
