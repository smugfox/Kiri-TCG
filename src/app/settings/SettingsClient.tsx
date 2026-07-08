"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAction, useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import { useConvexReady } from "@/app/providers";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";
import Modal from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

const TIER_LABEL = { free: "Collector · Free", trader: "Trader", dealer: "Dealer" } as const;

export default function SettingsClient() {
  const ready = useConvexReady();
  const toast = useToast();
  const { signOut } = useAuthActions();
  const viewer = useQuery(api.users.viewer, ready ? {} : "skip");
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

  if (!ready || viewer === undefined) return null;
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
            <div className="lb">Name</div>
            <input className="input" style={{ width: "100%" }} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="fld">
            <div className="lb">Email</div>
            <input className="input is-disabled" style={{ width: "100%" }} value={viewer.email ?? ""} disabled />
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
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <Badge>{TIER_LABEL[viewer.tier as keyof typeof TIER_LABEL] ?? viewer.tier}</Badge>
            {viewer.tier === "free" ? (
              <Link href="/pricing" className="btn btn-secondary" style={{ textDecoration: "none" }}>
                See plans
              </Link>
            ) : (
              <Button variant="secondary" onClick={openPortal}>Manage subscription</Button>
            )}
          </div>
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
