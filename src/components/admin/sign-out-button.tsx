"use client";
import { LogOut } from "lucide-react";
import { RpgButton } from "@/components/rpg/rpg-button";
import { signOutAction } from "@/lib/actions/auth";
export function AdminSignOutButton() {
  return <RpgButton type="button" variant="secondary" className="h-10 text-xs" onClick={()=>signOutAction("/admin/login")}><LogOut className="h-4 w-4"/>ログアウト</RpgButton>;
}
