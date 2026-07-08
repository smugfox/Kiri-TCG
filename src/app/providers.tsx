"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ToastProvider } from "@/components/ui/Toast";
import { PendingAddReplayer } from "@/components/features/AddCardDrawer";

/** True once NEXT_PUBLIC_CONVEX_URL is configured; UI degrades gracefully before that. */
const ConvexReadyContext = createContext(false);
export const useConvexReady = () => useContext(ConvexReadyContext);

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
        </ToastProvider>
      </ConvexAuthNextjsProvider>
    </ConvexReadyContext.Provider>
  );
}
