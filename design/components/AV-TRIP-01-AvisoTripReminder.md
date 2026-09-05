# AV-TRIP-01 — AvisoTripReminder
**Version:** 1.1 — 2026-09-04 — radii 4/8/12/16/20, W5 1.1. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AV-TRIP-01`

## Name
AvisoTripReminder

## Responsibility
Trip reminder notification

## Details
Reminder.

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
- Spec doc: `design/components/AV-TRIP-01-AvisoTripReminder.md` (this file)
- Implementation: `src/components/av/` or domain folder
- Catalog index: `design/components/README.md`