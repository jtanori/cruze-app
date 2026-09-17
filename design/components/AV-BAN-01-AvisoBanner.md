# AV-BAN-01 — AvisoBanner
**Version:** 1.1 — 2026-09-16 — stub bound: live unread count + alerts handoff. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AV-BAN-01`

## Name
AvisoBanner

## Responsibility
Compact aviso summary strip on the trip surface (STUB placeholder).

## Details
Live banner bound to `useAvisosStore.unreadCount()` (`AvisoBanner.tsx:17`); renders null at zero; otherwise full-width button → `/{locale}/alerts` with count via t("alerts.bannerSingular/bannerPlural", { count }) + chevron (`AvisoBanner.tsx:19-31`). Placed on the trip page active-trip block (`trip/page.tsx:158`). Fully i18n.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AV for canonical definition.

## Status
- Spec: defined (v1.1 bound + verified)
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
