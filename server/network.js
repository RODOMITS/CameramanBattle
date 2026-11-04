import {setDefaultResultOrder} from 'node:dns';

// Prefer IPv4 while retaining Node's fallback to other available addresses.
setDefaultResultOrder('ipv4first');

export function networkError(error,token=''){
 const parts=[],seen=new Set();
 function visit(e,depth=0){
  if(!e||depth>3||seen.has(e))return;
  seen.add(e);
  const text=[e.code,e.message].filter(Boolean).join(': ');
  if(text&&!parts.includes(text))parts.push(text);
  visit(e.cause,depth+1);
  for(const nested of (e.errors||[]).slice(0,4))visit(nested,depth+1);
 }
 visit(error);
 let result=parts.join(' | ')||'Неизвестная сетевая ошибка';
 if(token)result=result.replaceAll(token,'[TOKEN]').replaceAll(encodeURIComponent(token),'[TOKEN]');
 return result.replace(/bot\d+:[A-Za-z0-9_-]+/g,'bot[TOKEN]').slice(0,1600);
}
