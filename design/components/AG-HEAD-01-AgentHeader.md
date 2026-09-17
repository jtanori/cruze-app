# AG-HEAD-01 — AgentHeader
**Version:** 1.2 — 2026-09-16 — full rewrite from v1.1 stub; no standalone file, inline pattern contract. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-HEAD-01`

## Name
AgentHeader

## Responsibility
Inline header pattern for the agent surface (no standalone component).

## Details
No `AgentHeader.tsx` exists. The "header" is the inline welcome avatar: `w-16 h-16 rounded-full bg-cruze-green/10` with `Bot w-8 h-8 text-cruze-green` (`AgentChat.tsx:176-178`), mirrored at message scale `w-8 h-8 … bg-cruze-green/10` + `Bot w-4 h-4` in `MessageBubble` (`AgentChat.tsx:36-45`) and the streaming bubble (`AgentChat.tsx:204-206`). Contract: assistant identity = Bot icon on `cruze-green/10` disc; user identity = User icon on `bg-surface-raised` (`AgentChat.tsx:37-45`). No title bar, no actions, no i18n strings in this pattern. Do not create a standalone header file unless the surface gains chrome.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.2 inline-pattern contract)
- Implementation:
  - `src/components/agent/AgentChat.tsx` — inline Bot avatar discs; key props: none (pattern, not a component)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-HEAD-01-AgentHeader.md` (this file)
- Implementation: `src/components/agent/AgentChat.tsx`
- Catalog index: `design/components/README.md`
