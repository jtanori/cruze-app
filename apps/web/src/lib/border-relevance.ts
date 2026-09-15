import { BORDER_CROSSINGS, haversineDistance } from "./border-data";

/**
 * Border relevance — computed from geography, never a hand-maintained list.
 *
 * Answers: "is this place meaningfully related to a supported border
 * crossing, and why?" Powers the same-country destination exception:
 * opposite-country results pass through untouched, while same-country
 * places are admitted only when relevant.
 */

export type BorderRelationship =
  | "adjacent"
  | "crossing_access"
  | "border_corridor";

export interface RelevantCrossing {
  id: string;
  name: string;
  distanceKm: number;
}

export interface BorderRelevance {
  relevant: boolean;
  crossings: RelevantCrossing[];
  distanceToCrossing?: number;
  relationship?: BorderRelationship;
}

/** Within a border town's walkshed — e.g. Sonoyta ↔ Lukeville. */
export const ADJACENT_KM = 15;
/** Day-trip access to a gate — e.g. Mexicali ↔ Calexico corridor. */
export const ACCESS_KM = 50;

export function getBorderRelevance(lat: number, lng: number): BorderRelevance {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { relevant: false, crossings: [] };
  }

  const crossings: RelevantCrossing[] = BORDER_CROSSINGS.map((c) => ({
    id: c.id,
    name: c.name,
    distanceKm: haversineDistance(
      { lat, lng },
      { lat: c.coordinates.lat, lng: c.coordinates.lng }
    ),
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  const nearest = crossings[0];
  if (!nearest || nearest.distanceKm > ACCESS_KM) {
    return { relevant: false, crossings: [] };
  }

  return {
    relevant: true,
    crossings: crossings.filter((c) => c.distanceKm <= ACCESS_KM),
    distanceToCrossing: nearest.distanceKm,
    relationship: nearest.distanceKm <= ADJACENT_KM ? "adjacent" : "crossing_access",
  };
}
