"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { ConvexReactClient, useConvexAuth, useQuery } from "convex/react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { api } from "../../convex/_generated/api";
import { ToastProvider } from "@/components/ui/Toast";
import { PendingAddReplayer } from "@/components/features/AddCardDrawer";
import { initAnalytics, identify, capture, EVENTS } from "@/lib/analytics";

/** PostHog boot + identify on auth; fires SIGNUP once per browser. */
function Analytics() {
  const { isAuthenticated } = useConvexAuth();
  const viewer = useQuery(api.users.viewer, isAuthenticated ? {} : "skip");
  useEffect(() => {
    initAnalytics();
  }, []);
  useEffect(() => {
    if (!viewer) return;
    identify(viewer._id, { tier: viewer.tier });
    if (!localStorage.getItem("kiri.signupTracked")) {
      localStorage.setItem("kiri.signupTracked", "1");
      capture(EVENTS.SIGNUP);
    }
  }, [viewer]);
  return null;
}

/** True once NEXT_PUBLIC_CONVEX_URL is configured; UI degrades gracefully before that. */
const ConvexReadyContext = createContext(false);
export const useConvexReady = () => useContext(ConvexReadyContext);

/**
 * True only while a signed-in session exists. Queries behind requireUser must
 * gate on this (not just useConvexReady): on sign-out a still-mounted page's
 * subscriptions re-run unauthenticated and the server's UNAUTHORIZED throw
 * would land in render as the 500 error page.
 */
export const useAuthedReady = () => {
  const ready = useConvexReady();
  const { isAuthenticated } = useConvexAuth();
  return ready && isAuthenticated;
};

export default function Providers({ children }: { children: ReactNode }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const client = useMemo(() => (url ? new ConvexReactClient(url) : null), [url]);
  if (!client) {
    return (
      <ConvexReadyContext.Provider value={false}>
        <ToastProvider>{children}</ToastProvider>
      </ConvexReadyContext.Provider>
    );
  }
  return (
    <ConvexReadyContext.Provider value={true}>
      <ConvexAuthNextjsProvider client={client}>
        <ToastProvider>
          {children}
          <PendingAddReplayer />
          <Analytics />
        </ToastProvider>
      </ConvexAuthNextjsProvider>
    </ConvexReadyContext.Provider>
  );
}
