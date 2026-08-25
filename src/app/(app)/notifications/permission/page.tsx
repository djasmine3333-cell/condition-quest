import { requireUser } from "@/lib/auth";
import { NotificationPermissionScreen } from "@/components/app/notification-permission-screen";
export default async function NotificationPermissionPage() {
  await requireUser();
  return <NotificationPermissionScreen vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY??null}/>;
}
