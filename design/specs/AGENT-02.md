# AGENT-02 — Agent Conversation Awareness

**Version:** 1.0 — 2026-09-13 — follow-up resolution, history-aware templates, suggestion-chip wiring.

## Objective
Make the agent resolve follow-up turns ("it", "that crossing", "sí", "y los documentos?") against conversation history, acknowledge returning users compactly, and turn suggestion chips into real sends. Rule-based, no LLM.

## Architecture

```
User message
  → buildHistory(store.messages, 6)
  → resolveFollowUp(message, history) → effectiveMessage
  → classifyIntent(effectiveMessage)
  → extractCrossingMention(effectiveMessage)   // inherits previous-turn mentions
  → getAgentContext()
  → generateResponse(intent, { ..., history })
  → addMessage(user) + addMessage(assistant, text, response)
```

## Follow-up resolution (`lib/agent-conversation.ts`)

- No history → passthrough (`usedHistory: false`).
- Affirmation (`yes|sí|ok|dale|…`, full-string match) → append previous **user** turn (accepts what was offered).
- Pronoun/fragment signal (`it|that|there|eso|ahí|and |y |what about|y qué|pero`) → append previous user turn for classifier/extractor context. Current message stays first so its intents keep rule priority.
- Same-message repeat or assistant-only history → passthrough.

## Template changes (`lib/agent-templates.ts`)

- `TemplateContext.history?: ConversationTurn[]` (defaults `[]`; all existing behavior preserved when absent).
- `greeting` with non-empty history → compact `agent.template.greetingBack` + suggestions (no trip recap, no proactive repeat).
- `general` with non-empty history → prepends `agent.template.followUpContext`.

## Suggestion wiring

- `RichResponse` accepts `onSuggestion?: (s: string) => void`; chips call it (no-op when absent).
- `AgentChat.MessageBubble` forwards `handleSend` as `onSuggestion` — chip taps send as new user turns and flow through the full pipeline (history, live context, outbox).

## i18n (en/es)

- `agent.template.greetingBack`, `agent.template.followUpContext`

## Known limits (deferred)

- English `hours` routes to `wait_times` (rule-priority collision); Spanish `horario` is exact — see `intent-classifier.test.ts`.
- `happening`/`pasando` route to `status` before `whatshappening`; status suggestions still offer the border summary.
- Single-turn inheritance only (last user turn); multi-turn entity tracking is future work.

## Tests

- `lib/__tests__/agent-conversation.test.ts` — history window, pronoun/fragment/affirmation, passthroughs
- `lib/__tests__/agent-templates.test.ts` — greeting-back variant, follow-up prefix
- `components/agent/__tests__/rich-response.test.tsx` — chip render, click callback, absent-handler safety
- `components/agent/__tests__/agent-pipeline.test.tsx` — end-to-end (unchanged, still green)

## Files

- `apps/web/src/lib/agent-conversation.ts`
- `apps/web/src/lib/agent-templates.ts` (history field + greeting/general)
- `apps/web/src/components/agent/AgentProvider.tsx` (history wiring)
- `apps/web/src/components/agent/RichResponse.tsx` + `AgentChat.tsx` (chip sends)
