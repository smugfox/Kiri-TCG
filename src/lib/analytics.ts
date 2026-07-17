"use client";

/**
 * FR-018 funnel events (constants per TASK-036). Env-gated: without
 * NEXT_PUBLIC_POSTHOG_KEY, capture() logs in dev and no-ops in prod, so
 * instrumented code never branches. The magic-moment funnel is
 * SIGNUP → FIRST_CARD_ADDED → TENTH_CARD_ADDED.
 */


export const EVENTS = {
  SIGNUP: "signup",
  FIRST_CARD_ADDED: "first_card_added",
  TENTH_CARD_ADDED: "tenth_card_added",
  ALERT_CREATED: "alert_created",
  ALERT_FIRED_OPENED: "alert_fired_opened",
  CHECKOUT_STARTED: "checkout_started",
  SUBSCRIBED: "subscribed",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

// posthog-js is ~50KB gz, so it loads dynamically and only when keyed.
type PostHog = typeof import("posthog-js").default;
let client: PostHog | null = null;
let loading: Promise<void> | null = null;

export function initAnalytics(): void {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || client || loading || typeof window === "undefined") return;
  loading = import("posthog-js").then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      capture_pageview: true,
      persistence: "localStorage+cookie",
    });
    client = posthog;
  });
}

export function identify(userId: string, props?: Record<string, unknown>) {
  if (client) client.identify(userId, props);
  else if (loading) loading.then(() => client?.identify(userId, props));
}

export function capture(event: EventName, props?: Record<string, unknown>) {
  if (client) {
    client.capture(event, props);
  } else if (loading) {
    loading.then(() => client?.capture(event, props));
  } else if (process.env.NODE_ENV === "development") {
    console.log(`[analytics] ${event}`, props ?? {});
  }
}
