import { NextRequest, NextResponse } from "next/server";
import { getMockRecommendation } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const origin = searchParams.get("origin") ?? "Tijuana";
  const destination = searchParams.get("destination") ?? "San Diego";

  await new Promise((r) => setTimeout(r, 100));

  return NextResponse.json(getMockRecommendation(origin, destination));
}
