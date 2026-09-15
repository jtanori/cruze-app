# SPLASH-01 — Splash
**Version:** 1.0 — 2026-09-15 — adopted from S00 v1.2 brief. Radii/tokens per W5 §1-2.

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
- Implementation: pending (`src/components/splash/`)
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
