import type { Place } from "@/types";

/**
 * Get the best display name for a Place.
 * Prefers city name over street address or POI name.
 */
export function getDisplayName(place: Place | null): string {
  if (!place) return "";
  return place.city || place.name;
}

/**
 * Format minutes into human-readable duration.
 * - Under 60 min: "45 min"
 * - Over 60 min: "8h 47m"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

