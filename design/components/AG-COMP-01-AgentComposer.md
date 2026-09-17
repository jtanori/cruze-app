# AG-COMP-01 — AgentComposer
**Version:** 1.2 — 2026-09-16 — full rewrite from v1.1 stub; offline/empty/disabled states. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-COMP-01`

## Name
AgentComposer

## Responsibility
Fixed input bar: guide toggle, text input, send with offline/empty/disabled states.

## Details
Fixed dock `bottom-[var(--nav-bottom-height)]` with `border-t bg-surface-elevated backdrop-blur` (`AgentChat.tsx:220-221`). Offline state: queue banner `t("agent.queuedOffline",{count}) role=status` when `outboxCount > 0` (`AgentChat.tsx:222-226`); sends while offline echo + enqueue instead of processing (`AgentChat.tsx:94-98`). Guide state: `showGuide` panel with `t("agent.guide.title/body")` + prompt pills, toggled by `HelpCircle` button labeled `t("agent.guide.title")` (`AgentChat.tsx:227-256`). Empty state: send disabled on `!input.trim()` (`AgentChat.tsx:275`); Enter (no shift) sends via both `handleKeyDown` (`AgentChat.tsx:128-133`) and input `onKeyDown` (`AgentChat.tsx:262-268`). Disabled state: input `disabled={isProcessing}` + `disabled:opacity-50` (`AgentChat.tsx:270-271`); send `disabled={!input.trim() || isProcessing}` + `disabled:opacity-40` (`AgentChat.tsx:275`) with label `t("agent.send")` (`AgentChat.tsx:277`) and placeholder `t("agent.placeholder")` (`AgentChat.tsx:269`). Fully i18n — no hardcoded strings.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.2 verified)
- Implementation:
  - `src/components/agent/AgentChat.tsx` — inline composer dock; key props: none (pattern, not a component)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-COMP-01-AgentComposer.md` (this file)
- Implementation: `src/components/agent/AgentChat.tsx`
- Catalog index: `design/components/README.md`
