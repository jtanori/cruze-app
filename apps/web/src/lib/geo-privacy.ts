/**
 * S1 — Geo-privacy helpers for persisted state.
 *
 * Precise GPS coordinates never need to survive a reload at full resolution:
 * live fixes re-acquire within seconds, while persisted trails are the
 * highest-value target for localStorage theft. Persisted coordinates are
 * rounded to 3 decimals (~100m) — fully sufficient for routing, ETAs, and
 * nearby ranking — and movement trails stay in memory only.
 */

/** Round a coordinate to ~100m precision. Pass-through for non-finite input. */
export function roundCoord(value: number): number {
  if (!Number.isFinite(value)) return value;
  return Math.round(value * 1000) / 1000;
}

interface HasLatLng {
  latitude: number;
  longitude: number;
}

/** Shallow-copy a place with rounded coordinates. */
export function sanitizePlace<T extends HasLatLng>(place: T | null): T | null {
  if (!place) return null;
  return {
    ...place,
    latitude: roundCoord(place.latitude),
    longitude: roundCoord(place.longitude),
  };
}

interface HasLatLngPair {
  lat: number;
  lng: number;
}

/** Shallow-copy a {lat,lng} pair with rounded coordinates. */
export function sanitizeLatLng<T extends HasLatLngPair>(point: T | null): T | null {
  if (!point) return null;
  return { ...point, lat: roundCoord(point.lat), lng: roundCoord(point.lng) };
}

/** Cap retained trip history (prevents indefinite accumulation). */
export const MAX_COMPLETED_TRIPS = 20;

export function capCompletedTrips<T>(trips: T[]): T[] {
  return trips.slice(0, MAX_COMPLETED_TRIPS);
}
