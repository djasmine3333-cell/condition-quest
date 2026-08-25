"use client";
export function isPushSupported():boolean{return typeof window!=="undefined"&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window;}
export function isStandalonePwa():boolean{if(typeof window==="undefined")return false;return window.matchMedia("(display-mode: standalone)").matches||(navigator as unknown as{standalone?:boolean}).standalone===true;}
export function isIos():boolean{if(typeof navigator==="undefined")return false;return /iphone|ipad|ipod/i.test(navigator.userAgent);}
function urlBase64ToUint8Array(base64String:string):Uint8Array{const padding="=".repeat((4-(base64String.length%4))%4);const base64=(base64String+padding).replace(/-/g,"+").replace(/_/g,"/");const rawData=window.atob(base64);const outputArray=new Uint8Array(rawData.length);for(let i=0;i<rawData.length;i++)outputArray[i]=rawData.charCodeAt(i);return outputArray;}
export async function subscribeToPush(vapidPublicKey:string):Promise<boolean>{
  if(!isPushSupported())return false;
  const permission=await Notification.requestPermission();
  if(permission!=="granted")return false;
  const registration=await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  let subscription=await registration.pushManager.getSubscription();
  if(!subscription)subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(vapidPublicKey).buffer as ArrayBuffer});
  const json=subscription.toJSON();
  const response=await fetch("/api/push/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({endpoint:json.endpoint,keys:json.keys})});
  return response.ok;
}
