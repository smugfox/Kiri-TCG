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

// Alert evaluation, after prices are fresh (crossing semantics, PRD FR-011).
crons.daily(
  "evaluate alerts",
  { hourUTC: 6, minuteUTC: 45 },
  internal.alerts.evaluate,
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
