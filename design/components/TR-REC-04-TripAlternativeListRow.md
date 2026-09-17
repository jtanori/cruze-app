# TR-REC-04 — TripAlternativeListRow (RETIRED)
**Version:** retired — 2026-09-16 — file deleted; zero live importers, superseded by TR-REC-03. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> RETIRED — do not implement. `TripAlternativeListRow.tsx` (props `name/accessLabel/waitMinutes/status/direction/freshnessMinutes/onClick`) had no importers in `apps/web` (grep 2026-09-16: only self-hit). Canonical alternatives surface is TR-REC-03 `TripAlternativeListSection` (inline expandable rows, fully i18n). Known deviations frozen for record: hardcoded `Abierto/Limitado/Cerrado`, default `direction = "Norte"`, hardcoded `` `Actualizado ${freshnessMinutes} min` `` and `min` unit (no `t()`). File deleted 2026-09-16 (restorable via git).

## ID
`TR-REC-04`

## Name
TripAlternativeListRow

## Responsibility
Legacy standalone alternative row (retired).

## Details
Single-button row (`min-h-[56px]`, `rounded-[var(--radius-md)]`) with name + direction · status · freshness subline and wait + chevron. Superseded by the Section's inline rows.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §TR for canonical definition.

## Status
- Spec: retired (do not implement)
- Implementation: none (file deleted 2026-09-16)
- Workflow usage: none

## Tokens (when defined in W5 spec)
N/A — retired.

## Integration
None — retired.

## File Reference
- Spec doc: `design/components/TR-REC-04-TripAlternativeListRow.md` (this file)
- Implementation: none (deleted `src/components/trip/TripAlternativeListRow.tsx`)
- Catalog index: `design/components/README.md`
