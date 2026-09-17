# AV-ROW-01 — AvisoRow
**Version:** 1.2 — 2026-09-16 — verified against AvisoRow.tsx; absolute HH:MM, no relative time. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AV-ROW-01`

## Name
AvisoRow

## Responsibility
Generic row title snippet recency

## Details
Severity Badge (critical→new, warning→count, else neutral at `AvisoRow.tsx:13,19`) + absolute time HH:MM via `toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})` (`AvisoRow.tsx:12`) + title truncate (`AvisoRow.tsx:22`) + description line-clamp-2 (`AvisoRow.tsx:23`) + optional crossingName (`AvisoRow.tsx:24`). No relative time ("Hace 8 min") is implemented — stub text only. Row is a full-width button with hover border state (`AvisoRow.tsx:16`); onClick optional (`AvisoRow.tsx:8,16`).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AV for canonical definition.

## Status
- Spec: defined (v1.2 verified)
- Implementation: `src/components/avisos/AvisoRow.tsx` — severity Badge + HH:MM + truncate/line-clamp-2 + crossingName; key props: `aviso: Aviso`, `onClick?: () => void`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AV-ROW-01-AvisoRow.md` (this file)
- Implementation: `src/components/avisos/AvisoRow.tsx`
- Catalog index: `design/components/README.md`