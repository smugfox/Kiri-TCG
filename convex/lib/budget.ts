/**
 * JustTCG request-budget constants and day/hour keys. Plain runtime (no
 * "use node") so both mutations and the node action layer can import them.
 * Free tier: 100 requests/day; 10 are reserved for search backfill, the
 * rest for the nightly refresh (PRD FR-005).
 */

export const DAILY_BUDGET = 90;
export const BACKFILL_BUDGET = 10;

/** Per-user cap on uncached-search backfill triggers (PRD § Security). */
export const BACKFILL_TRIGGERS_PER_HOUR = 5;

export function utcDay(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

export function utcHour(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 13);
}
