import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * S2 — Same-origin geocoding proxy.
 *
 * Search keystrokes and place queries must not go browser→Mapbox with an
 * embedded public token. This route holds the token server-side and returns
 * slimmed results (no raw Mapbox feature dump).
 *
 * Token resolution: MAPBOX_TOKEN (server-only, preferred) with transitional
 * fallback to NEXT_PUBLIC_MAPBOX_TOKEN. Set MAPBOX_TOKEN in Vercel env.
 */

function serverToken(): string | null {
  return (
    process.env.MAPBOX_TOKEN ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? null
  );
}

function countryParam(country: string | null): string {
  const c = (country ?? "").toUpperCase();
  return c === "MX" || c === "US" ? c.toLowerCase() : "mx,us";
}

/**
 * GET /api/places?query=&country=&limit=
 * country: MX | US | null (both). limit clamped 1..10.
 */
export async function GET(request: NextRequest) {
  try {
    const token = serverToken();
    if (!token) {
      return NextResponse.json(
        { error: "Geocoding unavailable: MAPBOX_TOKEN not configured" },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query = (searchParams.get("query") ?? "").trim();
    if (query.length < 2) {
      return NextResponse.json({ places: [] });
    }
    if (query.length > 100) {
      return NextResponse.json(
        { error: "Invalid query: maximum 100 characters" },
        { status: 400 }
      );
    }
    const limitRaw = Number(searchParams.get("limit") ?? "5");
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 10) : 5;

    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json` +
      `?access_token=${token}&country=${countryParam(searchParams.get("country"))}` +
      `&types=place,region&language=es&limit=${limit}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox geocoding: ${response.status}`);
    }
    const data = await response.json();
    const features = Array.isArray(data.features) ? data.features : [];

    // Debug trail (token never logged): what Mapbox returned vs what we kept.
    const debug = process.env.CRUZE_DEBUG_SEARCH === "1";
    if (debug) {
      console.log(
        `[search-debug] q=${JSON.stringify(query)} country=${searchParams.get("country") ?? "mx,us"} ` +
          `limit=${limit} mapbox_hits=${features.length}`
      );
    }

    // Country comes from Mapbox's own context chain — never a bare default.
    // Order: context country short_code → properties.short_code → the
    // requested single-country filter (actual request data, not inference).
    const requestedSingle = (() => {
      const c = countryParam(searchParams.get("country"));
      return c === "mx" ? "MX" : c === "us" ? "US" : null;
    })();

    const NON_MAINLAND_US = new Set([
      "US-AK",
      "US-HI",
      "US-PR",
      "US-GU",
      "US-VI",
      "US-MP",
      "US-AS",
      "US-UM",
    ]);

    // Slimmed contract — clients never see raw Mapbox features.
    const places = [];
    for (const f of features) {
      const placeName: string = f.place_name || "";
      const parts = placeName.split(",").map((s: string) => s.trim());
      const context: Array<{ id?: string; short_code?: string }> = Array.isArray(
        f.context
      )
        ? f.context
        : [];
      const countryCtx = context.find((c) => c.id?.startsWith("country."));
      const regionCtx = context.find((c) => c.id?.startsWith("region."));
      // State-level features (e.g. Alaska) carry the region code in
      // properties instead of context — check both.
      const propCode = f.properties?.short_code?.toUpperCase() ?? null;
      const regionCode = regionCtx?.short_code?.toUpperCase() ?? null;
      const regionLike = regionCode ?? (propCode && propCode.includes("-") ? propCode : null);

      // Non-mainland US regions (Alaska, Hawaii, territories) are out of
      // scope for a border-crossing app — drop them server-side.
      if (regionLike && NON_MAINLAND_US.has(regionLike)) {
        if (debug) console.log(`[search-debug] DROP non-mainland (${regionLike}): ${placeName}`);
        continue;
      }

      const countryCode =
        countryCtx?.short_code?.toUpperCase() ??
        f.properties?.short_code?.toUpperCase() ??
        null;
      const country =
        countryCode === "US" ? "US" : countryCode === "MX" ? "MX" : requestedSingle;
      if (!country) {
        if (debug) console.log(`[search-debug] DROP no-country: ${placeName}`);
        continue;
      }
      if (debug) {
        console.log(`[search-debug] KEEP ${country}${regionCode ? `/${regionCode}` : ""}: ${placeName}`);
      }

      places.push({
        id: String(f.id ?? placeName),
        name: parts[0] || placeName,
        formattedAddress: placeName,
        latitude: Array.isArray(f.center) ? f.center[1] ?? null : null,
        longitude: Array.isArray(f.center) ? f.center[0] ?? null : null,
        country,
        countryCode: country,
        city: parts[0] || undefined,
        region: parts[1] || undefined,
      });
    }

    if (debug) {
      console.log(`[search-debug] responding places=${places.length}`);
    }
    return NextResponse.json(
      { places },
      { headers: { "Cache-Control": "public, max-age=300" } }
    );
  } catch (error) {
    console.error("Places proxy error:", error);
    return NextResponse.json({ error: "Failed to search places" }, { status: 500 });
  }
}
