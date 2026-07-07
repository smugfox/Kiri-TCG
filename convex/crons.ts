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

export default crons;
