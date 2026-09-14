/**
 * S1 — Coordinate validation for API routes.
 *
 * Precise user coordinates arrive in URL query strings (server/CDN logs,
 * history, Referer). Minimum duty: reject garbage fast with 400 instead of
 * letting NaN or null-island (0,0) poison ranking and echo back.
 */

export class InvalidCoordinatesError extends Error {
  constructor(detail: string) {
    super(`Invalid coordinates: ${detail}`);
    this.name = "InvalidCoordinatesError";
  }
}

/**
 * Parse an optional latitude. Absent/empty → undefined (caller decides
 * whether coordinates are required). Present but non-finite or out of
 * [-90, 90] → throws InvalidCoordinatesError.
 */
export function parseLatitude(raw: string | null | undefined): number | undefined {
  if (raw === null || raw === undefined || raw === "") return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < -90 || n > 90) {
    throw new InvalidCoordinatesError(`latitude ${JSON.stringify(raw)} out of range [-90, 90]`);
  }
  return n;
}

/** Same for longitude, range [-180, 180]. */
export function parseLongitude(raw: string | null | undefined): number | undefined {
  if (raw === null || raw === undefined || raw === "") return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < -180 || n > 180) {
    throw new InvalidCoordinatesError(`longitude ${JSON.stringify(raw)} out of range [-180, 180]`);
  }
  return n;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * All-or-nothing pair validation. Returns undefined when both absent.
 * Throws when only one side is present or either is invalid.
 */
export function parseLatLngPair(
  latRaw: string | null | undefined,
  lngRaw: string | null | undefined
): LatLng | undefined {
  const lat = parseLatitude(latRaw);
  const lng = parseLongitude(lngRaw);
  if ((lat === undefined) !== (lng === undefined)) {
    throw new InvalidCoordinatesError("latitude and longitude must be provided together");
  }
  if (lat === undefined || lng === undefined) return undefined;
  return { lat, lng };
}

/** Map validation failures to a 400 JSON shape (re-throws anything else). */
export function isInvalidCoordinatesError(error: unknown): error is InvalidCoordinatesError {
  return error instanceof InvalidCoordinatesError;
}
