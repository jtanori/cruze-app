# SET-ROOT-01 — SettingsList
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`SET-ROOT-01`

## Name
SettingsList

## Responsibility
Root settings list container

## Details
Eyebrow + card section pattern, repeated per section (`SettingsRoot.tsx:34-49`):
eyebrow `text-xs font-semibold uppercase tracking-wider text-muted`
(`SettingsRoot.tsx:36`) + card `bg-surface border border-border
rounded-[var(--radius-lg)] divide-y divide-border` (`SettingsRoot.tsx:37`).
Sections: PERFIL / GUARDADOS / PRIVACIDAD / INFORMACIÓN
(`SettingsRoot.tsx:24-29`); rows are full-width buttons `px-4 py-4`
with icon + label (`SettingsRoot.tsx:41-44`); no `h1` — hosting page's
`CruzeBackHeader` already titles the screen (`SettingsRoot.tsx:32`).
All labels via `t()` — no hardcoded strings. PWA install is NOT a
`SettingsRoot` section: `PwaInstallRow` is page-placed above `SettingsRoot`
in `src/app/[locale]/settings/page.tsx:18`.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §SET for canonical definition.

## Status
- Spec: defined
- Implementation: `src/components/settings/SettingsRoot.tsx` — eyebrow+card
  sections, callback-driven rows (`onProfile/onFavorites/onMyTrips/onDataSharing/onAbout/onContact`, `SettingsRoot.tsx:13-20,22`)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/SET-ROOT-01-SettingsList.md` (this file)
- Implementation: `src/components/settings/SettingsRoot.tsx` (note: `settings/`, not `set/`)
- Catalog index: `design/components/README.md`