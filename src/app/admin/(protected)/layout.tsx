import Link from "next/link";
import { LayoutDashboard, ScrollText } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { HeroPixelIcon } from "@/components/rpg/hero-pixel-icon";
import { AdminSignOutButton } from "@/components/admin/sign-out-button";
const NAV_ITEMS=[{href:"/admin",label:"ダッシュボード",icon:LayoutDashboard},{href:"/admin/quests",label:"クエスト管理",icon:ScrollText}] as const;
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin();
  return (
    <div className="flex min-h-screen bg-[color:var(--rpg-navy-deep)]">
      <aside className="flex w-64 shrink-0 flex-col gap-2 border-r-2 border-[color:var(--rpg-gold)] bg-[color:var(--rpg-navy)] p-4">
        <div className="mb-4 flex items-center gap-2 px-1">
          <HeroPixelIcon className="h-8 w-8"/>
          <div><p className="pixel-font text-sm text-[color:var(--rpg-gold-bright)]">コンディション<br/>クエスト</p><p className="text-[10px] tracking-widest text-[color:var(--rpg-text-muted)]">ADMIN</p></div>
        </div>
        {NAV_ITEMS.map(item=>(
          <Link key={item.href} href={item.href} className="rpg-button rpg-button-secondary flex h-11 items-center gap-2 px-3 text-sm"><item.icon className="h-4 w-4"/>{item.label}</Link>
        ))}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-[color:var(--rpg-gold)]/30 bg-[color:var(--rpg-navy-light)] px-3 py-2 text-xs text-[color:var(--rpg-text-muted)]">管理者: {profile.nickname}</div>
          <AdminSignOutButton/>
        </div>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
