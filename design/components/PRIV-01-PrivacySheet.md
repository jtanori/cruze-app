# PRIV-01 — PrivacySheet
**Version:** 1.0 — 2026-09-16 — new spec; code comment already claims PRIV-01. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`PRIV-01`

## Name
PrivacySheet

## Responsibility
First-use privacy acknowledgement bottom sheet, once per document version.

## Details
Claims `PRIV-01` in code comment (`PrivacySheet.tsx:11-17`): "Shows once per privacy document version, after init and before personalized functionality. Location and push permissions stay separate flows. Necessary processing is never presented as optional." Renders `null` unless `visible && docVersion` (`PrivacySheet.tsx:52`). Version check: fetches `/api/legal/versions` (`PrivacySheet.tsx:33`), reads `data?.versions?.privacy?.version` (`PrivacySheet.tsx:37`), shows iff `!isAcknowledged(version)` (`PrivacySheet.tsx:40-42`); fetch failure "never blocks the app" (`PrivacySheet.tsx:44-46`). Sheet: `BottomSheet open={visible} onClose={() => {}} variant="detail"` (`PrivacySheet.tsx:71`) — non-dismissable by scrim/close. Acknowledgement semantics: `acknowledge({ documentKey: "privacy", documentVersion, locale, jurisdiction, withOptionals })` (`PrivacySheet.tsx:54-61`); jurisdiction derived from `location?.country` MX/US else `UNKNOWN` (`PrivacySheet.tsx:26-29`); "Without optionals explicitly denies the optional set": `recordConsent("analytics", false)` + `recordConsent("personalized_ads", false)` (`PrivacySheet.tsx:62-66`). Store is append-only, version-bound, re-review on bump (`privacy.ts:5-10,39-42`). Layout: eyebrow `t("privacy.sheet.eyebrow")` (`PrivacySheet.tsx:73-75`, es `PRIVACIDAD`), title/body + full-notice link `/{locale}/legal/privacy` (`PrivacySheet.tsx:76-85`), two CTAs h-12 (`PrivacySheet.tsx:87-98`), configure link `/{locale}/settings/data-sharing` (`PrivacySheet.tsx:99-104`). i18n: all copy via `t("privacy.sheet.*")` — clean, no hardcoded strings.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §PRIV for canonical definition (new section; code preceded spec).

## Status
- Spec: defined (v1.0 2026-09-16)
- Implementation:
  - `src/components/privacy/PrivacySheet.tsx` — version-gated acknowledgement sheet, non-dismissable, dual-CTA + configure link
  - `src/stores/privacy.ts` — append-only version-bound acknowledgement log (`cruze-privacy` persist)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Mounted once in `src/app/[locale]/layout.tsx:31` inside `LocationProvider`, alongside `CookieNotice` (`:32`); renders above all routes. Links out to legal + data-sharing surfaces.

## File Reference
- Spec doc: `design/components/PRIV-01-PrivacySheet.md` (this file)
- Implementation: `src/components/privacy/PrivacySheet.tsx`, `src/stores/privacy.ts`
- Catalog index: `design/components/README.md`
