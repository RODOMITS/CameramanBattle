import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareShare,shareCaption} from '../server/share.js';
test('promo sharing prepares photo, exact user copy, play button and chat picker',async()=>{
 const result=await prepareShare(async(method,body)=>{
  assert.equal(method,'savePreparedInlineMessage');assert.equal(body.user_id,42);
  assert.equal(body.result.photo_url,'https://example.com/images/brand/share.png');
  assert.equal(body.result.caption,shareCaption);assert.ok(shareCaption.includes('<b>Я открыл бесплатный кейс в @cameraman_battle_bot</b>'));
  assert.equal(body.result.parse_mode,'HTML');assert.equal(body.result.reply_markup.inline_keyboard[0][0].text,'🚀 Играть');
  assert.ok(body.allow_user_chats&&body.allow_group_chats&&body.allow_channel_chats);
  return {id:'prepared-message'};
 },42,'https://example.com');assert.equal(result.id,'prepared-message');
});
