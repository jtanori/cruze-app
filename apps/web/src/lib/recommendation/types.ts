/**
 * Canonical recommendation contract — T07.
 *
 * This file defines the single source of truth for recommendation data
 * flowing through the app. Three distinct concepts:
 *
 *   TripRecommendation   → engine output (ephemeral, displayed by T07)
 *   SelectedCrossing     → user choice (persisted to TripState)
 *   RecommendationReason → structured reason (code + data, not prose)
 *
 * The API returns `TripRecommendation`. The user selects a crossing.
 * Only `SelectedCrossing` is persisted to the trip store.
 *
 * Existing types to deprecate:
 *   types/place.ts::CrossingRecommendation    → use SelectedCrossing
 *   domain/recommendation/types.ts::CrossingRecommendation → use CrossingEntity
 */

// ─── Status ───────────────────────────────────────────────────────

export type RecommendationCrossingStatus = "open" | "limited" | "closed";

// ─── Reason codes ─────────────────────────────────────────────────
// Codes are stable identifiers. Data provides context for i18n.
// UI layer produces human-readable strings from code + data.

export type RecommendationReasonCode =
  | "fastest_total_time"
  | "shortest_wait"
  | "best_access_match"
  | "only_open_option"
  | "closest_to_route"
  | "candidate_preference";

export interface RecommendationReason {
  code: RecommendationReasonCode;
  data?: Record<string, string | number>;
}

// ─── Crossing summary (within a recommendation) ──────────────────

export interface RecommendationCrossingSummary {
  id: string;
  name: string;
  mexicanCity: string;
  usCity: string;
  mexicanState: string;
  usState: string;
  corridor: string;
  coordinates: { lat: number; lng: number };
}

// ─── Alternative ──────────────────────────────────────────────────

export interface RecommendationAlternative {
  crossingId: string;
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  waitTime: number;
  totalJourneyTime: number;
  deltaMinutes: number;
  status: RecommendationCrossingStatus;
  isLive: boolean;
  coordinates: { lat: number; lng: number };
}

// ─── Trip recommendation (engine output) ──────────────────────────
//
// This is what the API returns and what T07 displays.
// It is ephemeral — not persisted to the store.

export interface TripRecommendation {
  primary: {
    crossing: RecommendationCrossingSummary;
    waitTime: number;
    totalJourneyTime: number;
    status: RecommendationCrossingStatus;
    isLive: boolean;
    score: number;
    reason: RecommendationReason;
    confidence: "high" | "medium" | "low";
  };
  alternatives: RecommendationAlternative[];
  context: {
    originName: string;
    destinationName: string;
    originLat: number;
    originLng: number;
    destLat: number;
    destLng: number;
    travelMode?: string;
    direction?: string;
    accessType?: string;
    documentProfile?: string;
  };
  generatedAt: string;
}

// ─── Selected crossing (persisted to TripState) ───────────────────
//
// This is what the user commits when they click "Usar este cruce".
// Minimal fields — just enough for the active trip to reference.

export interface SelectedCrossing {
  crossingId: string;
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  waitTime: number;
  totalJourneyTime: number;
  status: RecommendationCrossingStatus;
  isLive: boolean;
  generatedAt: string;
  coordinates: { lat: number; lng: number };
}

// ─── Mapping helpers ──────────────────────────────────────────────

/**
 * Extract a `SelectedCrossing` from a `TripRecommendation` primary.
 * Called when the user commits their selection.
 */
export function selectCrossingFromRecommendation(
  rec: TripRecommendation,
): SelectedCrossing {
  return {
    crossingId: rec.primary.crossing.id,
    crossingName: rec.primary.crossing.name,
    mexicanCity: rec.primary.crossing.mexicanCity,
    usCity: rec.primary.crossing.usCity,
    waitTime: rec.primary.waitTime,
    totalJourneyTime: rec.primary.totalJourneyTime,
    status: rec.primary.status,
    isLive: rec.primary.isLive,
    generatedAt: rec.generatedAt,
    coordinates: rec.primary.crossing.coordinates,
  };
}

/**
 * Extract a `SelectedCrossing` from an alternative.
 * Called when the user selects an alternative as their trip choice.
 */
export function selectCrossingFromAlternative(
  alt: RecommendationAlternative,
  rec: TripRecommendation,
): SelectedCrossing {
  return {
    crossingId: alt.crossingId,
    crossingName: alt.crossingName,
    mexicanCity: alt.mexicanCity,
    usCity: alt.usCity,
    waitTime: alt.waitTime,
    totalJourneyTime: alt.totalJourneyTime,
    status: alt.status,
    isLive: alt.isLive,
    generatedAt: rec.generatedAt,
    coordinates: alt.coordinates,
  };
}
