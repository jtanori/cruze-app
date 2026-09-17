# LOC-CONF-01 — LocationConfidenceIndicator
**Version:** 1.1 — 2026-09-04 — radii 4/8/12/16/20, W5 1.1. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`LOC-CONF-01`

## Name
LocationConfidenceIndicator

## Responsibility
Semantic confidence badge

## Details
States: unavailable/determining/needs_confirmation/ready/needs_refreshing. Hides GPS details.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §LOC for canonical definition.

## Status
- Spec: defined
- Implementation: `src/components/location/LocationConfidenceIndicator.tsx` — labels via labelKey t("onboarding.location.confidence.*") (ConfidenceIndicator.tsx:20-30); accuracy ±Nm is locale-invariant units. Fully i18n.
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/LOC-CONF-01-LocationConfidenceIndicator.md` (this file)
- Implementation: `src/components/location/LocationConfidenceIndicator.tsx` (note: `location/`, not `loc/`)
- Catalog index: `design/components/README.md`