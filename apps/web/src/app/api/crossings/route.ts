/*── CROSSINGS API ROUTE HANDLER ───────────────────────────────────────────╭
  Purpose: Next.js route handler for crossing data
 ──────────────────────────────────────────────────────────────────────────╯

  IMPLEMENTATION NOTES:
  - CBP API: https://bwt.cbp.gov/api/waittimes (free, no key required)
  - Covers 55+ US-Mexico crossings
   - 5min cache for production, 30s for development
  - Single source: border-data.ts (42 ports) + border-data-service.ts (live CBP merge, no inline mock)
  - Route: GET /api/crossings?direction=MX_TO_US
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

// GET /api/crossings - List crossings with live CBP data via border-data-service (42 ports, no mock)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const direction = (searchParams.get("direction") as "MX_TO_US" | "US_TO_MX" | undefined) ?? "MX_TO_US";
    const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : undefined;
    const lng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : undefined;

    const { getCrossingsWithLiveData } = await import("@/lib/border-data-service");
    const liveCrossings = await getCrossingsWithLiveData(direction);
    let crossings: any[] = liveCrossings.map((c) => ({
      id: c.id,
      name: c.name,
      cityOrigin: c.mexicanCity,
      cityDestination: c.usCity,
      direction,
      status: c.status,
      is24Hours: true,
      operatingHoursText: c.hours,
      waitTime: c.waitTime,
      isLive: c.isLive,
      lastUpdated: c.lastUpdated,
      coordinates: c.coordinates,
      lanes: c.lanes,
      dominantWaitMinutes: c.waitTime,
      typicalWaitMinutes: c.waitTime,
    }));
    if (lat !== undefined && lng !== undefined) {
      const { haversineDistance } = await import("@/lib/border-data");
      crossings = crossings
        .map((c: any) => ({ ...c, distanceKm: haversineDistance({ lat, lng }, c.coordinates) }))
        .sort((a: any, b: any) => a.distanceKm - b.distanceKm);
    } else {
      const statusOrder: Record<string, number> = { OPEN: 0, LIMITED: 1, CLOSED: 2 };
      crossings.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));
    }
    return NextResponse.json({ crossings, cacheTtl: 300, isLive: crossings.some((c: any) => c.isLive) });
  } catch (error) {
    console.error("CBP API error:", error);
    return NextResponse.json({ crossings: [], error: "Failed to fetch crossings" }, { status: 500 });
  }
}

// GET /api/crossings/[id] - Single crossing detail (live, via border-data-service)
async function GET_DETAIL(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { getCrossingWithLiveData } = await import("@/lib/border-data-service");
    const crossing = await getCrossingWithLiveData(params.id);
    if (!crossing) {
      return NextResponse.json({ error: "Crossing not found" }, { status: 404 });
    }
    return NextResponse.json({ crossing, cacheTtl: 300 });
  } catch (error) {
    console.error("Error fetching crossing:", error);
    return NextResponse.json({ error: "Failed to fetch crossing detail" }, { status: 500 });
  }
}