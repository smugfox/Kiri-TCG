"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAction, useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import { useAuthedReady } from "@/app/providers";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

const TIER_LABEL = { free: "Collector · Free", trader: "Trader", dealer: "Dealer" } as const;

/** Usage against a free cap, using the design system's progress-bar anatomy. */
function UsageMeter({ name, used, cap }: { name: string; used: number; cap: number }) {
  return (
    <div className="prog" style={{ flex: 1, minWidth: 150, width: "auto" }}>
      <div className="ph">
        <span style={{ color: "var(--color-on-surface-muted)" }}>{name}</span>
        <span className="r">{used} / {cap}</span>
      </div>
      <div className="track" role="progressbar" aria-valuenow={used} aria-valuemin={0} aria-valuemax={cap} aria-label={`${name}: ${used} of ${cap} used`}>
        <div className="fill" style={{ width: `${Math.min(100, (used / cap) * 100)}%`, minWidth: used > 0 ? 6 : 0 }} />
      </div>
    </div>
  );
}

export default function SettingsClient() {
  const ready = useAuthedReady();
  const toast = useToast();
  const { signOut } = useAuthActions();
  const viewer = useQuery(api.users.viewer, ready ? {} : "skip");
  const usage = useQuery(api.users.usage, ready ? {} : "skip");
  const updateProfile = useMutation(api.users.updateProfile);
  const setEmailAlerts = useMutation(api.users.setEmailAlerts);
  const createPortalSession = useAction(api.billing.createPortalSession);
  const deleteAccount = useAction(api.billing.cancelAndDeleteAccount);

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (viewer?.name) setName(viewer.name);
  }, [viewer?.name]);

  if (!ready) return null;
  if (viewer === undefined) {
    return (
      <div className="page" style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-6) var(--space-5)" }} aria-busy="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="skel" style={{ display: "block", height: 120, marginBottom: 20, borderRadius: "var(--rounded-md)" }} />
        ))}
      </div>
    );
  }
  if (viewer === null) return null; // middleware redirects; belt and braces

  const openPortal = async () => {
    try {
      const { url } = await createPortalSession({});
      window.location.href = url;
    } catch (err) {
      const code = err instanceof ConvexError ? (err.data as { code?: string }).code : null;
      toast(
        code === "NOT_FOUND"
          ? "No subscription on this account yet."
          : "Billing isn't live yet. The free tier keeps working.",
      );
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount({});
      await signOut();
      window.location.href = "/";
    } catch {
      toast("Deletion didn't complete. Try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-6) var(--space-5)", display: "grid", gap: "var(--space-7)" }}>
      <h1 style={{ font: "var(--type-h2)", letterSpacing: "var(--type-h2-ls)" }}>Settings</h1>

      <div className="sset">
        <div>
          <div className="st2">Profile</div>
          <div className="sd2">How your name appears in Kiri.</div>
        </div>
        <div className="scard">
          <div className="fld">
            <label className="lb" htmlFor="settings-name">Name</label>
            <input id="settings-name" className="input" style={{ width: "100%" }} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="fld">
            <label className="lb" htmlFor="settings-email">Email</label>
            <input id="settings-email" className="input is-disabled" style={{ width: "100%" }} value={viewer.email ?? ""} disabled />
          </div>
          <div className="srow-save">
            <Button
              loading={saving}
              disabled={!name.trim() || name.trim() === (viewer.name ?? "")}
              onClick={async () => {
                setSaving(true);
                try {
                  await updateProfile({ name });
                  toast("Profile saved.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="sset">
        <div>
          <div className="st2">Notifications</div>
          <div className="sd2">In-app alerts always arrive; email is up to you.</div>
        </div>
        <div className="scard">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <Switch
              on={viewer.emailAlertsEnabled}
              onToggle={(enabled) =>
                setEmailAlerts({ enabled }).then(() =>
                  toast(enabled ? "Email alerts on." : "Email alerts off. The bell still works."),
                )
              }
              label="Email me when price alerts fire"
            />
            <span style={{ font: "var(--type-body-sm)" }}>Email me when price alerts fire</span>
          </div>
        </div>
      </div>

      <div className="sset">
        <div>
          <div className="st2">Billing</div>
          <div className="sd2">Plan, invoices, and cancellation live in the customer portal.</div>
        </div>
        <div className="scard">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <span style={{ font: "500 16px/1.4 var(--font-body)" }}>
              {TIER_LABEL[viewer.tier as keyof typeof TIER_LABEL] ?? viewer.tier}
            </span>
            {viewer.tier === "free" ? (
              <Link href="/pricing" className="btn btn-secondary" style={{ textDecoration: "none", flex: "none" }}>
                See plans
              </Link>
            ) : (
              <Button variant="secondary" onClick={openPortal}>Manage subscription</Button>
            )}
          </div>
          {usage && usage.holdingsCap !== null && usage.alertsCap !== null && (
            <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap", marginTop: "var(--space-4)" }}>
              <UsageMeter name="Portfolio" used={usage.holdingsRows} cap={usage.holdingsCap} />
              <UsageMeter name="Active alerts" used={usage.activeAlerts} cap={usage.alertsCap} />
            </div>
          )}
        </div>
      </div>

      <div className="sset">
        <div>
          <div className="st2">Danger zone</div>
          <div className="sd2">For leaving for good.</div>
        </div>
        <div className="danger-card" style={{ maxWidth: "none" }}>
          <div className="dinfo">
            <div className="dt">Delete account</div>
            <div className="dd">
              Removes your portfolio, watchlist, alerts, and history for good, and cancels
              any subscription. There is no undo.
            </div>
          </div>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Delete account</Button>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete your account?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Keep my account</Button>
            <Button variant="destructive" loading={deleting} onClick={doDelete}>Delete everything</Button>
          </>
        }
      >
        <p style={{ font: "var(--type-body-sm)", maxWidth: "44ch" }}>
          Your portfolio, watchlist, alerts, notifications, and price history views are
          hard-deleted and any subscription is canceled. This can&apos;t be undone.
        </p>
      </Modal>
    </div>
  );
}
