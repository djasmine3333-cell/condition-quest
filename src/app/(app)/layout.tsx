import { requireUser } from "@/lib/auth";
import { BottomNav } from "@/components/app/bottom-nav";
import { ProfileProvider } from "@/components/app/profile-context";
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireUser();
  return (
    <ProfileProvider profile={profile}>
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[color:var(--rpg-navy-deep)] pb-20">
        <main className="flex-1 px-4 pt-6">{children}</main>
        <BottomNav/>
      </div>
    </ProfileProvider>
  );
}
