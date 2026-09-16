# SET-DATA-01 — DataSharingControls
**Version:** 2.0 — 2026-09-15 — placeholder retired; granular versioned consent toggles blessed (D1 decision). Prior: 1.1 placeholder ("Próximamente", no controls).

## ID
`SET-DATA-01`

## Name
DataSharingControls

## Responsibility
Granular privacy controls: contribution, personalized ads, analytics — each writing a versioned consent record with plain-language revocation.

## Details
Three `Toggle` rows (label + purpose description), a revocation note, and the
consent policy version line. Contribution doubles as the ad-light bargain
switch; revoking restores default ad behavior. Stale policy versions read as
denied (re-consent required). No fake toggles: every control writes
`recordConsent` with `CONSENT_POLICY_VERSION`.

## Source
W10 S05. Forward-compatible with PRIV-01 (notice link, document version, and
contact entry point land here in Plan B).

## Status
- Spec: defined (v2.0)
- Implementation: `src/components/settings/SettingsDataSharing.tsx`
- Workflow usage: W10

## Tokens
W5 §1-2 foundations. Rows `px-4 py-4`, dividers `border-border`, radius 12px.

## Integration
Backed by `stores/monetization.ts` (`toggleContribution`, `recordConsent`,
`hasConsent`) and `lib/consent.ts` (`CONSENT_POLICY_VERSION`).

## File Reference
- Spec doc: `design/components/SET-DATA-01-DataSharingControls.md` (this file)
- Implementation: `src/components/settings/SettingsDataSharing.tsx`
- Catalog index: `design/components/README.md`
