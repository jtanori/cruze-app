# CR-DIR-05 — CrossingsDirectoryFilterBar — SUPERSEDED
**Version:** 1.2 — 2026-09-07 — REMOVED from implementation. Permanent segmented filter bars violate W7 (toolbar + progressive sheet model).

## ID
`CR-DIR-05` (retired)

## Name
CrossingsDirectoryFilterBar

## Responsibility
~~Filter bar~~ — superseded by `CR-DIR-06` (toolbar) + `CR-DIR-05A` (filter sheet).

## Details
~~Todos/México/EE.UU. + Auto/A pie/Comercial + sort relevance/speed/distance/name.~~
Do not implement. See `CR-DIR-05A-CrossingsDirectoryFilterSheet.md` and `CR-DIR-06-CrossingsDirectoryToolbar.md`. This file is retained as a retirement record.

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
- Spec doc: `design/components/CR-DIR-05-CrossingsDirectoryFilterBar.md` (this file)
- Implementation: `src/components/cr/` or domain folder
- Catalog index: `design/components/README.md`