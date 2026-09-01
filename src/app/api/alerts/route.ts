import { NextRequest, NextResponse } from "next/server";
import { MOCK_ALERTS } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const since = searchParams.get("since");

  let alerts = MOCK_ALERTS;

  if (since) {
    const sinceDate = new Date(since);
    alerts = alerts.filter((a) => new Date(a.timestamp) > sinceDate);
  }

  return NextResponse.json(alerts);
}
