# CR-SUM-01 — CrossingSummary
**Version:** 1.0 — 2026-09-15 — backfilled for existing `crossing/[id]/summary` route (was unspecced).

## ID
`CR-SUM-01`

## Name
CrossingSummary

## Responsibility
Post-crossing confirmation: estimated vs actual times, contribution prompt, favorite/share/done actions.

## Details
Success header (crossing name) → stats card (estimated/actual/comparison/completedAt)
→ contribution prompt (or thanks state) → save-favorite / share / done actions.

## Rules
- All user-facing strings via `crossing.summary.*` i18n keys — no hardcoded
  English share text, no emoji status vocabulary (🟢/🟡/✓).
- Share uses `useShare` (Web Share API with clipboard fallback) — never
  `navigator.share` bare, so desktop always works.
- `completedAt` renders with explicit locale (`toLocaleTimeString(locale)`).
- Contribution submit flips local state only until a backend exists; record
  the intent, never fake persistence.

## Source
Backfilled from implementation, D2 decision.

## Status
- Spec: defined (aligned 2026-09-16)
- Implementation: `src/app/[locale]/crossing/[id]/summary/page.tsx` — Rules-compliant: useShare with clipboard fallback, dot + faster/slower keys (no emoji), share title/text keys, locale time. Fully i18n.
- Workflow usage: C03 exit → summary

## Tokens
W5 §1-2 foundations. Success tint `cruze-green/10`, radius 20px cards.

## Integration
Reached from crossing detail confirmation flows. Favorite via favorites store.

## File Reference
- Spec doc: `design/components/CR-SUM-01-CrossingSummary.md` (this file)
- Implementation: `src/app/[locale]/crossing/[id]/summary/page.tsx`
- Catalog index: `design/components/README.md`
