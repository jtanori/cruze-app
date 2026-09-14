/**
 * Country resolution domain — single source of truth for "which country
 * is the user in".
 *
 * Precedence (formal):
 *   1. Valid geocoded country (Mapbox reverse-geocode) → HIGH
 *   2. Deterministic geographic fallback (bounding boxes) → MEDIUM
 *   3. UNKNOWN → LOW — never invent certainty in a border app.
 */

export type Country = "MX" | "US";
export type ResolvedCountry = Country | "UNKNOWN";
export type CountryConfidence = "HIGH" | "MEDIUM" | "LOW";

export interface CountryResolution {
  country: ResolvedCountry;
  confidence: CountryConfidence;
}

const MX_BOUNDS = {
  north: 32.72,
  south: 14.53,
  east: -86.72,
  west: -118.47,
};

const US_BOUNDS = {
  north: 49.38,
  south: 24.39,
  east: -66.95,
  west: -125.0,
};

/**
 * Pure deterministic geographic fallback. Independently testable.
 * Only unambiguous exclusive zones resolve; the overlap zone and
 * out-of-bounds points → UNKNOWN. Mapbox (strict country params)
 * is the authority — geometry never guesses where it can't know.
 */
export function resolveCountryFromCoordinates(
  lat: number,
  lng: number
): ResolvedCountry {
  const inMX =
    lat >= MX_BOUNDS.south &&
    lat <= MX_BOUNDS.north &&
    lng >= MX_BOUNDS.west &&
    lng <= MX_BOUNDS.east;
  const inUS =
    lat >= US_BOUNDS.south &&
    lat <= US_BOUNDS.north &&
    lng >= US_BOUNDS.west &&
    lng <= US_BOUNDS.east;

  if (inMX && !inUS) return "MX";
  if (inUS && !inMX) return "US";
  return "UNKNOWN";
}

/**
 * Orchestrator: geocoded country wins, coordinate fallback next,
 * UNKNOWN last. Never returns a forced MX/US.
 */
export function resolveUserCountry(
  lat: number,
  lng: number,
  geocodedCountry?: Country | null
): CountryResolution {
  if (geocodedCountry === "MX" || geocodedCountry === "US") {
    return { country: geocodedCountry, confidence: "HIGH" };
  }
  const fallback = resolveCountryFromCoordinates(lat, lng);
  if (fallback === "UNKNOWN") {
    return { country: "UNKNOWN", confidence: "LOW" };
  }
  return { country: fallback, confidence: "MEDIUM" };
}

/**
 * Contextual crossing direction for the T01 nearby surface (no trip yet).
 * This is NOT the trip direction — trip direction derives from
 * origin + destination. UNKNOWN → null (no direction filter).
 */
export function contextualDirectionForCountry(
  country: ResolvedCountry
): "MX_TO_US" | "US_TO_MX" | null {
  if (country === "MX") return "MX_TO_US";
  if (country === "US") return "US_TO_MX";
  return null;
}

/**
 * Display-direction hierarchy for crossing surfaces (C03, nearby):
 *   trip direction → contextual direction → null (show both).
 * Null must render BOTH directions — never silently become northbound.
 */
export function resolveDisplayDirection(
  tripDirection: "MX_TO_US" | "US_TO_MX" | null,
  country: ResolvedCountry
): "MX_TO_US" | "US_TO_MX" | null {
  if (tripDirection === "MX_TO_US" || tripDirection === "US_TO_MX") {
    return tripDirection;
  }
  return contextualDirectionForCountry(country);
}
