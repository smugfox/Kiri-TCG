"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAction, useConvexAuth } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "../../../convex/_generated/api";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const CHECKOUT_KEY = "kiri.pendingCheckout";

type Plan = "trader" | "dealer";
type Interval = "month" | "year";

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const PLANS: Array<{
  key: "free" | Plan;
  name: string;
  blurb: string;
  monthly: number;
  features: string[];
  featured?: boolean;
}> = [
  {
    key: "free",
    name: "Collector",
    blurb: "Every card page, every chart, a real portfolio.",
    monthly: 0,
    features: ["Portfolio up to 100 cards", "1 active price alert", "All four games", "Nightly price updates"],
  },
  {
    key: "trader",
    name: "Trader",
    blurb: "For collections that outgrew the shoebox.",
    monthly: 6,
    features: ["Unlimited portfolio", "Unlimited alerts", "Priority nightly refresh", "Everything in Collector"],
    featured: true,
  },
  {
    key: "dealer",
    name: "Dealer",
    blurb: "Inventory-scale tracking for serious volume.",
    monthly: 15,
    features: ["Everything in Trader", "Built for 1,000+ card inventories", "Early access to bulk tools"],
  },
];

/**
 * plan-cards with the monthly/annual segmented toggle (annual saves 20%,
 * shown as the monthly-equivalent price). Only the featured plan carries
 * the primary button. Unauthed CTAs park the checkout intent and go
 * through sign-in.
 */
export default function PlanCards({ showToggle = true }: { showToggle?: boolean }) {
  const [interval, setInterval] = useState<Interval>("month");
  const { isAuthenticated } = useConvexAuth();
  const createCheckout = useAction(api.billing.createCheckout);
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState<Plan | null>(null);

  const startCheckout = async (plan: Plan) => {
    if (!isAuthenticated) {
      sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify({ plan, interval }));
      router.push("/signin?next=/pricing");
      return;
    }
    setBusy(plan);
    try {
      const { url } = await createCheckout({ plan, interval });
      window.location.href = url;
    } catch (err) {
      const code = err instanceof ConvexError ? (err.data as { code?: string }).code : null;
      toast(
        code === "BILLING_NOT_CONFIGURED"
          ? "Checkout isn't live yet. Kiri is in beta; the free tier keeps working."
          : "Checkout didn't open. Try again.",
      );
      setBusy(null);
    }
  };

  // Replay a checkout that was interrupted by sign-in.
  useEffect(() => {
    if (!isAuthenticated) return;
    const raw = sessionStorage.getItem(CHECKOUT_KEY);
    if (!raw) return;
    sessionStorage.removeItem(CHECKOUT_KEY);
    try {
      const pending = JSON.parse(raw) as { plan: Plan; interval: Interval };
      setInterval(pending.interval);
      startCheckout(pending.plan);
    } catch {
      // malformed; drop it
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const price = (monthly: number) =>
    interval === "month" ? monthly : Math.round(monthly * 0.8 * 100) / 100;

  return (
    <div>
      {showToggle && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-6)" }}>
          <div className="range-tabs" role="tablist" aria-label="Billing interval">
            <button role="tab" aria-selected={interval === "month"} className={interval === "month" ? "active" : ""} onClick={() => setInterval("month")}>
              Monthly
            </button>
            <button role="tab" aria-selected={interval === "year"} className={interval === "year" ? "active" : ""} onClick={() => setInterval("year")}>
              Annual · save 20%
            </button>
          </div>
        </div>
      )}
      <div className="plans" style={{ justifyContent: "center" }}>
        {PLANS.map((plan) => (
          <div key={plan.key} className={`plan ${plan.featured ? "featured" : ""}`}>
            {plan.featured && <span className="pop2">Most popular</span>}
            <div className="pn">{plan.name}</div>
            <div className="pd">{plan.blurb}</div>
            <div className="pp">
              {plan.monthly === 0 ? "Free" : `$${price(plan.monthly).toFixed(2).replace(/\.00$/, "")}`}
              {plan.monthly > 0 && <span className="per"> /mo{interval === "year" ? ", billed annually" : ""}</span>}
            </div>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.key === "free" ? (
              <Button variant="secondary" className="btn" onClick={() => router.push(isAuthenticated ? "/portfolio" : "/signin")}>
                {isAuthenticated ? "You're on Collector" : "Start free"}
              </Button>
            ) : (
              <Button
                variant={plan.featured ? "primary" : "secondary"}
                className="btn"
                loading={busy === plan.key}
                onClick={() => startCheckout(plan.key as Plan)}
              >
                Upgrade to {plan.name}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
