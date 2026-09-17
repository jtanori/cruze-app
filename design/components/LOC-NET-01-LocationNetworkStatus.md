# LOC-NET-01 — LocationNetworkStatus
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`LOC-NET-01`

## Name
LocationNetworkStatus

## Responsibility
Network status hook/banner

## Details
Detects offline, shows Sin conexión, disables search.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §LOC for canonical definition.

## Status
- Spec: defined
- Implementation: no `NetworkStatus.tsx` exists (location dir has 9 files, none network); hook `src/lib/network-status.ts:37-73` (`useNetworkStatus()` → `{ online, reachability, isReachable }`, `HEAD /api/health` probe `:17-32`) consumed inline by `LocationRecoveryPanel.tsx:7,22`, `LocationSearchInput.tsx:7,24`, `AgentChat.tsx:10,75`; presentational banner `src/components/shared/ConnectivityBanner.tsx:11` (`{ isOnline, onRetry? }`, null when online `:17`, offline bar + retry `:20-35`).
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/LOC-NET-01-LocationNetworkStatus.md` (this file)
- Implementation: `src/components/loc/` or domain folder
- Catalog index: `design/components/README.md`