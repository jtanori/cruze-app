/**
 * LIVE-01 — Live crossing intelligence types.
 *
 * These types represent the current operational state of a crossing,
 * separate from the committed trip context (SelectedCrossing in TripState).
 *
 * Invariants:
 * - isLive === freshness === "live"
 * - totalJourneyTime is frozen from SelectedCrossing, never live-refreshed
 * - status never includes "unknown" — freshness expresses data-quality problems
 */

export type CrossingFreshness = "live" | "recent" | "stale" | "unavailable";

export type CrossingOperationalStatus = "open" | "limited" | "closed";

export interface LiveCrossingSnapshot {
  crossingId: string;
  status: CrossingOperationalStatus;
  waitTime: number;
  totalJourneyTime: number;
  isLive: boolean;
  generatedAt: string;
  freshness: CrossingFreshness;
}

export type CrossingChangeType = "WAIT_SURGE" | "WAIT_DROP" | "STATUS_CHANGE";

export interface CrossingChange {
  type: CrossingChangeType;
  crossingId: string;
  previousStatus: CrossingOperationalStatus;
  currentStatus: CrossingOperationalStatus;
  previousWait: number;
  currentWait: number;
  deltaMinutes: number;
  deltaPercent: number;
  detectedAt: string;
}
