"use client";

import { FormEvent, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexReady } from "@/app/providers";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";
import Alert from "@/components/ui/Alert";

function AuthCardInner({ next }: { next: string }) {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function oauth(provider: "google" | "apple") {
    setError(null);
    try {
      await signIn(provider, { redirectTo: next });
    } catch {
      setError("Sign-in could not start. Try again in a moment.");
    }
  }

  async function magicLink(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signIn("resend", { email, redirectTo: next });
      setLinkSent(true);
    } catch {
      setError("The sign-in link could not be sent. Check the address and try again.");
    }
  }

  return (
    <div className="auth">
      <div className="at">Welcome back</div>
      <div className="oauth">
        <Button variant="secondary" onClick={() => oauth("google")}>Continue with Google</Button>
        <Button variant="secondary" onClick={() => oauth("apple")}>Continue with Apple</Button>
      </div>
      <div className="divider">or</div>
      {linkSent ? (
        <Alert kind="success">Sign-in link sent. Check your email; the link works once and expires in 15 minutes.</Alert>
      ) : (
        <form onSubmit={magicLink}>
          <FormField label="Email">
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%" }} />
          </FormField>
          <Button type="submit" className="full" style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-4)" }}>
            Send sign-in link
          </Button>
        </form>
      )}
      {error && <div style={{ marginTop: "var(--space-3)" }}><Alert kind="error">{error}</Alert></div>}
      <div className="afoot">New here? Signing in creates your account.</div>
    </div>
  );
}

export default function AuthCard({ next = "/portfolio" }: { next?: string }) {
  const ready = useConvexReady();
  if (!ready) {
    return (
      <div className="auth">
        <div className="at">Welcome back</div>
        <Alert kind="info">Sign-in activates once the Convex backend is provisioned (run npx convex dev).</Alert>
      </div>
    );
  }
  return <AuthCardInner next={next} />;
}
