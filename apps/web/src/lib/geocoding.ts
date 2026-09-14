import type { Place } from "@/types";

/**
 * S2 — Geocoding clients go through same-origin proxies (/api/places,
 * /api/reverse). The Mapbox token lives server-side; browsers never see
 * queries or coordinates leave for third parties. Only interactive map
 * tiles still use the public token (see CrossingDetailMap).
 */

export interface GeocodingResult {
  id: string;
  placeName: string;
  center: [number, number]; // [lng, lat]
  context: string[];
}

interface ProxyPlace {
  id: string;
  name: string;
  formattedAddress: string;
  latitude: number | null;
  longitude: number | null;
  country: "MX" | "US";
  countryCode: string;
  city?: string;
  region?: string;
}

function toPlace(p: ProxyPlace): Place {
  return {
    id: p.id,
    name: p.name,
    formattedAddress: p.formattedAddress,
    latitude: p.latitude ?? 0,
    longitude: p.longitude ?? 0,
    country: p.country,
    countryCode: p.countryCode,
    city: p.city,
    region: p.region,
  };
}

/**
 * Search for locations via the server proxy.
 * Limited to MX and USA locations.
 */
export async function searchLocations(
  query: string,
  limit: number = 5
): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      query,
      limit: String(limit),
    });
    const response = await fetch(`/api/places?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Places API error: ${response.status}`);
    }

    const data = await response.json();
    const places: ProxyPlace[] = Array.isArray(data.places) ? data.places : [];

    return places.map((p) => ({
      id: p.id,
      placeName: p.formattedAddress,
      center: [p.longitude ?? 0, p.latitude ?? 0],
      context: [p.city, p.region].filter((x): x is string => Boolean(x)),
    }));
  } catch (error) {
    console.error("Geocoding search failed:", error);
    return [];
  }
}

/**
 * Search for places via the server proxy.
 * Returns Place[] format for compatibility with existing components.
 * `country` is a STRICT server-side filter (ISO alpha-2, lowercase);
 * pass the target side when known, null for both (UNKNOWN user).
 */
export async function searchPlaces(
  query: string,
  limit: number = 5,
  country?: "MX" | "US" | null
): Promise<Place[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      query,
      limit: String(limit),
    });
    if (country) params.set("country", country);
    const response = await fetch(`/api/places?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Places API error: ${response.status}`);
    }

    const data = await response.json();
    const places: ProxyPlace[] = Array.isArray(data.places) ? data.places : [];
    return places.map(toPlace);
  } catch (error) {
    console.error("Geocoding search failed:", error);
    return [];
  }
}

/**
 * Reverse geocode coordinates via the server proxy.
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<Place | null> {
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
    });
    const response = await fetch(`/api/reverse?${params.toString()}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.place ? toPlace(data.place as ProxyPlace) : null;
  } catch {
    return null;
  }
}
