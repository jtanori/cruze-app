# SPLASH-TAGLINE-01 — SplashPositioning
**Version:** 1.1 — 2026-09-16 — implementation sync; adopted from S00 v1.2 brief. Radii/tokens per W5 §1-2. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`SPLASH-TAGLINE-01`

## Name
SplashPositioning

## Type
Content

## Responsibility
Brand statement exactly 'Smarter crossings. / Better journeys.', lower-left, Inter.

## Details
See `design/workflows/W0-application-entry.md` (S00 normative spec).

## Source
W0 S00 brief v1.2 (full-bleed, no chrome, quiet progress).

## Status
- Spec: defined
- Implementation: shipped inline lower-left (`SplashScene.tsx:55-61`) via `t("splash.tagline1/tagline2")` — en `Smarter crossings. / Better journeys.` matches spec; es `Cruces más inteligentes. / Mejores viajes.` (i18n, not a deviation).
- Workflow usage: W0

## Tokens
W5 §1-2 foundations (midnight/mint, Inter/Sora). No splash-specific cards,
borders, radii, or shadows. Progress reuses existing primitives or stays W0-local.

## Integration
Composed under SPLASH-01 per W0 §5 composition tree. No data/consent/location
dependencies.

## File Reference
- Spec doc: `design/components/SPLASH-TAGLINE-01-SplashPositioning.md` (this file)
- Implementation: `src/components/splash/` (domain folder, pending)
- Workflow: `design/workflows/W0-application-entry.md`
