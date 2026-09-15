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

/**
 * Format a distance in km for tight rows (locale-neutral, no preposition).
 * - Under 1 km: "500 m"
 * - Under 10 km: "3.2 km"
 * - Else: "12 km"
 */
export function formatDistance(km: number): string {
  if (!Number.isFinite(km) || km < 0) return "—";
  if (km < 1) return `${Math.max(1, Math.round(km * 1000))} m`;
  if (km < 10) return `${(Math.round(km * 10) / 10).toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/**
 * Get Tailwind background class for crossing status.
 * Consolidates status color mappings from 5+ files.
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "OPEN":
      return "bg-improving";
    case "LIMITED":
      return "bg-caution";
    case "CLOSED":
      return "bg-critical";
    default:
      return "bg-faint";
  }
}

/**
 * Get Tailwind text class for crossing status.
 */
export function getStatusTextColor(status: string): string {
  switch (status) {
    case "OPEN":
      return "text-improving";
    case "LIMITED":
      return "text-caution";
    case "CLOSED":
      return "text-critical";
    default:
      return "text-faint";
  }
}

/**
 * Get status dot color for crossing status.
 */
export function getStatusDotColor(status: string): string {
  switch (status) {
    case "OPEN":
      return "bg-cruze-mint";
    case "LIMITED":
      return "bg-cruze-amber";
    case "CLOSED":
      return "bg-alert-red";
    default:
      return "bg-muted";
  }
}

