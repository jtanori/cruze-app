# CR-DET-10 — CrossingDetailActionBar
**Version:** 1.3 — 2026-09-07 — placement rule: rendered INSIDE the padded content container. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`CR-DET-10`

## Name
CrossingDetailActionBar

## Responsibility
In-flow decision group: primary Usar este cruce + secondary text action. NOT a fixed dock — lives in page flow inside the canonical content inset.

## Placement rule
Render INSIDE the page's padded content container (`px-4 sm:px-5`), as the last block after supporting sections. Never as a sibling after the container closes — that puts both CTAs at viewport edges, outside content margins. Same rule applies to every page-level action group (Page Composition Standard §B).

## Details
"Usar este cruce" (primary: full content width, h-12/48px, px-4, mint, radius-lg) → trip setup with `?crossing=` candidate handoff (never silent overwrite — see `trip-handoff.ts` guard). "Comparar cruces →" (secondary text action, centered, min-h-44px, faint→ink hover) → compare route with current + 2 nearest POEs. Only the primary gets button treatment. No fixed/sticky positioning, no edge bleed (`-mx-*` forbidden), no `pb-*` compensation on the page.

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
- Spec doc: `design/components/CR-DET-10-CrossingDetailActionBar.md` (this file)
- Implementation: `src/components/cr/` or domain folder
- Catalog index: `design/components/README.md`