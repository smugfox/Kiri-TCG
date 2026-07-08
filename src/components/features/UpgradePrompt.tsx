"use client";

import Link from "next/link";
import Alert from "@/components/ui/Alert";

const COPY = {
  holdings: "Your free portfolio is full at 100 cards.",
  alerts: "The free tier runs one active alert at a time.",
} as const;

/** LIMIT_REACHED copy with the upgrade path (PRD FR-010). */
export default function UpgradePrompt({ kind = "holdings" }: { kind?: keyof typeof COPY }) {
  return (
    <Alert kind="warning">
      <span>
        {COPY[kind]}{" "}
        <Link href="/pricing" style={{ fontWeight: 500, color: "inherit" }}>
          Upgrade to Trader
        </Link>{" "}
        for unlimited cards and alerts.
      </span>
    </Alert>
  );
}
