# AG-MSG-01 — AgentMessageList
**Version:** 1.2 — 2026-09-16 — full rewrite from v1.1 stub; scroll container + outbox/streaming realities. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-MSG-01`

## Name
AgentMessageList

## Responsibility
Scrollable conversation region with empty, streaming, typing, and offline-queue states.

## Details
Container `flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-24` inside the dvh shell (`AgentChat.tsx:172-173`). Empty (no messages, not processing) → inline welcome (`AgentChat.tsx:174-195`); else maps `messages` to `MessageBubble` with `onSuggestion={handleSend}` (`AgentChat.tsx:198-200`), then streaming bubble when `streamingContent` non-empty (`AgentChat.tsx:201-213`), then `TypingIndicator` when processing without streaming text (`AgentChat.tsx:214`), anchored by `messagesEndRef` (`AgentChat.tsx:215`). Auto-scrolls on `messages/isProcessing` via `scrollIntoView({behavior:"smooth"})` (`AgentChat.tsx:83-85,167-169`). Offline reality: outbox count banner `t("agent.queuedOffline",{count})` sits in the composer zone, not the list (`AgentChat.tsx:222-226`); queued items flush in order on reconnect (`AgentChat.tsx:148-165`).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.2 verified)
- Implementation:
  - `src/components/agent/AgentChat.tsx` — inline list region; key props: none (pattern, not a component)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-MSG-01-AgentMessageList.md` (this file)
- Implementation: `src/components/agent/AgentChat.tsx`
- Catalog index: `design/components/README.md`
