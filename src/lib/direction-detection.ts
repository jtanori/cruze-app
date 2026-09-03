import type { TripDirection } from "./trip-setup-flow";

interface LatLng {
  lat: number;
  lng: number;
}

// Border latitudes - crossings sit around 31-32N
const BORDER_LAT_NORTH = 32.5;
const BORDER_LAT_SOUTH = 31.0;

export function detectDirection(
  origin: LatLng,
  destination: LatLng
): TripDirection {
  const originIsNorth = origin.lat > BORDER_LAT_NORTH;
  const originIsSouth = origin.lat < BORDER_LAT_SOUTH;
  const destIsNorth = destination.lat > BORDER_LAT_NORTH;
  const destIsSouth = destination.lat < BORDER_LAT_SOUTH;

  // Clear northbound: south -> north
  if (originIsSouth && destIsNorth) return "northbound";
  // Clear southbound: north -> south
  if (originIsNorth && destIsSouth) return "southbound";

  // Fallback to simple lat comparison if near border
  if (destination.lat > origin.lat + 0.5) return "northbound";
  if (origin.lat > destination.lat + 0.5) return "southbound";

  return "unknown";
}

export function needsDirectionConfirmation(
  origin: LatLng,
  destination: LatLng
): boolean {
  return detectDirection(origin, destination) === "unknown";
}
