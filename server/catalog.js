import fs from 'node:fs';
export const catalog=JSON.parse(fs.readFileSync(new URL('./catalog.json',import.meta.url),'utf8'));
export const cents=n=>Math.round(n*100);
export const normalize=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
export const acceptedNames=catalog.items.map(i=>i.name);
export const withdrawNames=acceptedNames;
