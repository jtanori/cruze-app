# AG-PROV-01 — AgentProvider
**Version:** 1.0 — 2026-09-16 — new. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-PROV-01`

## Name
AgentProvider

## Responsibility
Loads merged crossing data and exposes processMessage (history → intent → templated i18n response).

## Details
Context value `{ crossings, loading, processMessage }` (`AgentProvider.tsx:16-20`); `useAgent` throws outside provider (`AgentProvider.tsx:24-28`). Loads via `fetchMergedCrossings()` in mount effect (`AgentProvider.tsx:39-47`). `processMessage(message, opts?: { echoUser?: boolean })` (`AgentProvider.tsx:49-50`): `buildHistory(messages)` + `resolveFollowUp(message, history)` (`AgentProvider.tsx:52-53`); `classifyIntent(effectiveMessage)` (`AgentProvider.tsx:56`); `extractCrossingMention(effectiveMessage, BORDER_CROSSINGS)` with fallback to `crossings.find(c => c.id === crossingId)` (`AgentProvider.tsx:59-62`); `getAgentContext()` live context (`AgentProvider.tsx:65`); `generateResponse(intent, { crossing, allCrossings, trip, profile, liveContext, history, t })` where `t` wraps `useTranslations` with try/catch key-fallback, no hardcoded `isEn` (`AgentProvider.tsx:67-82`). Persistence: `echoUser:false` → assistant-only `addMessage` (flushed outbox items already echoed at queue time); default echoes user then assistant (`AgentProvider.tsx:84-90`). No UI rendered; provider wraps `children` (`AgentProvider.tsx:97-101`).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.0 new)
- Implementation:
  - `src/components/agent/AgentProvider.tsx` — data + NLU pipeline host; key props: `children: React.ReactNode`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-PROV-01-AgentProvider.md` (this file)
- Implementation: `src/components/agent/AgentProvider.tsx`
- Catalog index: `design/components/README.md`
