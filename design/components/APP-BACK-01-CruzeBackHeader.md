# APP-BACK-01 — CruzeBackHeader

## ID
`APP-BACK-01`

## Name
CruzeBackHeader

## Responsibility
Back navigation header (←) used on interior pages

## Details
Header variant with back arrow + title + optional actions. Used on T02-T06, C03, N01, S01.

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
- Spec doc: `design/components/APP-BACK-01-CruzeBackHeader.md` (this file)
- Implementation: `src/components/app/` or domain folder
- Catalog index: `design/components/README.md`
