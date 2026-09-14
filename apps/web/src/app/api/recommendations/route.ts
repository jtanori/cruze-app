import { NextRequest, NextResponse } from "next/server";
import { getCrossingsWithLiveData, type CrossingWithLiveData } from "@/lib/border-data-service";
import { findCandidateCrossings } from "@/lib/border-data";
import type { Place } from "@/types";

interface RankedCrossing extends CrossingWithLiveData {
  totalJourneyTime: number;
  score: number;
  reasonCode: string;
  reasonData: Record<string, string | number>;
}

/** Filter crossings by travel mode eligibility */
function isEligibleForTravelMode(
  crossing: CrossingWithLiveData,
  travelMode: string | null,
): boolean {
  if (!travelMode) return true;
  if (travelMode === "walking") {
    return crossing.lanes.some((l) => l.category === "pedestrian" && l.isOpen);
  }
  if (travelMode === "commercial") {
    return crossing.lanes.some((l) => l.category === "commercial" && l.isOpen);
  }
  // privateVehicle — must have at least one open passenger lane
  return crossing.lanes.some((l) => l.category === "passenger" && l.isOpen);
}

/** Filter crossings by access type compatibility */
function isAccessCompatible(
  crossing: CrossingWithLiveData,
  accessType: string | null,
): boolean {
  if (!accessType || accessType === "unknown") return true;
  if (accessType === "sentri") {
    // SENTRI users can use any lane, but prefer SENTRI-equipped crossings
    return true;
  }
  if (accessType === "readyLane") {
    // Ready Lane users can use standard + Ready Lane
    return true;
  }
  // standard — can use any open lane
  return true;
}

/** Check if crossing has SENTRI lanes */
function hasSentryLanes(crossing: CrossingWithLiveData): boolean {
  return crossing.lanes.some((l) => l.name.toLowerCase().includes("sentri") && l.isOpen);
}

/** Check if crossing has Ready Lane */
function hasReadyLane(crossing: CrossingWithLiveData): boolean {
  return crossing.lanes.some((l) => l.name.toLowerCase().includes("ready") && l.isOpen);
}

/** Rank crossings and generate structured reasons */
function rankCrossings(
  candidates: CrossingWithLiveData[],
  travelMode: string | null,
  accessType: string | null,
): RankedCrossing[] {
  const eligible = candidates.filter((c) => {
    if (c.status === "CLOSED") return false;
    if (!isEligibleForTravelMode(c, travelMode)) return false;
    if (!isAccessCompatible(c, accessType)) return false;
    return true;
  });

  // If no eligible crossings, fall back to closed ones (user should know)
  const pool = eligible.length > 0 ? eligible : candidates.filter((c) => c.status !== "CLOSED");
  if (pool.length === 0) return candidates.slice(0, 3).map((c) => ({
    ...c,
    totalJourneyTime: c.waitTime + 30,
    score: 0,
    reasonCode: "only_option",
    reasonData: {},
  }));

  return pool
    .map((c) => {
      const totalJourneyTime = c.waitTime + 30; // approach estimate
      let score = 100 - c.waitTime; // base: lower wait = higher score
      let reasonCode = "fastest_total_time";
      const reasonData: Record<string, string | number> = {
        deltaMinutes: 0,
      };

      // Access type bonus
      if (accessType === "sentri" && hasSentryLanes(c)) {
        score += 15;
        reasonCode = "best_access_match";
        reasonData.accessType = "sentri";
      } else if (accessType === "readyLane" && hasReadyLane(c)) {
        score += 10;
        reasonCode = "best_access_match";
        reasonData.accessType = "readyLane";
      }

      // Live data confidence bonus
      if (c.isLive) {
        score += 5;
      }

      return {
        ...c,
        totalJourneyTime,
        score,
        reasonCode,
        reasonData,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const originLat = searchParams.get("originLat");
  const originLng = searchParams.get("originLng");
  const destLat = searchParams.get("destLat");
  const destLng = searchParams.get("destLng");
  const origin = searchParams.get("origin") ?? "Tijuana";
  const destination = searchParams.get("destination") ?? "San Diego";
  const clientDirection = searchParams.get("direction");
  const travelMode = searchParams.get("travelMode");
  const accessType = searchParams.get("accessType");
  const documentProfile = searchParams.get("documentProfile");

  try {
    // S1: strict coordinate validation — NaN and null-island values must
    // 400, never poison ranking or echo back into context.
    const { parseLatLngPair, isInvalidCoordinatesError } = await import(
      "@/lib/coord-validation"
    );
    let originCoords;
    let destCoords;
    try {
      originCoords = parseLatLngPair(originLat, originLng);
      destCoords = parseLatLngPair(destLat, destLng);
    } catch (error) {
      if (isInvalidCoordinatesError(error)) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }
    if ((originCoords === undefined) !== (destCoords === undefined)) {
      return NextResponse.json(
        { error: "Invalid coordinates: origin and destination are required together" },
        { status: 400 }
      );
    }
    if (originCoords && destCoords) {
      const start: Place = {
        id: "origin",
        name: origin,
        latitude: originCoords.lat,
        longitude: originCoords.lng,
        country: "MX",
        formattedAddress: origin,
      } as Place;
      const dest: Place = {
        id: "destination",
        name: destination,
        latitude: destCoords.lat,
        longitude: destCoords.lng,
        country: "US",
        formattedAddress: destination,
      } as Place;

      const direction = clientDirection ?? (start.country === "MX" && dest.country === "US" ? "MX_TO_US" : "US_TO_MX");

      const candidates = findCandidateCrossings(start, dest, direction as any);
      const liveData = await getCrossingsWithLiveData(direction as any);
      const liveById = new Map(liveData.map((c) => [c.id, c]));

      const enriched = candidates
        .map((c) => liveById.get(c.id))
        .filter((c): c is CrossingWithLiveData => c !== undefined);

      const ranked = rankCrossings(enriched, travelMode, accessType);

      if (ranked.length === 0) {
        return NextResponse.json({ error: "No crossings found" }, { status: 404 });
      }

      const primary = ranked[0];
      const alternatives = ranked.slice(1, 3).map((r) => ({
        crossingId: r.id,
        crossingName: r.name,
        mexicanCity: r.mexicanCity,
        usCity: r.usCity,
        coordinates: r.coordinates,
        waitTime: r.waitTime,
        totalJourneyTime: r.totalJourneyTime,
        deltaMinutes: r.waitTime - primary.waitTime,
        status: r.status.toLowerCase() as "open" | "limited" | "closed",
        isLive: r.isLive,
        generatedAt: r.lastUpdated ?? new Date().toISOString(),
      }));

      return NextResponse.json({
        primary: {
          crossingName: primary.name,
          mexicanCity: primary.mexicanCity,
          usCity: primary.usCity,
          coordinates: primary.coordinates,
          waitTime: primary.waitTime,
          totalJourneyTime: primary.totalJourneyTime,
          rank: "recommended" as const,
          status: primary.status.toLowerCase() as "open" | "limited" | "closed",
          generatedAt: primary.lastUpdated ?? new Date().toISOString(),
          isLive: primary.isLive,
          crossingId: primary.id,
          reasonCode: primary.reasonCode,
          reasonData: primary.reasonData,
        },
        alternatives,
        context: {
          originName: origin,
          destinationName: destination,
          originLat: originCoords!.lat,
          originLng: originCoords!.lng,
          destLat: destCoords!.lat,
          destLng: destCoords!.lng,
          direction,
          ...(travelMode && { travelMode }),
          ...(accessType && { accessType }),
          ...(documentProfile && { documentProfile }),
        },
        generatedAt: new Date().toISOString(),
      });
    }

    // Fallback: generic live ranking. Coordinates stay null — never 0,0
    // (null island); callers must not treat the ranking as geo-anchored.
    const direction = clientDirection ?? "MX_TO_US";
    const liveData = await getCrossingsWithLiveData(direction as any);
    const ranked = rankCrossings(liveData, travelMode, accessType);
    const primary = ranked[0];
    if (!primary) {
      return NextResponse.json({ error: "No live data" }, { status: 500 });
    }
    const alternatives = ranked.slice(1, 3).map((r) => ({
      crossingId: r.id,
      crossingName: r.name,
      mexicanCity: r.mexicanCity,
      usCity: r.usCity,
      coordinates: r.coordinates,
      waitTime: r.waitTime,
      totalJourneyTime: r.totalJourneyTime,
      deltaMinutes: r.waitTime - primary.waitTime,
      status: r.status.toLowerCase() as "open" | "limited" | "closed",
      isLive: r.isLive,
      generatedAt: r.lastUpdated ?? new Date().toISOString(),
    }));

    return NextResponse.json({
      primary: {
        crossingName: primary.name,
        mexicanCity: primary.mexicanCity,
        usCity: primary.usCity,
        coordinates: primary.coordinates,
        waitTime: primary.waitTime,
        totalJourneyTime: primary.totalJourneyTime,
        rank: "recommended" as const,
        status: primary.status.toLowerCase() as "open" | "limited" | "closed",
        generatedAt: primary.lastUpdated ?? new Date().toISOString(),
        isLive: primary.isLive,
        crossingId: primary.id,
        reasonCode: primary.reasonCode,
        reasonData: primary.reasonData,
      },
      alternatives,
      context: {
        originName: origin,
        destinationName: destination,
        originLat: null,
        originLng: null,
        destLat: null,
        destLng: null,
        direction,
        ...(travelMode && { travelMode }),
        ...(accessType && { accessType }),
        ...(documentProfile && { documentProfile }),
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Recommendations API error:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
