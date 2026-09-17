# CR-DET-01 — CrossingDetailHero
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`CR-DET-01`

## Name
CrossingDetailHero

## Responsibility
Canonical header SAN LUIS

## Details
Name + ☆ favorite + status + wait + freshness (timestamp optional — omitted when unknown, never fabricated). `direction: northbound | southbound | both`; travel-pair labels are `MX → US` (`CrossingDetailHero.tsx:49,66`) with secondary slot `secondaryEstimatedLabel="US → MX · est."` + `secondaryEstimated` (`CrossingDetailHero.tsx:14,28`) — bare NORTE/SUR is a violation. Null waits render "—". Variations trip vs directory.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §CR for canonical definition.

## Status
- Spec: defined
- Implementation: see `src/components/` (domain: cr)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/CR-DET-01-CrossingDetailHero.md` (this file)
- Implementation: `src/components/cr/` or domain folder
- Catalog index: `design/components/README.md`