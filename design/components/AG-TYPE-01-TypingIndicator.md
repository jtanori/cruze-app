# AG-TYPE-01 — TypingIndicator
**Version:** 1.0 — 2026-09-16 — new. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-TYPE-01`

## Name
TypingIndicator

## Responsibility
Three-dot bounce fallback while the agent processes before streaming text exists.

## Details
Three `w-1.5 h-1.5 bg-faint rounded-full animate-bounce` dots with staggered delays `-0.3s/-0.15s/0` inside a `bg-surface-elevated rounded-full border-border` pill (`TypingIndicator.tsx:5-11`). No props, no i18n strings. Rendered by `AgentChat` only when `isProcessing && !streamingContent` (`AgentChat.tsx:214`); replaced by the streaming bubble once `streamingContent` is non-empty (`AgentChat.tsx:201-213`).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.0 new)
- Implementation:
  - `src/components/agent/TypingIndicator.tsx` — stateless fallback indicator; key props: none
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-TYPE-01-TypingIndicator.md` (this file)
- Implementation: `src/components/agent/TypingIndicator.tsx`
- Catalog index: `design/components/README.md`
