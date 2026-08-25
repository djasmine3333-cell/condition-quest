"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { completeDailyQuestAction } from "@/lib/actions/quests";
export function DailyQuestCompleteButton({ dailyQuestId, isDone }: { dailyQuestId: string; isDone: boolean }) {
  const router=useRouter(); const [isPending,setIsPending]=useState(false);
  if(isDone) return <span className="flex items-center gap-1 text-xs font-bold text-[color:var(--rpg-green)]"><CheckCircle2 className="h-4 w-4"/>完了</span>;
  async function handleClick() {
    setIsPending(true);
    try { const result=await completeDailyQuestAction(dailyQuestId); if(result.success){toast.success(`${result.message}（+${result.pointsAwarded} CP）`);router.refresh();}else{toast.error(result.message);router.refresh();} } finally { setIsPending(false); }
  }
  return <button type="button" onClick={handleClick} disabled={isPending} className="rpg-button rpg-button-primary px-3 py-1.5 text-xs disabled:opacity-50">{isPending?"記録中...":"完了にする"}</button>;
}
