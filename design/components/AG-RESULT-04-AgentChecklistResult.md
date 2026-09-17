# AG-RESULT-04 — AgentChecklistResult
**Version:** 1.2 — 2026-09-16 — full rewrite from v1.1 stub. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-RESULT-04`

## Name
AgentChecklistResult

## Responsibility
Read-only pre-crossing checklist with checked / warning / pending states.

## Details
Container `bg-surface border-border rounded-lg divide-y divide-border` (`AgentChecklistResult.tsx:12`); rows `px-4 py-2.5` with `CheckCircle text-success` (checked), `AlertTriangle text-warning` (warning), `Circle text-muted` (else) + label `text-sm text-ink` + optional `detail text-xs text-faint` (`AgentChecklistResult.tsx:13-21`). Props `{ result: AgentChecklistType }` — no callbacks, no handoff buttons (`AgentChecklistResult.tsx:6-8`); items carry `status/label/detail` (`AgentChecklistResult.tsx:15-18`). i18n: labels/details are data passthrough, no hardcoded strings. No mint buttons, no deviation.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.2 verified)
- Implementation:
  - `src/components/agent/AgentChecklistResult.tsx` — static checklist; key props: `result`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-RESULT-04-AgentChecklistResult.md` (this file)
- Implementation: `src/components/agent/AgentChecklistResult.tsx`
- Catalog index: `design/components/README.md`
