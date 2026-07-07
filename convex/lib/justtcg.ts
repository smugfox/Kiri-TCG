"use node";

/**
 * JustTCG API client. Only Convex actions may import this; the key lives in
 * the Convex env (`npx convex env set JUSTTCG_API_KEY ...`) and never reaches
 * the client. Free tier: 100 requests/day, 10/minute, 20 cards/request.
 * Budget accounting lives in the `syncState` table (see sync actions).
 */

const BASE = "https://api.justtcg.com/v1";

export class JustTcgError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "JustTcgError";
  }
}

let lastRequestAt = 0;
const MIN_INTERVAL_MS = 6500; // ~9/minute, under the 10/minute limit

async function pace() {
  const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();
}

export async function justTcgFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = process.env.JUSTTCG_API_KEY;
  if (!key) throw new JustTcgError("JUSTTCG_API_KEY is not set in the Convex environment");
  await pace();
  const url = new URL(BASE + path);
  for (const [k, val] of Object.entries(params)) url.searchParams.set(k, val);
  const res = await fetch(url, { headers: { "x-api-key": key } });
  if (!res.ok) throw new JustTcgError(`JustTCG ${res.status} on ${path}`, res.status);
  return (await res.json()) as T;
}

/** Batch lookup: POST /cards with [{ variantId }], ≤20 per request. */
export async function justTcgPost<T>(path: string, body: unknown): Promise<T> {
  const key = process.env.JUSTTCG_API_KEY;
  if (!key) throw new JustTcgError("JUSTTCG_API_KEY is not set in the Convex environment");
  await pace();
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "x-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new JustTcgError(`JustTCG ${res.status} on POST ${path}`, res.status);
  return (await res.json()) as T;
}

export { DAILY_BUDGET, BACKFILL_BUDGET, utcDay } from "./budget";
