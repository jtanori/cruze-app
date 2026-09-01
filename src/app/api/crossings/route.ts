import { NextResponse } from "next/server";
import { MOCK_CROSSINGS } from "@/lib/mock-data";

export async function GET() {
  // In production: fetch from CBP API
  // For now: serve mock data with simulated latency
  await new Promise((r) => setTimeout(r, 100));

  return NextResponse.json(MOCK_CROSSINGS, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
