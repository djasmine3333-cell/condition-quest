"use client";
import { createContext, useContext } from "react";
import type { Database } from "@/types/database";
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
interface ProfileContextValue { profile: Profile; }
const ProfileContext = createContext<ProfileContextValue|null>(null);
export function ProfileProvider({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  return <ProfileContext.Provider value={{profile}}>{children}</ProfileContext.Provider>;
}
export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile は ProfileProvider の内側でのみ使用できます");
  return ctx.profile;
}
