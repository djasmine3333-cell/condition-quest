"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell, Smartphone } from "lucide-react";
import { RpgButton } from "@/components/rpg/rpg-button";
import { RpgPanel } from "@/components/rpg/rpg-panel";
import { isPushSupported, isIos, isStandalonePwa, subscribeToPush } from "@/lib/push/client";
import { updateNotificationSettingAction } from "@/lib/actions/profile";
export function NotificationPermissionScreen({ vapidPublicKey }: { vapidPublicKey: string|null }) {
  const router=useRouter(); const [isSubmitting,setIsSubmitting]=useState(false);
  const [supported,setSupported]=useState(true); const [needsIosInstall,setNeedsIosInstall]=useState(false);
  useEffect(()=>{ setSupported(isPushSupported()); setNeedsIosInstall(isIos()&&!isStandalonePwa()); },[]);
  async function handleEnable() {
    if(!vapidPublicKey){toast.error("通知設定が完了していません");return;}
    setIsSubmitting(true);
    try { const ok=await subscribeToPush(vapidPublicKey); if(ok){await updateNotificationSettingAction(true);toast.success("通知を有効にしました");router.push("/home");}else{toast.error("通知を有効にできませんでした");} } finally { setIsSubmitting(false); }
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-[color:var(--rpg-gold)] bg-[color:var(--rpg-navy-light)]"><Bell className="h-8 w-8 text-[color:var(--rpg-gold-bright)]"/></div>
        <h1 className="pixel-font text-lg text-[color:var(--rpg-text-light)]">今すぐクエストの通知を受け取る</h1>
        <p className="text-sm text-[color:var(--rpg-text-muted)]">1日に数回届く「今すぐクエスト」を見逃さないように、通知をオンにしておきましょう。</p>
      </div>
      {needsIosInstall?(
        <RpgPanel><div className="flex flex-col items-center gap-3 px-4 py-6 text-center"><Smartphone className="h-8 w-8 text-[color:var(--rpg-text-muted)]"/><p className="text-sm font-bold text-[color:var(--rpg-text-light)]">iPhoneではホーム画面に追加してから通知を受け取れます</p><p className="text-sm text-[color:var(--rpg-text-muted)]">Safariの共有メニューから「ホーム画面に追加」を選択してください。</p></div></RpgPanel>
      ):!supported?(
        <RpgPanel><p className="px-4 py-6 text-center text-sm text-[color:var(--rpg-text-muted)]">この端末では通知機能をご利用いただけません。</p></RpgPanel>
      ):(
        <RpgButton onClick={handleEnable} disabled={isSubmitting}>{isSubmitting?"設定中...":"通知を受け取る"}</RpgButton>
      )}
      <RpgButton type="button" variant="secondary" className="h-12 text-sm" onClick={()=>router.push("/home")}>あとで設定する</RpgButton>
    </div>
  );
}
