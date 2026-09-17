# LOC-GATE-01 — LocationPermissionGate
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`LOC-GATE-01`

## Name
LocationPermissionGate

## Responsibility
Root infrastructure gate orchestrating location FSM

## Details
CORRECTED per code: `LocationProvider.tsx:8-14` "replacing RootGate +
LocationGate" and "the provider itself never blocks rendering" — it is a
single non-blocking subscription (`useLocation()` in context,
`LocationProvider.tsx:15-18`). There is NO `LocationPermissionGate.tsx`
or `RootGate`/`LocationGate` file (location dir holds 9 files, none a gate).
Blocking vs passthrough is decided per route by consumers: `(main)/layout.tsx:71-88`
switches on `status` (loading→`Spinner`, prompt→`LocationPermissionPrompt`,
acquiring→`LocationAcquisitionState`, error→`LocationRecoveryPanel`,
ready→children) while `AppShell` chrome always renders (`:68-69,91-98`).
Prior "gate-states / persisted cruze-location" language is superseded.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §LOC for canonical definition.

## Status
- Spec: defined
- Implementation: `src/components/location/LocationProvider.tsx` (non-blocking provider) + `useLocationContext()`; gating UI lives in `src/app/[locale]/(main)/layout.tsx:71-88`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/LOC-GATE-01-LocationPermissionGate.md` (this file)
- Implementation: `src/components/location/LocationProvider.tsx` (note: `location/`, not `loc/`)
- Catalog index: `design/components/README.md`