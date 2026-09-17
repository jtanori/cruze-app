# AV-BAN-01 — AvisoBanner
**Version:** 1.0 — 2026-09-16 — new; specified-but-stub, slated for alignment pass. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AV-BAN-01`

## Name
AvisoBanner

## Responsibility
Compact aviso summary strip on the trip surface (STUB placeholder).

## Details
Current impl is a static card `bg-surface border-border rounded-lg p-4 sm:p-6 mt-4 sm:mt-6` with hardcoded `2 new avisos` (`AvisoBanner.tsx:9-12`); accepts only `className` (`AvisoBanner.tsx:3-7`) — no count prop, no store read, no navigation, no dismiss. Placed on the trip page active-trip block (`trip/page.tsx:158`). STUB (do not treat as complete): hardcoded English count string with no `t()`; static `2` disconnected from `useAvisosStore`; slated for alignment pass to bind live count/i18n/handoff (see AV-HEAD-01).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AV for canonical definition.

## Status
- Spec: defined (v1.0 specified-but-stub)
- Implementation:
  - `src/components/avisos/AvisoBanner.tsx` — static placeholder; key props: `className?`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AV-BAN-01-AvisoBanner.md` (this file)
- Implementation: `src/components/avisos/AvisoBanner.tsx`
- Catalog index: `design/components/README.md`
