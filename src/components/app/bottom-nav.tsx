"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, Coins, NotebookPen, User } from "lucide-react";
import { cn } from "@/lib/utils";
const NAV_ITEMS = [
  { href:"/home", label:"ホーム", icon:Home },
  { href:"/quests", label:"クエスト", icon:ListChecks },
  { href:"/points", label:"ポイント", icon:Coins },
  { href:"/history", label:"記録", icon:NotebookPen },
  { href:"/mypage", label:"マイページ", icon:User },
] as const;
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-[color:var(--rpg-gold)] bg-[color:var(--rpg-green-deep)] pb-[env(safe-area-inset-bottom)]" aria-label="メインナビゲーション">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {NAV_ITEMS.map(({href,label,icon:Icon})=>{
          const isActive=pathname===href||pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link href={href} aria-current={isActive?"page":undefined} className={cn("flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",isActive?"text-[color:var(--rpg-gold-bright)]":"text-[color:var(--rpg-text-muted)]")}>
                <Icon className="h-6 w-6" strokeWidth={isActive?2.4:1.8} aria-hidden="true"/>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
