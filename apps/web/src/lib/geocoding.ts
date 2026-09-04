import type { Place } from "@/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export interface GeocodingResult {
  id: string;
  placeName: string;
  center: [number, number]; // [lng, lat]
  context: string[];
}

export interface GeocodingFeature {
  id: string;
  place_name: string;
  center: [number, number];
  context: Array<{ id: string; text: string }>;
  properties?: {
    short_code?: string;
  };
}

function detectCountry(feature: GeocodingFeature): "MX" | "US" {
  const shortCode = feature.properties?.short_code;
  if (shortCode) {
    return shortCode.toUpperCase() === "US" ? "US" : "MX";
  }
  const contextIds = feature.context?.map((c) => c.id) || [];
  for (const ctx of contextIds) {
    if (ctx.startsWith("country.") && ctx.includes("united_states")) return "US";
  }
  return "MX";
}

function featureToPlace(feature: GeocodingFeature): Place {
  const country = detectCountry(feature);
  const placeName = feature.place_name || "";
  const parts = placeName.split(",").map((s) => s.trim());
  const name = parts[0] || placeName;

  return {
    id: feature.id,
    name,
    formattedAddress: placeName,
    latitude: feature.center[1],
    longitude: feature.center[0],
    country,
    countryCode: country,
    city: parts[0],
    region: parts[1],
  };
}

/**
 * Search for locations using Mapbox Geocoding API
 * Limited to MX and USA locations
 */
export async function searchLocations(
  query: string,
  limit: number = 5
): Promise<GeocodingResult[]> {
  if (!MAPBOX_TOKEN) {
    console.warn("Mapbox token not configured");
    return [];
  }

  if (!query || query.length < 2) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${MAPBOX_TOKEN}&country=mx,us&types=place,region&language=es&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }

    return data.features.map((feature: GeocodingFeature) => ({
      id: feature.id,
      placeName: feature.place_name,
      center: feature.center,
      context: feature.context?.map((c) => c.text) || [],
    }));
  } catch (error) {
    console.error("Geocoding search failed:", error);
    return [];
  }
}

/**
 * Search for places using Mapbox Geocoding API
 * Returns Place[] format for compatibility with existing components
 */
export async function searchPlaces(
  query: string,
  limit: number = 5
): Promise<Place[]> {
  if (!MAPBOX_TOKEN) {
    return [];
  }

  if (!query || query.length < 2) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${MAPBOX_TOKEN}&country=mx,us&types=place,region&language=es&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }

    return data.features.map(featureToPlace);
  } catch (error) {
    console.error("Geocoding search failed:", error);
    return [];
  }
}

/**
 * Reverse geocode coordinates to get a Place object
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<Place | null> {
  if (!MAPBOX_TOKEN) {
    return null;
  }

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=place,region&language=es&limit=1`;

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return featureToPlace(data.features[0]);
    }

    return null;
  } catch {
    return null;
  }
}
