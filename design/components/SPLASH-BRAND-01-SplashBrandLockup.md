# SPLASH-BRAND-01 — SplashBrandLockup
**Version:** 1.1 — 2026-09-16 — implementation sync; adopted from S00 v1.2 brief. Radii/tokens per W5 §1-2. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`SPLASH-BRAND-01`

## Name
SplashBrandLockup

## Type
Identity

## Responsibility
CRUZE mark + wordmark + BORDER INTELLIGENCE descriptor, upper-left. Prefers supplied vector asset.

## Details
See `design/workflows/W0-application-entry.md` (S00 normative spec).

## Source
W0 S00 brief v1.2 (full-bleed, no chrome, quiet progress).

## Status
- Spec: defined
- Implementation: shipped inline — upper-left lockup `/brand/logo/cruze-logo.svg` (`SplashScene.tsx:44-52`, "never vertically centered" per `:7`); DEVIATION flagged: hardcoded English `aria-label="Cruze — Border Intelligence"` (`SplashScene.tsx:21`).
- Workflow usage: W0

## Tokens
W5 §1-2 foundations (midnight/mint, Inter/Sora). No splash-specific cards,
borders, radii, or shadows. Progress reuses existing primitives or stays W0-local.

## Integration
Composed under SPLASH-01 per W0 §5 composition tree. No data/consent/location
dependencies.

## File Reference
- Spec doc: `design/components/SPLASH-BRAND-01-SplashBrandLockup.md` (this file)
- Implementation: `src/components/splash/` (domain folder, pending)
- Workflow: `design/workflows/W0-application-entry.md`
