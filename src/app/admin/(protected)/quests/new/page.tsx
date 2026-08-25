import { requireAdmin } from "@/lib/auth";
import { QuestForm } from "@/components/admin/quest-form";
export default async function NewQuestPage() {
  await requireAdmin();
  return <div className="flex flex-col gap-6"><div><h1 className="pixel-font text-xl text-[color:var(--rpg-gold-bright)]">クエストを作成</h1><p className="mt-1 text-sm text-[color:var(--rpg-text-muted)]">配信日時・表示期限はAsia/Tokyoの時刻で入力してください</p></div><QuestForm/></div>;
}
