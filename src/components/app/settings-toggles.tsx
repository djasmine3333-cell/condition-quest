"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateNotificationSettingAction, updateRankingOptInAction } from "@/lib/actions/profile";

function RpgSwitch({ checked, disabled, onCheckedChange }: { checked: boolean; disabled: boolean; onCheckedChange: (v:boolean)=>void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={()=>onCheckedChange(!checked)}
      className={`inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-[color:var(--rpg-gold)] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${checked?"bg-[color:var(--rpg-green)]":"bg-[color:var(--rpg-navy-deep)]"}`}>
      <span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked?"translate-x-5":"translate-x-0.5"}`}/>
    </button>
  );
}

export function NotificationToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, setIsPending] = useState(false);
  async function handleChange(value: boolean) {
    if (value) { router.push("/notifications/permission"); return; }
    setIsPending(true); setEnabled(value);
    const result = await updateNotificationSettingAction(value);
    if (result.error) { toast.error(result.error); setEnabled(!value); } else { router.refresh(); }
    setIsPending(false);
  }
  return <RpgSwitch checked={enabled} disabled={isPending} onCheckedChange={handleChange}/>;
}

export function RankingOptInToggle({ initialOptIn }: { initialOptIn: boolean }) {
  const router = useRouter();
  const [optIn, setOptIn] = useState(initialOptIn);
  const [isPending, setIsPending] = useState(false);
  async function handleChange(value: boolean) {
    setIsPending(true); setOptIn(value);
    const result = await updateRankingOptInAction(value);
    if (result.error) { toast.error(result.error); setOptIn(!value); } else { router.refresh(); }
    setIsPending(false);
  }
  return <RpgSwitch checked={optIn} disabled={isPending} onCheckedChange={handleChange}/>;
}
