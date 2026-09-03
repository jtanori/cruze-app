import type { Place, TripType, TripDirection } from "@/types";

export type BorderDirection = "MX_TO_US" | "US_TO_MX";

export type BorderCorridor =
  | "tijuana-san-diego"
  | "mexicali-calexico"
  | "nogales"
  | "san-luis"
  | "el-paso-juarez"
  | "laredo-nuevo-laredo"
  | "reynosa-hidalgo"
  | "matamoros-brownsville";

export interface BorderCrossing {
  id: string;
  name: string;
  mexicanCity: string;
  usCity: string;
  mexicanState: string;
  usState: string;
  mexicanAddress: string;
  usAddress: string;
  corridor: BorderCorridor;
  coordinates: { lat: number; lng: number };
  country: "MX" | "US";
}

export const BORDER_CROSSINGS: BorderCrossing[] = [
  // San Diego / Tijuana Corridor
  {
    id: "san-ysidro",
    name: "San Ysidro",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Av. de las Américas s/n, Zona Río, 22000 Tijuana, B.C.",
    usAddress: "7450一步 1, San Ysidro, CA 92173",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.5431, lng: -117.0379 },
    country: "US",
  },
  {
    id: "otay-mesa",
    name: "Otay Mesa",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Av. de los Parientes s/n, Mesa de Otay, 22435 Tijuana, B.C.",
    usAddress: "2701 Terminal Ave, San Diego, CA 92154",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.5561, lng: -116.9756 },
    country: "US",
  },
  {
    id: "tecate",
    name: "Tecate",
    mexicanCity: "Tecate",
    usCity: "Tecate",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Libre s/n, Col. Centro, 21400 Tecate, B.C.",
    usAddress: "1500 Eastgate Blvd, Tecate, CA 91980",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.5694, lng: -116.6333 },
    country: "US",
  },

  // Mexicali / Calexico Corridor
  {
    id: "calexico-west",
    name: "Calexico West",
    mexicanCity: "Mexicali",
    usCity: "Calexico",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Av. Niños Héroes s/n, Col. Centro, 21100 Mexicali, B.C.",
    usAddress: "1099 East 1st St, Calexico, CA 92231",
    corridor: "mexicali-calexico",
    coordinates: { lat: 32.6789, lng: -115.4989 },
    country: "US",
  },
  {
    id: "calexico-east",
    name: "Calexico East",
    mexicanCity: "Mexicali",
    usCity: "Calexico",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Carretera México-Tijuana km 13, 21100 Mexicali, B.C.",
    usAddress: "1415 East 1st St, Calexico, CA 92231",
    corridor: "mexicali-calexico",
    coordinates: { lat: 32.6703, lng: -115.4614 },
    country: "US",
  },

  // Arizona Corridor
  {
    id: "nogales-mariposa",
    name: "Nogales Mariposa",
    mexicanCity: "Nogales",
    usCity: "Nogales",
    mexicanState: "Sonora",
    usState: "Arizona",
    mexicanAddress: "Av. José López Portillo s/n, Col. Centro, 84000 Nogales, Son.",
    usAddress: "101 N Dual Hwy, Nogales, AZ 85621",
    corridor: "nogales",
    coordinates: { lat: 31.3359, lng: -110.9408 },
    country: "US",
  },
  {
    id: "nogales-decongestion",
    name: "Nogales DeCongestion",
    mexicanCity: "Nogales",
    usCity: "Nogales",
    mexicanState: "Sonora",
    usState: "Arizona",
    mexicanAddress: "Av. Adolfo López Mateos s/n, Col. Centro, 84000 Nogales, Son.",
    usAddress: "450 N Dual Hwy, Nogales, AZ 85621",
    corridor: "nogales",
    coordinates: { lat: 31.3442, lng: -110.9392 },
    country: "US",
  },
  {
    id: "san-luis",
    name: "San Luis",
    mexicanCity: "San Luis Río Colorado",
    usCity: "San Luis",
    mexicanState: "Sonora",
    usState: "Arizona",
    mexicanAddress: "Av. Sonora s/n, Col. Centro, 83400 San Luis R.C., Son.",
    usAddress: "1450 S 1st Ave, San Luis, AZ 85349",
    corridor: "san-luis",
    coordinates: { lat: 32.4863, lng: -114.7817 },
    country: "US",
  },

  // Texas Corridor
  {
    id: "el-paso-ysleta",
    name: "Ysleta",
    mexicanCity: "Ciudad Juárez",
    usCity: "El Paso",
    mexicanState: "Chihuahua",
    usState: "Texas",
    mexicanAddress: "Av. Carlos Juárez s/n, Col. Centro, 32000 Ciudad Juárez, Chih.",
    usAddress: "11500 Alameda Ave, El Paso, TX 79925",
    corridor: "el-paso-juarez",
    coordinates: { lat: 31.7533, lng: -106.3172 },
    country: "US",
  },
  {
    id: "el-paso-stanton",
    name: "Stanton",
    mexicanCity: "Ciudad Juárez",
    usCity: "El Paso",
    mexicanState: "Chihuahua",
    usState: "Texas",
    mexicanAddress: "Av. Lincoln s/n, Col. Centro, 32000 Ciudad Juárez, Chih.",
    usAddress: "1110 S Stanton St, El Paso, TX 79901",
    corridor: "el-paso-juarez",
    coordinates: { lat: 31.7683, lng: -106.4247 },
    country: "US",
  },
  {
    id: "el-paso-bridge-of-americas",
    name: "Bridge of the Americas",
    mexicanCity: "Ciudad Juárez",
    usCity: "El Paso",
    mexicanState: "Chihuahua",
    usState: "Texas",
    mexicanAddress: "Av. de las Américas s/n, Col. Centro, 32000 Ciudad Juárez, Chih.",
    usAddress: "1601 Delta Dr, El Paso, TX 79901",
    corridor: "el-paso-juarez",
    coordinates: { lat: 31.7683, lng: -106.4503 },
    country: "US",
  },
  {
    id: "laredo-north",
    name: "Laredo North",
    mexicanCity: "Nuevo Laredo",
    usCity: "Laredo",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Av. Fidel Velázquez s/n, Col. Centro, 88000 Nuevo Laredo, Tamps.",
    usAddress: "1000 Bob Bullock Loop, Laredo, TX 78045",
    corridor: "laredo-nuevo-laredo",
    coordinates: { lat: 27.5064, lng: -99.5076 },
    country: "US",
  },
  {
    id: "hidalgo",
    name: "Hidalgo",
    mexicanCity: "Reynosa",
    usCity: "Hidalgo",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Av. Cuauhtémoc s/n, Col. Centro, 88000 Reynosa, Tamps.",
    usAddress: "1112 International Blvd, Hidalgo, TX 78557",
    corridor: "reynosa-hidalgo",
    coordinates: { lat: 26.2644, lng: -98.2647 },
    country: "US",
  },
  {
    id: "brownsville",
    name: "Brownsville",
    mexicanCity: "Matamoros",
    usCity: "Brownsville",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Av. 5 de Mayo s/n, Col. Centro, 88000 Matamoros, Tamps.",
    usAddress: "1 Zapata Dr, Brownsville, TX 78521",
    corridor: "matamoros-brownsville",
    coordinates: { lat: 25.8624, lng: -97.5069 },
    country: "US",
  },
];

export interface BorderCity {
  name: string;
  country: "MX" | "US";
  corridor: BorderCorridor;
  coordinates: { lat: number; lng: number };
}

export const BORDER_CITIES_MX: BorderCity[] = [
  { name: "Tijuana", country: "MX", corridor: "tijuana-san-diego", coordinates: { lat: 32.5149, lng: -117.0382 } },
  { name: "Tecate", country: "MX", corridor: "tijuana-san-diego", coordinates: { lat: 32.5694, lng: -116.6333 } },
  { name: "Mexicali", country: "MX", corridor: "mexicali-calexico", coordinates: { lat: 32.6275, lng: -115.4844 } },
  { name: "Ensenada", country: "MX", corridor: "tijuana-san-diego", coordinates: { lat: 31.8667, lng: -116.6006 } },
  { name: "Rosarito", country: "MX", corridor: "tijuana-san-diego", coordinates: { lat: 32.3595, lng: -117.0464 } },
  { name: "Nogales", country: "MX", corridor: "nogales", coordinates: { lat: 31.2959, lng: -110.9392 } },
  { name: "San Luis Río Colorado", country: "MX", corridor: "san-luis", coordinates: { lat: 32.4863, lng: -114.7817 } },
  { name: "Ciudad Juárez", country: "MX", corridor: "el-paso-juarez", coordinates: { lat: 31.6904, lng: -106.4245 } },
  { name: "Nuevo Laredo", country: "MX", corridor: "laredo-nuevo-laredo", coordinates: { lat: 27.4757, lng: -99.5213 } },
  { name: "Reynosa", country: "MX", corridor: "reynosa-hidalgo", coordinates: { lat: 26.0928, lng: -98.2770 } },
  { name: "Matamoros", country: "MX", corridor: "matamoros-brownsville", coordinates: { lat: 25.8694, lng: -97.5034 } },
];

export const BORDER_CITIES_US: BorderCity[] = [
  { name: "San Diego", country: "US", corridor: "tijuana-san-diego", coordinates: { lat: 32.7157, lng: -117.1611 } },
  { name: "Chula Vista", country: "US", corridor: "tijuana-san-diego", coordinates: { lat: 32.6401, lng: -117.0842 } },
  { name: "Calexico", country: "US", corridor: "mexicali-calexico", coordinates: { lat: 32.6789, lng: -115.4989 } },
  { name: "Nogales", country: "US", corridor: "nogales", coordinates: { lat: 31.3404, lng: -110.9383 } },
  { name: "San Luis", country: "US", corridor: "san-luis", coordinates: { lat: 32.4870, lng: -114.7822 } },
  { name: "El Paso", country: "US", corridor: "el-paso-juarez", coordinates: { lat: 31.7619, lng: -106.4850 } },
  { name: "Laredo", country: "US", corridor: "laredo-nuevo-laredo", coordinates: { lat: 27.5064, lng: -99.5076 } },
  { name: "Hidalgo", country: "US", corridor: "reynosa-hidalgo", coordinates: { lat: 26.2644, lng: -98.2647 } },
  { name: "Brownsville", country: "US", corridor: "matamoros-brownsville", coordinates: { lat: 25.9261, lng: -97.4973 } },
];

export function getBorderCitiesForDirection(direction: BorderDirection): BorderCity[] {
  return direction === "MX_TO_US" ? BORDER_CITIES_MX : BORDER_CITIES_US;
}

export function getCrossingsForDirection(direction: BorderDirection): BorderCrossing[] {
  return BORDER_CROSSINGS;
}

export function findNearestCrossing(
  lat: number,
  lng: number
): BorderCrossing | null {
  let nearest: BorderCrossing | null = null;
  let minDist = Infinity;

  for (const crossing of BORDER_CROSSINGS) {
    const dist = haversineDistance(
      { lat, lng },
      crossing.coordinates
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = crossing;
    }
  }

  return nearest;
}

export function isNearBorder(
  lat: number,
  lng: number,
  thresholdKm: number = 100
): boolean {
  const nearest = findNearestCrossing(lat, lng);
  if (!nearest) return false;
  return haversineDistance({ lat, lng }, nearest.coordinates) <= thresholdKm;
}

/** Determine which country a point is in based on nearest border crossing */
export function detectCountryFromLocation(
  lat: number,
  lng: number
): "MX" | "US" | null {
  const nearest = findNearestCrossing(lat, lng);
  if (!nearest) return null;

  const dist = haversineDistance({ lat, lng }, nearest.coordinates);
  if (dist > 200) return null;

  // If closer to the Mexican city side → US (they're in MX heading to US)
  // If closer to the US city side → MX (they're in US heading to MX)
  const mxCity = BORDER_CITIES_MX.find(
    (c) => c.name === nearest.mexicanCity
  );
  const usCity = BORDER_CITIES_US.find(
    (c) => c.name === nearest.usCity
  );

  if (!mxCity || !usCity) return null;

  const distToMx = haversineDistance({ lat, lng }, mxCity.coordinates);
  const distToUs = haversineDistance({ lat, lng }, usCity.coordinates);

  // Closer to MX city → they're in MX, heading to US
  // Closer to US city → they're in US, heading to MX
  return distToMx < distToUs ? "US" : "MX";
}

/** Get destination cities (the OTHER side) given an origin country */
export function getDestinationCities(
  originCountry: "MX" | "US"
): BorderCity[] {
  return originCountry === "MX" ? BORDER_CITIES_US : BORDER_CITIES_MX;
}

/** Get origin cities (same side as the user) */
export function getOriginCities(
  userCountry: "MX" | "US"
): BorderCity[] {
  return userCountry === "MX" ? BORDER_CITIES_MX : BORDER_CITIES_US;
}

/** Find matching crossings between two border cities */
export function findCrossingsBetween(
  originName: string,
  destinationName: string
): BorderCrossing[] {
  const direct = BORDER_CROSSINGS.filter(
    (c) =>
      (c.mexicanCity === originName && c.usCity === destinationName) ||
      (c.usCity === originName && c.mexicanCity === destinationName)
  );

  if (direct.length > 0) return direct;

  // Fallback: find crossings in the same corridor as origin or destination
  const originCity = [...BORDER_CITIES_MX, ...BORDER_CITIES_US].find(
    (c) => c.name === originName
  );
  const destCity = [...BORDER_CITIES_MX, ...BORDER_CITIES_US].find(
    (c) => c.name === destinationName
  );

  const corridor = originCity?.corridor ?? destCity?.corridor;
  if (corridor) {
    return BORDER_CROSSINGS.filter((c) => c.corridor === corridor);
  }

  // Last resort: return top 3 crossings sorted by distance to destination
  if (destCity) {
    return [...BORDER_CROSSINGS]
      .sort(
        (a, b) =>
          haversineDistance(a.coordinates, destCity.coordinates) -
          haversineDistance(b.coordinates, destCity.coordinates)
      )
      .slice(0, 3);
  }

  return [];
}

/** Get corridor display label */
export function getCorridorLabel(corridor: BorderCorridor): string {
  const labels: Record<BorderCorridor, string> = {
    "tijuana-san-diego": "Tijuana / San Diego",
    "mexicali-calexico": "Mexicali / Calexico",
    nogales: "Nogales",
    "san-luis": "San Luis",
    "el-paso-juarez": "El Paso / Ciudad Juárez",
    "laredo-nuevo-laredo": "Laredo / Nuevo Laredo",
    "reynosa-hidalgo": "Reynosa / Hidalgo",
    "matamoros-brownsville": "Matamoros / Brownsville",
  };
  return labels[corridor] ?? corridor;
}

/** Group cities by corridor */
export function groupCitiesByCorridor(
  cities: BorderCity[]
): Array<{ corridor: BorderCorridor; label: string; cities: BorderCity[] }> {
  const grouped = new Map<BorderCorridor, BorderCity[]>();
  for (const city of cities) {
    const existing = grouped.get(city.corridor) ?? [];
    existing.push(city);
    grouped.set(city.corridor, existing);
  }

  return Array.from(grouped.entries())
    .map(([corridor, c]) => ({
      corridor,
      label: getCorridorLabel(corridor),
      cities: c,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Find the nearest border city to a coordinate */
export function findNearestBorderCity(
  lat: number,
  lng: number
): BorderCity | null {
  const allCities = [...BORDER_CITIES_MX, ...BORDER_CITIES_US];
  let nearest: BorderCity | null = null;
  let minDist = Infinity;

  for (const city of allCities) {
    const dist = haversineDistance({ lat, lng }, city.coordinates);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }

  // If nearest city is more than 200km away, not useful
  if (minDist > 200) return null;

  return nearest;
}

export function haversineDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinHalfLat = Math.sin(dLat / 2);
  const sinHalfLng = Math.sin(dLng / 2);
  const h =
    sinHalfLat * sinHalfLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinHalfLng * sinHalfLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ─── New Trip Intelligence Functions ───

/** Determine if a trip crosses the US-MX border */
export function detectTripType(
  start: Place,
  destination: Place
): TripType {
  if (start.country === destination.country) {
    return "same_country";
  }

  const validDirections = [
    { from: "MX", to: "US" },
    { from: "US", to: "MX" },
  ];

  const isValid = validDirections.some(
    (d) => start.country === d.from && destination.country === d.to
  );

  return isValid ? "cross_border" : "unsupported";
}

/** Derive border direction from start and destination */
export function deriveDirection(
  start: Place,
  destination: Place
): TripDirection | null {
  if (start.country === "MX" && destination.country === "US") {
    return "MX_TO_US";
  }
  if (start.country === "US" && destination.country === "MX") {
    return "US_TO_MX";
  }
  return null;
}

/** Find candidate crossings based on route geography */
export function findCandidateCrossings(
  start: Place,
  destination: Place,
  direction: TripDirection
): BorderCrossing[] {
  const routeMidpoint = {
    lat: (start.latitude + destination.latitude) / 2,
    lng: (start.longitude + destination.longitude) / 2,
  };

  const withDistance = BORDER_CROSSINGS.map((crossing) => ({
    crossing,
    distanceToRoute:
      haversineDistance(crossing.coordinates, routeMidpoint) +
      haversineDistance(crossing.coordinates, { lat: start.latitude, lng: start.longitude }) * 0.3 +
      haversineDistance(crossing.coordinates, { lat: destination.latitude, lng: destination.longitude }) * 0.3,
  }));

  withDistance.sort((a, b) => a.distanceToRoute - b.distanceToRoute);

  return withDistance.slice(0, 5).map((item) => item.crossing);
}
