import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  parseLatitude,
  parseLongitude,
  isInvalidCoordinatesError,
} from "@/lib/coord-validation";

/**
 * S2 — Same-origin reverse-geocode proxy.
 *
 * Precise GPS fixes must not travel browser→Mapbox. Coordinates are
 * validated (400 on garbage) and the token stays server-side.
 *
 * GET /api/reverse?lat=&lng= → { place: Place | null }
 */
export async function GET(request: NextRequest) {
  try {
    const token =
      process.env.MAPBOX_TOKEN ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? null;
    if (!token) {
      return NextResponse.json(
        { error: "Geocoding unavailable: MAPBOX_TOKEN not configured" },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    let lat: number | undefined;
    let lng: number | undefined;
    try {
      lat = parseLatitude(searchParams.get("lat"));
      lng = parseLongitude(searchParams.get("lng"));
    } catch (error) {
      if (isInvalidCoordinatesError(error)) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }
    if (lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: "Invalid coordinates: lat and lng are required together" },
        { status: 400 }
      );
    }

    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
      `?access_token=${token}&country=mx,us&types=place,region&language=es&limit=1`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox reverse geocoding: ${response.status}`);
    }
    const data = await response.json();
    const f = Array.isArray(data.features) ? data.features[0] : null;
    if (!f) {
      return NextResponse.json({ place: null });
    }

    const placeName: string = f.place_name || "";
    const parts = placeName.split(",").map((s: string) => s.trim());
    const shortCode: string | undefined = f.properties?.short_code;
    const country = shortCode?.toUpperCase() === "US" ? "US" : "MX";

    return NextResponse.json(
      {
        place: {
          id: String(f.id ?? placeName),
          name: parts[0] || placeName,
          formattedAddress: placeName,
          latitude: Array.isArray(f.center) ? f.center[1] ?? null : null,
          longitude: Array.isArray(f.center) ? f.center[0] ?? null : null,
          country,
          countryCode: country,
          city: parts[0] || undefined,
          region: parts[1] || undefined,
        },
      },
      { headers: { "Cache-Control": "public, max-age=300" } }
    );
  } catch (error) {
    console.error("Reverse proxy error:", error);
    return NextResponse.json({ error: "Failed to reverse geocode" }, { status: 500 });
  }
}
