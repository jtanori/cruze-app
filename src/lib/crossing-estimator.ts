/**
 * Crossing Estimation Engine
 * Calculates and dynamically re-estimates crossing times.
 */

import type { CrossingMode } from "@/types";

const BUFFER_MINUTES = {
  walking: 10,
  personal_vehicle: 5,
  commercial_vehicle: 5,
  public_transport: 8,
};

/**
 * Calculate initial estimated crossing time.
 * @param waitTime - Current wait time at the crossing (minutes)
 * @param approachTime - Time to reach crossing from origin (minutes)
 * @param crossingMode - How the user is crossing
 * @returns Estimated total crossing time in minutes
 */
export function calculateEstimatedCrossingTime(
  waitTime: number,
  approachTime: number,
  crossingMode: CrossingMode
): number {
  const buffer = BUFFER_MINUTES[crossingMode] || 5;
  return waitTime + approachTime + buffer;
}

/**
 * Determine if re-estimation should occur.
 * Adaptive: checks time since last estimate AND wait time delta.
 */
export function shouldReEstimate(
  currentWaitTime: number,
  lastWaitTime: number,
  lastReEstimateAt: string | null,
  reEstimateCount: number,
  maxReEstimates: number
): boolean {
  // Don't re-estimate if we've hit the max
  if (reEstimateCount >= maxReEstimates) return false;

  // Don't re-estimate if no previous estimate
  if (!lastReEstimateAt) return true;

  const timeSinceLastEstimate = Date.now() - new Date(lastReEstimateAt).getTime();
  const minIntervalMs = 5 * 60 * 1000; // Minimum 5 minutes between re-estimates

  if (timeSinceLastEstimate < minIntervalMs) return false;

  // Re-estimate if wait time changed significantly
  const waitDelta = Math.abs(currentWaitTime - lastWaitTime);
  return waitDelta >= 5; // 5+ minute change triggers re-estimation
}

/**
 * Re-estimate crossing time based on new wait data.
 */
export function reEstimateCrossingTime(
  originalEstimate: number,
  oldWaitTime: number,
  newWaitTime: number
): number {
  const diff = newWaitTime - oldWaitTime;
  return Math.max(originalEstimate + diff, 0);
}

/**
 * Check if estimated time has elapsed.
 */
export function hasEstimatedTimeElapsed(estimatedArrivalAt: string | null): boolean {
  if (!estimatedArrivalAt) return false;
  return Date.now() >= new Date(estimatedArrivalAt).getTime();
}

/**
 * Calculate the actual crossing time from start to confirmation.
 */
export function calculateActualCrossingTime(
  startedAt: string,
  confirmedAt: string
): number {
  const start = new Date(startedAt).getTime();
  const end = new Date(confirmedAt).getTime();
  return Math.round((end - start) / (1000 * 60));
}

/**
 * Format crossing time for display.
 */
export function formatCrossingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Get crossing time comparison (estimated vs actual).
 */
export function getCrossingTimeComparison(
  estimated: number,
  actual: number
): { diff: number; faster: boolean; label: string } {
  const diff = Math.abs(estimated - actual);
  const faster = actual < estimated;
  const label = faster
    ? `${diff} min faster than expected`
    : `${diff} min slower than expected`;
  return { diff, faster, label };
}
