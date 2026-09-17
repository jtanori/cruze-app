# AV-HEAD-01 — AvisosSheet
**Version:** 1.3 — 2026-09-16 — adds AvisoBanner placement + i18n deviation notes. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AV-HEAD-01`

## Name
AvisosSheet

## Responsibility
Global sheet/page container for Avisos

## Details
Opened via bell, groups today/yesterday/earlier.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AV for canonical definition.

## Status
- Spec: defined (v1.2 implemented)
- Implementation:
  - `src/components/avisos/AvisosView.tsx` — chrome-free master/detail (AvisosList groups + AvisoDetail + back)
  - `src/components/avisos/AvisosSheet.tsx` — BottomSheet wrapper, owns selection, mark-read-on-open, `initialAvisoId`
  - `src/hooks/useAvisoActions.ts` — Ask Agent (one-shot context → /agent) + View recommendation (/crossing/id or /trip)
  - `src/app/[locale]/alerts/page.tsx` — hosts AvisosView, `?aviso=id` deep link, fixed row-select (was markAllRead)
   - Chrome 2026-09: alerts lives outside `(main)` — `CruzeBackHeader`, no bottom tabs (settings-style); bottom nav carries no alerts tab so nothing breaks
   - `src/components/avisos/AvisoBanner.tsx` — STUB placeholder (hardcoded "2 new avisos" at `AvisoBanner.tsx:11`), placed on trip page active-trip block (`trip/page.tsx:158`); specified-but-stub per AV-BAN-01, slated for alignment pass (live count + i18n + handoff)
- i18n DEVIATIONS (recorded, not blessed): `AvisoBanner` hardcodes English "2 new avisos" (`AvisoBanner.tsx:11`) with no `t()`; `AvisoDetail` hardcodes Spanish "Ver recomendación" / "Preguntar al Agente" (`AvisoDetail.tsx:27-28`)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AV-HEAD-01-AvisosSheet.md` (this file)
- Implementation: `src/components/av/` or domain folder
- Catalog index: `design/components/README.md`