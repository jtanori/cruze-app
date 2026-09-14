# CR-DIR-01 — CrossingsDirectoryList
**Version:** 1.2 — 2026-09-07 — presentational; server-driven via useCrossingsDirectory; empty ≠ unavailable.

## ID
`CR-DIR-01`

## Name
CrossingsDirectoryList

## Responsibility
Presentational directory list. Data, filtering, ranking, pagination live server-side (`useCrossingsDirectory` + §34 query contract).

## Details
Denser info-oriented list, not duplicate of nearby preview.
States: loading skeletons → unavailable (retry) → empty (clear-filters when filters active) → rows + CR-DIR-09 load-more. Empty ≠ unavailable, always distinct.

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
- Spec doc: `design/components/CR-DIR-01-CrossingsDirectoryList.md` (this file)
- Implementation: `src/components/cr/` or domain folder
- Catalog index: `design/components/README.md`