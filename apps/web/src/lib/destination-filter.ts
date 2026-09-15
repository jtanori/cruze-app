/**
 * Country detection and destination filtering logic.
 *
 * Opposite-country results always pass. Same-country places are admitted
 * only when border-relevant (computed geography, never a hand list), with
 * the nearest crossing attached as a candidate — the destination itself is
 * never rewritten.
 */
import { getBorderRelevance, type BorderRelevance } from "./border-relevance";

export type Country = "MX" | "US";

export interface Place {
  id: string;
  name: string;
  formattedAddress?: string;
  latitude: number;
  longitude: number;
  country: Country;
  countryCode: string;
  city?: string;
  region?: string;
}

/**
 * Country comes from geocoding, never geometry. Callers pass the resolved
 * user country (or UNKNOWN/null when the location has none).
 */

/**
 * Get target destination country based on user's country
 * Simple rule: MX → US, US → MX
 */
export function getTargetDestinationCountry(userCountry: Country): Country {
  return userCountry === "MX" ? "US" : "MX";
}

/**
 * Filter places by target destination country.
 * A known country filters to the opposite side; UNKNOWN (or absent)
 * returns candidates unfiltered — never invent a side.
 */
export function filterDestinationsByCountry(
  places: Place[],
  knownCountry?: Country | "UNKNOWN" | null
): Place[] {
  const userCountry = knownCountry ?? "UNKNOWN";
  if (userCountry === "UNKNOWN") return places;
  const targetCountry = getTargetDestinationCountry(userCountry);

  return places.filter((place) => place.country === targetCountry);
}

export interface RelevantPlace extends Place {
  borderRelevance?: BorderRelevance;
  borderCrossingId?: string;
  borderCrossingName?: string;
}

/**
 * Admission filter with the border-relevance exception.
 *
 * - Opposite-country places: admitted untouched.
 * - Same-country places: admitted only when border-relevant, carrying the
 *   nearest crossing as a candidate (destination never rewritten).
 * - Same-country places without finite coordinates or beyond access range:
 *   excluded.
 * - UNKNOWN user country: everything passes, no candidates attached.
 */
export function filterDestinations(
  places: Place[],
  knownCountry?: Country | "UNKNOWN" | null
): RelevantPlace[] {
  const userCountry = knownCountry ?? "UNKNOWN";
  if (userCountry === "UNKNOWN") return [...places];
  const targetCountry = getTargetDestinationCountry(userCountry);

  const normal: RelevantPlace[] = [];
  const relevant: RelevantPlace[] = [];
  for (const place of places) {
    if (place.country === targetCountry) {
      normal.push(place);
      continue;
    }
    if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) {
      continue;
    }
    const relevance = getBorderRelevance(place.latitude, place.longitude);
    if (!relevance.relevant) continue;
    const nearest = relevance.crossings[0];
    relevant.push({
      ...place,
      borderRelevance: relevance,
      borderCrossingId: nearest.id,
      borderCrossingName: nearest.name,
    });
  }
  // Border-relevant rows lead: without the boost, Mapbox ranking + the
  // client's slice(0, 5) would cut them (e.g. Sonoita Sonora ranks #6 for
  // "sono"). Within each group, Mapbox order is preserved (stable sort).
  return [...relevant, ...normal];
}

/**
 * Get target destination country for a KNOWN user country.
 * UNKNOWN has no opposite side — callers must handle it explicitly
 * (generic copy, unfiltered results) instead of inventing one here.
 */
export function getTargetDestinationCountrySafe(
  userCountry: Country | "UNKNOWN" | null | undefined
): Country | null {
  if (userCountry !== "MX" && userCountry !== "US") return null;
  return getTargetDestinationCountry(userCountry);
}