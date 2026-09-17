# SPLASH-01 — Splash
**Version:** 1.1 — 2026-09-16 — implementation sync; adopted from S00 v1.2 brief. Radii/tokens per W5 §1-2. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`SPLASH-01`

## Name
Splash

## Type
Composite

## Responsibility
Owns the complete S00 visual composition (scene, identity, overlay, tagline, progress). Owns no initialization, data, or navigation.

## Details
See `design/workflows/W0-application-entry.md` (S00 normative spec).

## Source
W0 S00 brief v1.2 (full-bleed, no chrome, quiet progress).

## Status
- Spec: defined
- Implementation: shipped — `src/components/splash/SplashScene.tsx` (precomposed scene + brand overlay + tagline + quiet progress, `SplashScene.tsx:6-12,45-72`) gated by `SplashGate` (`MIN_SPLASH_MS=900`, `SplashGate.tsx:12-23`); mounted in `src/app/[locale]/layout.tsx:30`
- Workflow usage: W0

## Tokens
W5 §1-2 foundations (midnight/mint, Inter/Sora). No splash-specific cards,
borders, radii, or shadows. Progress reuses existing primitives or stays W0-local.

## Integration
Composed under SPLASH-01 per W0 §5 composition tree. No data/consent/location
dependencies.

## File Reference
- Spec doc: `design/components/SPLASH-01-Splash.md` (this file)
- Implementation: `src/components/splash/` (domain folder, pending)
- Workflow: `design/workflows/W0-application-entry.md`
