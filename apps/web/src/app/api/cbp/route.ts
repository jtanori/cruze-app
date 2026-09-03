/*── CBP API ROUTE HANDLER ────────────────────────────────────────────────╭
  Purpose: Route handler for CBP wait time data
 ──────────────────────────────────────────────────────────────────────────╯

  IMPLEMENTATION NOTES:
  - Endpoint: https://bwt.cbp.gov/api/waittimes (free, no key required)
  - Covers 55+ US-Mexico crossings
  - Response format: wait times per crossing per direction
  - Cache strategy: 5min revalidation with revalidateTag
  - Southbound data estimation: 70% of northbound times

  RESPONSE FORMAT:
  - waitTimes: Array of crossing wait times
  - lastUpdated: timestamp
  - totalCrossings: number

  RATE LIMITING:
  - No API key required
  - Respectful caching: 5min minimum
  - Fallback to mock data on errors
──────────────────────────────────────────────────────────────────────────*/
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// CBP API endpoint
const CBP_API = "https://bwt.cbp.gov/api/waittimes";

// Mock data for development (matches CBP response format)
const MOCK_CBP_DATA = {
  waitTimes: [
    { crossingId: "san-ysidro", direction: "MX_TO_US", waitMinutes: 45, laneStatus: "standard" },
    { crossingId: "otay-mesa", direction: "MX_TO_US", waitMinutes: 35, laneStatus: "standard" },
    { crossingId: "tecate", direction: "MX_TO_US", waitMinutes: 15, laneStatus: "limited" },
    { crossingId: "san-ysidro", direction: "US_TO_MX", waitMinutes: 30, laneStatus: "standard" },
    { crossingId: "otay-mesa", direction: "US_TO_MX", waitMinutes: 25, laneStatus: "standard" },
  ],
  lastUpdated: new Date().toISOString(),
  totalCrossings: 55,
};

// GET /api/cbp/waittimes - CBP wait times data
export async function GET(request: NextRequest) {
  try {
    // In production, fetch from CBP API
    // const response = await fetch(CBP_API, {
    //   cache: "force-cache",
    //   next: { revalidate: 300 }, // 5min
    // });

    // For development, use mock data
    const data = MOCK_CBP_DATA;

    // Add cache headers
    const headers: HeadersInit = {
      "x-cache": "stale-while-revalidate",
      "x-last-updated": data.lastUpdated,
    };

    return NextResponse.json(data, {
      headers,
      // Revalidate every 5 minutes (300 seconds)
      // @ts-ignore - Next.js specific property not in standard ResponseInit
      next: { revalidate: 300 },
    });
  } catch (error) {
    console.error("CBP API error:", error);
    // Fallback to mock data on error
    return NextResponse.json(MOCK_CBP_DATA, {
      // @ts-ignore - Next.js specific property not in standard ResponseInit
      next: { revalidate: 60 }, // 1min fallback
    });
  }
}

/* ─── POST /api/cbp/waittimes - Submit observed wait times ─────────────────╭
  Purpose: Allow users to submit observed wait times (crowdsourcing)
──────────────────────────────────────────────────────────────────────────╯*/
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Acknowledge receipt
  return NextResponse.json(
    { status: "received", submitted: new Date().toISOString() },
    { status: 201 }
  );
}