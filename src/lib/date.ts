const TOKYO_TZ = "Asia/Tokyo";
function toTokyoParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: TOKYO_TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  const [year, month, day] = formatter.format(date).split("-").map(Number);
  return { year, month, day };
}
export function toTokyoDateString(date: Date = new Date()): string {
  const { year, month, day } = toTokyoParts(date);
  return `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}
export function todayInTokyo(): string { return toTokyoDateString(new Date()); }
export function getTokyoWeekRange(date: Date = new Date()) {
  const { year, month, day } = toTokyoParts(date);
  const base = new Date(Date.UTC(year, month-1, day, 12, 0, 0));
  const dow = base.getUTCDay();
  const monday = new Date(base); monday.setUTCDate(monday.getUTCDate() + (dow===0?-6:1-dow));
  const sunday = new Date(monday); sunday.setUTCDate(sunday.getUTCDate()+6);
  return { weekStart: toTokyoDateString(monday), weekEnd: toTokyoDateString(sunday) };
}
export function formatTokyoDateTime(isoString: string): string {
  return new Intl.DateTimeFormat("ja-JP", { timeZone: TOKYO_TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(isoString));
}
export function tokyoLocalInputToUtcIso(localValue: string): string {
  const [datePart, timePart] = localValue.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(Date.UTC(year, month-1, day, hour-9, minute, 0)).toISOString();
}
export function utcIsoToTokyoLocalInput(isoString: string): string {
  const date = new Date(isoString);
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: TOKYO_TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
  const parts = f.formatToParts(date);
  const get = (type: string) => parts.find(p=>p.type===type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}
