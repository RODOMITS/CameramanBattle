let sharingCase=false;
document.addEventListener('click',async event=>{
 const button=event.target.closest('[data-share-case]');if(!button)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(sharingCase||serverPending||busy)return;
 if(!serverTG?.isVersionAtLeast?.('8.0')||!serverTG?.shareMessage)return toast('Открой кейс в обновлённом Telegram',true);
 sharingCase=true;button.disabled=true;
 try{
  const prepared=await serverAPI('/api/share/prepare',{caseId:button.dataset.shareCase});
  serverTG.shareMessage(prepared.id);
  await pullServer(false);render();
  toast('Кейс доступен — нажми «Открыть бесплатно»');
 }catch(error){toast(error.message,true);}
 finally{sharingCase=false;button.disabled=false;}
},true);
