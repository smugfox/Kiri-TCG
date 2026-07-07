import { ReactNode } from "react";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

/**
 * Server-side auth provider, active only once NEXT_PUBLIC_CONVEX_URL exists.
 * Keeps the Phase 0 shell renderable before `npx convex dev` is run.
 */
export default function AuthShell({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return <>{children}</>;
  return <ConvexAuthNextjsServerProvider>{children}</ConvexAuthNextjsServerProvider>;
}
