# Pages × Workflows Integration Report

**Generated:** 2026-09-03
**Source:** `design/INTEGRATION_PLAN.md` Phases 8-10, `docs/CHECKLISTS.md`, `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` Reference matrices
**Status:** Phase 8 compositions complete (Band 4), Phase 9 wiring in progress

## 1. Page Catalog (28 v3 pages)

| # | ID | Page | Route (`apps/web/src/app/[locale]/...`) | Components (Domain+Surface+Responsibility) | Primitives |
|---|----|------|------------------------------------------|--------------------------------------------|------------|
| 1 | L01 | Location Permission | `onboarding/location-permission/page.tsx` | LocationPermissionGate, LocationPermissionPrompt, LocationAcquisitionState, LocationRecoveryPanel, LocationConfidenceIndicator, LocationStatusBanner | Button, Spinner, Badge, Banner |
| 2 | L02 | Location Acquisition | *state within L01* (`acquiring`) | LocationAcquisitionState | Spinner, Stack |
| 3 | L03 | Location Recovery | *state within L01* (`permission_denied`/`low_confidence`/...) | LocationRecoveryPanel, LocationStatusBanner | Button, Banner, DataStatus |
| 4 | T02 | Destination | `trip/setup` (TripSetupDestinationStep) + `onboarding/destination` (legacy) | TripSetupDestinationStep, TripSetupProgress | SearchInput, Button, Stack, Section |
| 5 | T03 | Origin | `trip/setup` (TripSetupOriginStep) | TripSetupOriginStep, LocationConfidenceIndicator | Button, SearchInput, DataStatus |
| 6 | T04 | Travel Mode | `trip/setup` (TripSetupTravelModeStep) | TripSetupTravelModeStep | RadioGroup, Section, Stack |
| 7 | DIR | Direction | `trip/setup` (TripSetupDirectionStep) | TripSetupDirectionStep, direction-detection | RadioGroup |
| 8 | ACC | Vehicle Access | `trip/setup` (TripSetupVehicleAccessStep) | TripSetupVehicleAccessStep | RadioGroup |
| 9 | DOC | Document Profile | `trip/setup` (TripSetupDocumentProfileStep) | TripSetupDocumentProfileStep | RadioGroup, Banner |
| 10 | T07 | Recommendation | `trip/recommendation/page.tsx` | TripRecommendationPrimaryCard (TR-REC-01), TripRecommendationReasonList (TR-REC-02), TripAlternativeListSection (TR-REC-03/04) | DataMetric, DataDelta, Badge, Button, Section |
| 11 | T08 | Active Trip | `(main)/viaje/page.tsx` | TripStatusHeader, TripRouteSummary, TripActionBar (TR-ACT-03), TripChecklistSection (TR-ACT-04) | DataStatus, DataTimestamp, Button, Stack |
| 12 | T10 | Completion | `trip/completion/page.tsx` | TripCompletionPrompt (TR-COMP-01) | Button, Section, Stack |
| 13 | C01 | Crossings Directory | `(main)/crossings/page.tsx` | CrossingsDirectoryList, CrossingsDirectoryFilterBar (CR-DIR-05), CrossingsDirectoryRow (CR-DIR-02), CrossingsDirectoryExpandedRow (CR-DIR-03) | SearchInput, SegmentedControl, DataStatus, EmptyState |
| 14 | C03 | Crossing Detail (canonical) | `crossing/[id]/page.tsx` | CrossingDetailHero (CR-DET-01), CrossingDetailMap (C05), CrossingDetailLaneSection (CR-DET-03), CrossingDetailAccessSection (CR-DET-04), CrossingDetailHoursSection (CR-DET-05), CrossingDetailRequirementsSection (CR-DET-06), CrossingDetailRestrictionsSection (CR-DET-07), CrossingDetailServicesSection (CR-DET-08), CrossingDetailActionBar (CR-DET-10) + CruzeBackHeader | DataStatus, DataTimestamp, DataMetric, Badge, Button |
| 15 | C04 | Compare | *via* CrossingsCompareTable (C04) | CrossingsCompareTable (CMP) | DataMetric, DataDelta, Tab |
| 16 | C05 | Map | *via* CrossingDetailMap (C05) | CrossingDetailMap | Section, Stack |
| 17 | A01 | Agent Welcome | `(main)/agent/page.tsx` → AgentChat → AgentWelcomeScreen | AgentWelcomeScreen (A01), AgentChat (A02) | Button, TextInput, Avatar, Spinner |
| 18 | A02 | Agent Conversation | `(main)/agent/page.tsx` | AgentChat, AgentCrossingResult (AG-RESULT-01), AgentRecommendationResult (AG-RESULT-02), AgentTripAction (AG-RESULT-03), AgentChecklistResult (AG-RESULT-04) | Badge, DataMetric, Button |
| 19 | N01 | Avisos List | `(main)/alerts/page.tsx` (AvisosList) | AvisosList (N01), AvisoRow (AV-ROW-01) | Badge, EmptyState, Section |
| 20 | N02 | Aviso Detail | *via* AvisoDetail (N02) | AvisoDetail | Badge, Button |
| 21 | S01 | Settings Root | `settings/page.tsx` | SettingsRoot (S01) | Section, Stack, Divider |
| 22 | S02 | Profile | `settings/profile/page.tsx` | SettingsProfile (S02) | Select, Toggle, Section |
| 23 | S03 | Favorites | `settings/favorites/page.tsx` + `(main)/favorites/page.tsx` | SettingsFavorites (S03) | EmptyState, Button |
| 24 | S04 | My Trips | `settings/trips/page.tsx` | SettingsMyTrips (S04) | EmptyState, Section |
| 25 | S05 | Data Sharing | `settings/data-sharing/page.tsx` | SettingsDataSharing (S05) | Section, Banner |
| 26 | S06 | About | `settings/about/page.tsx` | SettingsAbout (S06) | Section, Stack |
| 27 | ONB | Onboarding Entry | `onboarding/page.tsx` | Redirect → destination | Spinner |
| 28 | CONF | Viaje Configure | `(main)/viaje/configure/page.tsx` | TripSetupFlow (re-entry) | Button, Section |

## 2. Workflow Definitions (10)

| Workflow | Spec | Pages (in order) | Branching |
|----------|------|------------------|-----------|
| **W1 Location** | Spec §2-3 | L01 → L02 → L03 → Viaje (or manual fallback) | StateMachine 9 states: uninitialized→requesting→acquiring→ready / denied→recovery |
| **W2 Trip Walking** | Spec §17 | T02 → T03 → T04(walking) → T07 | Minimal, no docs/access |
| **W3 Trip Commercial** | Spec §18 | T02 → T03 → T04(commercial) → T07 | Filter compatible crossings |
| **W4 Trip Private SB** | Spec §19 | T02 → T03 → T04(private) → DIR(south) → T07 | Derived direction, no access/docs |
| **W5 Trip Private NB** | Spec §19/21-22 | T02 → T03 → T04(private) → DIR(north) → ACC → DOC → T07 | Full: access + docs + lifecycle |
| **W6 Active Trip** | Spec §26-29 | T07 → T08 → T10 → S04 | Checklist, ActionBar, isEligibleForMyTrips (completed only) |
| **W7 Crossings** | Spec §30-40 | C01 → C03 → C04 (Compare) → Trip (Usar) | Canonical detail, 7 metrics |
| **W8 Agent** | Spec §41-44 | A01 → A02 (with/without context) | AG-RESULT-01..04, context: location/trip/crossing/avisos |
| **W9 Avisos** | Spec §45-46 | N01 → N02 → Trip/Agent | Group today/yesterday/earlier, WHAT/WHY/ACTION |
| **W10 Settings** | Spec §10-11/47-50 | S01 → S02/S03/S04/S05/S06 | Profile/Favorites/MyTrips isolation |

## 3. Pages × Workflows Matrix (✓ = participates)

| Page | W1 Loc | W2 Walk | W3 Comm | W4 PrivSB | W5 PrivNB | W6 Active | W7 Cross | W8 Agent | W9 Avisos | W10 Set | #W |
|------|--------|---------|---------|-----------|-----------|-----------|----------|----------|-----------|---------|----|
| L01 | ✓ | | | | | | | ✓ | | | 2 |
| L02 | ✓ | | | | | | | | | | 1 |
| L03 | ✓ | | | | | | | | | | 1 |
| T02 | | ✓ | ✓ | ✓ | ✓ | | | | | | 4 |
| T03 | ✓ | ✓ | ✓ | ✓ | ✓ | | | | | | 5 |
| T04 | | ✓ | ✓ | ✓ | ✓ | | | | | | 4 |
| DIR | | | | ✓ | ✓ | | | | | | 2 |
| ACC | | | | | ✓ | | | | | | 1 |
| DOC | | | | | ✓ | | | | | | 1 |
| T07 | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | | 8 |
| T08 | | | | | | ✓ | | ✓ | | | 2 |
| T10 | | | | | | ✓ | | | | ✓ | 2 |
| C01 | | | | | | | ✓ | ✓ | | | 2 |
| C03 | | | | | | ✓ | ✓ | ✓ | ✓ | | 5 |
| C04 | | | | | | | ✓ | | | | 1 |
| C05 | ✓ | | | | | | ✓ | | | | 2 |
| A01 | | | | | | | | ✓ | | | 1 |
| A02 | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | | 9 |
| N01 | | | | | | | | ✓ | ✓ | | 2 |
| N02 | | | | | | | ✓ | ✓ | ✓ | | 3 |
| S01 | | | | | | | | | | ✓ | 1 |
| S02 | | | | | | | | | | ✓ | 1 |
| S03 | | | | | | | ✓ | | | ✓ | 2 |
| S04 | | | | | | ✓ | | | | ✓ | 2 |
| S05 | | | | | | | | | | ✓ | 1 |
| S06 | | | | | | | | | | ✓ | 1 |
| ONB | | ✓ | ✓ | ✓ | ✓ | | | | | | 4 |
| CONF | | ✓ | ✓ | ✓ | ✓ | ✓ | | | | | 5 |

## 4. Coverage Summary

- **Total pages:** 28
- **Workflows:** 10
- **Most connected pages:** A02 Agent Conversation (9 workflows), T07 Recommendation (8), T03 Origin (5), C03 Detail (5)
- **Most isolated:** ACC/DOC/S05/S06/S01/S02 (1 workflow) — by design (specialized)
- **Coverage:** 28/28 pages participate in ≥1 workflow; 10/10 workflows have ≥2 pages

## 5. Component → Primitive Trace (sample)

- `TripRecommendationPrimaryCard` → DataMetric, DataDelta, Badge, Button, Stack, Section
- `TripChecklistSection` → Divider, Badge, Toggle, Stack
- `CrossingsDirectoryRow` → DataStatus, DataTimestamp, Badge, Tab
- `LocationPermissionPrompt` → Button, IconButton, Stack, EmptyState
- `AvisoRow` → Badge, DataTimestamp, Stack
- Full per-component trace in `design/COMPONENT-CATALOG.md` + `src/components/primitives/` (33/33)

## 6. Gaps / Next

- Legacy `onboarding/destination` + `starting-point` still use v2 `DestinationSearch` — redirect to `trip/setup` (TripSetupFlow) in Phase 8 cleanup
- `playwright/tests/screens-evidence.test.ts` is `describe.skip` until v3 screens wired per this matrix
- E2E `playwright` webServer now `pnpm --filter cruce-web dev` (monorepo) — re-enable after wiring

---
*Next: finish Phase 8 wiring (redirects) + Phase 9 E2E per workflow, then re-run `docs/CHECKLISTS.md` §§18-34 + 25-26.*
