"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import { RpgButton } from "@/components/rpg/rpg-button";
import { RpgPanel } from "@/components/rpg/rpg-panel";
import { completeInstantQuestAction } from "@/lib/actions/quests";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/quest-category";
import type { Database } from "@/types/database";
type Quest = Database["public"]["Tables"]["quests"]["Row"];
export function QuestDetailClient({ quest, initiallyCompleted, isWithinWindow }: { quest: Quest; initiallyCompleted: boolean; isWithinWindow: boolean }) {
  const [isCompleted,setIsCompleted]=useState(initiallyCompleted); const [pointsAwarded,setPointsAwarded]=useState(quest.points);
  const [isPending,setIsPending]=useState(false); const [errorMessage,setErrorMessage]=useState<string|undefined>();
  const Icon=CATEGORY_ICONS[quest.category];
  async function handleComplete() {
    setIsPending(true); setErrorMessage(undefined);
    try { const result=await completeInstantQuestAction(quest.id); if(result.success){setPointsAwarded(result.pointsAwarded);setIsCompleted(true);}else{setErrorMessage(result.message);if(result.message.includes("既に完了"))setIsCompleted(true);} } finally { setIsPending(false); }
  }
  if(isCompleted) return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div className="animate-check-pop"><CheckCircle2 className="h-20 w-20 text-[color:var(--rpg-gold-bright)]"/></div>
      <h1 className="pixel-font text-2xl text-[color:var(--rpg-gold-bright)]">QUEST CLEAR!</h1>
      <p className="text-[color:var(--rpg-text-light)]">{quest.title}</p>
      <RpgPanel className="w-full max-w-xs"><div className="flex items-center justify-between px-4 py-3 text-sm"><span className="text-[color:var(--rpg-text-muted)]">獲得CP</span><span className="pixel-font text-[color:var(--rpg-gold-bright)]">+{pointsAwarded} CP</span></div></RpgPanel>
      <p className="text-sm text-[color:var(--rpg-text-muted)]">おつかれさまでした！</p>
      <Link href="/home" className="w-full max-w-xs"><RpgButton variant="secondary">ホームに戻る</RpgButton></Link>
    </div>
  );
  return (
    <div className="flex flex-col gap-6">
      <RpgPanel>
        <div className="flex flex-col items-center gap-3 px-4 py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-[color:var(--rpg-gold)] bg-[color:var(--rpg-navy-light)]"><Icon className="h-8 w-8 text-[color:var(--rpg-gold-bright)]"/></div>
          <span className="rpg-button rpg-button-secondary px-3 py-1 text-xs">{CATEGORY_LABELS[quest.category]}</span>
          <h1 className="pixel-font text-lg text-[color:var(--rpg-text-light)]">{quest.title}</h1>
          <p className="text-sm text-[color:var(--rpg-text-muted)]">{quest.description}</p>
          <div className="mt-1 flex items-center gap-2 text-sm"><Sparkles className="h-4 w-4 text-[color:var(--rpg-gold-bright)]"/><span className="text-[color:var(--rpg-gold-bright)]">約{quest.duration_seconds}秒 ・ +{quest.points} CP</span></div>
        </div>
      </RpgPanel>
      {errorMessage&&<p className="text-center text-sm text-[color:var(--rpg-red-bright)]">{errorMessage}</p>}
      {isWithinWindow?(
        <div className="flex flex-col gap-3">
          <RpgButton onClick={handleComplete} disabled={isPending}>{isPending?"記録中...":"クエストに挑戦する！"}</RpgButton>
          <Link href="/home"><RpgButton type="button" variant="secondary" className="h-12 text-sm">あとで</RpgButton></Link>
        </div>
      ):(
        <p className="text-center text-sm text-[color:var(--rpg-text-muted)]">このクエストの受付時間は終了しました</p>
      )}
    </div>
  );
}
