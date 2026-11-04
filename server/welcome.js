import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

export const welcomeCaption='<b>Добро пожаловать в Cameraman Battle!</b>👋\n\nПервые кейсы по CTD:\n<blockquote>» Открывай кейсы и крути апгрейдер\n» Получай лучший дроп</blockquote>\n\nЗалетай👇';

export function createWelcome(store,telegram,publicUrl){
 const photo=readFileSync(new URL('../public/images/brand/welcome.png',import.meta.url));
 const hash=createHash('sha256').update(photo).digest('hex');
 return async chatId=>{
  const fields={chat_id:chatId,caption:welcomeCaption,parse_mode:'HTML',reply_markup:{inline_keyboard:[[{text:'🚀 Играть',web_app:{url:publicUrl}}],[{text:'📰 Новости',url:'https://t.me/cameraman_battle'}]]}};
  const cached=store.setting('welcomePhoto');
  if(cached?.hash===hash){
   try{return await telegram('sendPhoto',{...fields,photo:cached.fileId});}
   catch(error){if(!/file.*(identifier|id)|wrong.*file|file.*(invalid|expired)/i.test(error.message))throw error;}
  }
  const form=new FormData();
  for(const [key,value] of Object.entries(fields))form.set(key,typeof value==='object'?JSON.stringify(value):String(value));
  form.set('photo',new Blob([photo],{type:'image/png'}),'welcome.png');
  const message=await telegram('sendPhoto',form);
  const fileId=message.photo?.at(-1)?.file_id;
  if(fileId)store.set('welcomePhoto',{hash,fileId});
  return message;
 };
}
