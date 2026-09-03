# CRUZE — Integration Plan v3
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
| BottomSheet (Standard, Action, Detail) | | Open/closed | |
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
| Filter Pills (CR-DIR-05) | Spec §32 | All/MX/US, Auto/A pie/Comercial | 2 days |
| Sort Options | Spec §32 | Relevance, fastest, closest, name | 2 days |
| Crossings Directory Row Expanded | Spec §33, CR-DIR-03 | Lane info, access, hours, services | 4 days |
| Crossing Detail (C03) | Spec §34-35 | Canonical detail page | 5 days |
| Crossing Detail Hero (CR-DET-01) | Spec §35 | Hero with map, status, wait | 3 days |
| Lane Times Section (CR-DET-03) | Spec §35 | Standard/Ready/SENTRI with wait | 3 days |
| Access Section (CR-DET-04) | Spec §35 | Auto/A pie/Comercial/... | 2 days |
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

*Plan Version: 3.2 | Target: v3.0 Specification | Foundation-First Approach | Based on v3 Target Docs in /docs/ | Updated: 2026-09-02*