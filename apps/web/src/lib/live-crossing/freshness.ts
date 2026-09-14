/**
 * LIVE-01 — Crossing data freshness calculation.
 *
 * Freshness is derived from generatedAt (last successful data acquisition),
 * NOT from fetch outcome. Failed fetches leave generatedAt unchanged,
 * so freshness naturally degrades.
 *
 * Thresholds:
 *   0 ──── 5m ──── 30m ──── 120m ────►
 *     LIVE    RECENT    STALE    UNAVAILABLE
 */

import type { CrossingFreshness } from "./types";

export const FRESHNESS_THRESHOLDS = {
  /** Data within one CBP server cache cycle */
  LIVE_MAX_MS: 5 * 60 * 1000,
  /** Data is usable but not real-time */
  RECENT_MAX_MS: 30 * 60 * 1000,
  /** Data may be outdated */
  STALE_MAX_MS: 120 * 60 * 1000,
} as const;

export function calculateCrossingFreshness(
  generatedAt: string,
  now: number = Date.now()
): CrossingFreshness {
  const age = now - new Date(generatedAt).getTime();

  if (age <= FRESHNESS_THRESHOLDS.LIVE_MAX_MS) return "live";
  if (age <= FRESHNESS_THRESHOLDS.RECENT_MAX_MS) return "recent";
  if (age <= FRESHNESS_THRESHOLDS.STALE_MAX_MS) return "stale";
  return "unavailable";
}
