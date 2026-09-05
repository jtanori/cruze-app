# APP-LIVE-01 — CruzeLiveIndicator

## ID
`APP-LIVE-01`

## Name
CruzeLiveIndicator

## Responsibility
Global live data freshness indicator

## Details
Semantic indicator for LIVE/RECENT/STALE data. Not decorative.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §APP for canonical definition.

## Status
- Spec: defined
- Implementation: see `src/components/` (domain: app)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/APP-LIVE-01-CruzeLiveIndicator.md` (this file)
- Implementation: `src/components/app/` or domain folder
- Catalog index: `design/components/README.md`
