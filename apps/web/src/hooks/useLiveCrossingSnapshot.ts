/**
 * LIVE-01 — Hook for live crossing intelligence.
 *
 * Fetches current crossing state from /api/crossings/merged,
 * maps it to a LiveCrossingSnapshot, and manages the refresh lifecycle.
 *
 * Refresh triggers:
 * - Initial fetch on mount / crossing selection
 * - Interval refresh every 5 minutes (aligned with CBP server cache)
 * - Visibility regain (tab refocus)
 * - Manual retry via refresh()
 *
 * Architecture boundary: this hook never mutates TripState.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveCrossingStore, getCrossingChanges } from "@/stores/live-crossing";
import type { LiveCrossingSnapshot, CrossingChange } from "@/lib/live-crossing/types";
import type { TripDirection } from "@/types";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

interface UseLiveCrossingSnapshotResult {
  snapshot: LiveCrossingSnapshot | null;
  isLoading: boolean;
  error: string | null;
  previousSnapshot: LiveCrossingSnapshot | null;
  changes: CrossingChange[];
  refresh: () => Promise<void>;
}

export function useLiveCrossingSnapshot(
  crossingId: string | null,
  direction: TripDirection | null,
  initialTotalJourneyTime: number
): UseLiveCrossingSnapshotResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changes, setChanges] = useState<CrossingChange[]>([]);

  const snapshot = useLiveCrossingStore((s) => s.snapshot);
  const previousSnapshot = useLiveCrossingStore((s) => s.previousSnapshot);
  const setSnapshot = useLiveCrossingStore((s) => s.setSnapshot);
  const setErrorState = useLiveCrossingStore((s) => s.setError);
  const clearStore = useLiveCrossingStore((s) => s.clear);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const fetchSnapshot = useCallback(async () => {
    if (!crossingId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/crossings/merged");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const crossing = data.crossings?.find(
        (c: { id: string }) => c.id === crossingId
      );

      if (!crossing) {
        throw new Error(`Crossing ${crossingId} not found`);
      }

      const dir = direction === "US_TO_MX" ? "south" : "north";
      setSnapshot(crossing, dir, initialTotalJourneyTime);

      const detectedChanges = getCrossingChanges();
      if (detectedChanges.length > 0) {
        setChanges(detectedChanges);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setErrorState(message);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [crossingId, direction, initialTotalJourneyTime, setSnapshot, setErrorState]);

  // Initial fetch + interval
  useEffect(() => {
    mountedRef.current = true;

    if (crossingId) {
      fetchSnapshot();

      intervalRef.current = setInterval(fetchSnapshot, REFRESH_INTERVAL_MS);
    }

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [crossingId, fetchSnapshot]);

  // Visibility change
  useEffect(() => {
    if (!crossingId) return;

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchSnapshot();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [crossingId, fetchSnapshot]);

  // Clear on crossing change
  useEffect(() => {
    if (!crossingId) {
      clearStore();
      setChanges([]);
    }
  }, [crossingId, clearStore]);

  return {
    snapshot,
    isLoading,
    error,
    previousSnapshot,
    changes,
    refresh: fetchSnapshot,
  };
}
