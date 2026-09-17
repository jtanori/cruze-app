> RETIRED — file deleted 2026-09-16; zero importers. Live welcome is the inline empty state in `AgentChat.tsx:174-195`. Restorable via git.

# AG-WEL-01 — AgentWelcome (RETIRED)
**Version:** retired — 2026-09-16 — file deleted; zero importers, live welcome is inline in AgentChat. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-WEL-01`

## Name
AgentWelcome

## Responsibility
Welcome state for the agent surface (DEAD CODE — live welcome is inline in AgentChat).

## Details
`AgentWelcomeScreen.tsx:17-42` renders centered Bot disc + `Hola. Soy Cruze.` (`AgentWelcomeScreen.tsx:26`) + Spanish description (`AgentWelcomeScreen.tsx:27`) + `contextPrompts ?? DEFAULT_PROMPTS` buttons (`AgentWelcomeScreen.tsx:18,30-38`) with `onPrompt` callback prop (`AgentWelcomeScreen.tsx:5-8`). DEAD: `(main)/agent/page.tsx:6-12` renders only `AgentProvider > AgentChat`; nothing imports `AgentWelcomeScreen`. The live welcome is the inline empty state in `AgentChat.tsx:174-195` using `t("agent.welcome")` / `t("agent.welcomeDescription")` (`AgentChat.tsx:180-181`). DEVIATION (do not bless): `DEFAULT_PROMPTS` hardcodes Spanish (`AgentWelcomeScreen.tsx:10-15`: `¿Qué cruces están disponibles?`, `¿Cuál me conviene más?`, `Revisa mi viaje`, `¿Qué debo revisar antes de cruzar?`); title/description hardcode Spanish (`AgentWelcomeScreen.tsx:26-27`); file has no `useTranslations`. Also stale token: `bg-cruze-mint/10` + `text-cruze-mint` (`AgentWelcomeScreen.tsx:22-23`) vs live `bg-cruze-green/10` + `text-cruze-green` (`AgentChat.tsx:176-177`). Action: delete file or align to i18n + green tokens before any reuse.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: retired (do not implement)
- Implementation:
  - `src/components/agent/AgentWelcomeScreen.tsx` — DELETED 2026-09-16 (was dead + deviating; restorable via git); live welcome is the inline empty state in `AgentChat.tsx:174-195`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-WEL-01-AgentWelcome.md` (this file)
- Implementation: `src/components/agent/AgentWelcomeScreen.tsx`
- Catalog index: `design/components/README.md`
