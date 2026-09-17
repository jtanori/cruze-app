# AG-MSG-02 — AgentMessage
**Version:** 1.2 — 2026-09-16 — full rewrite from v1.1 stub; MessageBubble passthrough. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-MSG-02`

## Name
AgentMessage

## Responsibility
Single message bubble with role-based alignment and rich assistant rendering.

## Details
`MessageBubble({ message, onSuggestion })` (`AgentChat.tsx:20-26`): row `justify-end` user / `justify-start` assistant (`AgentChat.tsx:30`), inner `max-w-[85%]` with `flex-row-reverse` for user (`AgentChat.tsx:32-34`); avatar User on `bg-surface-raised` vs Bot on `bg-cruze-green/10` (`AgentChat.tsx:36-45`); bubble user `bg-cruze-green text-dark rounded-tr-sm`, assistant `bg-surface border-border text-ink rounded-tl-sm`, `rounded-[var(--radius-lg)] text-sm` (`AgentChat.tsx:48-53`). Content: user or assistant-without-richContent renders `message.content` verbatim (`AgentChat.tsx:55-56`); assistant with `richContent` renders only `RichResponse` — `message.content` is NOT also rendered (dedup rule, `AgentChat.tsx:58-60`). i18n: pure `t()` passthrough, zero hardcoded strings in this function — consistent with the agent-templates rule (all user-facing copy originates from `generateResponse` + `t`, see `AgentProvider.tsx:67-82`). Only two roles exist (`user`/assistant via `isUser` check at `AgentChat.tsx:27`); no System variant implemented.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.2 verified)
- Implementation:
  - `src/components/agent/AgentChat.tsx` — `MessageBubble`; key props: `message: AgentMessage`, `onSuggestion?: (suggestion: string) => void`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-MSG-02-AgentMessage.md` (this file)
- Implementation: `src/components/agent/AgentChat.tsx`
- Catalog index: `design/components/README.md`
