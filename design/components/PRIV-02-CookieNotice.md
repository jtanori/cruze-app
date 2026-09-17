# PRIV-02 — CookieNotice
**Version:** 1.0 — 2026-09-16 — new spec; storage-transparency notice distinct from PRIV-01. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`PRIV-02`

## Name
CookieNotice

## Responsibility
Lightweight local-storage transparency notice with one-tap dismiss.

## Details
`DISMISSED_KEY = "cruze-cookie-notice-dismissed"` (`CookieNotice.tsx:7`); shows iff `localStorage` lacks the key (`CookieNotice.tsx:20-24`); dismiss writes `"1"` (`CookieNotice.tsx:32-39`); storage-unavailable stays silent rather than nagging (`CookieNotice.tsx:25-27,35-37`). Distinct from the privacy acknowledgement per code comment (`CookieNotice.tsx:9-14`): "covers local storage transparency, links the cookies document, and dismisses with one tap. Necessary storage is never presented as optional." Fixed bottom sheet: `role="region"`, `fixed bottom-[var(--nav-bottom-height)] left-0 right-0 z-[var(--z-overlay)] px-4 pb-3` (`CookieNotice.tsx:42-46`); card `bg-surface-elevated border border-border rounded-[var(--radius-lg)] p-4 shadow-xl space-y-3` (`CookieNotice.tsx:47`); single CTA h-11 (`CookieNotice.tsx:58-63`); cookies link `/{locale}/legal/cookies` (`CookieNotice.tsx:51-56`). i18n: all copy via `t("privacy.cookies.*")` (es title `Guardamos datos en tu dispositivo`) — clean, no hardcoded strings.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §PRIV for canonical definition (new section; code preceded spec).

## Status
- Spec: defined (v1.0 2026-09-16)
- Implementation:
  - `src/components/privacy/CookieNotice.tsx` — fixed bottom storage-transparency card, localStorage-gated, one-tap dismiss
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Mounted once in `src/app/[locale]/layout.tsx:32` inside `LocationProvider`, alongside `PrivacySheet` (`:31`). Sits above bottom nav via `--nav-bottom-height` offset.

## File Reference
- Spec doc: `design/components/PRIV-02-CookieNotice.md` (this file)
- Implementation: `src/components/privacy/CookieNotice.tsx`
- Catalog index: `design/components/README.md`
