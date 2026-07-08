"use client";

import Link from "next/link";
import Alert from "@/components/ui/Alert";

/** LIMIT_REACHED copy with the upgrade path (PRD FR-010, US-003). */
export default function UpgradePrompt() {
  return (
    <Alert kind="warning">
      <span>
        Your free portfolio is full at 100 cards.{" "}
        <Link href="/pricing" style={{ fontWeight: 500, color: "inherit" }}>
          Upgrade to Trader
        </Link>{" "}
        for unlimited cards and alerts.
      </span>
    </Alert>
  );
}
