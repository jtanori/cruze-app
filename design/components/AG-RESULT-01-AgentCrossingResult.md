# AG-RESULT-01 — AgentCrossingResult
**Version:** 1.2 — 2026-09-16 — full rewrite from v1.1 stub; handoffs + deviations. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-RESULT-01`

## Name
AgentCrossingResult

## Responsibility
Structured crossing card with wait, journey total, status, and Ver cruce / Navegar handoffs.

## Details
Card `bg-surface border-border rounded-lg p-4 space-y-3` (`AgentCrossingResult.tsx:17`): name `text-ink font-semibold text-sm` (`AgentCrossingResult.tsx:18`); wait row `Clock` + `formatDuration(waitTime)` or `—` when null (`AgentCrossingResult.tsx:20-21`); journey total only when non-null via t("agent.result.totalJourney", { duration }) (`AgentCrossingResult.tsx:23`); status line `text-xs text-muted` (`AgentCrossingResult.tsx:25`). Handoffs render only when callbacks provided: `onView` → t("agent.result.viewCrossing") h-9 secondary, `onNavigate` → t("agent.result.navigate") h-9 mint primary with `Navigation` icon (`AgentCrossingResult.tsx:27-28`). Props `{ result: AgentCrossingResult, onView?: () => void, onNavigate?: () => void }` (`AgentCrossingResult.tsx:8-12`); `result` carries `crossingName/waitTime/totalJourney/status` (`AgentCrossingResult.tsx:18-25`). Fully i18n — no hardcoded strings. Note: primary uses raw `bg-cruze-mint` (no disabled state exists on these buttons; Button-primitive migration deferred — no behavior gap).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.2 verified)
- Implementation:
  - `src/components/agent/AgentCrossingResult.tsx` — structured card; key props: `result`, `onView?`, `onNavigate?`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-RESULT-01-AgentCrossingResult.md` (this file)
- Implementation: `src/components/agent/AgentCrossingResult.tsx`
- Catalog index: `design/components/README.md`
