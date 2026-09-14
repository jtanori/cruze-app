import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  parseLatitude,
  parseLongitude,
  isInvalidCoordinatesError,
} from "@/lib/coord-validation";

/**
 * S2 — Same-origin directions proxy.
 *
 * Origin + destination coordinates must not travel browser→Mapbox.
 * Returns GeoJSON coordinates only (no steps, no metadata).
 *
 * GET /api/directions?start=lng,lat&end=lng,lat → { coordinates: [lng,lat][] }
 */
function parsePair(raw: string | null): { lng: number; lat: number } | undefined {
  if (!raw) return undefined;
  const [lngRaw, latRaw] = raw.split(",");
  const lng = parseLongitude(lngRaw?.trim());
  const lat = parseLatitude(latRaw?.trim());
  if (lng === undefined || lat === undefined) return undefined;
  return { lng, lat };
}

export async function GET(request: NextRequest) {
  try {
    const token =
      process.env.MAPBOX_TOKEN ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? null;
    if (!token) {
      return NextResponse.json(
        { error: "Directions unavailable: MAPBOX_TOKEN not configured" },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    let start;
    let end;
    try {
      start = parsePair(searchParams.get("start"));
      end = parsePair(searchParams.get("end"));
    } catch (error) {
      if (isInvalidCoordinatesError(error)) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }
    if (!start || !end) {
      return NextResponse.json(
        { error: "Invalid coordinates: start and end as lng,lat are required" },
        { status: 400 }
      );
    }

    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/` +
      `${start.lng},${start.lat};${end.lng},${end.lat}` +
      `?geometries=geojson&access_token=${token}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox directions: ${response.status}`);
    }
    const data = await response.json();
    const coordinates =
      data.routes?.[0]?.geometry?.coordinates ??
      [[start.lng, start.lat], [end.lng, end.lat]];

    return NextResponse.json({ coordinates });
  } catch (error) {
    console.error("Directions proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch directions" }, { status: 500 });
  }
}
