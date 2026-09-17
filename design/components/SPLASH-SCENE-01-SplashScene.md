# SPLASH-SCENE-01 — SplashScene
**Version:** 1.1 — 2026-09-16 — implementation sync; adopted from S00 v1.2 brief. Radii/tokens per W5 §1-2. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`SPLASH-SCENE-01`

## Name
SplashScene

## Type
Layout composite

## Responsibility
Full-bleed composition root: viewport layout, anchors, responsive positioning, stacking context.

## Details
See `design/workflows/W0-application-entry.md` (S00 normative spec).

## Source
W0 S00 brief v1.2 (full-bleed, no chrome, quiet progress).

## Status
- Spec: defined
- Implementation: shipped — `src/components/splash/SplashScene.tsx:13-80` (fixed full-bleed `bg-midnight`, `data-testid="splash-scene"`); gate `SplashGate.tsx:22` renders scene until `ready`
- Workflow usage: W0

## Tokens
W5 §1-2 foundations (midnight/mint, Inter/Sora). No splash-specific cards,
borders, radii, or shadows. Progress reuses existing primitives or stays W0-local.

## Integration
Composed under SPLASH-01 per W0 §5 composition tree. No data/consent/location
dependencies.

## File Reference
- Spec doc: `design/components/SPLASH-SCENE-01-SplashScene.md` (this file)
- Implementation: `src/components/splash/` (domain folder, pending)
- Workflow: `design/workflows/W0-application-entry.md`
