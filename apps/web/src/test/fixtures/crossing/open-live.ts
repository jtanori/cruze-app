// Fixture: crossing/open-live — CrossingStatusBadge OPEN + CrossingFreshness LIVE (W5 §18+22)
// Version: 1.1 — 2026-09-04 — W5 canon 1.1
export const openLiveFixture = {
  status: "OPEN" as const,
  freshness: "LIVE" as const,
  waitTime: 11,
  direction: "MX_TO_US" as const,
  lastUpdated: Date.now(),
  // must NOT render "EN VIVO" when freshness is LIVE only — see TESTING_TOOLS.md §7.1
} as const;
