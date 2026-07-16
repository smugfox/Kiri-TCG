"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useConvexReady } from "@/app/providers";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

/**
 * Portfolio-demo auth card: the primary action is an anonymous demo
 * account pre-seeded with a sample collection (no personal data stored).
 * Google remains as a real sign-in for the site owner; Apple and magic
 * links were removed because their providers are not configured.
 */
function AuthCardInner({ next }: { next: string }) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const ensureDemoData = useMutation(api.demo.ensureDemoData);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function demo() {
    setError(null);
    setBusy(true);
    try {
      await signIn("anonymous");
      await ensureDemoData();
      router.push(next);
    } catch {
      setError("The demo could not start. Try again in a moment.");
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    try {
      await signIn("google", { redirectTo: next });
    } catch {
      setError("Sign-in could not start. Try again in a moment.");
    }
  }

  return (
    <div className="auth">
      <div className="at">Explore Kiri</div>
      <div className="oauth">
        <Button onClick={demo} loading={busy} disabled={busy}>
          {busy ? "Setting up your demo…" : "Explore the demo"}
        </Button>
        <Button variant="secondary" onClick={google} disabled={busy}>Continue with Google</Button>
      </div>
      {error && <div style={{ marginTop: "var(--space-3)" }}><Alert kind="error">{error}</Alert></div>}
      <div className="afoot">
        The demo is an anonymous account pre-filled with a sample collection; nothing personal is
        stored. Google sign-in saves only your name and email in this portfolio project&apos;s database.
      </div>
    </div>
  );
}

export default function AuthCard({ next = "/portfolio" }: { next?: string }) {
  const ready = useConvexReady();
  if (!ready) {
    return (
      <div className="auth">
        <div className="at">Explore Kiri</div>
        <Alert kind="info">Sign-in activates once the Convex backend is provisioned (run npx convex dev).</Alert>
      </div>
    );
  }
  return <AuthCardInner next={next} />;
}
