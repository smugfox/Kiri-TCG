import Google from "@auth/core/providers/google";
import Apple from "@auth/core/providers/apple";
import Resend from "@auth/core/providers/resend";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { convexAuth } from "@convex-dev/auth/server";

// Anonymous powers the portfolio-demo account (no personal data stored).
// Google is always on; Apple and magic links activate when their env vars exist.
const providers: Parameters<typeof convexAuth>[0]["providers"] = [Google, Anonymous];
if (process.env.AUTH_APPLE_ID) providers.push(Apple);
if (process.env.AUTH_RESEND_KEY) providers.push(Resend({ from: "Kiri <auth@kiri.app>" }));

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers,
});
