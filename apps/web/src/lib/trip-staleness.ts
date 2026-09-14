/**
 * Trip-lifecycle staleness — NOT crossing-data freshness.
 * Crossing freshness (LIVE/RECENT/STALE/UNAVAILABLE) stays in
 * CrossingFreshness; this module only answers "is this trip too old
 * to keep executing".
 */

export const TRIP_STALENESS_THRESHOLD_MS = 12 * 60 * 60 * 1000;

export function isTripStale(
  lastEvaluatedAt: string | null,
  now: number = Date.now(),
  thresholdMs: number = TRIP_STALENESS_THRESHOLD_MS
): boolean {
  if (!lastEvaluatedAt) return false;
  return now - new Date(lastEvaluatedAt).getTime() > thresholdMs;
}
