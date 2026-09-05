/**
 * Country detection and destination filtering logic
 * Simple rule: MX location → US destinations, US location → MX destinations
 */

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
 * Detect user's country from latitude/longitude
 * Simple bounding box approach for MX/US
 */
export function detectUserCountry(lat: number, lng: number): Country {
  // Mexico bounding box (approximate)
  const mxBounds = {
    north: 32.72,
    south: 14.53,
    east: -86.72,
    west: -118.47,
  };

  // US bounding box (approximate, contiguous)
  const usBounds = {
    north: 49.38,
    south: 24.39,
    east: -66.95,
    west: -125.0,
  };

  const inMX = lat >= mxBounds.south && lat <= mxBounds.north && lng >= mxBounds.west && lng <= mxBounds.east;
  const inUS = lat >= usBounds.south && lat <= usBounds.north && lng >= usBounds.west && lng <= usBounds.east;

  if (inMX && !inUS) return "MX";
  if (inUS && !inMX) return "US";

  // Default to US for border/overlap areas or unknown
  // Could also check which is closer
  return "US";
}

/**
 * Get target destination country based on user's country
 * Simple rule: MX → US, US → MX
 */
export function getTargetDestinationCountry(userCountry: Country): Country {
  return userCountry === "MX" ? "US" : "MX";
}

/**
 * Filter places by target destination country
 */
export function filterDestinationsByCountry(
  places: Place[],
  userLat: number,
  userLng: number
): Place[] {
  const userCountry = detectUserCountry(userLat, userLng);
  const targetCountry = getTargetDestinationCountry(userCountry);

  return places.filter((place) => place.country === targetCountry);
}

/**
 * Get target country code for search placeholder (MX/US)
 */
export function getTargetCountryCode(userLat: number, userLng: number): "MX" | "US" {
  const userCountry = detectUserCountry(userLat, userLng);
  return getTargetDestinationCountry(userCountry);
}