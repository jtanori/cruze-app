/**
 * Country resolution domain — single source of truth for "which country
 * is the user in".
 *
 * Deliberately boring: the ONLY authority is the geocoded country
 * (Mapbox reverse-geocode via /api/reverse). No bounding boxes, no
 * defaults — geometry cannot tell Tijuana from San Diego or resolve
 * ocean/desert fixes, so anything else would be guessing. Without a
 * geocoded country the answer is UNKNOWN (LOW), and every consumer
 * treats UNKNOWN as "generic copy, unfiltered results".
 */

export type Country = "MX" | "US";
export type ResolvedCountry = Country | "UNKNOWN";
export type CountryConfidence = "HIGH" | "LOW";

export interface CountryResolution {
  country: ResolvedCountry;
  confidence: CountryConfidence;
}

/**
 * Geocoded country wins (HIGH); everything else is UNKNOWN (LOW).
 * Never returns a forced MX/US.
 */
export function resolveUserCountry(
  geocodedCountry?: Country | null
): CountryResolution {
  if (geocodedCountry === "MX" || geocodedCountry === "US") {
    return { country: geocodedCountry, confidence: "HIGH" };
  }
  return { country: "UNKNOWN", confidence: "LOW" };
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
