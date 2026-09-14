"use client";

import { useTripStore } from "@/stores/trip";
import type { MapPoint } from "@/lib/map-route";

/**
 * Derive valid trip-map context from the trip store.
 * Returns origin + destination only when BOTH have valid coordinates.
 * Partial or stale store fields produce null — the map stays crossing-only.
 */
export function useTripMapContext(): {
  origin: MapPoint | null;
  destination: MapPoint | null;
} {
  const start = useTripStore((s) => s.start);
  const destination = useTripStore((s) => s.destination);
  const completed = useTripStore((s) => s.completed);

  if (completed) return { origin: null, destination: null };
  if (!start || !destination) return { origin: null, destination: null };

  // Both must have valid numeric coordinates
  if (
    typeof start.latitude !== "number" ||
    typeof start.longitude !== "number" ||
    typeof destination.latitude !== "number" ||
    typeof destination.longitude !== "number"
  ) {
    return { origin: null, destination: null };
  }

  return {
    origin: { lat: start.latitude, lng: start.longitude, label: start.name },
    destination: {
      lat: destination.latitude,
      lng: destination.longitude,
      label: destination.name,
    },
  };
}
