import test from 'node:test';
import assert from 'node:assert/strict';
import {createWelcome,welcomeCaption} from '../server/welcome.js';

test('welcome uploads cover with HTML caption and buttons, then reuses Telegram photo',async()=>{
 const settings=new Map(),calls=[];
 const store={setting:k=>settings.get(k),set:(k,v)=>settings.set(k,v)};
 const telegram=async(method,body)=>{calls.push({method,body});return {photo:[{file_id:'cover-file-id'}]};};
 const welcome=createWelcome(store,telegram,'https://example.com');
 await welcome(123);
 assert.equal(calls[0].method,'sendPhoto');
 const form=calls[0].body;
 assert.ok(form instanceof FormData);
 assert.equal(form.get('caption'),welcomeCaption);
 assert.equal(form.get('parse_mode'),'HTML');
 assert.ok(form.get('photo').size>0);
 const buttons=JSON.parse(form.get('reply_markup')).inline_keyboard;
 assert.equal(buttons[0][0].text,'🚀 Играть');
 assert.equal(buttons[0][0].web_app.url,'https://example.com');
 assert.equal(buttons[1][0].url,'https://t.me/cameraman_battle');
 assert.ok(welcomeCaption.includes('</b>'));
 assert.ok(welcomeCaption.includes('<blockquote>'));
 await welcome(456);
 assert.equal(calls[1].body.photo,'cover-file-id');
 assert.equal(calls[1].body.chat_id,456);
});
