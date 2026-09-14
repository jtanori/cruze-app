# CRUZE — UI Architecture & Implementation Reference
> **⚠️ SUPERSEDED FOR IMPLEMENTATION — Source of truth:** `design/components/<ID>-<Name>.md` (see `design/components/README.md` — 84 specs) + `design/workflows/W*.md` (W1-W10) + `design/workflows/W5_component_level_design_spec.md` (tokens) + `design/INTEGRATION_PLAN.md` Addendum.
> This document remains **product rationale / decision freeze only** (§104-105). Do not implement directly from it.


### Product Catalog · Component Matrices · ASCII Screen Maps · QA Checklists
### Supporting Document v1.0

---

# 0. Purpose

This document is the implementation companion to the Cruze Product, UX & Design System Specification.

It establishes:

1. Product catalog ASCII references
2. Per-page component matrices
3. Per-page ASCII diagrams with component references
4. Component-type / primitive / variation matrices
5. Implementation checklist matrices
6. Navigation and workflow consistency checklists

The purpose is to provide a common language between:

- Product
- UX
- UI
- Design System
- Frontend
- QA
- Data / intelligence
- Agent
- Future contributors

---

# 1. Component Reference Convention

Every domain component receives a stable reference ID.

Format:

```text
<DOMAIN>-<SURFACE>-<SEQUENCE>
```

Examples:

```text
LOC-GATE-01
TR-SETUP-03
TR-REC-01
CR-DIR-02
CR-DET-05
AG-RESULT-03
AV-ROW-01
SET-PROFILE-01
```

These IDs are **documentation identifiers**, not necessarily source-code names.

The source-code component should use the canonical contextual name.

Example:

```text
TR-REC-01
        ↓
TripRecommendationPrimaryCard
```

---

# 2. Domain Prefixes

| Prefix | Domain |
|---|---|
| `APP` | Application shell |
| `LOC` | Location |
| `TR` | Trip |
| `CR` | Crossings |
| `AG` | Agent |
| `AV` | Avisos |
| `SET` | Settings |
| `CMP` | Comparison |
| `MAP` | Map |
| `DS` | Design-system primitives |

---

# 3. Product Surface Catalog

```text
                                      ┌─────────────────────┐
                                      │       CRUZE         │
                                      │   Border Intelligence│
                                      └──────────┬──────────┘
                                                 │
                                         LOCATION READY
                                                 │
                    ┌────────────────────────────┼────────────────────────────┐
                    │                            │                            │
                    ▼                            ▼                            ▼
              ┌───────────┐                ┌───────────┐                ┌───────────┐
              │  VIAJE    │                │  CRUCES   │                │  AGENTE   │
              │    TR     │                │    CR     │                │    AG     │
              └─────┬─────┘                └─────┬─────┘                └─────┬─────┘
                    │                            │                            │
          ┌─────────┼──────────┐         ┌───────┼────────┐             ┌─────┴─────┐
          │         │          │         │       │        │             │           │
          ▼         ▼          ▼         ▼       ▼        ▼             ▼           ▼
       Nearby     Setup   Recommendation Directory Detail Compare     Conversation Results
          │         │          │            │       │       │             │
          │         │          │            │       │       │             │
          └─────────┴──────────┴────────────┴───────┴───────┴─────────────┘
                                      │
                              SHARED INTELLIGENCE
                                      │
                ┌─────────────────────┼─────────────────────┐
                ▼                     ▼                     ▼
             AVISOS                LOCATION               PROFILE
                │                     │                     │
                └─────────────────────┼─────────────────────┘
                                      │
                                  SETTINGS
```

---

# 4. Global Application Shell

```text
┌─────────────────────────────────────────────────────────┐
│ [APP-HEAD-01] CRUZE      CRUCES        [APP-AV-01] 🔔  │
│     (left 30%)        (centered)         [APP-SET-01] ⚙ │
├─────────────────────────────────────────────────────────┤
│ [APP-COMPANION-01] search / filter companion (per-page) │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    PAGE CONTENT                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [APP-NAV-01] Viaje      Cruces       Agente             │
└─────────────────────────────────────────────────────────┘
```

Header zones: left (brand/back, 30%), center (route title, viewport-centered
via measured equal side widths — ResizeObserver takes max(left, right)),
right (actions/helpers, 30%). The notification badge stays owned by
`APP-AV-01`; it never moves into the title zone. Route titles: CRUCES /
AGENTE / FAVORITOS / AVISOS; Trip shows brand only. `headerCompanion`
(`HeaderCompanionContext`) lets a page portal fixed chrome under the header
(C01 portals its search/filter toolbar there); AppShell offsets content
accordingly (+64px).

## Global components

| Ref | Component | Source name |
|---|---|---|
| `APP-HEAD-01` | Application header | `CruzeAppHeader` (`TopAppBar`: 3-zone, measured centering) |
| `APP-AV-01` | Avisos trigger | `CruzeNotificationButton` (owns unread badge) |
| `APP-SET-01` | Settings trigger | `CruzeSettingsButton` |
| `APP-COMPANION-01` | Header companion slot | `HeaderCompanionContext` (per-page fixed chrome) |
| `APP-NAV-01` | Primary navigation | `CruzeBottomNav` (68px) |
| `APP-LIVE-01` | Global/live indicator | `CruzeLiveIndicator` |
| `APP-PAGE-01` | Page header | `CruzePageHeader` |
| `APP-BACK-01` | Back navigation | `CruzeBackHeader` |

---

# 5. Location Product Catalog

```text
LOCATION
│
├── Permission
│   └── LOC-GATE-01 LocationPermissionGate
│
├── Prompt
│   └── LOC-PROMPT-01 LocationPermissionPrompt
│
├── Acquisition
│   └── LOC-ACQ-01 LocationAcquisitionState
│
├── Recovery
│   ├── LOC-REC-01 LocationRecoveryPanel
│   └── LOC-SEARCH-01 LocationSearchInput
│
├── Search
│   └── LOC-SUGGEST-01 LocationSearchSuggestions
│
├── Confidence
│   └── LOC-CONF-01 LocationConfidenceIndicator
│
├── Status
│   └── LOC-STATUS-01 LocationStatusBanner
│
└── Network
    └── LOC-NET-01 LocationNetworkStatus
```

ASCII:

```text
┌───────────────────────────────────────┐
│              LOC-GATE-01              │
│                                       │
│              ¿Dónde estás?            │
│                                       │
│  Cruze necesita tu ubicación para     │
│  encontrar los cruces relevantes.     │
│                                       │
│        [ LOC-PROMPT-01 ]              │
│       Permitir ubicación              │
│                                       │
└───────────────────────────────────────┘
```

L03 — Location Recovery with Manual Search:

```text
┌───────────────────────────────────────┐
│                                       │
│     No se pudo obtener tu             │
│     ubicación por GPS.                │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ 🔍 LOC-SEARCH-01                │  │
│  │ Buscar ubicación...             │  │
│  └─────────────────────────────────┘  │
│                                       │
│  LOC-SUGGEST-01                       │
│  Tijuana, BC                          │
│  Mexicali, BC                         │
│  Ciudad Juárez, CHIH                  │
│                                       │
│  ─────────── o ───────────            │
│                                       │
│  [ Reintentar GPS ]                   │
│  [ Configuración del sistema ]        │
│                                       │
└───────────────────────────────────────┘
```

---

# 6. Trip Product Catalog

```text
TRIP
│
├── Empty
│   ├── TR-HERO-01 TripHero
│   ├── TR-EMPTY-01 TripDestinationSearch
│   └── TR-NEAR-01 TripNearbyCrossingsSection
│
├── Nearby
│   └── TR-NEAR-02 TripNearbyCrossingRow
│
├── Setup
│   ├── TR-SETUP-01 TripSetupProgress
│   ├── TR-SETUP-02 TripSetupDestinationStep
│   ├── TR-SETUP-03 TripSetupOriginStep
│   ├── TR-SETUP-04 TripSetupTravelModeStep
│   ├── TR-SETUP-05 TripSetupVehicleAccessStep
│   └── TR-SETUP-06 TripSetupDocumentProfileStep
│
├── Recommendation
│   ├── TR-REC-01 TripRecommendationPrimaryCard
│   ├── TR-REC-02 TripRecommendationReasonList
│   ├── TR-REC-03 TripAlternativeListSection
│   └── TR-REC-04 TripAlternativeListRow
│
├── Active
│   ├── TR-ACT-01 TripStatusHeader
│   ├── TR-ACT-02 TripRouteSummary
│   ├── TR-ACT-03 TripActionBar
│   ├── TR-ACT-04 TripChecklistSection
│   └── TR-ACT-05 TripStalePrompt
│
└── Completion
    └── TR-COMP-01 TripCompletionPrompt
```

# 6b. Architecture Registry — Domain Hooks & Services

UI components live in the catalogs above. Implementation utilities live here.

```text
DOMAIN — location (Mapbox is the authority; geometry never guesses)
├── resolveCountryFromCoordinates(lat, lng)   pure fallback: exclusive boxes → MX/US;
│                                             overlap/out-of-bounds → UNKNOWN
├── resolveUserCountry(lat, lng, geocoded?)   precedence: geocoded (HIGH) → coordinates (MEDIUM) → UNKNOWN (LOW)
├── geocoding country params (strict)         forward search filters to target side; reverse constrains mx,us
└── contextualDirectionForCountry(country)    T01 contextual direction (UNKNOWN → null, unfiltered)
UNKNOWN consumer contract: TopBar badge hidden · search unfiltered + generic copy ·
  hero generic body · nearby omits direction (API default applies)

FOLLOW-UP REVISIONS (post Phase G)
R1 — service-layer honesty: mergeWithCBPData/getMergedCrossingsData null-paths
  return UNKNOWN + null waits/hours (delete FALLBACK_WAIT_TIMES); lands with
  the Phase E backend migration; acceptance: no || "OPEN" / || 20 /
  || "Open 24 hours" remains.
R2 — C01 location-gate wiring: denied/unavailable → inline recovery;
  MX/US → default "Cerca de ti"; UNKNOWN → explicit "Toda la frontera";
  scope flows into the §34 query. Lands after the toolbar rebuild.

FOUR SEPARATE CONCEPTS (never collapse):
  location availability (hook state: acquiring/ready/denied…) — gates recovery UI
  country resolution (MX/US/UNKNOWN + confidence) — gates contextual defaults
  operational state (OPEN/LIMITED/CLOSED/UNKNOWN) — per crossing, data-driven
  freshness (timestamp or nothing) — per value, never invented
UNKNOWN country → explicit unfiltered scope ("Toda la frontera");
  never manufacture "Cerca de ti" without resolved country semantics.
Direction hierarchy: trip direction → contextualDirectionForCountry → null (both).

DOMAIN — trip
├── useNearbyCrossings(location)              candidates → normalize → rank → 2–3 (+ contextual direction)
├── useTripStaleness()                        trip-lifecycle staleness only (never crossing freshness)
├── isTripStale(lastEvaluatedAt)              pure lifecycle predicate
├── buildSetupUrl() / buildMapsUrl()          pure navigation builders
├── mapPlaceToDestination(place)              Mapbox Place → domain destination
└── trip-handoff (?dest=/?crossing=)          parse → resolve candidate → compat guard;
                                              crossing is CANDIDATE, never silent overwrite

DOMAIN — crossings
├── NETWORK RULE: browser fetches crossing data only via /api/*.
│   Direct bwt.cbp.gov calls live server-side only (border-data-service,
│   consumed by API routes). No exceptions.
├── fetchMergedCrossings()                    client choke point → GET /api/crossings/merged
│                                             (full dataset, both directions; favorites/alerts/
│                                             agent/intelligence/detail all use this)
├── normalizeCrossings(items)                 typed API normalization (no any-casts)
├── rankCrossings(list)                       INTERIM relevance rank until backend ranks
├── compareCrossings(inputs, opts)            C04: viaje/distancia/winner/compat (pure, tested)
├── formatFreshness(ts, t)                    shared short-form freshness (single source)
├── buildCrossingSharePayload(input)          C03 ↗: omission-safe snapshot (unknown→explicit line,
│                                             missing waits/freshness omitted; locale-aware URL)
└── agent pendingContext (NON-PERSISTED)      C03→Agent one-shot handoff: set → navigate →
                                              consume → clear. Direct launches never inherit.
├── useCrossingsCompare(ids, …)               C04 data owner (origin: trip → location)
├── parseCrossingsQuery(params)               W7 §34: validated scope/mode/status/search/sort/
│                                             direction/cursor/limit (+lat/lng); safe defaults
├── applyCrossingsQuery(items, query)         server filter/rank/sort/paginate → items/total/
│                                             nextCursor/hasMore/scope (NEARBY w/o coords → ALL)
└── useCrossingsDirectory(…)                  C01 data owner (debounced search, cursor append)

QUERY CONTRACT (W7 §34, implemented in /api/crossings):
  scope: NEARBY (needs lat/lng) | MX | US | ALL — scopes label, never exclude (all POEs binational)
  sort: RELEVANCE (status → wait → freshness → distance) | FASTEST | NEAREST | NAME
  mode/status filters pass through unknown data (absence ≠ incompatibility)
  cursor: offset-based; limit default 10, max 50; directory sort default NEAREST
  response: { crossings (compat slice), total, nextCursor, hasMore, scope }
  R1 PENDING: manufactured OPEN/fallback waits still flow from border-data-service.
```

---

# 7. Crossings Product Catalog

```text
CROSSINGS
│
├── Directory
│   ├── CR-DIR-01 CrossingsDirectoryList (presentational; data via useCrossingsDirectory)
│   ├── CR-DIR-02 CrossingsDirectoryRow (name + Norte/Sur waits + chevron, py-2.5)
│   ├── CR-DIR-03 CrossingsDirectoryExpandedRow (lanes/hours/services conditional)
│   ├── CR-DIR-04 CrossingsDirectorySearchInput (h-11, native clear hidden)
│   ├── CR-DIR-06 CrossingsDirectoryToolbar (search + ≡ trigger w/ count badge)
│   ├── CR-DIR-05A CrossingsDirectoryFilterSheet (BottomSheet + draft RadioGroups + fixed Aplicar footer)
│   ├── CR-DIR-07 CrossingsDirectorySummary (total + scope copy)
│   ├── CR-DIR-08 SortControl (compact select, default NEAREST: Más cercanos first)
│   └── CR-DIR-09 CrossingsDirectoryLoadMoreState (Cargar más / spinner)
│   └── (removed) CR-DIR-05 CrossingsDirectoryFilterBar — superseded by 05A sheet
│
├── Status
│   ├── CR-STATUS-01 CrossingStatusBadge
│   ├── CR-STATUS-02 CrossingDirectionTimes
│   ├── CR-STATUS-03 CrossingWaitTime
│   ├── CR-STATUS-04 CrossingWaitDelta
│   └── CR-STATUS-05 CrossingFreshness
│
├── Detail
│   ├── CR-DET-01 CrossingDetailHero
│   ├── CR-DET-02 CrossingDetailMap
│   ├── CR-DET-03 CrossingDetailLaneSection
│   ├── CR-DET-04 CrossingDetailAccessSection
│   ├── CR-DET-05 CrossingDetailHoursSection
│   ├── CR-DET-06 CrossingDetailRequirementsSection
│   ├── CR-DET-07 CrossingDetailRestrictionsSection
│   ├── CR-DET-08 CrossingDetailServicesSection
│   ├── CR-DET-09 CrossingFavoriteButton
│   └── CR-DET-10 CrossingDetailActionBar
│
└── Compare
    └── CR-CMP-01 CrossingsCompareTable
```

---

# 8. Agent Product Catalog

```text
AGENT
│
├── AG-HEAD-01 AgentHeader
├── AG-WEL-01 AgentWelcome
├── AG-PROMPT-01 AgentPromptList
├── AG-PROMPT-02 AgentPromptChip
├── AG-MSG-01 AgentMessageList
├── AG-MSG-02 AgentMessage
├── AG-COMP-01 AgentComposer
│
└── Results
    ├── AG-RESULT-01 AgentCrossingResult
    ├── AG-RESULT-02 AgentRecommendationResult
    ├── AG-RESULT-03 AgentTripAction
    └── AG-RESULT-04 AgentChecklistResult
```

---

# 9. Avisos Catalog

```text
AVISOS
│
├── AV-HEAD-01 AvisosSheet
├── AV-BADGE-01 AvisosBadge
├── AV-ROW-01 AvisoRow
│
├── Specialized
│   ├── AV-CROSS-01 AvisoCrossingChange
│   ├── AV-REC-01 AvisoRecommendationChange
│   ├── AV-TRIP-01 AvisoTripReminder
│   ├── AV-CHECK-01 AvisoChecklistReminder
│   └── AV-DATA-01 AvisoDataWarning
│
└── AV-EMPTY-01 AvisosEmptyState
```

---

# 10. Settings Catalog

```text
SETTINGS
│
├── SET-ROOT-01 SettingsList
├── SET-SEC-01 SettingsSection
│
├── Profile
│   └── SET-PROFILE-01 ProfileSettings
│
├── Favorites
│   └── SET-FAV-01 FavoriteCrossingsList
│
├── My Trips
│   └── SET-TRIP-01 SavedTripsList
│
├── Data Sharing
│   └── SET-DATA-01 DataSharingPlaceholder
│
└── About
    └── SET-ABOUT-01 AboutLinksList
```

---

# 11. Page Inventory

| Ref | Page | Primary purpose |
|---|---|---|
| `L01` | Location Permission | Establish location |
| `L02` | Location Acquisition | Acquire/validate location |
| `L03` | Location Recovery | Recover location (GPS retry + manual search) |
| `T01` | Trip Empty | First/default Trip surface |
| `T02` | Trip Destination | Select destination |
| `T03` | Trip Origin | Confirm origin |
| `T04` | Travel Mode | Select mode |
| `T05` | Vehicle Access | Private northbound context |
| `T06` | Document Profile | Optional document context |
| `T07` | Recommendation | Select best crossing |
| `T08` | Active Trip | Execute trip |
| `T09` | Trip Settings | Modify active trip |
| `T10` | Completion | Complete/save trip |
| `C01` | Crossings Directory | Live border overview |
| `C02` | Search/Filter | Refine crossings |
| `C03` | Crossing Detail | Complete crossing information |
| `C04` | Compare | Compare crossings |
| `C05` | Map | Geographic context |
| `A01` | Agent Welcome | Start interaction |
| `A02` | Agent Conversation | Ask/receive |
| `A03` | Agent Result | Structured action/result |
| `N01` | Avisos | Review changes |
| `N02` | Aviso Detail | Understand change |
| `S01` | Settings | Settings root |
| `S02` | Profile | Local profile |
| `S03` | Favorites | Saved crossings |
| `S04` | My Trips | Completed trips |
| `S05` | Data Sharing | Coming Soon |
| `S06` | About | Legal/product information |

---

# 12. Per-Page Component Matrix

## 12.1 Location

| Page | Components | Required | Optional |
|---|---|---|---|
| `L01` | `LOC-GATE-01`, `LOC-PROMPT-01` | Gate, explanation, CTA | Settings shortcut |
| `L02` | `LOC-ACQ-01`, `LOC-CONF-01` | Acquisition state | Cancel |
| `L03` | `LOC-REC-01`, `LOC-SEARCH-01`, `LOC-SUGGEST-01`, `LOC-STATUS-01` | Recovery, search, suggestions | Technical explanation |

---

## 12.2 Trip

| Page | Components | Required | Conditional |
|---|---|---|---|
| `T01` | `TR-HERO-01`, `TR-EMPTY-01` (DestinationSearch), `TR-NEAR-01`, `TR-NEAR-02`, `LOC-STATUS-01` | Hero + destination search, nearby preview | Last trip |
| `T02` | `APP-BACK-01`, `TR-SETUP-01`, `TR-SETUP-02` | Destination input | Recent destinations |
| `T03` | `APP-BACK-01`, `TR-SETUP-01`, `TR-SETUP-03` | Origin | Current location |
| `T04` | `APP-BACK-01`, `TR-SETUP-01`, `TR-SETUP-04` | Travel modes | Profile shortcut |
| `T05` | `APP-BACK-01`, `TR-SETUP-05` | Access selection | Help |
| `T06` | `APP-BACK-01`, `TR-SETUP-06` | Document categories | Skip |
| `T07` | `TR-REC-01`, `TR-REC-02`, `TR-REC-03`, `TR-REC-04` | Recommendation | Compare |
| `T08` | `TR-ACT-01..05` | Trip status, route, action, checklist, stale prompt | Aviso banner |
| `T09` | `TR-SETUP-*` | Relevant editable fields | Reset |
| `T10` | `TR-COMP-01` | Completion | Save |

---

## 12.3 Crossings

| Page | Components | Required | Conditional |
|---|---|---|---|
| `C01` | `CR-DIR-01..04`, `CR-DIR-06`, `CR-DIR-05A`, `CR-DIR-07..09`, `CR-STATUS-*` | Toolbar + sheet + summary/sort, rows | Expansion |
| `C02` | `CR-DIR-04`, `CR-DIR-05` | Search/filter | Sort |
| `C03` | `CR-DET-01..10` | Hero, status, wait, actions | Detail sections |
| `C04` | `CR-CMP-01` | Comparison | Compatibility filter |
| `C05` | `CR-DET-02` / `MAP-*` | Map | Route overlay |

---

## 12.4 Agent

| Page | Components | Required | Conditional |
|---|---|---|---|
| `A01` | `AG-HEAD-01`, `AG-WEL-01`, `AG-PROMPT-01`, `AG-PROMPT-02`, `AG-COMP-01` | Welcome, prompts, composer | Context |
| `A02` | `AG-HEAD-01`, `AG-MSG-01`, `AG-MSG-02`, `AG-COMP-01` | Messages, composer | Results |
| `A03` | `AG-RESULT-*` | Structured result | Contextual actions |

---

## 12.5 Avisos

| Page | Components | Required | Conditional |
|---|---|---|---|
| `N01` | `AV-HEAD-01`, `AV-BADGE-01`, `AV-ROW-01`, `AV-EMPTY-01` | List/empty state | Category filters |
| `N02` | specialized Aviso component | Event detail | Agent action |

---

## 12.6 Settings

| Page | Components | Required |
|---|---|---|
| `S01` | `SET-ROOT-01`, `SET-SEC-01` | Settings list |
| `S02` | `SET-PROFILE-01` | Profile |
| `S03` | `SET-FAV-01` | Favorites |
| `S04` | `SET-TRIP-01` | Saved trips |
| `S05` | `SET-DATA-01` | Placeholder |
| `S06` | `SET-ABOUT-01` | About/legal |

---

# 13. ASCII Page Diagrams

# L01 — Location Permission

```text
┌─────────────────────────────────────┐
│                                     │
│              CRUZE                  │
│                                     │
│        ┌───────────────────┐        │
│        │                   │        │
│        │   Location        │        │
│        │   illustration    │        │
│        │                   │        │
│        └───────────────────┘        │
│                                     │
│            ¿Dónde estás?            │
│                                     │
│  Cruze usa tu ubicación para        │
│  encontrar los cruces relevantes.  │
│                                     │
│        [ LOC-PROMPT-01 ]            │
│        Permitir ubicación            │
│                                     │
│             Configuración           │
│                                     │
└─────────────────────────────────────┘
```

---

# T01 — Trip Empty / Nearby Intelligence

```text
┌─────────────────────────────────────┐
│ [APP-HEAD-01] CRUZE MX    🔔    ⚙   │
├─────────────────────────────────────┤
│                                     │
│ <section> (mb-6 = 24px)             │
│ [LOC-STATUS-01 inline strip]        │
│                                     │
│ ¿A dónde vas? (text-3xl)            │
│ …body… (text-base, balance)         │
│                                     │
│ [TR-EMPTY-01 compound input]        │
│ [ 🔍 …EE.UU. …………… (→) ]  │ ← icon-only CTA, no helper
│                                     │
│ </section>                          │
│─────────────────────────────────────│
│ [TR-NEAR-01] (mt-7 = 28px)          │
│ CERCA DE TI                         │
│ Cruces relevantes ahora (xs)        │
│                                     │
│ [TR-NEAR-02]                        │
│ San Luis                 11 min     │
│ ● Abierto  Norte     Hace 2 min    │
│                                     │
│ [TR-NEAR-02]                        │
│ Lukeville                18 min     │
│ ● Abierto  Norte     Hace 3 min    │
│                                     │
│ [TR-NEAR-02]                        │
│ Nogales Mariposa         24 min     │
│ ● Abierto  Norte     Hace 2 min    │
│                                     │
│          Ver todos los cruces →     │
│                                     │
├─────────────────────────────────────┤
│ [APP-NAV-01] Viaje | Cruces | Agente│
└─────────────────────────────────────┘
```

---

# T02 — Destination

```text
┌─────────────────────────────────────┐
│ [APP-BACK-01] ←       DESTINO       │
├─────────────────────────────────────┤
│                                     │
│ [TR-SETUP-01]                       │
│ ●──────○──────○──────○              │
│                                     │
│ ¿A dónde vas?                       │
│                                     │
│ [TR-SETUP-02]                       │
│ [ 🔍 Buscar destino... ]            │
│                                     │
│ Destinos recientes                  │
│                                     │
│ Los Angeles                         │
│ Phoenix                             │
│ San Diego                           │
│                                     │
│                                     │
│                    [ Continuar ]     │
└─────────────────────────────────────┘
```

---

# T03 — Origin

```text
┌─────────────────────────────────────┐
│ [APP-BACK-01] ←       ORIGEN        │
├─────────────────────────────────────┤
│                                     │
│ [TR-SETUP-01]                       │
│ ●──────●──────○──────○              │
│                                     │
│ ¿Desde dónde sales?                 │
│                                     │
│ [TR-SETUP-03]                       │
│                                     │
│ [ ◎ Usar mi ubicación actual ]      │
│                                     │
│ [ Ingresar punto de partida ]      │
│                                     │
│                                     │
│                    [ Continuar ]     │
└─────────────────────────────────────┘
```

---

# T04 — Travel Mode

```text
┌─────────────────────────────────────┐
│ [APP-BACK-01] ←    ¿CÓMO VIAJAS?    │
├─────────────────────────────────────┤
│                                     │
│ [TR-SETUP-01]                       │
│ ●──────●──────●──────○              │
│                                     │
│ [TR-SETUP-04]                       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🚶  A pie                       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🚗  Vehículo privado            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🚚  Comercial                   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

# T05 — Private Vehicle Access

```text
┌─────────────────────────────────────┐
│ [APP-BACK-01] ←                     │
├─────────────────────────────────────┤
│                                     │
│ ¿Cómo cruzas normalmente?            │
│                                     │
│ [TR-SETUP-05]                       │
│                                     │
│ ○ Cruce estándar                    │
│ ○ Ready Lane                        │
│ ○ SENTRI / Global Entry             │
│ ○ No estoy seguro                   │
│                                     │
│                                     │
│ Esta información ayuda a filtrar    │
│ recomendaciones.                   │
│                                     │
│                    [ Continuar ]     │
└─────────────────────────────────────┘
```

---

# T06 — Document Profile

```text
┌─────────────────────────────────────┐
│ [APP-BACK-01] ←                     │
├─────────────────────────────────────┤
│                                     │
│ ¿Qué documentación tienes?          │
│                                     │
│ [TR-SETUP-06]                       │
│                                     │
│ ○ Pasaporte / documento de viaje    │
│ ○ Visa                               │
│ ○ Ciudadanía / residencia de EE.UU.│
│ ○ Programa de viajero confiable     │
│ ○ No estoy seguro                   │
│                                     │
│ Esta información ayuda a filtrar    │
│ recomendaciones. No determina       │
│ elegibilidad legal.                 │
│                                     │
│ [ Omitir ]           [ Continuar ]  │
└─────────────────────────────────────┘
```

---

# T07 — Recommendation

```text
┌─────────────────────────────────────┐
│ [APP-HEAD-01] CRUZE       🔔    ⚙   │
├─────────────────────────────────────┤
│                                     │
│ MEJOR CRUCE PARA TU VIAJE           │
│                                     │
│ [TR-REC-01]                         │
│ ┌─────────────────────────────────┐ │
│ │ RECOMENDADO                     │ │
│ │                                 │ │
│ │ San Luis                        │ │
│ │ ● Abierto                       │ │
│ │                                 │ │
│ │ 11 min          8h 35m          │ │
│ │ Espera          Total           │ │
│ │                                 │ │
│ │ [ Usar este cruce ]             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [TR-REC-02]                         │
│ ¿Por qué?                           │
│ • Menor tiempo total                │
│ • Compatible con tu cruce           │
│ • Datos recientes                   │
│                                     │
│ [TR-REC-03] OTRAS OPCIONES           │
│                                     │
│ [TR-REC-04] Lukeville      +17 min  │
│ [TR-REC-04] Nogales        +48 min  │
│                                     │
│             Comparar →              │
└─────────────────────────────────────┘
```

---

# T08 — Active Trip

```text
┌─────────────────────────────────────┐
│ [APP-HEAD-01] CRUZE       🔔    ⚙   │
├─────────────────────────────────────┤
│                                     │
│ [TR-ACT-01]                        │
│ MI VIAJE                            │
│                                     │
│ [TR-ACT-02]                        │
│ Puerto Peñasco                      │
│        ↓                            │
│ Los Angeles                         │
│                                     │
│ CRUCE RECOMENDADO                   │
│ San Luis                            │
│ 11 min                              │
│                                     │
│ [TR-ACT-03]                        │
│ [ Navegar ]                         │
│ [ Ver cruce ]                       │
│                                     │
│ [TR-ACT-04]                        │
│ ANTES DE CRUZAR                     │
│                                     │
│ ✓ Cruce abierto                     │
│ ✓ Datos recientes                   │
│ ○ Revisar documentación             │
│ ○ Revisar restricciones             │
│                                     │
└─────────────────────────────────────┘
```

---

# T10 — Completion

```text
┌─────────────────────────────────────┐
│                                     │
│          VIAJE COMPLETADO           │
│                                     │
│ Puerto Peñasco → Los Angeles        │
│                                     │
│ Cruce utilizado                     │
│ San Luis                            │
│                                     │
│ [TR-COMP-01]                        │
│                                     │
│     [ Guardar en Mis viajes ]       │
│                                     │
│               Listo                 │
│                                     │
└─────────────────────────────────────┘
```

---

# C01 — Crossings Directory

```text
┌─────────────────────────────────────┐
│ [APP-HEAD-01] CRUZE  CRUCES  🔔  ⚙  │
├─────────────────────────────────────┤
│ [APP-COMPANION-01: CR-DIR-06]       │
│ [ 🔍 Buscar cruces... ]  [≡ n]      │
├─────────────────────────────────────┤
│ [CR-DIR-07] 42 cruces · Toda la…    │
│             Más cercanos ↓ [CR-DIR-08│
│                                     │
│ [CR-DIR-02]                         │
│ San Luis                       ˅    │
│ ● Operativo  Norte 11 min           │
│              Sur    5 min            │
│                                     │
│ [CR-DIR-02]                         │
│ Lukeville                      ˅    │
│ ● Operativo  Norte 18 min           │
│              Sur    8 min            │
│                                     │
│ [CR-DIR-09] Cargar más              │
├─────────────────────────────────────┤
│ [APP-NAV-01] Viaje | Cruces | Agente│
└─────────────────────────────────────┘
```

No content-level CRUCES heading (context lives in header). Filter lives in
`CR-DIR-05A` sheet (scope/mode/state + fixed Aplicar footer, disabled until
changed); `CR-DIR-05` FilterBar is removed. Count = total matching query;
empty ≠ unavailable (retry vs clear-filters).

---

# C03 — Crossing Detail

```text
┌─────────────────────────────────────┐
│ [APP-BACK-01] ←      SAN LUIS       │
├─────────────────────────────────────┤
│                                     │
│ [CR-DET-01]                         │
│ SAN LUIS                 ☆          │
│ ● Operativo      Hace 2 min         │
│                                     │
│ NORTE              SUR              │
│ 11 min             5 min            │
│ (trip/contextual side, else both)   │
│                                     │
│ [CR-DET-02]                         │
│ ┌─────────────────────────────────┐ │
│ │             MAP                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [CR-DET-03] (only with live lanes)  │
│ TIEMPOS POR CARRIL                  │
│ Standard       11 min               │
│                                     │
│ [CR-DET-05] (only when sourced)     │
│ HORARIOS                            │
│                                     │
│ [CR-DET-10]                         │
│ [ Usar este cruce ] (candidate)     │
│ [ Comparar ]      (secondary)       │
└─────────────────────────────────────┘
```

No live data → `Desconocido` + "—", no timestamp, sections hidden (never
invented defaults). Direction hierarchy: trip → contextual → both.
`CR-DET-04/06/07/08` render only with sourced data.

---

# C04 — Compare

```text
┌─────────────────────────────────────┐
│ [APP-BACK-01] ←       COMPARAR      │
├─────────────────────────────────────┤
│                                     │
│ [CR-CMP-01]                         │
│                                     │
│                 San Luis  Lukeville │
│              ★ Mejor opción        │
│ Espera Norte       11       18      │
│ Espera Sur          5        8      │
│ Viaje              8h35     8h52    │
│ Distancia          168km    181km   │
│ Estado             Abierto  Abierto │
│ Datos              Hace 2m  Ahora   │
│ [Usar este cruce] [Usar este cruce]│
└─────────────────────────────────────┘
```

---

# A01 — Agent Welcome

```text
┌─────────────────────────────────────┐
│ [AG-HEAD-01] AGENTE                 │
├─────────────────────────────────────┤
│                                     │
│ [AG-WEL-01]                         │
│ Hola. Soy Cruze.                    │
│                                     │
│ Puedo ayudarte a entender la        │
│ frontera, comparar cruces o         │
│ revisar tu viaje.                   │
│                                     │
│ [AG-PROMPT-01]                      │
│ [ ¿Qué cruces están disponibles? ]  │
│ [ ¿Cuál me conviene más? ]          │
│ [ Revisa mi viaje ]                 │
│ [ ¿Qué debo revisar? ]              │
│                                     │
│                                     │
│ [AG-COMP-01]                        │
│ [ Escribe una pregunta... ]    ↑    │
├─────────────────────────────────────┤
│ [APP-NAV-01] Viaje | Cruces | Agente│
└─────────────────────────────────────┘
```

---

# N01 — Avisos

```text
┌─────────────────────────────────────┐
│ [APP-BACK-01] ←       AVISOS        │
├─────────────────────────────────────┤
│                                     │
│ [AV-ROW-01]                         │
│ Tu recomendación cambió             │
│ San Luis ya no es la mejor opción   │
│ Hace 8 min                           │
│                                     │
│ [AV-ROW-01]                         │
│ Tiempo de espera aumentó            │
│ San Luis · +12 min                  │
│ Hace 21 min                          │
│                                     │
│ [AV-ROW-01]                         │
│ Revisa tu checklist                 │
│ Estás cerca de tu cruce             │
│                                     │
└─────────────────────────────────────┘
```

---

# S01 — Settings

```text
┌─────────────────────────────────────┐
│ [APP-BACK-01] ←   CONFIGURACIÓN     │
├─────────────────────────────────────┤
│                                     │
│ [SET-SEC-01] PERFIL                 │
│ [SET-PROFILE-01] Perfil             │
│                                     │
│ [SET-SEC-01] GUARDADOS              │
│ [SET-FAV-01] Favoritos              │
│ [SET-TRIP-01] Mis viajes            │
│                                     │
│ [SET-SEC-01] PRIVACIDAD             │
│ [SET-DATA-01] Compartir datos       │
│                                     │
│ [SET-SEC-01] INFORMACIÓN            │
│ [SET-ABOUT-01] Acerca de Cruze      │
│                                     │
└─────────────────────────────────────┘
```

---

# 14. Component Type Matrix

Components are classified by type before being classified by domain.

| Type | Purpose | Typical primitives | Examples |
|---|---|---|---|
| Container | Organize content | Stack, Section | Detail section |
| Navigation | Move between surfaces | Button, IconButton | Bottom nav |
| Input | Collect information | Input, Radio, Select | Destination |
| Data display | Show intelligence | DataMetric, Badge | Wait time |
| Status | Communicate state | Badge, Icon | Open/stale |
| Action | Execute primary task | Button | Use crossing |
| List | Repeat entities | Stack, Divider | Crossing directory |
| Result | Present computed output | Container, Metric | Recommendation |
| Feedback | Communicate system state | Banner, Toast | Data warning |
| Disclosure | Progressive detail | Accordion/Section | Requirements |
| Overlay | Contextual interaction | Sheet, Modal | Trip settings |
| Map | Geographic context | Map surface | Crossing map |
| Conversation | Agent interaction | Message, Input | Agent |
| Empty state | No content | EmptyState | No favorites |

---

# 15. Primitive → Variation Matrix

| Primitive | Base | Variations | Important states |
|---|---|---|---|
| `Button` | Primary | Secondary, Ghost, Destructive | Default, pressed, disabled, loading |
| `IconButton` | Standard | Compact, prominent | Default, pressed, disabled |
| `TextInput` | Standard | Search, location, destination | Empty, focused, filled, error |
| `SearchInput` | Search (h-11, native clear suppressed, custom clear) | Directory, destination | Empty, typing, results, no results |
| `SegmentedControl` | Standard | Filter | Selected, disabled |
| `RadioGroup` | Standard | Card radio | Selected, error |
| `Checkbox` | Standard | Checklist | Checked, unchecked, disabled |
| `Toggle` | Standard | Settings | On, off, disabled |
| `Badge` | Neutral | Recommendation, count | Default |
| `StatusBadge` | Operational | Freshness | Open, limited, closed, unknown |
| `Banner` | Informational | Warning, error, success | Visible/dismissed |
| `EmptyState` | Standard | Product-specific | Empty |
| `Skeleton` | Text | Card, list, metric | Loading |
| `Spinner` | Standard | Inline, page | Loading |
| `Divider` | Standard | Section | Default |
| `BottomSheet` | Standard (portal to body, guaranteed width, scroll-lock) | Action, detail, footer toolbar | Open/closed, footer, scroll-locked page |
| `Modal` | Standard | Confirmation | Open/closed |
| `DataMetric` | Numeric | Large, compact | Normal, unavailable |
| `DataDelta` | Change | Positive, negative, neutral | Normal |
| `DataTimestamp` | Time | Compact, verbose | Current, stale |
| `DataStatus` | Semantic (es labels: Operativo/Limitado/Cerrado/Desconocido) | Operational, freshness | All status states |

---

# 16. Domain Component Variation Matrix

## Crossing

| Component | Base variation | Context variations |
|---|---|---|
| `CrossingListRow` | Compact | Nearby, directory, search |
| `CrossingsDirectoryToolbar` | Search + filter trigger | C01 header companion |
| `CrossingsDirectoryFilterSheet` | Scope/mode/state + fixed footer | C01 filter |
| `CrossingsDirectorySummary` | Count + scope + sort | C01 summary |
| `CrossingsDirectoryLoadMoreState` | Cargar más / spinner | C01 pagination |
| `CrossingStatusBadge` | Operational | Open, limited, closed, unknown |
| `CrossingWaitTime` | Standard | Large, compact, unavailable |
| `CrossingFreshness` | Timestamp | Live, recent, stale |
| `CrossingDirectionTimes` | Dual direction | North-focused, south-focused |
| `CrossingDetailHero` | Full | Trip-contextual, directory-contextual |
| `CrossingDetailLaneSection` | Expanded | Mode-filtered |
| `CrossingDetailAccessSection` | Summary | User-profile contextual |
| `CrossingFavoriteButton` | Icon | Saved/unsaved |
| `CrossingDetailActionBar` | Standard | Trip, directory, agent context |

---

## Trip

| Component | Base variation | Context variations |
|---|---|---|
| `TripHero` | Eyebrow + title + body | T01 (no eyebrow), generic hero |
| `TripEmptyActionPanel` | No trip | First-use, returning |
| `TripNearbyCrossingRow` | Compact (single meta row) | Nearby, selected |
| `TripStalePrompt` | Stale recovery | Still-current vs start-new |
| `TripSetupProgress` | Stepper | 3-step, 4-step, adaptive |
| `TripSetupTravelModeStep` | Selection | Walking, private, commercial |
| `TripSetupVehicleAccessStep` | Selection | Northbound only |
| `TripSetupDocumentProfileStep` | Optional selection | Northbound private |
| `TripRecommendationPrimaryCard` | Full recommendation | Nearby, trip |
| `TripAlternativeListRow` | Compact | Comparison-oriented |
| `TripChecklistSection` | Checklist | Pre-crossing, warning |

---

## Agent

| Component | Base variation | Context variations |
|---|---|---|
| `AgentPromptChip` | Suggested prompt | Trip, crossing, generic |
| `AgentMessage` | Text | User, assistant, system |
| `AgentCrossingResult` | Crossing card | Nearby, search, recommendation |
| `AgentRecommendationResult` | Recommendation | Trip-aware |
| `AgentTripAction` | Action | Navigate, review, finish |
| `AgentChecklistResult` | Checklist | Pre-crossing |

---

# 17. State Matrix

Every interactive component should explicitly support the states applicable to it.

| State | Required? | Applies to |
|---|---:|---|
| Default | Yes | All interactive components |
| Hover | Web | Interactive components |
| Focus | Yes | Keyboard/input |
| Pressed | Yes | Interactive controls |
| Disabled | When applicable | Controls |
| Loading | When asynchronous | Data/action components |
| Empty | When applicable | Lists/results |
| Error | When applicable | Inputs/data |
| Stale | Data components | Live intelligence |
| Unavailable | Data components | Live intelligence |
| Selected | Selection controls | Filters/modes |
| Expanded | Disclosure | Directory/detail |
| Collapsed | Disclosure | Directory/detail |

---

# 18. Implementation Checklist — Page Level

Each page must pass the following checks.

| Check | Question |
|---|---|
| Purpose | Is the page solving one clear user problem? |
| Entry | Can every entry point be identified? |
| Exit | Does every primary action lead somewhere intentional? |
| Header | Is the correct header pattern used? |
| Navigation | Is primary navigation preserved? |
| Hierarchy | Is the primary decision visually dominant? |
| Data | Are all required data dependencies defined? |
| Freshness | Does live data expose freshness? |
| Loading | Is loading behavior defined? |
| Empty | Is empty state defined? |
| Error | Is error state defined? |
| Stale | Is stale state defined where relevant? |
| Accessibility | Can the page be navigated without color/map dependence? |
| Responsive | Does layout survive smaller screens? |
| Analytics | Are meaningful interactions captured? |
| Localization | Is terminology consistent? |
| Privacy | Is unnecessary personal information avoided? |

---

# 19. Implementation Checklist — Component Level

| Check | Question |
|---|---|
| Responsibility | Does the component have one obvious responsibility? |
| Name | Does the name communicate domain + context + function? |
| Reuse | Is it reusable without becoming generic? |
| Inputs | Are required props/state explicit? |
| Outputs | Are emitted actions explicit? |
| States | Are all applicable states implemented? |
| Accessibility | Are semantics and labels correct? |
| Responsive | Does it adapt to screen width? |
| Data | Does it distinguish unavailable from zero? |
| Freshness | Does live data display freshness? |
| Interaction | Are touch targets sufficient? |
| Loading | Does asynchronous content have a defined state? |
| Error | Does failure have a recoverable state? |
| Tokens | Are design tokens used instead of arbitrary values? |
| Localization | Is text externalized/localizable? |
| Analytics | Are important actions observable? |
| Tests | Are component states covered? |

---

# 20. Implementation Checklist — Primitive Level

| Primitive | Verify |
|---|---|
| Button | Hierarchy, size, state, accessibility, loading |
| IconButton | Tooltip/label, target size, state |
| Input | Label, placeholder, error, focus, keyboard behavior |
| Search | Debounce, clear, no-results state |
| Radio | Selection, keyboard, accessibility |
| Checkbox | Selection semantics |
| Toggle | Current value and state |
| Badge | Semantic meaning, contrast |
| StatusBadge | Operational vs freshness separation |
| Banner | Severity, dismissal, persistence |
| EmptyState | Explanation + useful next action |
| Skeleton | Layout parity with loaded state |
| Spinner | Only where skeleton is inappropriate |
| BottomSheet | Focus, dismissal, drag behavior |
| Modal | Focus trap, escape/back behavior |
| DataMetric | Numeric hierarchy, unavailable state |
| DataDelta | Direction + semantic meaning |
| Timestamp | Relative time + absolute fallback |
| Divider | Does it actually improve hierarchy? |

---

# 21. Implementation Checklist — Data Type Level

This is especially important for Cruze because the UI is driven by operational data.

## Crossing

| Type | Verify |
|---|---|
| `Crossing` | Stable ID, name, location, operational state |
| `CrossingDirection` | Direction is explicit |
| `CrossingLane` | Lane type and wait are explicit |
| `CrossingAccess` | Compatibility is explicit |
| `CrossingHours` | Timezone-aware |
| `CrossingRequirement` | Source-backed |
| `CrossingRestriction` | Source-backed |
| `CrossingService` | Current/verified |
| `CrossingObservation` | Timestamp + source + confidence |

---

## Location

| Type | Verify |
|---|---|
| `LocationState` | Explicit lifecycle state |
| `LocationAccuracy` | Numeric accuracy available |
| `LocationTimestamp` | Acquisition time |
| `LocationConfidence` | Semantic confidence |
| `LocationPermission` | Granted/denied/restricted |

---

## Trip

| Type | Verify |
|---|---|
| `Trip` | Stable state |
| `TripOrigin` | Coordinate/place |
| `TripDestination` | Coordinate/place |
| `TravelMode` | Walking/private/commercial |
| `Direction` | Derived/explicit |
| `AccessType` | Compatibility context |
| `DocumentProfile` | High-level only |
| `TripRecommendation` | Crossing + reasons + metrics |
| `TripChecklistState` | Per-item state |

---

# 22. Data Semantic Checklist

Every live value must answer:

```text
WHAT?
WHEN?
SOURCE?
CONFIDENCE?
DIRECTION?
```

For example:

```text
Wait:
11 min

Direction:
Northbound

Observed:
12:42 PM

Source:
Border data provider

Confidence:
High
```

The UI may hide some of these fields, but the data model should not.

---

# 23. Zero vs Unknown vs Stale

These must never be conflated.

```text
0 min
```

means:

> verified zero.

```text
—
```

means:

> unavailable / unknown.

```text
11 min
Actualizado hace 47 min
```

means:

> known value, but stale.

This distinction is mandatory throughout the product.

---

# 24. Operational vs Freshness Matrix

| Operational | Freshness | UI |
|---|---|---|
| Open | Live | Green/open + current |
| Open | Recent | Green/open + recent |
| Open | Stale | Open + stale warning |
| Limited | Live | Limited + current |
| Closed | Live | Closed + current |
| Unknown | Live | Unknown |
| Open | Unavailable | Open + data unavailable |

Never use one status to represent both dimensions.

---

# 25. Navigation Consistency Matrix

| From | Destination | Mechanism | Expected behavior |
|---|---|---|---|
| Viaje | Cruces | Link | Switch primary tab |
| Viaje | Crossing Detail | Row/action | Open detail |
| Viaje | Agent | Bottom nav | Preserve trip context |
| Nearby crossing | Detail | Row tap | No trip creation |
| Detail | Trip | `Usar este cruce` | Enter adaptive Trip Setup |
| Cruces | Detail | Row tap | Open canonical detail |
| Detail | Compare | Compare | Preserve crossing selection |
| Compare | Trip | Use action | Start trip with selected crossing |
| Agent | Crossing | Result action | Open canonical detail |
| Agent | Trip | Result action | Open relevant trip surface |
| Aviso | Crossing | Action | Open canonical detail |
| Aviso | Trip | Action | Open relevant trip |
| Settings | Favorites | Row | Open favorites |
| Settings | My Trips | Row | Open completed trips |
| Trip | Settings | Gear | Global settings |
| Any | Avisos | Bell | Open Avisos |
| Any | Settings | Gear | Open Settings |

---

# 26. Navigation Invariants

These rules should be enforced during implementation.

### Invariant 1

There are exactly three primary tabs:

```text
Viaje
Cruces
Agente
```

### Invariant 2

The bell always means:

> Avisos

### Invariant 3

The gear always means:

> Configuración

### Invariant 4

A crossing always resolves to the canonical Crossing Detail.

### Invariant 5

Trip recommendation and Crossing Detail are different surfaces.

### Invariant 6

Map never becomes a fourth primary destination.

### Invariant 7

Favorites never becomes a primary destination.

### Invariant 8

Completed trips belong in My Trips.

### Invariant 9

Active trips belong in Viaje.

### Invariant 10

Agent actions deep-link to canonical product surfaces instead of recreating them.

---

# 27. Trip Workflow Consistency Matrix

| Scenario | Expected flow |
|---|---|
| New user | Location → Viaje |
| User wants destination | Viaje → Trip Setup |
| User sees nearby crossing | Viaje → Crossing Detail |
| User wants that crossing | Detail → Trip Setup |
| Walking | Destination → Origin → Mode → Recommendation |
| Commercial | Destination → Origin → Mode → Recommendation |
| Private southbound | Destination → Origin → Mode → Recommendation |
| Private northbound | Destination → Origin → Mode → Access → optional Documents → Recommendation |
| Recommendation selected | Recommendation → Active Trip |
| Active trip | Active Trip → Navigate / Detail / Checklist |
| Trip completed | Completion → optional Save |
| Saved trip | Settings → My Trips |
| User asks Agent | Agent → contextual answer/action |
| Recommendation changes | Aviso → Recommendation / Agent |
| User near border | Aviso → Checklist / Crossing Detail |

---

# 28. Adaptive Questionnaire Consistency Matrix

| Context | Ask | Do not ask |
|---|---|---|
| Walking | Destination, origin | Vehicle/access/document details |
| Commercial | Destination, origin, commercial mode | Unnecessary passenger/document questions |
| Private southbound | Destination, origin, private mode | Northbound document questionnaire |
| Private northbound | Destination, origin, private mode, access | Unnecessary legal/document identifiers |
| Ambiguous direction | Direction | Repeated origin/destination |
| Known profile | Only missing material context | Already-known information |

---

# 29. Location Consistency Checklist

Every relevant screen must answer:

| Check | Requirement |
|---|---|
| Location available? | Yes before personalized intelligence |
| Location confidence sufficient? | Yes |
| Location stale? | Refresh when required |
| Origin default | Current location |
| User override | Always possible |
| Nearby ranking | Uses location |
| Crossing relevance | Uses location |
| Map context | Uses current/selected location |
| Agent context | Knows relevant location state |
| Permission failure | Recoverable |
| No location | Never fake personalization |

---

# 30. Agent Consistency Checklist

Every Agent interaction should determine whether it has context.

```text
Current location?
Active trip?
Selected crossing?
Travel mode?
Direction?
Recommendation?
Recent Aviso?
Checklist?
```

Then:

```text
IF context exists
    → contextual answer/action

ELSE
    → general Cruze answer
```

The Agent should never ask for information already available in Cruze state.

---

# 31. Avisos Consistency Checklist

An Aviso should answer:

```text
WHAT CHANGED?
WHY DOES IT MATTER?
WHAT CAN I DO?
```

Example:

```text
WHAT:
San Luis wait increased.

WHY:
Lukeville is now faster overall.

ACTION:
[ Ver recomendación ]
```

Avoid notifications that merely repeat raw data.

---

# 32. Design Consistency Checklist

| Category | Requirement |
|---|---|
| Typography | Sora for display, Inter for UI/body |
| Primary color | Cruze Mint |
| Background | Midnight |
| Surfaces | Surface / Elevated |
| Borders | Controlled 1px system |
| Radius | Restrained |
| Primary CTA | One clear primary action |
| Numbers | Strong numeric hierarchy |
| Status | Semantic |
| Freshness | Separate |
| Icons | Consistent family |
| Spacing | 4px base system |
| Touch target | ~44–48px |
| Color dependency | Never sole status indicator |
| Cards | Used for grouping, not decoration |

---

# 33. Component QA Matrix

Before a component is accepted:

```text
┌──────────────────────────────────────────────┐
│ COMPONENT QA                                 │
├──────────────────────────────────────────────┤
│ □ Correct domain                             │
│ □ Correct contextual name                   │
│ □ Single responsibility                     │
│ □ Uses primitives correctly                 │
│ □ No duplicated domain logic                │
│ □ Responsive                                │
│ □ Accessible                                │
│ □ Loading state                              │
│ □ Empty state where applicable              │
│ □ Error state where applicable               │
│ □ Stale state where applicable               │
│ □ Correct semantic colors                   │
│ □ Correct typography tokens                 │
│ □ Correct spacing tokens                    │
│ □ Correct interaction states                │
│ □ Localization-ready                        │
│ □ Analytics where appropriate               │
│ □ Unit/component tests                      │
└──────────────────────────────────────────────┘
```

---

# 34. Page QA Matrix

Every production page should pass:

```text
┌──────────────────────────────────────────────┐
│ PAGE QA                                      │
├──────────────────────────────────────────────┤
│ □ Entry point works                          │
│ □ Back behavior works                        │
│ □ Primary navigation works                   │
│ □ Header actions work                        │
│ □ Main action obvious                        │
│ □ Data loaded correctly                      │
│ □ Data freshness correct                     │
│ □ Loading state correct                       │
│ □ Empty state correct                         │
│ □ Error state correct                         │
│ □ Stale state correct                         │
│ □ Offline/unavailable state correct           │
│ □ No accidental duplicated UI                │
│ □ No unnecessary questions                   │
│ □ Correct contextual information             │
│ □ Accessibility verified                     │
│ □ Small-screen layout verified               │
│ □ Analytics verified                         │
└──────────────────────────────────────────────┘
```

---

# 35. Workflow QA Matrix

## Location

```text
□ Permission granted
□ Permission denied
□ Services disabled
□ Timeout
□ Low accuracy
□ Location recovered
□ Location refreshed
```

## Trip

```text
□ Destination selected
□ Origin selected
□ Current location used
□ Origin overridden
□ Walking branch
□ Commercial branch
□ Private branch
□ Northbound branch
□ Southbound branch
□ Recommendation generated
□ Alternative selected
□ Trip activated
□ Trip completed
□ Trip saved
```

## Crossings

```text
□ Directory loaded
□ Search works
□ Filters work
□ Direction values correct
□ Expansion works
□ Detail opens
□ Map opens
□ Compare works
□ Favorite works
□ Use crossing starts Trip
```

## Agent

```text
□ Generic question
□ Crossing-aware question
□ Trip-aware question
□ Structured result
□ Deep-link
□ Action
□ Error/retry
```

## Avisos

```text
□ Unread badge
□ Open
□ Read state
□ Crossing change
□ Recommendation change
□ Trip reminder
□ Checklist reminder
□ Data warning
```

---

# 36. Cross-Surface Consistency Matrix

A single concept must look and behave consistently wherever it appears.

| Concept | Viaje | Cruces | Agent | Avisos |
|---|---|---|---|---|
| Crossing name | Same | Same | Same | Same |
| Operational status | Same | Same | Same | Same |
| Wait time | Same | Same | Same | Same |
| Freshness | Same | Same | Same | Same |
| Direction | Same | Same | Same | Same |
| Recommendation | Full | Optional | Structured | Change |
| Favorite | Action | Action | Optional | Optional |
| Navigate | Action | Optional | Action | Optional |
| Checklist | Full | — | Result | Reminder |

---

# 37. Canonical Entity Principle

The same crossing must never become multiple UI-specific entities.

There is one:

```text
Crossing
```

and many presentations:

```text
CrossingListRow
CrossingNearbyRow
CrossingDetailHero
AgentCrossingResult
AvisoCrossingChange
```

Likewise, there is one:

```text
Trip
```

with multiple presentations:

```text
TripRouteSummary
TripRecommendation
TripActive
SavedTrip
AgentTripAction
```

This is critical for preventing domain fragmentation.

---

# 38. Component Duplication Detection

Before creating a new component, ask:

```text
1. Does this already exist?
2. Does an existing component solve 80%+ of this problem?
3. Is the difference contextual or structural?
4. Can the existing component accept a controlled variation?
5. Would adding that variation make the existing component ambiguous?
```

Decision:

```text
Same responsibility
      ↓
Reuse

Same responsibility + contextual variation
      ↓
Variant

Different responsibility
      ↓
New component

Multiple responsibilities
      ↓
Split existing component
```

---

# 39. Component Naming Decision Tree

```text
Does it belong to a domain?
        │
       YES
        ↓
What surface?
        │
        ↓
What responsibility?
        │
        ↓
Name = Domain + Surface + Responsibility
```

Examples:

```text
Crossing + Detail + Lane Section
        ↓
CrossingDetailLaneSection

Trip + Recommendation + Primary Card
        ↓
TripRecommendationPrimaryCard

Agent + Result + Crossing
        ↓
AgentCrossingResult
```

Avoid:

```text
Card
Panel
Container
Item
Content
Widget
```

unless they are genuinely primitives.

---

# 40. Implementation Completion Matrix

A feature is not complete merely because the happy path works.

| Layer | Definition of done |
|---|---|
| Data | Contract defined |
| State | Lifecycle defined |
| Primitive | States implemented |
| Component | Responsive/accessibility complete |
| Page | Loading/empty/error/stale complete |
| Navigation | Entry/exit paths complete |
| Agent | Contextual integration complete |
| Avisos | Relevant events integrated |
| Analytics | Events implemented |
| QA | Workflow matrix passed |
| Design | Tokens verified |
| Localization | Strings externalized |
| Privacy | Data minimization verified |

---

# 41. Final Architecture Reference

The implementation should converge toward this model:

```text
                         ┌────────────────────┐
                         │       CRUZE        │
                         └─────────┬──────────┘
                                   │
                            LOCATION GATE
                                   │
                            LOCATION STATE
                                   │
             ┌─────────────────────┼─────────────────────┐
             │                     │                     │
             ▼                     ▼                     ▼
         TRIP DOMAIN         CROSSING DOMAIN        AGENT DOMAIN
             │                     │                     │
       ┌─────┼──────┐        ┌─────┼──────┐        ┌────┴─────┐
       │     │      │        │     │      │        │          │
       ▼     ▼      ▼        ▼     ▼      ▼        ▼          ▼
     Setup  Rec.   Active   Dir. Detail Compare  Chat       Results
       │     │      │        │     │      │        │          │
       └─────┴──────┴────────┴─────┴──────┴────────┴──────────┘
                                   │
                            SHARED DOMAIN STATE
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
          LOCATION             AVISOS                PROFILE
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
                              SETTINGS
```

---

# 42. Final Navigation Reference

```text
                         GLOBAL HEADER
                  ┌──────────┴──────────┐
                  │                     │
                 🔔                    ⚙
              AVISOS               SETTINGS
                  │                     │
                  │          ┌──────────┼───────────┐
                  │          │          │           │
                  │       Profile   Favorites   My Trips
                  │
                  │          Data Sharing / About
                  │
                  │
          ┌───────┴────────────────────────────┐
          │                                    │
          ▼                                    ▼
       PRIMARY NAVIGATION
   ┌────────┬──────────┬────────┐
   │ Viaje  │ Cruces   │ Agente │
   └───┬────┴────┬─────┴───┬────┘
       │         │         │
       ▼         ▼         ▼
    Trip       Live      Contextual
   Decision   Border     Intelligence
```

---

# 43. Final Workflow Reference

```text
                         APP LAUNCH
                              │
                              ▼
                     LOCATION INITIALIZATION
                              │
                   ┌──────────┴──────────┐
                   │                     │
                FAILED                 READY
                   │                     │
                   ▼                     ▼
             RECOVERY UI              VIAJE
                                         │
                           ┌─────────────┴─────────────┐
                           │                           │
                           ▼                           ▼
                    START TRIP                 NEARBY CROSSINGS
                           │                           │
                           ▼                           ▼
                    TRIP SETUP                 CROSSING DETAIL
                           │                           │
                           ▼                    ┌──────┴──────┐
                    RECOMMENDATION              │             │
                           │                    ▼             ▼
                           ▼                 FAVORITE    USE CROSSING
                      ACTIVE TRIP                          │
                           │                               │
                           ▼                               ▼
                     CHECKLIST                         TRIP SETUP
                           │
                           ▼
                       COMPLETE
                           │
                           ▼
                     SAVE TRIP
```

---

# 44. Final Engineering Principle

Cruze should be implemented as:

> **one intelligence system, multiple contextual presentations.**

Not:

> one independent implementation per screen.

The crossing data model should feed:

```text
Trip
Crossings
Agent
Avisos
Map
Favorites
```

The Trip model should feed:

```text
Trip
Agent
Avisos
My Trips
Checklist
```

Location should feed:

```text
Nearby Crossings
Trip Origin
Recommendations
Map
Agent Context
Avisos
```

And the design system should feed all of them.

The result should be a system in which adding a new screen does **not** require inventing:

- another crossing card
- another status badge
- another wait-time treatment
- another header
- another recommendation pattern
- another navigation pattern
- another freshness indicator

Instead, the new screen composes existing primitives and domain components with a clearly defined responsibility.

---

# 45. Final Acceptance Gate

Before considering the Cruze UI architecture complete, the implementation must satisfy all six dimensions:

```text
                 ┌─────────────────────┐
                 │   CRUZE QUALITY     │
                 └──────────┬──────────┘
                            │
       ┌────────────┬───────┼───────┬────────────┐
       ▼            ▼       ▼       ▼            ▼
     PRODUCT       UX      DATA    DESIGN      TECH
       │            │       │       │            │
       └────────────┴───────┼───────┴────────────┘
                            │
                           QA
                            │
                            ▼
                     READY TO SHIP
```

### Product

```text
□ Clear mental model
□ Three primary destinations
□ Location-first
□ Adaptive Trip Setup
□ Crossing-first alternative path
□ Agent contextual
□ Avisos contextual
```

### UX

```text
□ No unnecessary questions
□ Clear hierarchy
□ Consistent navigation
□ Predictable back behavior
□ Progressive disclosure
□ Useful empty states
□ Recoverable failures
```

### Data

```text
□ Operational state explicit
□ Freshness explicit
□ Direction explicit
□ Source/timestamp available
□ Unknown ≠ zero
□ Stale ≠ live
```

### Design

```text
□ Correct tokens
□ Correct typography
□ Correct spacing
□ Consistent component states
□ Consistent status semantics
□ Controlled card usage
```

### Technical

```text
□ Component responsibility clear
□ Existing components reconciled
□ No unnecessary duplication
□ Domain state centralized
□ Local profile only
□ No unnecessary auth/account architecture
```

### QA

```text
□ Happy paths
□ Failure paths
□ Location paths
□ Adaptive branches
□ Navigation paths
□ Accessibility
□ Responsive behavior
□ Analytics
```

---

# 46. The One Rule to Keep Beside the Codebase

If a developer is unsure whether a new component, screen, interaction or workflow belongs in Cruze, ask:

> **Does this help the user understand the border, decide which crossing to use, execute their trip, or interact with Cruze's intelligence?**

If yes, determine which existing domain owns it.

If no, it probably does not belong in the current Cruze product.

That constraint should protect the product from gradually becoming a generic travel application.