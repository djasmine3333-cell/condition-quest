self.addEventListener("install",()=>{self.skipWaiting();});
self.addEventListener("activate",(event)=>{event.waitUntil(self.clients.claim());});
self.addEventListener("push",(event)=>{
  if(!event.data)return;
  let payload;try{payload=event.data.json();}catch{payload={title:"コンディションクエスト",body:event.data.text()};}
  const title=payload.title||"コンディションクエスト";
  const options={body:payload.body||"",icon:"/icons/icon-192.png",badge:"/icons/icon-192.png",data:{url:payload.url||"/home"}};
  event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener("notificationclick",(event)=>{
  event.notification.close();
  const targetUrl=(event.notification.data&&event.notification.data.url)||"/home";
  event.waitUntil((async()=>{const allClients=await self.clients.matchAll({type:"window",includeUncontrolled:true});for(const client of allClients){if(client.url.includes(targetUrl)&&"focus"in client)return client.focus();}if(self.clients.openWindow)return self.clients.openWindow(targetUrl);})());
});
