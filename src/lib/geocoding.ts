import type { Place } from "@/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const MX_US_BBOX = "-125,14.5,-80,50";

interface MapboxFeature {
  id: string;
  place_name: string;
  text: string;
  center: [number, number];
  context: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
  properties: {
    short_code?: string;
  };
}

interface MapboxResponse {
  features: MapboxFeature[];
}

function extractCountry(
  feature: MapboxFeature
): { country: "MX" | "US"; countryCode: string } | null {
  for (const item of feature.context) {
    if (item.id.startsWith("country")) {
      if (item.short_code === "us") return { country: "US", countryCode: "us" };
      if (item.short_code === "mx") return { country: "MX", countryCode: "mx" };
    }
  }
  if (feature.properties.short_code === "us")
    return { country: "US", countryCode: "us" };
  if (feature.properties.short_code === "mx")
    return { country: "MX", countryCode: "mx" };
  return null;
}

function extractCity(feature: MapboxFeature): string | undefined {
  for (const item of feature.context) {
    if (item.id.startsWith("place")) return item.text;
  }
  return undefined;
}

function extractRegion(feature: MapboxFeature): string | undefined {
  for (const item of feature.context) {
    if (item.id.startsWith("region")) return item.text;
  }
  return undefined;
}

function featureToPlace(feature: MapboxFeature): Place | null {
  const countryInfo = extractCountry(feature);
  if (!countryInfo) return null;

  return {
    id: feature.id,
    name: feature.text,
    formattedAddress: feature.place_name,
    latitude: feature.center[1],
    longitude: feature.center[0],
    country: countryInfo.country,
    countryCode: countryInfo.countryCode,
    city: extractCity(feature),
    region: extractRegion(feature),
  };
}

export async function searchPlaces(query: string): Promise<Place[]> {
  if (!MAPBOX_TOKEN) {
    console.warn("Mapbox token not configured, using fallback search");
    return fallbackSearch(query);
  }

  const encoded = encodeURIComponent(query);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${MAPBOX_TOKEN}&bbox=${MX_US_BBOX}&types=country,region,place,neighborhood,address,poi&language=en&limit=5`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Geocoding request failed");

  const data: MapboxResponse = await response.json();
  const places = data.features.map(featureToPlace).filter((p): p is Place => p !== null);
  return places;
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<Place | null> {
  if (!MAPBOX_TOKEN) {
    return fallbackReverseGeocode(lat, lng);
  }

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=country,region,place,neighborhood,address&language=en&limit=1`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Reverse geocoding request failed");

  const data: MapboxResponse = await response.json();
  if (data.features.length === 0) return null;

  return featureToPlace(data.features[0]);
}

// ─── Haversine distance (km) ───
function haversineDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

const FALLBACK_CITIES: Place[] = [
  // ─── US Cities ───
  {
    id: "san-diego-us",
    name: "San Diego",
    formattedAddress: "San Diego, California, United States",
    latitude: 32.7157,
    longitude: -117.1611,
    country: "US",
    countryCode: "us",
    city: "San Diego",
    region: "California",
  },
  {
    id: "los-angeles-us",
    name: "Los Angeles",
    formattedAddress: "Los Angeles, California, United States",
    latitude: 34.0522,
    longitude: -118.2437,
    country: "US",
    countryCode: "us",
    city: "Los Angeles",
    region: "California",
  },
  {
    id: "phoenix-us",
    name: "Phoenix",
    formattedAddress: "Phoenix, Arizona, United States",
    latitude: 33.4484,
    longitude: -112.074,
    country: "US",
    countryCode: "us",
    city: "Phoenix",
    region: "Arizona",
  },
  {
    id: "tucson-us",
    name: "Tucson",
    formattedAddress: "Tucson, Arizona, United States",
    latitude: 32.2226,
    longitude: -110.9747,
    country: "US",
    countryCode: "us",
    city: "Tucson",
    region: "Arizona",
  },
  {
    id: "las-vegas-us",
    name: "Las Vegas",
    formattedAddress: "Las Vegas, Nevada, United States",
    latitude: 36.1699,
    longitude: -115.1398,
    country: "US",
    countryCode: "us",
    city: "Las Vegas",
    region: "Nevada",
  },
  {
    id: "san-francisco-us",
    name: "San Francisco",
    formattedAddress: "San Francisco, California, United States",
    latitude: 37.7749,
    longitude: -122.4194,
    country: "US",
    countryCode: "us",
    city: "San Francisco",
    region: "California",
  },
  {
    id: "denver-us",
    name: "Denver",
    formattedAddress: "Denver, Colorado, United States",
    latitude: 39.7392,
    longitude: -104.9903,
    country: "US",
    countryCode: "us",
    city: "Denver",
    region: "Colorado",
  },
  {
    id: "el-paso-us",
    name: "El Paso",
    formattedAddress: "El Paso, Texas, United States",
    latitude: 31.7619,
    longitude: -106.485,
    country: "US",
    countryCode: "us",
    city: "El Paso",
    region: "Texas",
  },
  {
    id: "laredo-us",
    name: "Laredo",
    formattedAddress: "Laredo, Texas, United States",
    latitude: 27.5036,
    longitude: -99.5076,
    country: "US",
    countryCode: "us",
    city: "Laredo",
    region: "Texas",
  },
  {
    id: "calexico-us",
    name: "Calexico",
    formattedAddress: "Calexico, California, United States",
    latitude: 32.6789,
    longitude: -115.4989,
    country: "US",
    countryCode: "us",
    city: "Calexico",
    region: "California",
  },
  {
    id: "nogales-us",
    name: "Nogales",
    formattedAddress: "Nogales, Arizona, United States",
    latitude: 31.3404,
    longitude: -110.9381,
    country: "US",
    countryCode: "us",
    city: "Nogales",
    region: "Arizona",
  },
  // ─── Mexico Cities ───
  {
    id: "tijuana-mx",
    name: "Tijuana",
    formattedAddress: "Tijuana, Baja California, Mexico",
    latitude: 32.5149,
    longitude: -117.0382,
    country: "MX",
    countryCode: "mx",
    city: "Tijuana",
    region: "Baja California",
  },
  {
    id: "mexicali-mx",
    name: "Mexicali",
    formattedAddress: "Mexicali, Baja California, Mexico",
    latitude: 32.6276,
    longitude: -115.4558,
    country: "MX",
    countryCode: "mx",
    city: "Mexicali",
    region: "Baja California",
  },
  {
    id: "ensenada-mx",
    name: "Ensenada",
    formattedAddress: "Ensenada, Baja California, Mexico",
    latitude: 31.8669,
    longitude: -116.6003,
    country: "MX",
    countryCode: "mx",
    city: "Ensenada",
    region: "Baja California",
  },
  {
    id: "nogales-mx",
    name: "Nogales",
    formattedAddress: "Nogales, Sonora, Mexico",
    latitude: 31.3087,
    longitude: -110.9265,
    country: "MX",
    countryCode: "mx",
    city: "Nogales",
    region: "Sonora",
  },
  {
    id: "juarez-mx",
    name: "Ciudad Juárez",
    formattedAddress: "Ciudad Juárez, Chihuahua, Mexico",
    latitude: 31.6904,
    longitude: -106.4245,
    country: "MX",
    countryCode: "mx",
    city: "Ciudad Juárez",
    region: "Chihuahua",
  },
  {
    id: "chihuahua-mx",
    name: "Chihuahua",
    formattedAddress: "Chihuahua, Chihuahua, Mexico",
    latitude: 28.6353,
    longitude: -106.0889,
    country: "MX",
    countryCode: "mx",
    city: "Chihuahua",
    region: "Chihuahua",
  },
  {
    id: "nuevo-laredo-mx",
    name: "Nuevo Laredo",
    formattedAddress: "Nuevo Laredo, Tamaulipas, Mexico",
    latitude: 27.4757,
    longitude: -99.5218,
    country: "MX",
    countryCode: "mx",
    city: "Nuevo Laredo",
    region: "Tamaulipas",
  },
  {
    id: "monterrey-mx",
    name: "Monterrey",
    formattedAddress: "Monterrey, Nuevo León, Mexico",
    latitude: 25.6866,
    longitude: -100.3161,
    country: "MX",
    countryCode: "mx",
    city: "Monterrey",
    region: "Nuevo León",
  },
  {
    id: "saltillo-mx",
    name: "Saltillo",
    formattedAddress: "Saltillo, Coahuila, Mexico",
    latitude: 25.4232,
    longitude: -100.9934,
    country: "MX",
    countryCode: "mx",
    city: "Saltillo",
    region: "Coahuila",
  },
  {
    id: "hermosillo-mx",
    name: "Hermosillo",
    formattedAddress: "Hermosillo, Sonora, Mexico",
    latitude: 29.0729,
    longitude: -110.9559,
    country: "MX",
    countryCode: "mx",
    city: "Hermosillo",
    region: "Sonora",
  },
  {
    id: "guadalajara-mx",
    name: "Guadalajara",
    formattedAddress: "Guadalajara, Jalisco, Mexico",
    latitude: 20.6597,
    longitude: -103.3496,
    country: "MX",
    countryCode: "mx",
    city: "Guadalajara",
    region: "Jalisco",
  },
  {
    id: "mexico-city-mx",
    name: "Mexico City",
    formattedAddress: "Mexico City, Mexico",
    latitude: 19.4326,
    longitude: -99.1332,
    country: "MX",
    countryCode: "mx",
    city: "Mexico City",
    region: "Mexico City",
  },
];

function fallbackSearch(query: string): Place[] {
  const q = query.toLowerCase();
  return FALLBACK_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.region?.toLowerCase().includes(q)
  );
}

function fallbackReverseGeocode(lat: number, lng: number): Place | null {
  let nearest: Place | null = null;
  let minDist = Infinity;

  for (const city of FALLBACK_CITIES) {
    const dist = haversineDistance({ lat, lng }, { lat: city.latitude, lng: city.longitude });
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }

  return nearest;
}
