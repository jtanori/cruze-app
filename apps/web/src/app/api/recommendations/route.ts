import { NextRequest, NextResponse } from "next/server";
import { getCrossingsWithLiveData } from "@/lib/border-data-service";
import { findCandidateCrossings } from "@/lib/border-data";
import type { Place } from "@/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const originLat = searchParams.get("originLat");
  const originLng = searchParams.get("originLng");
  const destLat = searchParams.get("destLat");
  const destLng = searchParams.get("destLng");
  const origin = searchParams.get("origin") ?? "Tijuana";
  const destination = searchParams.get("destination") ?? "San Diego";

  try {
    // If we have coordinates, use live candidate logic
    if (originLat && originLng && destLat && destLng) {
      const start: Place = {
        id: "origin",
        name: origin,
        latitude: parseFloat(originLat),
        longitude: parseFloat(originLng),
        country: "MX",
        formattedAddress: origin,
      } as Place;
      const dest: Place = {
        id: "destination",
        name: destination,
        latitude: parseFloat(destLat),
        longitude: parseFloat(destLng),
        country: "US",
        formattedAddress: destination,
      } as Place;

      // Derive direction from country
      const direction = start.country === "MX" && dest.country === "US" ? "MX_TO_US" : "US_TO_MX";

      const candidates = findCandidateCrossings(start, dest, direction as any);
      const liveData = await getCrossingsWithLiveData(direction as any);

      const liveById = new Map(liveData.map((c) => [c.id, c]));

      const ranked = candidates
        .map((c) => {
          const live = liveById.get(c.id);
          return {
            crossingId: c.id,
            crossingName: c.name,
            mexicanCity: c.mexicanCity,
            usCity: c.usCity,
            waitTime: live?.waitTime ?? 20,
            totalJourneyTime: (live?.waitTime ?? 20) + 30, // + approach estimate
            status: (live?.status ?? "OPEN").toLowerCase() as "open" | "limited" | "closed",
            generatedAt: live?.lastUpdated ?? new Date().toISOString(),
            isLive: live?.isLive ?? false,
          };
        })
        .sort((a, b) => a.waitTime - b.waitTime);

      if (ranked.length === 0) {
        return NextResponse.json({ error: "No crossings found" }, { status: 404 });
      }

      const primary = ranked[0];
      const alternatives = ranked.slice(1, 3).map((r) => ({
        crossingId: r.crossingId,
        crossingName: r.crossingName,
        mexicanCity: r.mexicanCity,
        usCity: r.usCity,
        waitTime: r.waitTime,
        totalJourneyTime: r.totalJourneyTime,
        deltaMinutes: r.waitTime - primary.waitTime,
        status: r.status,
        generatedAt: r.generatedAt,
      }));

      const reasons = [
        `Menor tiempo total (${primary.waitTime} min)`,
        "Compatible con tu tipo de cruce",
        primary.isLive ? "Datos en vivo" : "Datos estimados",
      ];

      return NextResponse.json({
        primary: {
          crossingName: primary.crossingName,
          mexicanCity: primary.mexicanCity,
          usCity: primary.usCity,
          waitTime: primary.waitTime,
          totalJourneyTime: primary.totalJourneyTime,
          rank: "recommended" as const,
          status: primary.status,
          generatedAt: primary.generatedAt,
          isLive: primary.isLive,
          crossingId: primary.crossingId,
        },
        reasons,
        alternatives,
        generatedAt: new Date().toISOString(),
      });
    }

    // Fallback: generic live ranking without specific origin/dest (e.g. direct browse)
    const liveData = await getCrossingsWithLiveData("MX_TO_US");
    const ranked = [...liveData].sort((a, b) => a.waitTime - b.waitTime);
    const primary = ranked[0];
    if (!primary) {
      return NextResponse.json({ error: "No live data" }, { status: 500 });
    }
    const alternatives = ranked.slice(1, 3).map((r) => ({
      crossingId: r.id,
      crossingName: r.name,
      mexicanCity: r.mexicanCity,
      usCity: r.usCity,
      waitTime: r.waitTime,
      totalJourneyTime: r.waitTime + 30,
      deltaMinutes: r.waitTime - primary.waitTime,
      status: r.status.toLowerCase() as "open" | "limited" | "closed",
      generatedAt: r.lastUpdated ?? new Date().toISOString(),
    }));

    return NextResponse.json({
      primary: {
        crossingName: primary.name,
        mexicanCity: primary.mexicanCity,
        usCity: primary.usCity,
        waitTime: primary.waitTime,
        totalJourneyTime: primary.waitTime + 30,
        rank: "recommended" as const,
        status: primary.status.toLowerCase() as "open" | "limited" | "closed",
        generatedAt: primary.lastUpdated ?? new Date().toISOString(),
        isLive: primary.isLive,
        crossingId: primary.id,
      },
      reasons: [
        `Menor tiempo total (${primary.waitTime} min)`,
        "Compatible con tu tipo de cruce",
        primary.isLive ? "Datos en vivo" : "Datos estimados",
      ],
      alternatives,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Recommendations API error:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
