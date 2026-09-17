> RETIRED — superseded by AV-DET-01. No per-type implementation exists; the single generic `src/components/avisos/AvisoDetail.tsx` serves ALL `AvisoType` values (`apps/web/src/lib/avisos.ts:9-18`). This doc is retained for catalog history only — do not implement against it. Crossing/wait-change WHAT/WHY/ACTION renders through AV-DET-01 generic Badge+date+title+desc+handoffs; no `AvisoCrossingChange.tsx` exists.

# AV-CROSS-01 — AvisoCrossingChange
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AV-CROSS-01`

## Name
AvisoCrossingChange

## Responsibility
Specialized crossing wait change

## Details
WHAT WHY ACTION.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AV for canonical definition.

## Status
- Spec: defined
- Implementation: see `src/components/` (domain: av)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AV-CROSS-01-AvisoCrossingChange.md` (this file)
- Implementation: `src/components/av/` or domain folder
- Catalog index: `design/components/README.md`