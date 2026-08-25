import { Bell, Trophy } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { HeroPixelIcon } from "@/components/rpg/hero-pixel-icon";
import { RpgPanel, RpgTitleBar } from "@/components/rpg/rpg-panel";
import { calculateLevel } from "@/components/rpg/status-bar";
import { NotificationToggle, RankingOptInToggle } from "@/components/app/settings-toggles";
import { SignOutButton } from "@/components/app/sign-out-button";
export default async function MyPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const { data: pointsRows } = await supabase.from("points_ledger").select("points").eq("user_id",profile.id).eq("is_reversed",false);
  const totalPoints=(pointsRows??[]).reduce((sum,row)=>sum+row.points,0);
  const { level, expIntoLevel, expForNextLevel } = calculateLevel(totalPoints);
  const progress=Math.round((expIntoLevel/expForNextLevel)*100);
  return (
    <div className="flex flex-col gap-5">
      <RpgTitleBar>マイページ</RpgTitleBar>
      <RpgPanel>
        <div className="flex items-center gap-4 p-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-[color:var(--rpg-gold)] bg-[color:var(--rpg-navy-light)]"><HeroPixelIcon className="h-12 w-12"/></div>
          <div className="flex-1">
            <p className="pixel-font text-sm text-[color:var(--rpg-text-light)]">勇者 Lv.{level}</p>
            <p className="mt-1 text-base font-bold text-[color:var(--rpg-text-light)]">{profile.nickname}</p>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full border border-[color:var(--rpg-gold)] bg-[color:var(--rpg-navy-deep)]"><div className="h-full bg-gradient-to-r from-sky-400 to-sky-300" style={{width:`${progress}%`}}/></div>
            <p className="mt-0.5 text-right text-[10px] text-[color:var(--rpg-text-muted)]">{expIntoLevel} / {expForNextLevel}</p>
          </div>
        </div>
        <div className="mx-4 mb-4 flex items-center justify-between rounded-lg border border-[color:var(--rpg-gold)]/40 bg-[color:var(--rpg-navy-light)] px-4 py-3"><span className="text-sm text-[color:var(--rpg-text-muted)]">合計CP</span><span className="pixel-font text-lg text-[color:var(--rpg-gold-bright)]">{totalPoints.toLocaleString()} CP</span></div>
      </RpgPanel>
      <RpgPanel>
        <RpgTitleBar>設定</RpgTitleBar>
        <div className="flex flex-col divide-y divide-[color:var(--rpg-gold)]/20 px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3"><Bell className="h-5 w-5 text-[color:var(--rpg-text-muted)]"/><div><p className="text-sm font-medium text-[color:var(--rpg-text-light)]">通知を受け取る</p><p className="text-xs text-[color:var(--rpg-text-muted)]">今すぐクエストの通知</p></div></div>
            <NotificationToggle initialEnabled={profile.notification_enabled}/>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3"><Trophy className="h-5 w-5 text-[color:var(--rpg-text-muted)]"/><div><p className="text-sm font-medium text-[color:var(--rpg-text-light)]">ランキングに表示する</p><p className="text-xs text-[color:var(--rpg-text-muted)]">オフでもCPは獲得できます</p></div></div>
            <RankingOptInToggle initialOptIn={profile.ranking_opt_in}/>
          </div>
        </div>
      </RpgPanel>
      <SignOutButton/>
    </div>
  );
}
