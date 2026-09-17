# AG-CHAT-01 — AgentChat
**Version:** 1.0 — 2026-09-16 — new. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-CHAT-01`

## Name
AgentChat

## Responsibility
Owns the full agent conversation surface: welcome, message list, composer, guide, offline queue, streaming.

## Details
SUGGESTED_PROMPTS keys (`AgentChat.tsx:13-18`: `agent.suggest.crossings/sentry/waitTimes/configureTrip`) render as full-width buttons in the empty welcome state (`AgentChat.tsx:185-193`, click → `handleSuggestionClick(t(key))` at `AgentChat.tsx:188`) and as pill chips in the collapsible guide (`AgentChat.tsx:234-245`, click → `setShowGuide(false)` + `handleSend(t(key))` at `AgentChat.tsx:237-240`). `handleSend` (`AgentChat.tsx:87-122`) guards empty/processing (`AgentChat.tsx:88`), offline → echo + `enqueueOutbox` (`AgentChat.tsx:94-98`), online → `processMessage` + word-by-word streaming at 30ms/word (`AgentChat.tsx:104-115`), error → `t("agent.errorState")` (`AgentChat.tsx:118`). `handleSuggestionClick` = `handleSend` (`AgentChat.tsx:124-126`); list passes `onSuggestion={handleSend}` (`AgentChat.tsx:199`) and `RichResponse` suggestion chips call `onSuggestion` (`RichResponse.tsx:69`). One-shot C03 pending-crossing handoff consumes `pendingContext` once then clears (`AgentChat.tsx:137-144`). Reconnect flush drains outbox in order via `flushAgentOutbox(takeNext, send with echoUser:false, dequeue)` with `flushingRef` StrictMode guard (`AgentChat.tsx:148-165`). `TypingIndicator` fallback renders only when `isProcessing && !streamingContent` (`AgentChat.tsx:214`); streaming bubble renders when both set (`AgentChat.tsx:201-213`). Auto-scroll on `messages/isProcessing` (`AgentChat.tsx:167-169`); scroll container `flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-24` (`AgentChat.tsx:173`); shell height `h-[calc(100dvh-var(--nav-header-height)-var(--nav-bottom-height))]` (`AgentChat.tsx:172`). Composer fixed above bottom nav (`AgentChat.tsx:220`); offline queue status `t("agent.queuedOffline", {count})` with `role="status"` (`AgentChat.tsx:222-226`); input disabled while processing, placeholder `t("agent.placeholder")` (`AgentChat.tsx:257-272`); send disabled on `!input.trim() || isProcessing`, label `t("agent.send")` (`AgentChat.tsx:273-280`).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.0 new)
- Implementation:
  - `src/components/agent/AgentChat.tsx` — conversation orchestrator; key props: none (reads `useAgentStore`, `useAgent`, `useNetworkStatus`); callbacks `handleSend`, `onSuggestion=handleSend`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-CHAT-01-AgentChat.md` (this file)
- Implementation: `src/components/agent/AgentChat.tsx`
- Catalog index: `design/components/README.md`
