# AG-RESULT-02 — AgentRecommendationResult
**Version:** 1.2 — 2026-09-16 — full rewrite from v1.1 stub; handoffs + deviations. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-RESULT-02`

## Name
AgentRecommendationResult

## Responsibility
Highlighted recommendation card with reasons and Usar / Comparar handoffs.

## Details
Card `bg-surface border-cruze-mint/30 rounded-lg` with t("agent.result.recommended") eyebrow (`AgentRecommendationResult.tsx:18`); name `text-ink font-bold` (`AgentRecommendationResult.tsx:19`); wait + journey in bold tabular with `Clock`/`TrendingUp` icons (`AgentRecommendationResult.tsx:21-22`); reasons list with `Check text-success` only when non-empty (`AgentRecommendationResult.tsx:24-28`). Handoffs conditional: `onUse` → t("agent.result.useCrossing") h-9 mint primary, `onCompare` → t("agent.result.compare") h-9 elevated secondary (`AgentRecommendationResult.tsx:32-33`). Props `{ result: AgentRecommendationResult, onUse?: () => void, onCompare?: () => void }` (`AgentRecommendationResult.tsx:8-12`); `result` carries `crossingName/waitTime/totalJourney/reasons` (`AgentRecommendationResult.tsx:19-26`). Fully i18n — no hardcoded strings. Note: primary uses raw `bg-cruze-mint` (no disabled state exists; Button-primitive migration deferred — no behavior gap).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.2 verified)
- Implementation:
  - `src/components/agent/AgentRecommendationResult.tsx` — recommendation card; key props: `result`, `onUse?`, `onCompare?`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-RESULT-02-AgentRecommendationResult.md` (this file)
- Implementation: `src/components/agent/AgentRecommendationResult.tsx`
- Catalog index: `design/components/README.md`
