"use client";

import { useEffect, useRef } from "react";
import { useTripStore } from "@/stores/trip";
import { useLocationContext } from "@/components/location/LocationProvider";

/**
 * Refresh the GPS fix on a 5-minute cadence while a trip is ACTIVE and the
 * tab is visible. Matches the location staleness threshold — no new concepts,
 * no background tracking, no watchPosition battery drain.
 */
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function useTripLocationRefresh() {
  const hasActiveTrip = useTripStore(
    (s) => s.recommendedCrossing !== null && !s.completed
  );
  const { retry } = useLocationContext();
  const retryRef = useRef(retry);
  retryRef.current = retry;

  useEffect(() => {
    if (!hasActiveTrip) return;
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        retryRef.current();
      }
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasActiveTrip]);
}
