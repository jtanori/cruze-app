import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // S1: throttle API burst traffic before it reaches route handlers.
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const { limited, retryAfterSec } = isRateLimited(getClientIp(request));
    if (limited) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSec) },
        }
      );
    }
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|es)/:path*', '/api/:path*']
};
