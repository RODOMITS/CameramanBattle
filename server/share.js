export const shareCaption='<b>Я открыл бесплатный кейс в @cameraman_battle_bot</b>\n\n<blockquote>» Открывай кейсы и крути апгрейдер\n» Получай лучший дроп</blockquote>\n\nЗалетай и ты👇';
export function prepareShare(telegram,userId,publicUrl){
 const photo=new URL('/images/brand/share.png',publicUrl).href;
 return telegram('savePreparedInlineMessage',{user_id:userId,result:{type:'photo',id:'cameraman-share',photo_url:photo,thumbnail_url:photo,caption:shareCaption,parse_mode:'HTML',reply_markup:{inline_keyboard:[[{text:'🚀 Играть',url:'https://t.me/cameraman_battle_bot?startapp'}]]}},allow_user_chats:true,allow_group_chats:true,allow_channel_chats:true});
}
