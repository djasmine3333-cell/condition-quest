import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login");
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
  if (profileError || !profile) redirect("/login");
  return { user: data.user, profile: profile as Profile };
}
export async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/admin/login");
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
  if (profileError || !profile || profile.role !== "super_admin") redirect("/admin/login");
  return { user: data.user, profile: profile as Profile };
}
