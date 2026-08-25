"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RpgPanel, RpgTitleBar } from "@/components/rpg/rpg-panel";
import { RpgButton } from "@/components/rpg/rpg-button";
import { FormError } from "@/components/app/form-error";
import { CATEGORY_LABELS } from "@/lib/quest-category";
import { utcIsoToTokyoLocalInput } from "@/lib/date";
import { createQuestAction, updateQuestAction, deleteQuestAction, stopQuestAction } from "@/lib/actions/admin-quests";
import { QUEST_CATEGORIES } from "@/lib/validations/quest";
import type { Database, QuestStatus } from "@/types/database";
type Quest = Database["public"]["Tables"]["quests"]["Row"];
export function QuestForm({ quest }: { quest?: Quest }) {
  const router=useRouter();
  const [title,setTitle]=useState(quest?.title??""); const [description,setDescription]=useState(quest?.description??"");
  const [category,setCategory]=useState(quest?.category??"mental"); const [durationSeconds,setDurationSeconds]=useState(quest?.duration_seconds??30);
  const [points,setPoints]=useState(quest?.points??5);
  const [scheduledAtLocal,setScheduledAtLocal]=useState(quest?utcIsoToTokyoLocalInput(quest.scheduled_at):"");
  const [expiresAtLocal,setExpiresAtLocal]=useState(quest?utcIsoToTokyoLocalInput(quest.expires_at):"");
  const [notificationTitle,setNotificationTitle]=useState(quest?.notification_title??"");
  const [notificationBody,setNotificationBody]=useState(quest?.notification_body??"");
  const [error,setError]=useState<string|undefined>(); const [isSubmitting,setIsSubmitting]=useState(false);
  function buildInput(status: QuestStatus) { return { title, description, category, durationSeconds, points, scheduledAtLocal, expiresAtLocal, notificationTitle, notificationBody, status }; }
  async function handleSave(status: QuestStatus) {
    setError(undefined); setIsSubmitting(true);
    try { const result=quest?await updateQuestAction(quest.id,buildInput(status)):await createQuestAction(buildInput(status)); if(result?.error)setError(result.error); } finally { setIsSubmitting(false); }
  }
  async function handleStop() {
    if(!quest)return; setIsSubmitting(true);
    const result=await stopQuestAction(quest.id);
    if(result.error){toast.error(result.error)}else{toast.success("公開を停止しました");router.refresh();}
    setIsSubmitting(false);
  }
  async function handleDelete() {
    if(!quest)return; if(!window.confirm("このクエストを削除します。よろしいですか？"))return; setIsSubmitting(true);
    const result=await deleteQuestAction(quest.id);
    if(result.error){toast.error(result.error)}else{toast.success("削除しました");router.push("/admin/quests");}
    setIsSubmitting(false);
  }
  return (
    <RpgPanel>
      <RpgTitleBar>クエスト内容</RpgTitleBar>
      <div className="flex flex-col gap-5 p-5">
        <FormError message={error}/>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2"><label className="text-xs font-bold text-[color:var(--rpg-text-muted)]">クエスト名</label><input value={title} onChange={e=>setTitle(e.target.value)} maxLength={100} className="rpg-input h-11 px-4 text-sm"/></div>
          <div className="flex flex-col gap-1.5 sm:col-span-2"><label className="text-xs font-bold text-[color:var(--rpg-text-muted)]">本文</label><textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={500} rows={3} className="rpg-input px-4 py-2.5 text-sm"/></div>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-[color:var(--rpg-text-muted)]">カテゴリ</label><select value={category} onChange={e=>setCategory(e.target.value as Quest["category"])} className="rpg-input h-11 px-4 text-sm">{QUEST_CATEGORIES.map(c=><option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}</select></div>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-[color:var(--rpg-text-muted)]">付与CP</label><input type="number" min={1} max={1000} value={points} onChange={e=>setPoints(Number(e.target.value))} className="rpg-input h-11 px-4 text-sm"/></div>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-[color:var(--rpg-text-muted)]">所要時間（秒）</label><input type="number" min={1} max={600} value={durationSeconds} onChange={e=>setDurationSeconds(Number(e.target.value))} className="rpg-input h-11 px-4 text-sm"/></div>
          <div/>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-[color:var(--rpg-text-muted)]">配信日時(Asia/Tokyo)</label><input type="datetime-local" value={scheduledAtLocal} onChange={e=>setScheduledAtLocal(e.target.value)} className="rpg-input h-11 px-4 text-sm"/></div>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-[color:var(--rpg-text-muted)]">表示期限(Asia/Tokyo)</label><input type="datetime-local" value={expiresAtLocal} onChange={e=>setExpiresAtLocal(e.target.value)} className="rpg-input h-11 px-4 text-sm"/></div>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-[color:var(--rpg-text-muted)]">通知タイトル</label><input value={notificationTitle} onChange={e=>setNotificationTitle(e.target.value)} maxLength={60} className="rpg-input h-11 px-4 text-sm"/></div>
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-[color:var(--rpg-text-muted)]">通知本文</label><input value={notificationBody} onChange={e=>setNotificationBody(e.target.value)} maxLength={120} className="rpg-input h-11 px-4 text-sm"/></div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-[color:var(--rpg-gold)]/20 pt-5">
          <RpgButton type="button" variant="secondary" className="h-11 w-auto px-4 text-sm" disabled={isSubmitting} onClick={()=>handleSave("draft")}>下書き保存</RpgButton>
          <RpgButton type="button" className="h-11 w-auto px-4 text-sm" disabled={isSubmitting} onClick={()=>handleSave("published")}>{quest?"更新して公開":"予約送信"}</RpgButton>
          {quest&&<><RpgButton type="button" variant="secondary" className="h-11 w-auto px-4 text-sm" disabled={isSubmitting||quest.status==="stopped"} onClick={handleStop}>公開停止</RpgButton><button type="button" disabled={isSubmitting} onClick={handleDelete} className="rpg-button h-11 w-auto border-[color:var(--rpg-red)] bg-[color:var(--rpg-red)] px-4 text-sm text-white disabled:opacity-50">削除</button></>}
        </div>
      </div>
    </RpgPanel>
  );
}
