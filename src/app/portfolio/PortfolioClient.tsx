"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexReady } from "@/app/providers";
import { useToast } from "@/components/ui/Toast";
import PortfolioHero from "@/components/features/PortfolioHero";
import StatTiles from "@/components/features/StatTiles";
import AllocationBar from "@/components/features/AllocationBar";
import HoldingsTable from "@/components/features/HoldingsTable";
import OnboardingChecklist from "@/components/features/OnboardingChecklist";
import CardSearch from "@/components/features/CardSearch";
import EmptyState from "@/components/ui/EmptyState";

export default function PortfolioClient() {
  const ready = useConvexReady();
  const summary = useQuery(api.portfolio.summary, ready ? {} : "skip");
  const viewer = useQuery(api.users.viewer, ready ? {} : "skip");
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgradedToastShown = useRef(false);

  // ?upgraded=1 confirms once the webhook has actually landed (tier is
  // reactive), then cleans the param so refreshes stay quiet.
  const upgraded = searchParams.get("upgraded") === "1";
  const tier = viewer?.tier;
  useEffect(() => {
    if (!upgraded || upgradedToastShown.current) return;
    if (tier && tier !== "free") {
      upgradedToastShown.current = true;
      toast(`Welcome to ${tier === "trader" ? "Trader" : "Dealer"}. Limits are off.`);
      router.replace("/portfolio");
    }
  }, [upgraded, tier, toast, router]);

  if (!ready) return null;
  if (summary === undefined) {
    return (
      <div className="portfolio-page" aria-busy="true">
        <span className="skel" style={{ display: "block", height: 220, borderRadius: "var(--rounded-md)" }} />
        <span className="skel" style={{ display: "block", height: 90, borderRadius: "var(--rounded-md)" }} />
      </div>
    );
  }

  if (summary.holdingsRows === 0) {
    return (
      <div className="portfolio-page">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-5)" }}>
          <EmptyState
            title="No cards in your portfolio yet"
            description="Add your first card and Kiri starts tracking what your collection is worth, every night."
            action={
              <div style={{ width: "min(440px, 100%)", margin: "0 auto", textAlign: "left" }}>
                <CardSearch autoFocus placeholder="Search for your first card" />
              </div>
            }
          />
          {!summary.onboardingDismissed && <OnboardingChecklist cardCount={summary.cardCount} />}
        </div>
      </div>
    );
  }

  const showChecklist = !summary.onboardingDismissed && summary.cardCount < 10;

  return (
    <div className="portfolio-page">
      <PortfolioHero totalValue={summary.totalValue} dayChangePercent={summary.dayChangePercent} />
      <div className="portfolio-split">
        <div className="main">
          <StatTiles summary={summary} />
          <AllocationBar allocation={summary.allocation} />
        </div>
        {showChecklist && (
          <div className="side">
            <OnboardingChecklist cardCount={summary.cardCount} />
          </div>
        )}
      </div>
      <section>
        <h2 style={{ font: "var(--type-h3)", letterSpacing: "var(--type-h3-ls)", marginBottom: "var(--space-4)" }}>
          Holdings
        </h2>
        <HoldingsTable />
      </section>
    </div>
  );
}
