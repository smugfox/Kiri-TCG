/** Money and time formatting per design.md voice rules: tabular numerals,
 * two decimals (aggregates at or above $10,000 drop cents), +/− prefixes
 * with a real minus sign, one-decimal percents. */

export function money(value: number): string {
  const dropCents = Math.abs(value) >= 10_000;
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dropCents ? 0 : 2,
    maximumFractionDigits: dropCents ? 0 : 2,
  });
}

export function signedMoney(value: number): string {
  return `${value < 0 ? "−" : "+"}${money(Math.abs(value))}`;
}

export function signedPercent(value: number): string {
  return `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(1)}%`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Relative time per the design.md ladder: minutes/hours → Yesterday →
 * "Jul 8" (this year) → "Jul 8, 2025". Freshness chips and notification
 * timestamps share this.
 */
export function relativeTime(unixMs: number, now = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - unixMs) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const then = new Date(unixMs);
  const today = new Date(now);
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(today) - startOfDay(then)) / 86_400_000);
  if (dayDiff <= 1) return "Yesterday";
  const monthDay = `${MONTHS[then.getMonth()]} ${then.getDate()}`;
  return then.getFullYear() === today.getFullYear()
    ? monthDay
    : `${monthDay}, ${then.getFullYear()}`;
}
