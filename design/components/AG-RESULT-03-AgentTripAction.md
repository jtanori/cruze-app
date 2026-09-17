# AG-RESULT-03 — AgentTripAction
**Version:** 1.2 — 2026-09-16 — full rewrite from v1.1 stub. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-RESULT-03`

## Name
AgentTripAction

## Responsibility
Single contextual trip action pill delegating navigation to the caller.

## Details
Icon map navigate/viewCrossing/compare/configure/complete → `Navigation/Eye/GitCompare/Settings/Flag` with `Navigation` fallback (`AgentTripAction.tsx:6-12,20`); primary treatment only for `navigate`, else `bg-surface` secondary (`AgentTripAction.tsx:21,26-28`); pill `rounded-full px-4 py-2` single-button with icon + `result.label` (`AgentTripAction.tsx:24-31`). Single `onAction: () => void` callback — routing lives with the caller (`AgentTripAction.tsx:14-17,25`). Props `{ result: AgentTripActionType, onAction: () => void }` (`AgentTripAction.tsx:14-17`). i18n: `result.label` is caller-supplied passthrough, no hardcoded strings in component. DEVIATION (minor): primary uses raw `bg-cruze-mint text-midnight border-cruze-mint` (`AgentTripAction.tsx:27`) instead of the `Button` primitive canon (`Button.tsx:34-41`).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.2 verified)
- Implementation:
  - `src/components/agent/AgentTripAction.tsx` — action pill; key props: `result`, `onAction`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-RESULT-03-AgentTripAction.md` (this file)
- Implementation: `src/components/agent/AgentTripAction.tsx`
- Catalog index: `design/components/README.md`
