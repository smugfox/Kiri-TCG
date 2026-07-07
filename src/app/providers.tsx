"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ToastProvider } from "@/components/ui/Toast";

/** True once NEXT_PUBLIC_CONVEX_URL is configured; UI degrades gracefully before that. */
const ConvexReadyContext = createContext(false);
export const useConvexReady = () => useContext(ConvexReadyContext);

export default function Providers({ children }: { children: ReactNode }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const client = useMemo(() => (url ? new ConvexReactClient(url) : null), [url]);
  const inner = <ToastProvider>{children}</ToastProvider>;
  if (!client) return <ConvexReadyContext.Provider value={false}>{inner}</ConvexReadyContext.Provider>;
  return (
    <ConvexReadyContext.Provider value={true}>
      <ConvexAuthNextjsProvider client={client}>{inner}</ConvexAuthNextjsProvider>
    </ConvexReadyContext.Provider>
  );
}
