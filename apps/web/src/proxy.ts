import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // API routes must NEVER pass through locale middleware (it would rewrite
  // /api/places to /es/api/places → 404). Throttle, then continue unprefixed.
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
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|es)/:path*', '/api/:path*']
};
