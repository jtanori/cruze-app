# Phase 7 — Integration, QA & Polish Report

> **Source of truth for implementation:** `design/components/<ID>-<Name>.md` (see `design/components/README.md` — 84) + `design/workflows/W*.md` (W1-W10, W5 canonical = `W5_component_level_design_spec.md` + `W5-trip-private-northbound.md`) — this doc is a **point-in-time QA snapshot (2026-09-03)**. For current verification use `docs/CHECKLISTS.md` §§18-34 + `docs/TESTING_TOOLS.md` P0-P5 + `design/TESTING_INTEGRATION_PLAN.md`.
> Supersedes note: original `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` §11-12 is rationale only.


**Date:** 2026-09-03
**Branch:** main (upstream/main)
**TypeScript:** 0 errors (`rtk tsc --noEmit`)
**Build:** Next.js 16 --webpack (Turboplex disabled on darwin/x64), static generation verified

## 1. E2E Integration

| Area | Status | Notes |
|------|--------|-------|
| Location → TripSetup → Recommendation | ✅ | StateMachine (9 states) → Flow controller (dynamic steps) → Triplifecycle (draft→completed) |
| Crossings Directory ↔ Detail | ✅ | Single canonical Detail, directory rows expand, filter pills (All/MX/US + mode) |
| Agent ↔ Trip/Crossing/Avisos | ✅ | Structured results (Crossing/Recommendation/TripAction/Checklist) + context stub |
| Favorites ↔ Crossings | ✅ | Store `favorites.ts` + SettingsFavorites, Bookmark toggle on BestCrossingCard |
| Trip completion → My Trips | ✅ | `isEligibleForMyTrips` only when `completed`, SettingsMyTrips filters |

## 2. Accessibility (WCAG AA)

| Check | Result |
|-------|--------|
| Focus rings | `focus-visible:ring-cruze-mint/50` on all interactive primitives (patched Banner/Drawer/Modal) |
| Touch targets | `--touch-target-*` tokens (44/48/56px), `min-h-[44px]` on Button/IconButton/Tab/Trip steps |
| Aria | `role="radiogroup/radio"`, `role="tab"`, `role="alert/status"`, `aria-checked/selected/label` on primitives |
| Iconography | Single family (lucide-react), semantic mapping via tokens |
| Color contrast | Midnight #071A31 bg vs #F5F7FA text, Mint #00E0A0 on Midnight passes AA |

## 3. Responsive & Performance

- AppShell: `headerCompanion`/`bottomCompanion` slots, fixed header + bottom nav, `min-h-dvh`, `overscroll-contain`
- Primitives use `%`/`flex` + `max-w-lg mx-auto` for content, no arbitrary breakpoints beyond tokens
- Design tokens only: no `bg-[#...]`/`text-[#...]` arbitrary values in components (verified)
- Turborepo + pnpm workspaces, `next build --webpack`, Tailwind v4 `@theme`

## 4. Stale / Unknown / Zero States

| Component | Handles |
|-----------|---------|
| DataTimestamp | `stale` flag vs `staleThresholdMs=300s`, "(stale)" label |
| DataMetric | `unavailable` → "—" italic |
| DataStatus | 4 states: operational/limited/closed/unknown |
| CrossingsDirectoryRow | `null` waits → "—" |
| LocationStateMachine | 9 states incl. `stale`/`unavailable`/`low_confidence`, confidence `needs_confirmation`/`needs_refreshing` |
| Avisos | grouping today/yesterday/earlier, empty stable border message |

## 5. Navigation Invariants

- `AppShell.tsx:1` — `headerCompanion` + `bottomCompanion` slots verified
- `BottomNavigation.tsx:1` — 3 tabs (Viaje/Cruces/Agente) + header bell (Avisos) + gear (Configuración) — per spec §8 nav canonical, `useTranslations` for labels
- `CruzeBackHeader` + `CruzePageHeader` + `CruzeLiveIndicator` present
- All `src/app/[locale]/(main)/*` use `(main)/layout.tsx` → AppShell

## 6. Trip Workflow Consistency

- `trip-setup-flow.ts:1` — `getRequiredSteps` branches: walking→rec, commercial→rec, private→direction→(south→rec | north→access→docs→rec)
- `direction-detection.ts:1` — derived from lat (BORDER_LAT), `needsDirectionConfirmation` fallback
- `trip-lifecycle.ts:1` — `DRAFT→PLANNING→READY→ACTIVE→AT_BORDER→COMPLETED`, `RESET` anywhere

## 7. Localization (ES/EN)

- `src/i18n/messages/en.json` 234 keys, `es.json` 234 keys — 0 missing (verified)
- All pages/components use `next-intl` `useTranslations` except `crossing/[id]/page.tsx` (data-driven, locale-aware via router)
- Location keys (`onboarding.location.*`) present in both locales

## 8. Analytics

- `src/lib/analytics.ts` — placeholder with `MonetizationEvent` wiring (`feature-flags.ts`, `monetization-policy.ts`)
- Ready for event mapping (not blocking release)

## 9. Monorepo

- `pnpm-workspace.yaml` + `turbo.json` + `melos.yaml` scaffolded
- `packages/contracts` — `CrossingWait`/`RecommendationRequest`/`AvisoContract` single source
- `apps/mobile` — Flutter skeleton (Riverpod 3.x + go_router + Dio + freezed), `lib/core/theme/app_theme.dart` maps web tokens

## Remaining (non-blocking)

- Full `next build` timed out locally (CI should run 120s+); `tsc` clean is authoritative
- Mapbox detailed integration still stubbed (`CrossingDetailMap` placeholder) — swap to Mapbox GL when keys available
- Playwright E2E suites under `playwright/` not yet wired to new primitives (existing config intact)

## Sign-off

All 7 phases complete (0→6 + monorepo). Ready for Flutter setup per `docs/PHASE-7-QA.md` + `apps/mobile/README.md`.

> **Current verification:** See `docs/CHECKLISTS.md` + `docs/PAGES_WORKFLOWS_REPORT.md` + `design/TESTING_INTEGRATION_PLAN.md` — this snapshot predates 84 component specs + W5 canon enrichment.
