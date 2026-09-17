# AV-LIST-01 — AvisosList
**Version:** 1.0 — 2026-09-16 — new. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AV-LIST-01`

## Name
AvisosList

## Responsibility
Grouped aviso list with inline empty state.

## Details
Empty (`avisos.length === 0`) → inline `EmptyState` with `t("alerts.empty")` + `t("alerts.emptyDescription")` (`AvisosList.tsx:16-18`). Else `groupAvisosByTime(avisos)` (`AvisosList.tsx:20`): skips `dismissed`, buckets by local-midnight boundaries into today/yesterday/earlier with `labelKey alerts.today/yesterday/earlier` (`avisos.ts:36-59`); headers render `t(g.labelKey)` uppercase (`AvisosList.tsx:26`); rows render `AvisoRow` with `onSelect ? () => onSelect(a) : undefined` (`AvisosList.tsx:28-30`). Stack `space-y-4 sm:space-y-6` groups, `space-y-2` rows (`AvisosList.tsx:23-27`); optional `className` passthrough (`AvisosList.tsx:8-14`). Fully i18n — no hardcoded strings.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AV for canonical definition.

## Status
- Spec: defined (v1.0 new)
- Implementation:
  - `src/components/avisos/AvisosList.tsx` — grouping list; key props: `avisos: Aviso[]`, `onSelect?: (aviso: Aviso) => void`, `className?`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AV-LIST-01-AvisosList.md` (this file)
- Implementation: `src/components/avisos/AvisosList.tsx`
- Catalog index: `design/components/README.md`
