# AV-DET-01 — AvisoDetail
**Version:** 1.0 — 2026-09-16 — new; single generic detail serving ALL aviso types. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AV-DET-01`

## Name
AvisoDetail

## Responsibility
Generic detail card (Badge + date + title + description + crossing + two handoff buttons) for every aviso type.

## Details
Card `bg-surface border-border rounded-lg p-5 space-y-4` (`AvisoDetail.tsx:18`): `Badge` variant critical→`new`, warning→`count`, else `neutral` showing raw `aviso.type` (`AvisoDetail.tsx:20`) + date `new Date(timestamp).toLocaleString()` (`AvisoDetail.tsx:15,21`); title `text-ink font-semibold` (`AvisoDetail.tsx:23`); description `text-sm text-muted` (`AvisoDetail.tsx:24`); `crossingName` line only when set (`AvisoDetail.tsx:25`). Handoffs conditional with analytics: `onViewRecommendation` → mint button + `trackEvent("aviso_action_view_recommendation",{avisoType})` (`AvisoDetail.tsx:27`); `onAskAgent` → elevated-bordered button + `trackEvent("aviso_action_ask_agent",{avisoType})` (`AvisoDetail.tsx:28`). Props `{ aviso, onAskAgent?, onViewRecommendation?, className? }` (`AvisoDetail.tsx:7-12`). Serves ALL `AvisoType` values (`avisos.ts:9-18`); no per-type components exist — see retirement banners on AV-CROSS-01/AV-REC-01/AV-TRIP-01/AV-CHECK-01/AV-DATA-01. DEVIATIONS (do not bless): button strings hardcode Spanish `Ver recomendación` / `Preguntar al Agente` (`AvisoDetail.tsx:27-28`) with no `t()`; primary uses raw `bg-cruze-mint text-midnight` (`AvisoDetail.tsx:27`) vs `Button` hollow-disabled canon (`Button.tsx:34-41`); `Badge` shows untranslated `aviso.type` key (`AvisoDetail.tsx:20`).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AV for canonical definition.

## Status
- Spec: defined (v1.0 new)
- Implementation:
  - `src/components/avisos/AvisoDetail.tsx` — generic detail; key props: `aviso: Aviso`, `onAskAgent?`, `onViewRecommendation?`, `className?`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AV-DET-01-AvisoDetail.md` (this file)
- Implementation: `src/components/avisos/AvisoDetail.tsx`
- Catalog index: `design/components/README.md`
