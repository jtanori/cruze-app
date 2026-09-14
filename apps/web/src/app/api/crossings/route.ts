/*── CROSSINGS API ROUTE HANDLER ───────────────────────────────────────────╭
  Purpose: Next.js route handler for crossing data
 ──────────────────────────────────────────────────────────────────────────╯

  IMPLEMENTATION NOTES:
  - CBP API: https://bwt.cbp.gov/api/waittimes (free, no key required)
  - Covers 55+ US-Mexico crossings
   - 5min cache for production, 30s for development
  - Single source: border-data.ts (42 ports) + border-data-service.ts (live CBP merge, no inline mock)
  - Route: GET /api/crossings (W7 §34: scope/mode/status/search/sort/direction/cursor/limit/lat/lng)
  - Route: GET /api/crossings/[id] for single crossing detail

  DATA TRANSFORMATION:
  - CBP response → CrossingEntity format
  - Lane data → LaneQueueData format
  - Historical profile → hourly wait time series
  - Status mapping: OPEN/LIMITED/CLOSED

  CACHE STRATEGY:
  - Development: 30s revalidation
  - Production: 5min revalidation with tag-based invalidation
──────────────────────────────────────────────────────────────────────────*/
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// GET /api/crossings - W7 §34 query contract. Thin: fetch live data,
// adapt, delegate filter/rank/sort/paginate to lib/crossings-query.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // S1: reject blatantly invalid coordinates up front instead of letting
    // them skew distance ranking (parseCrossingsQuery stays lenient by design).
    const { parseLatLngPair, isInvalidCoordinatesError } = await import(
      "@/lib/coord-validation"
    );
    try {
      parseLatLngPair(searchParams.get("lat"), searchParams.get("lng"));
    } catch (error) {
      if (isInvalidCoordinatesError(error)) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }
    const { parseCrossingsQuery, applyCrossingsQuery } = await import(
      "@/lib/crossings-query"
    );
    const query = parseCrossingsQuery(searchParams);

    const { getMergedCrossingsData } = await import("@/lib/border-data-service");
    const mergedCrossings = await getMergedCrossingsData();
    const northbound = query.direction === "MX_TO_US";
    const rankable = mergedCrossings.map((c) => ({
      id: c.id,
      name: c.name,
      mexicanCity: c.mexicanCity,
      usCity: c.usCity,
      status: northbound ? c.statusNorthbound : c.statusSouthbound,
      waitTime: northbound ? c.waitTimeNorthbound : c.waitTimeSouthbound,
      lastUpdated: c.lastUpdated,
      laneCategories: (northbound ? c.lanesNorthbound : c.lanesSouthbound).map(
        (l) => l.category
      ),
      coordinates: c.coordinates,
      // Both sides for directory rows + compat payload.
      waitTimeNorthbound: c.waitTimeNorthbound,
      waitTimeSouthbound: c.waitTimeSouthbound,
      statusNorthbound: c.statusNorthbound,
      statusSouthbound: c.statusSouthbound,
      isLive: c.isLive,
      hours: c.hours,
      cityOrigin: c.mexicanCity,
      cityDestination: c.usCity,
      direction: query.direction,
      is24Hours: true,
      operatingHoursText: c.hours,
      lanes: northbound ? c.lanesNorthbound : c.lanesSouthbound,
      dominantWaitMinutes: northbound ? c.waitTimeNorthbound : c.waitTimeSouthbound,
      typicalWaitMinutes: northbound ? c.waitTimeNorthbound : c.waitTimeSouthbound,
    }));
    const result = applyCrossingsQuery(rankable, query);
    return NextResponse.json({
      crossings: result.items,
      total: result.total,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      scope: result.scope,
      cacheTtl: 300,
      isLive: result.items.some((c) => c.isLive),
    });
  } catch (error) {
    console.error("CBP API error:", error);
    return NextResponse.json(
      { crossings: [], total: 0, nextCursor: null, hasMore: false, error: "Failed to fetch crossings" },
      { status: 500 }
    );
  }
}
