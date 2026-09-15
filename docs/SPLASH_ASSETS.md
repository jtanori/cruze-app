# S00 Splash — graphic asset inventory

> Source: S00 v1.2 brief + `design/workflows/W0-application-entry.md`.
> Locations are normative (`apps/web/public/brand/`); dimensions derive from
> the visual-regression matrix (reference of record: 390×844, plus
> 393×873, 768×1024, 1440×900). Status: **all pending preparation**.

## Required files

| File | Format | Size / spec | Purpose | Notes |
|------|--------|-------------|---------|-------|
| `public/brand/logo/cruze-logo.svg` | SVG vector | scalable, safe-bleed | `SPLASH-BRAND-01` mark | Prefer supplied vector; never re-typeset. Also reused by PWA/app icons later |
| `public/brand/logo/cruze-wordmark.svg` | SVG vector | scalable | `BORDER INTELLIGENCE` descriptor | May be merged into one lockup SVG with the mark |
| `public/brand/splash/splash-background.webp` | WebP | master 1440×3200, exports 1170×2532 (3x) + 828×1792 (2x) | `SPLASH-BG-01` full-bleed terrain | `object-fit: cover`, focal point protected; dark enough for white type |
| `public/brand/splash/splash-route.svg` | SVG vector | viewBox ~390×500 region, strokes scalable | `SPLASH-ROUTE-01` overlay (composition A only) | Skip entirely if route glow is baked into scene art |
| `public/brand/splash/splash-scene.webp` | WebP | same masters as background | Precomposed scene (composition B only) | A and B are exclusive — supply one composition |
| `public/brand/splash/splash-fallback.svg` | SVG vector | any (solid) | Offline/failure fallback | Midnight `#071A31` field + mint route abstraction; no photo dependency |

## Composition decision (needed before implementation)

- **A (separate)**: background + route SVG + brand — flexible, 3 assets.
- **B (precomposed)**: single scene webp + brand — fewer requests, fixed composition.
- Rule: never duplicate artwork between layers.

## Out of scope (explicitly not assets)

Device status bar, home indicator, notches, browser chrome — system-owned,
never produced as CRUZE assets. No splash-specific cards, radii, or shadows.

## Verification

- DevTools device frames at matrix sizes: full-bleed, no frame/radius, focal intact.
- Lighthouse: no layout shift from late image loads (preload background).
- Offline: scene renders from cache (pairs with existing service worker).
