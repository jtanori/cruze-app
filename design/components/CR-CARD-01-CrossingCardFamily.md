# CR-CARD-01 — CrossingCardFamily (RETIRED)
**Version:** retired — 2026-09-16 — files deleted; zero live importers, superseded by live replacements. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> RETIRED — do not implement. All four variants (`CrossingCard`, `CrossingOptionCard`, `TripCrossingCard`, `BestCrossingCard`) had zero importers repo-wide (grep 2026-09-16: only self-hits + a comment in `domain/crossing-types.ts:10`). Files deleted 2026-09-16 (restorable via git). Live replacements, all specced and aligned:
> - Rich directory card → `CrossingsDirectoryRow` + `CrossingsDirectoryExpandedRow` (CR-DIR-02/03)
> - Expandable option card → `CrossingsDirectoryRow` (CR-DIR-02) + `TripAlternativeListSection` (TR-REC-03)
> - Simplified trip card → `TripNearbyCrossingRow` (TR-NEAR-02)
> - Recommendation hero → `TripRecommendationPrimaryCard` (TR-REC-01)
>
> Deviations frozen for record (would need fixing on any revival): broken theme classes `bg-cruze-surface-elevated` / `border-cruze-surface-elevated` / `text-cruze-alert-red` (not in `@theme` — silently dropped); hardcoded ES (`Ver detalles`, aria-labels) and EN (`Total journey`, `Slower than recommended`, approach line, RichResponse-style aria-labels); `{usCity}, CA` hardcoded state (wrong outside California); `common.live` badge violating the no-liveness rule; duplicate freshness line in Best; inconsistent CTA treatments.

## ID
`CR-CARD-01`

## Name
CrossingCardFamily

## Responsibility
Legacy variant family for crossing cards (retired).

## Details
See retirement banner above for replacements and frozen deviations.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §CR for canonical definition.

## Status
- Spec: retired (do not implement)
- Implementation: none (4 files deleted 2026-09-16)
- Workflow usage: none

## Tokens (when defined in W5 spec)
N/A — retired.

## Integration
None — retired.

## File Reference
- Spec doc: `design/components/CR-CARD-01-CrossingCardFamily.md` (this file)
- Implementation: none (deleted `src/components/crossing/{CrossingCard,CrossingOptionCard,TripCrossingCard,BestCrossingCard}.tsx`)
- Catalog index: `design/components/README.md`
