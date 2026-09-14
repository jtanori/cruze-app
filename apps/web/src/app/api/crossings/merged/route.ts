/*── MERGED CROSSINGS API ROUTE ────────────────────────────────────────────╭
  Purpose: full merged dataset (static + live CBP, both directions) for
  clients that need more than the ranked §34 slice (favorites, alerts,
  agent context, crossing detail, intelligence views).

  This is the ONLY server-side CBP entrypoint besides /api/crossings.
  Browser code must never call bwt.cbp.gov directly — fetch this route.
  ──────────────────────────────────────────────────────────────────────────*/
import { NextResponse } from "next/server";

// GET /api/crossings/merged - full merged dataset, both directions
export async function GET() {
  try {
    const { getMergedCrossingsData } = await import("@/lib/border-data-service");
    const crossings = await getMergedCrossingsData();
    return NextResponse.json({
      crossings,
      cacheTtl: 300,
      isLive: crossings.some((c) => c.isLive),
    });
  } catch (error) {
    console.error("CBP API error:", error);
    return NextResponse.json(
      { crossings: [], error: "Failed to fetch crossings" },
      { status: 500 }
    );
  }
}
