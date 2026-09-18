# CR-CONF-01 — CrossingConfirmGate
**Version:** 1.1 — 2026-09-16 — emoji deviation fixed (dot + faster/slower keys, labels in locale). If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`CR-CONF-01`

## Name
CrossingConfirmGate

## Responsibility
Post-crossing confirm modal ("did you cross?").

## Details
`CrossingConfirmGate.tsx:8-17` reads `useCrossingDetectionStore()` (`crossingName/estimatedCrossingTime/actualCrossingTime/confirmedAt/confirmCrossing/dismissConfirmation`); `CrossingConfirmGate.tsx:19` returns `null` when `!crossingName`. `CrossingConfirmGate.tsx:26-27` fixed overlay `inset-0 z-50 bg-dark/80 backdrop-blur-sm`, card `bg-surface rounded-xl border-border shadow-xl mx-4`. `CrossingConfirmGate.tsx:29-39` header: `w-16 h-16 rounded-full bg-cruze-green/10` + `Check w-8 h-8 text-cruze-green`, title `t("crossing.confirm.title")`, subtitle `{crossingName}` raw. `CrossingConfirmGate.tsx:42-74` stats `bg-surface-elevated rounded-md p-4`: estimated row (`Clock` + `t("crossing.confirm.estimated")` + `formatCrossingTime(estimated)` per `:44-52`), conditional actual row (`MapPin` + `t("crossing.confirm.actual")` per `:54-64`), conditional comparison `border-t border-border` per `:66-72` with status dot + t(comparison.faster ? "crossing.confirm.fasterThanExpected" : "crossing.confirm.slowerThanExpected", { minutes: comparison.diff }) per `:69` (lib returns { diff, faster } only — labels live in locale, `crossing-estimator.ts:105-112`). Aligned — no emoji. `CrossingConfirmGate.tsx:77-93` actions: confirm `bg-cruze-green text-dark h-12 + Check + t("crossing.confirm.yes")` (`confirmCrossing` per `:79`), dismiss `bg-surface border-border h-12 + X + t("crossing.confirm.no")` (`dismissConfirmation` per `:87`). All copy via `t()` except `crossingName` + comparison label + emoji.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §CR for canonical definition.

## Status
- Spec: defined (v1.0 new)
- Implementation:
  - `src/components/crossing/CrossingConfirmGate.tsx` — store-driven modal, estimated/actual stats, emoji comparison (deviation), dual CTA
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Crossings/... surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/CR-CONF-01-CrossingConfirmGate.md` (this file)
- Implementation: `src/components/crossing/...`
- Catalog index: `design/components/README.md`
