/** Money and time formatting per design.md voice rules: tabular numerals,
 * two decimals, +/− prefixes on deltas (minus sign, not hyphen). */

export function money(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function signedMoney(value: number): string {
  return `${value < 0 ? "−" : "+"}${money(Math.abs(value))}`;
}

export function signedPercent(value: number): string {
  return `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(1)}%`;
}

/** "Updated 2h ago" style relative time for freshness chips. */
export function relativeTime(unixMs: number, now = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - unixMs) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}
