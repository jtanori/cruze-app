# CRUZE — Integration Plan v3
**Version:** 1.1 — 2026-09-04 — 83 specs, W5 1.1. If version differs, revisit testing.

> **Source of truth for implementation:** `design/components/<ID>-<Name>.md` (see `design/components/README.md` — 83) + `design/workflows/W*.md` (W1-W10, W5 canonical = `W5_component_level_design_spec.md` + `W5-trip-private-northbound.md`) + `docs/TESTING_TOOLS.md` (P0-P5) → `design/TESTING_INTEGRATION_PLAN.md`.
> Original `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` §11-12 + `docs/CRUZE — Product, UX & Design System Specification.v1.md` are rationale only. See Addendum below for phasing.

## Target Specification Achievement Plan · Third Iteration

---

## Executive Summary

This plan defines the development roadmap to achieve the **v3 Target Specification** (documented in `/docs/CRUZE — Product, UX & Design System Specification.v1.md` and `/docs/CRUZE — UI Architecture & Implementation Reference.v1.md`).

**Current State**: v2.0 implementation (7 atomic commits, unified navigation, fixed Mexico pill, agent input bar fixed, unified layout)

**Target State**: v3.0 — Full achievement of the v1/v3 Target Specification as documented in the archived v1 documents

**Status**: v2.0 complete (7 atomic commits pushed). v3.0 target specification defined in archived v1 documents.

---

## Target Specification (v3) — End Goal

The archived v1 documents define the **complete target architecture**:

| Document | Purpose |
|----------|---------|
| `docs/CRUZE — Product, UX & Design System Specification.v1.md` | Complete product specification (3,269 lines) |
| `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` | Implementation companion with component catalogs, ASCII screens, matrices |

These archived v1 documents represent the **complete target architecture** for v3.

---

## Current State (v2.0) vs Target (v3.0) — Gap Analysis

### ✅ Already Implemented (v2.0 Complete)

| Area | Status | Notes |
|------|--------|-------|
| Unified Navigation (AppShell, TopAppBar, BottomNavigation) | ✅ | 5 tabs, consistent header, dropdown menu |
| Fixed Mexico Pill | ✅ | `bg-cruze-mint text-midnight` visible |
| Default MX Filter | ✅ | Default "MX" for Mexican users |
| Agent Fixed Input Bar | ✅ | Fixed above bottom nav |
| Unified Layout | ✅ | AppShell with headerCompanion/bottomCompanion |
| Pages Unified | ✅ | Viaje, Cruces, Alertas, Favoritos, Agente, Onboarding, Home |
| Crossings Filter Pills | ✅ | Moved to content area, `bg-cruze-mint text-midnight` |
| Agent Input Bar | ✅ | Fixed above bottom nav via bottomCompanion |
| TypeScript | ✅ | 0 errors |
| Design Tokens | ✅ | globals.css @theme |

### ❌ Missing for v3 Target (Gap Analysis)

| Target Area | Spec Reference | Current State | Effort |
|-------------|----------------|---------------|--------|
| **Location State Machine** | Spec §2 | Partial (basic geolocation only) | High |
| **Location Gate UX** | Spec §3 | Missing (no L01/L02/L03 screens) | High |
| **Location Confidence** | Spec §2.2 | Missing | Medium |
| **Trip Setup Controller** | Spec §14 | Hardcoded 3-step onboarding | High |
| **Trip Setup Flow** | Spec §15-22 | Hardcoded 3-step, not dynamic | High |
| **Travel Mode Branching** | Spec §16 | Partial (no branching logic) | High |
| **Direction Detection** | Spec §20 | Missing | Medium |
| **Access Type Selection** | Spec §21 | Partial (in onboarding only) | Medium |
| **Document Profile** | Spec §22 | Partial (in onboarding only) | Medium |
| **Trip Recommendation Screen** | Spec §23 | Partial (uses BestCrossingCard) | Medium |
| **Alternatives with Delta** | Spec §25 | Partial (TripSummary only) | Medium |
| **Active Trip Screen** | Spec §26 | Partial (TripSummary only) | High |
| **Pre-Crossing Checklist** | Spec §27 | Missing | High |
| **Trip Completion Flow** | Spec §29 | Missing | High |
| **Crossings Directory** | Spec §30-33 | Partial (no expand, no lane info) | High |
| **Crossing Detail** | Spec §34-35 | Partial (CrossingIntelligenceView) | High |
| **Crossing Compare** | Spec §39 | Missing | Medium |
| **Map Integration** | Spec §40 | Partial (mapbox in CrossingIntelligenceView) | High |
| **Agent Structured Results** | Spec §44 | Missing (only text chat) | High |
| **Agent Structured Results Types** | Spec §44 | Missing (AgentCrossingResult, etc.) | High |
| **Avisos System** | Spec §45-46 | Partial (basic list only) | High |
| **Contextual Avisos** | Spec §46 | Missing | High |
| **Favorites** | Spec §47 | Partial (basic list only) | Medium |
| **My Trips** | Spec §48 | Missing | Medium |
| **Settings Pages** | Spec §10, 51 | Missing (S02-S06) | Medium |
| **Location State Machine** | Spec §2 | Missing (L01-L03) | High |
| **Location Gate UX** | Spec §3 | Missing (L01) | High |
| **Trip Setup Controller** | Spec §14 | Hardcoded steps | High |
| **Trip Setup Flow** | Spec §15-22 | Hardcoded 3-step | High |
| **Pre-Crossing Checklist** | Spec §27 | Missing | High |
| **Trip Completion Flow** | Spec §29 | Missing | High |
| **Crossing Compare** | Spec §39 | Missing | Medium |
| **Agent Structured Results** | Spec §44 | Missing | High |
| **Avisos System** | Spec §45-46 | Partial | High |
| **Settings Pages** | Spec §10, 51 | Missing (S02-S06) | Medium |
| **Design System Primitives** | Spec §63 | Partial | Medium |
| **Component Naming Convention** | Spec §64 | Partial | Low |
| **App Shell Components** | Spec §65 | Partial | Medium |
| **Location Components** | Spec §66 | Missing | High |

---

## Phased Development Plan — v3 Achievement (Foundations First)

### Phase 0: Design System Foundations (Weeks 1-3) — **START HERE**
**Goal**: Complete Design System Foundations, UI Primitives, Component Catalog, Tokens — the foundation for all feature work

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| **Design Tokens Audit & Completion** | Spec §54-62 | All tokens in globals.css @theme (colors, spacing, radius, typography, shadows) | 2 days |
| **Color System** | Spec §54-55 | Semantic color tokens (mint, amber, red, blue, status variants) | 1 day |
| **Typography System** | Spec §56-57 | Sora/Inter fonts, numeric hierarchy, scale | 1 day |
| **Spacing & Radius Tokens** | Spec §58-59 | 4px base system, radius scale | 1 day |
| **Border & Shadow Tokens** | Spec §60 | Border system, elevation shadows | 1 day |
| **Iconography System** | Spec §61 | Single icon family, semantic mapping | 1 day |
| **Touch Target Standards** | Spec §62 | 44-48px minimum, interactive targets | 1 day |

| **UI Primitives Layer (38 primitives)** | Spec §63 | Canonical primitive implementations | 5 days |
|------------------------------------------|----------|--------------------------------------|--------|
| Button (Primary, Secondary, Ghost, Destructive) | | Default, pressed, disabled, loading | |
| IconButton (Standard, Compact, Prominent) | | Default, pressed, disabled | |
| TextInput (Standard, Search, Location, Destination) | | Empty, focused, filled, error | |
| SearchInput (Directory, Destination) | | Empty, typing, results, no results | |
| SegmentedControl (Standard, Filter) | | Selected, disabled | |
| RadioGroup (Standard, Card radio) | | Selected, error | |
| Checkbox (Standard, Checklist) | | Checked, unchecked, disabled | |
| Toggle (Standard, Settings) | | On, off, disabled | |
| Badge (Neutral, Recommendation, Count) | | Default | |
| StatusBadge (Operational, Freshness) | | Open, limited, closed, unknown | |
| Banner (Informational, Warning, Error, Success) | | Visible/dismissed | |
| EmptyState (Standard, Product-specific) | | Empty | |
| Skeleton (Text, Card, List, Metric) | | Loading | |
| Spinner (Standard, Inline, Page) | | Loading | |
| Divider (Standard, Section) | | Default | |
| BottomSheet (Standard, Action, Detail, Footer toolbar) | | Open/closed, portal, scroll-lock | |
| Modal (Standard, Confirmation) | | Open/closed | |
| DataMetric (Numeric, Large, Compact) | | Normal, unavailable | |
| DataDelta (Change: Positive, Negative, Neutral) | | Normal | |
| DataTimestamp (Time: Compact, Verbose) | | Current, stale | |
| DataStatus (Semantic: Operational, Freshness) | | All status states | |
| Divider, Stack, Inline, Section, Stack, Inline, Section | | | |
| Toggle, Select, RadioGroup, Checkbox | | | |

| **Domain Component Catalog** | Spec §64 | Domain + Surface + Responsibility naming | 2 days |
|--------------------------------|----------|------------------------------------------|--------|
| Component naming convention enforcement | Spec §64 | Domain + Surface + Responsibility pattern | |
| Component Variation Matrices | Spec §16 | All variations documented | 1 day |
| State Matrix Coverage | Spec §17 | All 12 states per component | 1 day |

| **App Shell Components** | Spec §65 | AppHeader, BottomNav, etc. | 2 days |
|----------------------------|----------|----------------------------|--------|
| CruzeAppHeader | | | |
| CruzeBottomNav | | | |
| CruzeNotificationButton | | | |
| CruzeSettingsButton | | | |
| CruzePageHeader | | | |
| CruzeBackHeader | | | |
| CruzeLiveIndicator | | | |

| **Location Components** | Spec §66 | Location components | 2 days |
|-------------------------|----------|---------------------|--------|
| LocationPermissionGate (LOC-GATE-01) | | | |
| LocationPermissionPrompt (LOC-PROMPT-01) | | | |
| LocationAcquisitionState (LOC-ACQ-01) | | | |
| LocationRecoveryPanel (LOC-REC-01) | | | |
| LocationConfidenceIndicator (LOC-CONF-01) | | | |
| LocationStatusBanner (LOC-STATUS-01) | | | |

| **Design Tokens Audit** | Spec §54-62 | All tokens in globals.css @theme | 1 day |
|-------------------------|-------------|----------------------------------|--------|

| **Component Variation Matrices** | Spec §16 | All variations documented | 1 day |
|----------------------------------|----------|--------------------------|--------|
| **State Matrix Coverage** | Spec §17 | All 12 states per component | 1 day |

**Exit Criteria**: Complete design system foundation — all tokens, 38 primitives, component catalog, naming conventions, variation matrices, state matrices documented and implemented. All feature work builds on this foundation.

---

### Phase 1: Location System (Weeks 4-6)
**Goal**: Complete Location System (L01-L03) and Location State Machine — built on design system foundation

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| Location Permission Screen (L01) | Spec §3, L01 | Gate screen with explanation, CTA, settings link | 3 days |
| Location Acquisition (L02) | Spec §2, L02 | GPS acquisition with confidence evaluation | 4 days |
| Location Recovery (L03) | Spec §2, L03 | Recovery flows for denied/disabled/low-confidence | 3 days |
| Location State Machine | Spec §2 | State machine implementation | 3 days |
| Location Confidence Indicator | Spec §2.2, LOC-CONF-01 | Confidence evaluation UI | 2 days |
| Location Status Banner | Spec §2, LOC-STATUS-01 | Semantic location state display | 2 days |

**Exit Criteria**: Location state machine complete, all L01-L03 screens implemented, confidence evaluation working — all using design system primitives

---

### Phase 2: Trip Setup Controller & Flow (Weeks 4-6)
**Goal**: Dynamic Trip Setup Controller with adaptive flow per travel mode — built on design system components

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| TripSetupFlow Controller | Spec §14 | Dynamic workflow controller | 5 days |
| Trip Setup Progress (TR-SETUP-01) | Spec §12.2, TR-SETUP-01 | Adaptive stepper | 3 days |
| Destination Step (T02, TR-SETUP-02) | Spec §15, T02 | Destination search + recent | 3 days |
| Origin Step (T03, TR-SETUP-03) | Spec §15, T03 | Current location default + override | 3 days |
| Travel Mode Step (T04, TR-SETUP-04) | Spec §16, T04 | Walking/Private/Commercial selection | 3 days |
| Private Vehicle Access Step | Spec §21, TR-SETUP-05 | Access type selection (northbound) | 3 days |
| Document Profile Step | Spec §22, TR-SETUP-06 | Optional document profile | 3 days |
| Direction Detection | Spec §20 | Derived + manual fallback | 2 days |
| Walking Flow | Spec §17 | Minimal flow (dest → origin → mode → rec) | 2 days |
| Commercial Flow | Spec §18 | Filter compatible crossings | 2 days |
| Private Vehicle Flow | Spec §19 | Direction → access → docs → rec | 3 days |
| Direction Detection Logic | Spec §20 | Derived + manual fallback | 2 days |

**Exit Criteria**: Dynamic TripSetupFlow working, all 6 steps implemented, adaptive branching per mode — all using design system components

---

### Phase 3: Trip Recommendation & Active Trip (Weeks 7-9)
**Goal**: Complete Recommendation Screen (T07) and Active Trip (T08) — built on design system

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| Recommendation Screen (T07) | Spec §23, T07 | Primary rec + alternatives + reasons | 4 days |
| Recommendation Primary Card (TR-REC-01) | Spec §23, TR-REC-01 | BestCrossingCard full variant | 2 days |
| Recommendation Reasons (TR-REC-02) | Spec §23, TR-REC-02 | "Why this one" section | 2 days |
| Alternatives List (TR-REC-03/04) | Spec §25, TR-REC-03/04 | Delta minutes, compare action | 3 days |
| Recommendation Ranking Labels | Spec §24 | Recomendado / Más rápido / Alternativa | 1 day |
| Active Trip Screen (T08) | Spec §26, T08 | TripSummary with BestCrossingCard | 4 days |
| Trip Action Bar (TR-ACT-03) | Spec §28 | Navegar / Ver cruce / Comparar | 2 days |
| Pre-Crossing Checklist (TR-ACT-04) | Spec §27 | Data-driven checklist | 4 days |
| Trip Completion (T10) | Spec §29, TR-COMP-01 | Completion + save to My Trips | 3 days |
| Trip Lifecycle State Machine | Spec §13 | DRAFT→PLANNING→READY→ACTIVE→COMPLETED | 3 days |

**Exit Criteria**: Full recommendation flow, active trip with checklist, completion flow — all using design system

---

### Phase 4: Crossings Directory & Detail (Weeks 10-12)
**Goal**: Complete Crossings Directory (C01) and Canonical Crossing Detail (C03) — built on design system

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| Crossings Directory (C01) | Spec §30-33 | Full directory with search, filters, rows | 5 days |
| Crossings Directory Row (CR-DIR-02) | Spec §33 | Name, status, NB/SB wait, expand | 3 days |
| Filter Pills (CR-DIR-05) | Spec §32 | SUPERSEDED — toolbar (CR-DIR-06) + sheet (CR-DIR-05A) | done |
| Sort Options | Spec §32 | NEAREST default; Relevancia, Más rápidos, Nombre | 2 days |
| Crossings Directory Row Expanded | Spec §33, CR-DIR-03 | Lane info, access, hours, services | 4 days |
| Crossing Detail (C03) | Spec §34-35 | Canonical detail page | 5 days |
| Crossing Detail Hero (CR-DET-01) | Spec §35 | Hero with map, status, wait | 3 days |
| Lane Times Section (CR-DET-03) | Spec §35 | Standard/Ready/SENTRI with wait | 3 days |
| Access Section (CR-DET-04) | Spec §35 | Vehículo/A pie/Comercial; sourced-data only (hidden when unsourced) | 2 days |
| Hours Section (CR-DET-05) | Spec §35 | Hours display | 2 days |
| Requirements Section (CR-DET-06) | Spec §38 | Progressive disclosure | 3 days |
| Restrictions Section (CR-DET-07) | Spec §35 | Restrictions display | 2 days |
| Services Section (CR-DET-08) | Spec §35 | Services display | 2 days |
| Action Bar (CR-DET-10) | Spec §35 | "Usar este cruce" CTA | 2 days |
| Crossing Compare (C04) | Spec §39 | Compare table with metrics | 4 days |
| Map Integration (C05) | Spec §40 | Mapbox integration | 4 days |

**Exit Criteria**: Full directory with search/filter/sort, canonical detail page, compare view

---

### Phase 5: Agent Intelligence & Structured Results (Weeks 13-15)

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| Agent Welcome (A01) | Spec §43, A01 | Welcome screen with prompts | 3 days |
| Agent Conversation (A02) | Spec §43, A02 | Message list + composer | 4 days |
| Agent Structured Results | Spec §44 | Structured result types | 5 days |
| AgentCrossingResult (AG-RESULT-01) | Spec §44 | Crossing card result | 3 days |
| AgentRecommendationResult (AG-RESULT-02) | Spec §44 | Recommendation + actions | 3 days |
| AgentTripAction (AG-RESULT-03) | Spec §44 | Navigate/Review/Finish actions | 3 days |
| AgentChecklistResult (AG-RESULT-04) | Spec §44 | Checklist result | 2 days |
| Agent Structured Responses | Spec §44 | Card + action buttons | 3 days |
| Agent Context Awareness | Spec §41 | Location, crossing, trip, profile | 3 days |
| Agent Prompts (A01) | Spec §43 | Contextual suggested prompts | 2 days |

**Exit Criteria**: Agent returns structured cards with actions, context-aware

---

### Phase 5: Avisos System & Contextual Intelligence (Weeks 16-17)

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| Avisos List (N01) | Spec §45, N01 | Grouped by time (today/yesterday/earlier) | 4 days |
| Aviso Row (AV-ROW-01) | Spec §45 | Timestamp, crossing, severity badge | 3 days |
| Aviso Types | Spec §45 | 7 types implemented | 3 days |
| Aviso Detail (N02) | Spec §46 | Detail view with Agent action | 3 days |
| Contextual Avisos | Spec §46 | Trip reminder, checklist reminder | 3 days |
| Avisos-Agent Integration | Spec §46 | Avisos surface → Agent explains | 3 days |
| Aviso Categories | Spec §45 | Today/Yesterday/Earlier grouping | 2 days |

---

### Phase 6: Settings & Profile (Weeks 18-19)

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| Settings Root (S01) | Spec §10, S01 | Settings list with sections | 2 days |
| Profile (S02) | Spec §11, S02 | Travel mode, access type, docs, SENTRI | 4 days |
| Favorites (S03) | Spec §47, S03 | Saved crossings list + management | 3 days |
| My Trips (S04) | Spec §48, S04 | Completed trips only | 3 days |
| Data Sharing (S05) | Spec §49, S05 | "Próximamente" placeholder | 1 day |
| About (S06) | Spec §50, S06 | Legal, privacy, version, data sources | 2 days |

---

### Phase 7: Integration, QA & Polish (Weeks 22-23)

| Task | Effort |
|------|--------|
| E2E Integration Testing | 4 days |
| Accessibility Audit (WCAG AA) | 3 days |
| Responsive Testing | 2 days |
| Performance Optimization | 3 days |
| Stale/Stale/Unavailable States | 2 days |
| Zero vs Unknown vs Stale | 2 days |
| Navigation Invariants Verification | 2 days |
| Trip Workflow Consistency | 2 days |
| Analytics Events | 2 days |
| Localization (ES/EN) Complete | 2 days |

---

### Phase 8: Screen Compositions — Band 4 (Weeks 24-27)

**Goal**: Compose all 28 v3 pages from primitives → domain components → screen compositions (Spec §53 — 4-layer architecture). Each page is built one-by-one per `UI Architecture Reference` component matrices + ASCII maps.

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| Location Compositions (3 pages) | Spec §2-3, UI §§4-5 | L01 Permission, L02 Acquisition, L03 Recovery — each composes LocationPermissionGate/Prompt/Acquisition/Recovery/Confidence/Status primitives | 4 days |
| Trip Setup Compositions (6 pages) | Spec §12-22, UI §§6-7 | T02 Destination, T03 Origin, T04 TravelMode, Direction, Access, DocumentProfile — each wires TripSetup*Step + Progress + direction-detection | 6 days |
| Trip Recommendation + Active Trip (3 pages) | Spec §23-29, UI §§8-9 | T07 Recommendation (PrimaryCard+ReasonList+Alternatives), T08 Active Trip (StatusHeader+RouteSummary+ActionBar+Checklist), T10 Completion | 6 days |
| Crossings Compositions (4 pages) | Spec §30-40, UI §§10-11 | C01 Directory (List+FilterBar+Row), C03 Canonical Detail (Hero+Lane+Access+Hours+Requirements+Restrictions+Services+ActionBar), C04 Compare, C05 Map | 6 days |
| Agent + Avisos Compositions (4 pages) | Spec §41-46, UI §§12-13 | A01 Welcome, A02 Conversation (structured results), N01 Avisos List, N02 Aviso Detail | 5 days |
| Settings Compositions (6 pages) | Spec §10-11/47-50, UI §§14-15 | S01 Root, S02 Profile, S03 Favorites, S04 My Trips, S05 DataSharing, S06 About | 4 days |
| Trip Workflow Wiring | Spec §14/16-20 | Wire each page through TripSetupFlow controller + direction-detection + lifecycle (walking/commercial/private branching) | 4 days |
| Navigation Wiring | Spec §14, UI §17 | Wire all pages through AppShell headerCompanion/bottomCompanion, 5 tabs, invariants (CHECKLISTS.md §§25-26) | 3 days |

**Exit Criteria**: All 28 pages composed per Reference component matrices, each passes `docs/CHECKLISTS.md:34` Page QA + `CHECKLISTS.md:18` Page Level

### Phase 9: Workflow Integration (Weeks 28-29)

**Goal**: Wire composed pages through distinct workflows and verify end-to-end

| Workflow | Pages Involved | Verify | Effort |
|----------|---------------|--------|--------|
| Location Workflow | L01 → L02 → L03 → Viaje (or manual fallback) | StateMachine 9 states, confidence, recovery | 2 days |
| Trip Setup Walking | T02 → T03 → T04(walking) → T07 | Minimal flow, no docs/access | 2 days |
| Trip Setup Commercial | T02 → T03 → T04(commercial) → T07 | Filter compatible crossings | 2 days |
| Trip Setup Private Southbound | T02 → T03 → T04(private) → Direction(south) → T07 | Derived direction, no access/docs | 2 days |
| Trip Setup Private Northbound | T02 → T03 → T04(private) → Direction(north) → Access → Docs → T07 | Full branching + lifecycle | 3 days |
| Active Trip + Completion | T07 → T08 → T10 → S04 My Trips | Checklist, ActionBar, isEligibleForMyTrips | 2 days |
| Crossings Workflow | C01 → C03 → C04 → Trip (Usar este cruce) | Canonical detail, compare metrics | 2 days |
| Agent Workflow | A01 → A02 (with/without trip/crossing/avisos context) | Structured results AG-RESULT-01..04 | 2 days |
| Avisos Workflow | N01 → N02 → Trip/Agent | WHAT/WHY/ACTION, grouping today/yesterday/earlier | 2 days |
| Settings Workflow | S01 → S02/S03/S04/S05/S06 | Profile/Favorites/MyTrips isolation | 2 days |

**Exit Criteria**: Every workflow traverses its pages with correct branching, navigation invariants hold, stale/unknown/zero handled

### Phase 10: Pages × Workflows Integration Report (Week 30)

**Goal**: Present auditable report mapping pages to workflows

| Task | Effort |
|------|--------|
| Build Pages × Workflows matrix (28 × 10) — which pages participate in which workflows | 2 days |
| Component → Primitive trace (per-page: components → primitives) | 2 days |
| Workflow coverage % + gaps | 1 day |
| Publish `docs/PAGES_WORKFLOWS_REPORT.md` (source: `docs/CHECKLISTS.md` + Reference matrices) | 1 day |

**Exit Criteria**: Report shows 100% page coverage, all workflows integrated, gaps explicitly listed

---

### Phase 11: Legacy → v3 Redirects (Week 31)

**Goal**: Remove v2 onboarding shims, redirect to unified Band 4 compositions

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| Redirect `onboarding/destination` + `starting-point` → `trip/setup` | Spec §14 | `apps/web/src/app/[locale]/onboarding/destination/page.tsx` + `starting-point` → `redirect('/trip/setup')` | 0.5 day |
| Consolidate `onboarding/recommendation` → `trip/recommendation` | Spec §23 | Single canonical T07 route, onboarding route becomes redirect | 0.5 day |
| Viaje configure re-entry | Spec §12 | `(main)/viaje/configure` → `trip/setup` with existing trip hydration | 0.5 day |

**Exit Criteria**: No legacy onboarding routes render v2 components; all entry points converge on `trip/setup` + `trip/recommendation`

### Phase 12: Real Data Wiring (Weeks 32-33) — Incremental (reuse existing)

**Goal**: Enable live CBP + Mapbox by wiring existing infrastructure (no green-field)

**Existing (reuse, do not rebuild):**
- `apps/web/src/app/api/cbp/route.ts:1` — route handler with `https://bwt.cbp.gov/api/waittimes`, `MOCK_CBP_DATA` fallback, `revalidate:300`, `x-last-updated` header (currently mock branch active)
- `apps/web/src/lib/cbp-api.ts:1` — `fetchCBPWaitTimes()` with `CACHE_TTL_MS=5min`, `parseDelay`, `mapPortToCrossingId` (15 crossings), `NormalizedCrossingWait` (lanes: Standard/SENTRI/Ready/FAST/Pedestrian), `CACHE`
- `apps/web/src/lib/border-data-service.ts:1` — `getMergedCrossingsData()`, `getCrossingWithLiveData()`, `getCrossingsWithLiveData()`, `estimateSouthboundWait` (70% NB), `FALLBACK_WAIT_TIMES` (15 crossings), `isLive` + `lastUpdated` + `lanesNorthbound/Southbound`
- `apps/web/src/lib/border-data.ts:1` — `BORDER_CROSSINGS` static (55+ ports), `findCandidateCrossings`, `haversineDistance`
- `apps/web/src/hooks/use-crossings-data.ts:1` + `apps/web/src/hooks/use-location-filter.ts:1` — already wrap `getMergedCrossingsData` + filter logic (My area, Open now, All/MX→US)
- `apps/web/src/lib/geocoding.ts:1` + `apps/web/src/lib/geofence-monitor.ts:1` + `mapbox-gl@3.29.0` already installed — prior `CrossingIntelligenceView` used Mapbox with marker-attached labels

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| Enable CBP live in C03 Detail | Spec §34-35 | `crossing/[id]/page.tsx:1` → uncomment `fetch` in `api/cbp/route.ts:42` → call `getCrossingWithLiveData(id)` (not `BORDER_CROSSINGS` mock 20/35) → drive `CrossingDetailHero` `DataTimestamp` + `DataStatus` `isLive` | 1 day |
| Enable Mapbox in C03/C05 | Spec §40 | `CrossingDetailMap.tsx:1` stub → restore `mapbox-gl` impl from `CrossingIntelligenceView` (marker labels) with `coordinates`, fallback static | 1 day |
| Compare route C04 (if needed) | Spec §39 | Only if standalone required: `crossings/compare/page.tsx` wiring existing `CrossingsCompareTable.tsx:1` (7 metrics) via `getMergedCrossingsData` | 1 day |
| Verify C01 live | Spec §31-32 | `C01` already live via `getMergedCrossingsData` in `(main)/crossings/page.tsx:1` (updated to `CrossingsDirectoryList`) — verify `isLive`/`hours`/`lanes` vs mock | 0.5 day |

**Exit Criteria**: `fetch` uncommented, C03/C01 show live CBP waits with `live`/`stale` indicators via existing `isLive`/`lastUpdated`, map renders via existing `mapbox-gl`, no hardcoded 15/20 min — all reuse `cbp-api` + `border-data-service` + hooks

### Phase 13: Store Persistence (Week 34) — Incremental (reuse existing)

**Goal**: Wire existing persist stores + local repos (no new storage layer)

**Existing (reuse, do not rebuild):**
- Stores already `persist` via `zustand/middleware`: `stores/favorites.ts:1` (`crossingIds`, `addFavorite`/`isFavorite`), `stores/location.ts:1`, `stores/trip.ts:1` (`persist: cruze-trip`), `stores/traveler.ts:1` (`cruze-traveler`), `stores/alerts.ts:1` (`cruze-alerts`, `alertsLastSeenAt`), `stores/agent.ts:1`, `stores/monetization.ts:1` — all `persist` + `localStorage`
- Local repos already exist as clean wrappers: `infrastructure/persistence/local/local-trip-repo.ts:1` (`TripRepository` with `get`/`set`/`getState`/`complete`/`localStorage cruze-trip`), `local-profile-repo.ts:1` (`LocalProfileRepository cruze-traveler`), `local-favorites-repo.ts:1` (`cruze-favorites`), `local-crossing-repo.ts:1`
- Domain types already: `domain/trip/types.ts:1`, `domain/crossing/types.ts:1`, `domain/recommendation/types.ts:1`, `domain/crossing-types.ts:1` + `types` barrel
- `trip-lifecycle.ts:1` `isEligibleForMyTrips` (only `completed`) already gates `S04`

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| Wire Profile persistence | Spec §11 | `settings/profile` → ensure `useTravelerStore` (persist) + optional `LocalProfileRepository` for typed access — verify hydration (currently `useState` local in `SettingsProfile.tsx:1` → swap to `useTravelerStore`) | 1 day |
| Verify Favorites persistence | `stores/favorites.ts:1` | `settings/favorites` + `crossing/[id]` bookmark already `persist`; verify `LocalFavoritesRepository` parity, no new code | 0.5 day |
| Wire My Trips persistence | `trip-lifecycle.ts:1` | `trip/completion` `complete()` already sets `status:completed` via `useTripStore` (persist); `settings/trips` reads `isEligibleForMyTrips` — add filter (currently `[]` mock in `settings/trips/page.tsx:1`) | 1 day |
| Verify Avisos persistence | `stores/alerts.ts:1` | `alerts` already `persist cruze-alerts` with `unreadCount`; grouping today/yesterday/earlier already in `[locale]/alerts/page.tsx:1` — verify survives reload, no new repo | 0.5 day |

**Exit Criteria**: `traveler`/`favorites`/`trip`/`alerts` survive reload via existing `persist`; `S04` shows only `completed` — wiring fixes, not new storage

### Phase 14: Polish — Proxy, Analytics, Loading/Error, Tests (Week 35) — Incremental

**Goal**: Close `CHECKLISTS.md:33` Component QA + `34` Page QA gaps by reusing existing primitives

**Existing (reuse):**
- `apps/web/src/lib/analytics.ts:1` + `lib/feature-flags.ts:1` + `lib/monetization-policy.ts:1` + `stores/monetization.ts:1` — `MonetizationEvent` types + `analytics` stub already wired to stores
- Primitives already: `LoadingSkeleton.tsx:1` (Text/Card/List/Metric), `Spinner.tsx:1`, `ErrorState.tsx:1`, `EmptyState.tsx:1` — for `loading.tsx`/`error.tsx`
- `playwright/tests/screens-evidence.test.ts:132` already `describe.skip` after monorepo fix (`playwright.config.ts:1` webServer `pnpm --filter cruce-web dev`), `vitest.config.ts:1` + `@testing-library` already in `apps/web/package.json:1`
- Libs already tested via `tsc`: `trip-setup-flow.ts:1`, `direction-detection.ts:1`, `location-state-machine.ts:1`, `trip-lifecycle.ts:1`, `avisos.ts:1`

| Task | Spec Ref | Deliverable | Effort |
|------|----------|-------------|--------|
| Proxy migration | Next.js 16 | `middleware` → `proxy` via `npx @next/codemod@canary middleware-to-proxy` (0.5 day) | 0.5 day |
| Analytics wiring | `lib/analytics.ts:1` | Wire existing `MonetizationEvent` to `TripSetupFlow`/`TripActionBar`/`AvisoDetail` per `CHECKLISTS.md:18` Analytics — no new lib | 1 day |
| Loading/Error per page | `CHECKLISTS.md:33-34` | Add `loading.tsx` (reuse `LoadingSkeleton`) + `error.tsx` (reuse `ErrorState`) for 23 pages — composition only | 1 day |
| Playwright v3 | `playwright/tests/screens-evidence.test.ts:132` | Un-skip `describe.skip` → rewrite existing selectors `text:Cruces`→`getByText('Cruces')`, assert per `PAGES_WORKFLOWS_REPORT.md:3` — reuse existing `playwright.config.ts` webServer | 2 days |
| Vitest unit | `CHECKLISTS.md:19` | Cover existing libs `trip-setup-flow`/`direction-detection`/`location-state-machine`/`trip-lifecycle` via `vitest.config.ts` + `@testing-library` — no new infra | 1 day |

**Exit Criteria**: `middleware` warning gone via existing codemod, analytics observable via existing `analytics.ts`, every page has loading/error via existing `LoadingSkeleton`/`ErrorState`, Playwright 12/12 green, unit coverage for existing lib

---

## Milestone Summary

| Milestone | Target Week | Key Deliverable |
|-----------|-------------|-----------------|
| **M0: Design System Foundations Complete** | **Week 3** | Tokens, 38 primitives, component catalog, tokens, naming |
| **M1: Location System Complete** | Week 6 | L01-L03 + State Machine |
| **M2: Trip Setup Flow Complete** | Week 6 | Dynamic TripSetupFlow |
| **M3: Recommendation + Active Trip** | Week 9 | T07, T08 complete |
| **M4: Crossings Directory + Detail** | Week 12 | C01, C03, C04 complete |
| **M5: Agent Intelligence** | Week 15 | Structured results, context awareness |
| **M6: Avisos System** | Week 17 | N01, N02, contextual avisos |
| **M6: Settings & Profile** | Week 19 | S01-S06 complete |
| **M7: Design System Complete** | Week 21 | Primitives, components, tokens |
| **M8: v3.0 Release Candidate** | Week 23 | All invariants, QA passed |
| **M9: Screen Compositions (Band 4)** | Week 27 | 28 pages composed per Reference matrices |
| **M10: Workflow Integration** | Week 29 | 10 workflows wired end-to-end |
| **M11: Pages × Workflows Report** | Week 30 | Auditable matrix 28×10 |
| **M12: Legacy → v3 Redirects** | Week 31 | No v2 onboarding shims |
| **M13: Real Data Wiring** | Week 33 | Live CBP + Mapbox, no mocks |
| **M14: Store Persistence** | Week 34 | Profile/favorites/trips persisted |
| **M15: Polish (Proxy/Analytics/Tests)** | Week 35 | 0 warnings, 12/12 Playwright green |

---

## Monorepo Structure (Web + Flutter)

The project will transition to a monorepo structure to support both the existing Next.js web app and the upcoming Flutter mobile app.

```
project-root/
├── apps/
│   ├── web/              # existing Next.js app (moved from root)
│   └── mobile/           # new Flutter app
├── packages/
│   ├── types/            # shared TypeScript/Dart types
│   └── api-client/       # shared API contracts
├── package.json          # root workspace (pnpm)
├── pnpm-workspace.yaml
├── turbo.json            # Turborepo config (JS side)
├── melos.yaml            # Melos config (Flutter side)
└── README.md
```

### Flutter Stack (Locked)

| Layer | Choice |
|-------|--------|
| State management | Riverpod 3.x (riverpod_annotation + riverpod_generator) |
| Navigation | go_router + go_router_builder (typed routes) |
| Architecture | Feature-first + Clean Architecture / MVVM |
| Monorepo tool | Melos (Flutter side) + Turborepo (JS side) |

### Shared Contracts

- API response types shared between Next.js and Flutter
- Crossing data model defined once, consumed by both apps
- Design tokens exported from web CSS → Flutter theme

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Location permission denial | High | L03 recovery flows, manual entry fallback |
| CBP API reliability | Medium | Cached data, stale indicators, graceful degradation |
| Mapbox integration complexity | High | Incremental integration, fallback to static maps |
| Agent structured results complexity | High | Incremental: cards first, then actions |
| CBP API rate limits | Medium | Caching layer, request batching |
| Location accuracy in border zones | High | Confidence indicators, manual override |
| Trip Setup branching complexity | High | Incremental: mode first, then branching |

---

## Success Criteria (v3.0 Definition of Done)

| Criterion | Target |
|-----------|--------|
| All v1/v3 spec screens implemented | 28/28 pages |
| All navigation invariants enforced | 10/10 invariants |
| All component checklists pass | 100% |
| TypeScript strict mode | 0 errors |
| Accessibility | WCAG AA |
| Performance | <3s initial load, <1s transitions |
| E2E workflows pass | 12/12 scenarios |
| Design token usage | 100% (no arbitrary values) |
| Accessibility | WCAG AA |

---

## Resource Allocation

| Role | Weeks 1-3 | Weeks 4-6 | Weeks 7-9 | Weeks 10-12 | Weeks 13-15 | Weeks 16-17 | Weeks 18-19 | Weeks 20-21 | Weeks 22-23 |
|------|-----------|-----------|-----------|-------------|-------------|-------------|-------------|-------------|-------------|
| Frontend Lead | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
| Frontend Engineer 1 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
| Frontend Engineer 2 | 0.5 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
| Backend/API | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 |
| QA | 0.25 | 0.25 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 1.0 | 1.0 |

---

## Next Immediate Actions (Week 1)

1. **Day 1-2**: Design Tokens Audit & Completion (colors, spacing, radius, typography, shadows)
2. **Day 3-4**: UI Primitives Layer — implement 38 primitives
3. **Day 5**: Component Catalog + Naming Convention + Variation Matrices
4. **Week 2**: App Shell Components + Location Components
5. **Week 3**: Component Variation Matrices, State Matrices, Design Tokens Audit

---

*Plan Version: 3.4 | Target: v3.0 Specification | Foundation-First + Band 4 + Workflows + Follow-up (Redirects/Data/Persistence/Polish) | Based on v3 Target Docs in /docs/ + CHECKLISTS.md + PAGES_WORKFLOWS_REPORT.md | Updated: 2026-09-03*
---

# Component Spec Integration — Addendum (2026-09-04)

## Source of Truth

| Layer | Source of truth | Supersedes |
|-------|-----------------|------------|
| Tokens, typography, spacing, radius, borders, touch targets, shell | `design/workflows/W5_component_level_design_spec.md` §1-2 | Product spec §65 tokens |
| Per-component ASCII, responsibility, states, composition | `design/components/<ID>-<Name>.md` + `design/components/README.md` index | UI Arch §5-10 catalogs (rationale only) |
| Workflow screen sequence, ASCII maps, QA checklists | `design/workflows/W*.md` (W1-W10) | UI Arch §11-13 screen maps (rationale) |
| Pages × Workflows matrix, decision freeze | `docs/PAGES_WORKFLOWS_REPORT.md` + Product spec §104-105 | — |

## Phasing (aligns to existing PHASE 0—14 in this doc)

| Phase | What | Component IDs | Workflow docs | Verification |
|-------|------|---------------|---------------|--------------|
| 0 Foundations | Midnight #071A31, Surface, Mint #00E0A0 per W5 §1 | — | — | Visual QA |
| 1 Shell | APP-HEAD-01, APP-AV-01, APP-SET-01, APP-NAV-01, APP-BACK-01 | W5 §3-6 | Header + bottom nav on all primary surfaces |
| 2 Location | LOC-GATE-01 .. LOC-NET-01 | W1 | State machine 9 states, L01/L02/L03 inline |
| 3 Trip Empty + Nearby | TR-EMPTY-01, TR-NEAR-01/02, LOC-STATUS-01, LOC-CONF-01 | W1 §T01, W5 §8/16-17 | T01 Viaje intelligence surface |
| 4 Trip Setup | TR-SETUP-01..06 + direction derived | W2-W5 | Adaptive questionnaire, direction engine MX→US |
| 5 Recommendation | TR-REC-01..04, CR-STATUS-01..05 | W5 §23-26 | RECOMENDADO primary card + alternatives |
| 6 Active + Completion | TR-ACT-01..04, TR-COMP-01 | W6 | EXECUTE → COMPLETED → S04 My Trips |
| 7 Crossings | CR-DIR-01..05, CR-DET-01..10, CR-CMP-01, CR-STATUS-* | W7 | C01→C03 canonical, 7 metrics |
| 8 Agent | AG-HEAD-01 .. AG-RESULT-04 | W8 | Context-aware A01→A02→A03 |
| 9 Avisos | AV-HEAD-01 .. AV-EMPTY-01 | W9 | Bell → N01→N02 → Trip/Agent |
| 10 Settings | SET-ROOT-01 .. SET-ABOUT-01 | W10 | Gear → S01 hub → 5 leaves |

## How to implement a component

1. Open its spec: `design/components/<ID>-<Name>.md`.
2. Use tokens from W5 §1-2 (§1.1 colors, §1.2 Sora/Inter, §1.3 4px spacing, §1.4 radius, §1.6 44-48px touch).
3. Compose primitives per Design Foundation hierarchy (Foundations → Primitives → Domain → Screen → Workflow) — W5 §37.
4. Verify against its workflow ASCII (`design/workflows/W*.md`) and Product spec §36-38 (operational ≠ freshness).

## Original specs — now reference only

- `docs/CRUZE — Product, UX & Design System Specification.v1.md` — product rationale, decision freeze (§104), one-flow (§105). **Do not implement directly from it; use design/components + design/workflows.**
- `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` — architecture catalog §5-10, screen maps §13, checklists. **Now index only; per-component specs are source of truth.**
