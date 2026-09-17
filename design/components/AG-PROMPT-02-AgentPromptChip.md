# AG-PROMPT-02 — AgentPromptChip
**Version:** 1.2 — 2026-09-16 — full rewrite from v1.1 stub; no standalone file, inlined chips. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-PROMPT-02`

## Name
AgentPromptChip

## Responsibility
Single tappable suggested prompt (no standalone component).

## Details
No `AgentPromptChip.tsx` exists. Three inline chip variants: welcome rows (`AgentChat.tsx:186-193`: full-width, `text-left`, `active:bg-surface-subtle`), guide pills (`AgentChat.tsx:235-244`: `rounded-full`, `text-cruze-green`, `bg-cruze-green/10 border-cruze-green/30`, `hover:bg-cruze-green/20`), and `RichResponse` suggestion chips (`RichResponse.tsx:67-74`: same green pill + `ArrowRight w-3 h-3 inline mr-1` at `RichResponse.tsx:72`). Keys are `agent.suggest.*` (`AgentChat.tsx:13-18`); `RichResponse` chips render provider-supplied suggestion strings verbatim and call `onSuggestion` (`RichResponse.tsx:69`). All `AgentChat` chips send the translated string via `handleSend` (`AgentChat.tsx:124-126,188,239`).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.2 inline-chip contract)
- Implementation:
  - `src/components/agent/AgentChat.tsx` — inline prompt buttons; key props: none (pattern, not a component)
  - `src/components/agent/RichResponse.tsx` — suggestion chips; key props: `onSuggestion?: (suggestion: string) => void`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-PROMPT-02-AgentPromptChip.md` (this file)
- Implementation: `src/components/agent/AgentChat.tsx`, `src/components/agent/RichResponse.tsx`
- Catalog index: `design/components/README.md`
