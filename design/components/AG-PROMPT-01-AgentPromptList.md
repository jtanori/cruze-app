# AG-PROMPT-01 — AgentPromptList
**Version:** 1.2 — 2026-09-16 — full rewrite from v1.1 stub; no standalone file, inlined lists. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-PROMPT-01`

## Name
AgentPromptList

## Responsibility
Container rendering the set of suggested prompts (no standalone component).

## Details
No `AgentPromptList.tsx` exists. Two inline lists share `SUGGESTED_PROMPTS` (`AgentChat.tsx:13-18`): welcome full-width list `w-full space-y-2` with `bg-surface border-border rounded-md` rows (`AgentChat.tsx:184-194`) and guide pill-wrap list `flex flex-wrap gap-2` with `cruze-green/10` pills (`AgentChat.tsx:233-246`). All labels resolve via `t(key)` at render (`AgentChat.tsx:188-191,238-243`); clicks send the *translated* string (`AgentChat.tsx:188,239`). See AG-PROMPT-02 for the chip contract, AG-CHAT-01 for orchestration.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.2 inline-list contract)
- Implementation:
  - `src/components/agent/AgentChat.tsx` — two inline `SUGGESTED_PROMPTS.map` lists; key props: none (pattern, not a component)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-PROMPT-01-AgentPromptList.md` (this file)
- Implementation: `src/components/agent/AgentChat.tsx`
- Catalog index: `design/components/README.md`
