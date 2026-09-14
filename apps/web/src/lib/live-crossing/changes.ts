/**
 * LIVE-01 — Crossing change detection.
 *
 * Compares previous snapshot against current snapshot to detect
 * significant operational changes. Uses thresholds from alert-engine.ts:
 *
 *   WAIT_SURGE:  absolute >= +15 min OR relative >= +40%
 *   WAIT_DROP:   absolute <= -15 min
 *   STATUS_CHANGE: status !== previous.status
 *
 * Invariant: no previous snapshot = no change event.
 * Initial acquisition is baseline, not a change.
 */

import type { LiveCrossingSnapshot, CrossingChange, CrossingChangeType } from "./types";

/** Absolute threshold in minutes */
export const WAIT_SURGE_ABSOLUTE = 15;
/** Relative threshold as decimal (0.4 = +40%) */
export const WAIT_SURGE_RELATIVE = 0.4;
/** Absolute threshold in minutes (negative = improvement) */
export const WAIT_DROP_ABSOLUTE = -15;

export type DetectedChange = Omit<CrossingChange, "detectedAt">;

/**
 * Detect significant changes between two snapshots.
 * Returns empty array if no previous snapshot or no qualifying changes.
 */
export function detectCrossingChanges(
  previous: LiveCrossingSnapshot | null,
  current: LiveCrossingSnapshot
): DetectedChange[] {
  if (!previous) return [];
  if (previous.crossingId !== current.crossingId) return [];

  const changes: DetectedChange[] = [];
  const now = Date.now();
  const deltaMinutes = current.waitTime - previous.waitTime;
  const deltaPercent = previous.waitTime > 0 ? deltaMinutes / previous.waitTime : 0;

  // STATUS_CHANGE
  if (previous.status !== current.status) {
    changes.push({
      type: "STATUS_CHANGE",
      crossingId: current.crossingId,
      previousStatus: previous.status,
      currentStatus: current.status,
      previousWait: previous.waitTime,
      currentWait: current.waitTime,
      deltaMinutes,
      deltaPercent,
    });
  }

  // WAIT_SURGE
  const isSurge =
    deltaMinutes >= WAIT_SURGE_ABSOLUTE ||
    (previous.waitTime > 0 && deltaPercent >= WAIT_SURGE_RELATIVE);
  if (isSurge) {
    changes.push({
      type: "WAIT_SURGE",
      crossingId: current.crossingId,
      previousStatus: previous.status,
      currentStatus: current.status,
      previousWait: previous.waitTime,
      currentWait: current.waitTime,
      deltaMinutes,
      deltaPercent,
    });
  }

  // WAIT_DROP
  if (deltaMinutes <= WAIT_DROP_ABSOLUTE) {
    changes.push({
      type: "WAIT_DROP",
      crossingId: current.crossingId,
      previousStatus: previous.status,
      currentStatus: current.status,
      previousWait: previous.waitTime,
      currentWait: current.waitTime,
      deltaMinutes,
      deltaPercent,
    });
  }

  return changes;
}
