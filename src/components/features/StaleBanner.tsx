"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Banner from "@/components/ui/Banner";

const STALE_HOURS = 36;

/**
 * Site banner when the user's tracked prices haven't refreshed in 36h
 * (JustTCG outage or missed crons). Honest, dismissible, per design.md.
 */
export default function StaleBanner() {
  const { isAuthenticated } = useConvexAuth();
  const staleness = useQuery(api.status.staleness, isAuthenticated ? {} : "skip");
  if (!staleness || staleness.oldestUpdateHoursAgo <= STALE_HOURS) return null;
  return (
    <Banner kind="warning" flush>
      Price updates are delayed. Your values reflect the last good refresh; freshness
      chips show exactly how old each price is.
    </Banner>
  );
}
