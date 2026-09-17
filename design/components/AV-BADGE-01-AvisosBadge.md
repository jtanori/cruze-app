# AV-BADGE-01 — AvisosBadge
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AV-BADGE-01`

## Name
AvisosBadge

## Responsibility
Unread badge on bell

## Details
Mint dot.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AV for canonical definition.

## Status
- Spec: specified, not implemented (2026-09-16 — no `AvisosBadge` file exists; severity `Badge` usage inside `AvisoRow.tsx:19` / `AvisoDetail.tsx:20` is the generic primitive, not the specified bell badge)
- Implementation: none (bell badge missing — decide implement-or-drop in alignment pass)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AV-BADGE-01-AvisosBadge.md` (this file)
- Implementation: `src/components/av/` or domain folder
- Catalog index: `design/components/README.md`