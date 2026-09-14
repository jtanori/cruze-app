/**
 * LIVE-01 — Ephemeral store for live crossing intelligence.
 *
 * This store is NOT persisted — it holds live operational data that
 * degrades when the user leaves the active trip view.
 *
 * Architecture boundary: this store never mutates TripState.
 * SelectedCrossing in TripState is the committed trip decision.
 * LiveCrossingSnapshot here is the current operational state.
 */

import { create } from "zustand";
import type { LiveCrossingSnapshot, CrossingChange } from "@/lib/live-crossing/types";
import type { MergedCrossingData } from "@/lib/border-data-service";
import { calculateCrossingFreshness } from "@/lib/live-crossing/freshness";
import { detectCrossingChanges } from "@/lib/live-crossing/changes";

interface LiveCrossingState {
  snapshot: LiveCrossingSnapshot | null;
  previousSnapshot: LiveCrossingSnapshot | null;
  lastFetchAt: string | null;
  error: string | null;

  /** Replace snapshot with fresh data. Computes freshness, derives isLive. */
  setSnapshot: (crossing: MergedCrossingData, direction: "north" | "south" | null, totalJourneyTime: number) => void;

  /** Mark fetch attempt (success or failure) for tracking. */
  setFetchTime: () => void;

  /** Record error without overwriting valid snapshot. */
  setError: (error: string) => void;

  /** Clear all live data (e.g. on trip completion or reset). */
  clear: () => void;
}

function mapToSnapshot(
  crossing: MergedCrossingData,
  direction: "north" | "south" | null,
  totalJourneyTime: number,
  now: number = Date.now()
): LiveCrossingSnapshot {
  const status = direction === "south"
    ? crossing.statusSouthbound.toLowerCase() as LiveCrossingSnapshot["status"]
    : crossing.statusNorthbound.toLowerCase() as LiveCrossingSnapshot["status"];

  const waitTime = direction === "south"
    ? crossing.waitTimeSouthbound
    : crossing.waitTimeNorthbound;

  const generatedAt = crossing.lastUpdated || new Date(now).toISOString();
  const freshness = calculateCrossingFreshness(generatedAt, now);

  return {
    crossingId: crossing.id,
    status,
    waitTime,
    totalJourneyTime,
    isLive: freshness === "live",
    generatedAt,
    freshness,
  };
}

export const useLiveCrossingStore = create<LiveCrossingState>()((set) => ({
  snapshot: null,
  previousSnapshot: null,
  lastFetchAt: null,
  error: null,

  setSnapshot: (crossing, direction, totalJourneyTime) => {
    const now = Date.now();
    const newSnapshot = mapToSnapshot(crossing, direction, totalJourneyTime, now);
    set((state) => ({
      snapshot: newSnapshot,
      previousSnapshot: state.snapshot,
      lastFetchAt: new Date(now).toISOString(),
      error: null,
    }));
  },

  setFetchTime: () => {
    set({ lastFetchAt: new Date().toISOString() });
  },

  setError: (error) => {
    set({ error, lastFetchAt: new Date().toISOString() });
  },

  clear: () => {
    set({
      snapshot: null,
      previousSnapshot: null,
      lastFetchAt: null,
      error: null,
    });
  },
}));

/**
 * Detect changes between current and previous snapshot.
 * Returns empty array if no previous snapshot (initial acquisition).
 */
export function getCrossingChanges(): CrossingChange[] {
  const { previousSnapshot, snapshot } = useLiveCrossingStore.getState();
  if (!previousSnapshot || !snapshot) return [];

  const detected = detectCrossingChanges(previousSnapshot, snapshot);
  const now = new Date().toISOString();
  return detected.map((d) => ({ ...d, detectedAt: now }));
}
