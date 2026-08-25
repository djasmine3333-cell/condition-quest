import { AlertCircle } from "lucide-react";
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <div role="alert" className="flex items-start gap-2 rounded-lg border border-[color:var(--rpg-red)] bg-[color:var(--rpg-red)]/15 px-4 py-3 text-sm text-[color:var(--rpg-red-bright)]"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true"/><span>{message}</span></div>;
}
