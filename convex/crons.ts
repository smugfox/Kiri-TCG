import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Nightly price refresh: owned > watched > viewed-this-week > stalest,
// within the daily JustTCG budget (PRD FR-005).
crons.daily(
  "nightly price snapshot",
  { hourUTC: 6, minuteUTC: 0 },
  internal.sync.refreshVariants,
  {},
);

// Per-user portfolio totals, after prices are fresh.
crons.daily(
  "portfolio snapshots",
  { hourUTC: 7, minuteUTC: 0 },
  internal.portfolio.snapshotAll,
  {},
);

export default crons;
