# SET-SEC-01 — SettingsSection
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`SET-SEC-01`

## Name
SettingsSection

## Responsibility
Eyebrow + card section shell for settings groups (inline pattern, no standalone file)

## Details
Implemented inline in `SettingsRoot.tsx:35-37`: per-section `space-y-2`
wrapper (`:35`), eyebrow `text-xs font-semibold uppercase tracking-wider
text-muted` (`:36`), card `bg-surface border border-border
rounded-[var(--radius-lg)] divide-y divide-border` (`:37`). There is NO
`src/components/settings/SettingsSection.tsx` (settings dir holds
`SettingsAbout/SettingsDataSharing/SettingsFavorites/SettingsMyTrips/SettingsProfile/SettingsRoot`
only). Same eyebrow+card grammar as `PwaInstallRow.tsx:19-21`.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §SET for canonical definition.

## Status
- Spec: defined
- Implementation: inline pattern in `src/components/settings/SettingsRoot.tsx:35-37` (no standalone file)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/SET-SEC-01-SettingsSection.md` (this file)
- Implementation: `src/components/settings/SettingsRoot.tsx` inline (note: `settings/`, not `set/`)
- Catalog index: `design/components/README.md`