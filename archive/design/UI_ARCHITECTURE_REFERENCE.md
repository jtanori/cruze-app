# CRUZE — UI Architecture & Implementation Reference
## Implementation Catalog · Component Matrices · ASCII Screen Maps · QA Checklists
### Supporting Document v2.0 (Implemented)

---

## 1. Component Reference Convention

Format: `<DOMAIN>-<SURFACE>-<SEQUENCE>`

| Prefix | Domain |
|--------|--------|
| `APP` | Application shell |
| `LOC` | Location |
| `TR` | Trip |
| `CR` | Crossings |
| `AG` | Agent |
| `AV` | Avisos |
| `SET` | Settings |

---

## 2. Product Surface Catalog (Implemented)

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  LOCATION READY                                         │
│                      ┌────────────────────────────────┼──┐
                    ▼                            ▼        ▼
              ┌───────────┐                 ┌───────────┐
              │  VIAJE    │                 │  CRUCES   │
              │    TR     │                 │    CR     │
              └─────┬─────┘                 └─────┬─────┘
                    │                              │
           ┌────────┼──────┐               ┌───────┼─────┐
           ▼        ▼      ▼         ▼       ▼       ▼
        Nearby   Setup  Recommendation  Directory Detail Compare
                                       ┌───────┴─────┐
                                       ▼             ▼
                                  Conversation  Results
```

---

## 3. Global Application Shell (Implemented)

```text
┌─────────────────────────────────────────────────────────┐
│ [APP-HEAD-01] CRUZE              MX|USA        [≡]    │  ← TopAppBar (root)
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    PAGE CONTENT                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [APP-NAV-01] Viaje  Cruces  Agente  Favoritos  Alertas│
└─────────────────────────────────────────────────────────┘
```

| Ref | Component | Source | Status |
|-----|-----------|--------|--------|
| `APP-HEAD-01` | Application header | `TopAppBar` | ✅ |
| `APP-AV-01` | Avisos trigger | Bell in dropdown | ✅ |
| `APP-SET-01` | Settings trigger | Gear in dropdown | ✅ |
| `APP-NAV-01` | Primary navigation | `BottomNavigation` | ✅ |
| `APP-MXUSA-01` | Country indicator | MX\|USA next to app name | ✅ |
| `APP-DROPDOWN-01` | Header dropdown | 3-dots menu | ✅ |

---

## 4. Trip Product Catalog (Implemented)

```text
TRIP
│
├── Empty / Nearby
│   └── TR-NEAR-01 TripNearbyCrossingsSection
│
├── Recommendation
│   ├── TR-REC-01 TripRecommendationPrimaryCard  → BestCrossingCard
│   ├── TR-REC-02 TripRecommendationReasonList
│   ├── TR-REC-03 TripAlternativeListSection
│   └── TR-REC-04 TripAlternativeListRow → CrossingOptionCard
│
├── Active
│   ├── TR-ACT-01 TripStatusHeader
│   ├── TR-ACT-02 TripRouteSummary
│   ├── TR-ACT-03 TripActionBar
│   └── TR-ACT-04 TripChecklistSection
```

### Implemented Components
| Ref | Component | File | Status |
|-----|-----------|------|--------|
| `TR-REC-01` | BestCrossingCard | `BestCrossingCard.tsx` | ✅ |
| `TR-REC-04` | CrossingOptionCard (alt) | `CrossingOptionCard.tsx` | ✅ |
| `TR-ACT-01` | TripStatusHeader | `TripSummary.tsx` | ✅ |
| `TR-ACT-03` | TripActionBar | `TripSummary.tsx` | ✅ |

---

## 5. Crossings Product Catalog (Implemented)

```text
CROSSINGS
│
├── Directory
│   ├── CR-DIR-01 CrossingsDirectoryList
│   ├── CR-DIR-02 CrossingsDirectoryRow → CrossingOptionCard
│   ├── CR-DIR-03 CrossingsDirectoryExpandedRow
│   ├── CR-DIR-04 CrossingsDirectorySearchInput
│   └── CR-DIR-05 CrossingsDirectoryFilterBar → CrossingsFilterTabs
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
│   └── CR-DET-10 CrossingDetailActionBar
```

### Implemented
| Ref | Component | File | Status |
|-----|-----------|------|--------|
| `CR-DIR-02` | CrossingOptionCard | `CrossingOptionCard.tsx` | ✅ |
| `CR-DIR-05` | CrossingsFilterTabs | `CrossingsFilterContext.tsx` | ✅ |
| `CR-STATUS-01` | Status badge | `display.ts` | ✅ |

---

## 6. Agent Product Catalog

```text
AGENT
│
├── AG-HEAD-01 AgentHeader (in TopAppBar)
├── AG-WEL-01 AgentWelcome
├── AG-PROMPT-01 AgentPromptList
├── AG-PROMPT-02 AgentPromptChip
├── AG-MSG-01 AgentMessageList
├── AG-MSG-02 AgentMessage
├── AG-COMP-01 AgentComposer → Fixed input bar
```

### Implemented
| Ref | Component | File | Status |
|-----|-----------|------|--------|
| `AG-COMP-01` | AgentComposer | `AgentChat.tsx` | ✅ |
| `AG-WEL-01` | Welcome screen | `AgentChat.tsx` | ✅ |

---

## 8. Page Inventory (Implemented)

| Ref | Page | Route | Purpose | Status |
|-----|------|-------|-----------|--------|
| `L01` | Location Permission | `/onboarding` | Establish location | ✅ |
| `L02` | Location Acquisition | — | Acquire/validate | ✅ |
| `T01` | Trip Empty / Nearby | `/viaje` | First/default Trip | ✅ |
| `T02` | Trip Destination | `/onboarding/destination` | Select destination | ✅ |
| `T03` | Trip Origin | `/onboarding/starting-point` | Confirm origin | ✅ |
| `T04` | Travel Mode | `/onboarding/starting-point` | Select mode | ✅ |
| `T05` | Vehicle Access | `/onboarding/starting-point` | Private northbound | ✅ |
| `T06` | Document Profile | `/onboarding/starting-point` | Optional profile | ✅ |
| `T07` | Recommendation | `/onboarding/recommendation` | Select best crossing | ✅ |
| `T08` | Active Trip | `/viaje` | Execute trip | ✅ |
| `C01` | Crossings Directory | `/crossings` | Live border overview | ✅ |
| `C02` | Search/Filter | `/crossings` | Refine crossings | ✅ |
| `C03` | Crossing Detail | `/crossing/[id]` | Complete info | ⚠️ Partial |
| `A01` | Agent Welcome | `/agent` | Start interaction | ✅ |
| `A02` | Agent Conversation | `/agent` | Ask/receive | ✅ |
| `N01` | Avisos | `/alerts` | Review changes | ✅ |

---

## 9. Per-Page Component Matrix (Implemented)

### Trip
| Page | Components | Required | Conditional |
|------|------------|----------|-------------|
| `T01` | `BestCrossingCard`, `CrossingOptionCard[]` | Start, nearby | Last trip |
| `T07` | `BestCrossingCard`, `CrossingOptionCard[]` | Recommendation | Compare |
| `T08` | `TripSummary` | Status, route, actions | Aviso banner |

### Crossings
| Page | Components | Required | Conditional |
|------|------------|----------|-------------|
| `C01` | `CrossingsFilterProvider`, `CrossingsFilterTabs`, `CrossingOptionCard[]` | Search, filter, rows | Expandable |

### Agent
| Page | Components | Required | Conditional |
|------|------------|----------|-------------|
| `A01` | `AgentChat` (welcome + prompts) | Welcome, prompts | Context |
| `A02` | `AgentChat` (messages + fixed input) | Messages, composer | Results |

---

## 10. ASCII Page Diagrams (Implemented)

### T01 — Trip Empty / Nearby Intelligence (`/viaje`)
```
┌─────────────────────────────────────┐
│ [APP-HEAD-01] CRUZE  MX|USA   [≡]   │
├─────────────────────────────────────┤
│                                     │
│ TU VIAJE                            │
│                                     │
│ [TR-EMPTY-01]                       │
│ ¿A dónde vas?                       │
│                                     │
│ [ Comenzar un viaje ]               │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ CERCA DE TI                         │
│ Cruces relevantes ahora             │
│                                     │
│ [CrossingOptionCard] San Luis       │
│ ● OPEN              11 min          │
│                                     │
│ [CrossingOptionCard] Lukeville      │
│ ● OPEN              18 min          │
│                                     │
│          Ver todos los cruces →     │
├─────────────────────────────────────┤
│ [APP-NAV-01] Viaje | Cruces | Agente│
└─────────────────────────────────────┘
```

### T07 — Recommendation (`/onboarding/recommendation`)
```
┌─────────────────────────────────────┐
│ [APP-HEAD-01] CRUZE  MX|USA   [≡]   │
├─────────────────────────────────────┤
│                                     │
│ YOUR BEST OPTION                    │
│                                     │
│       San Ysidro                    │
│                                     │
│       24 min                        │
│       estimated crossing            │
│                                     │
│       ● OPEN                        │
│                                     │
│  Why we're recommending it          │
│  ✓ Fastest overall                 │
│  ✓ Open for your vehicle           │
│  ✓ Best route from your location   │
│                                     │
│  ┌──────────────────────────────┐  │
│  │      Start my trip →         │  │
│  └──────────────────────────────┘  │
│                                     │
│  Compare alternatives               │
├─────────────────────────────────────┤
│ [APP-NAV-01] Viaje | Cruces | Agente│
└─────────────────────────────────────┘
```

### C01 — Crossings Directory (`/crossings`)
```
┌─────────────────────────────────────┐
│ [APP-HEAD-01] CRUZE  MX|USA   [≡]   │  ← Search input
├─────────────────────────────────────┤
│                                     │
│ CRUCES                              │
│                                     │
│ [ 🔍 Buscar cruces... ]             │  ← Search companion
│                                     │
│ Todos  México  Estados Unidos       │  ← Filter pills (content)
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ [CrossingOptionCard] San Luis       │
│ ● OPEN          11 min              │
│                                     │
│ [CrossingOptionCard] Lukeville      │
│ ● OPEN              18 min          │
│                                     │
│ [CrossingOptionCard] Nogales        │
│ ● OPEN              24 min          │
├─────────────────────────────────────┤
│ [APP-NAV-01] Viaje | Cruces | Agente│
└─────────────────────────────────────┘
```

### C03 — Crossing Detail (`/crossing/[id]`)
```
┌─────────────────────────────────────┐
│ [APP-BACK-01] ←      SAN LUIS       │
├─────────────────────────────────────┤
│                                     │
│ [BestCrossingCard]                  │
│ SAN LUIS                            │
│ ● OPEN          24 min              │
│ ─────────────────────────────────── │
│ WHY THIS ONE                        │
│ ✓ Fastest overall                  │
│ ✓ Open for your vehicle            │
│ ✓ Best route from your location    │
│ ─────────────────────────────────── │
│                                     │
│ LIVE CONDITIONS                     │
│ Border wait          24 min         │
│ Approach traffic      8 min         │
│ Total estimated      32 min         │
│ ─────────────────────────────────── │
│                                     │
│ ALTERNATIVES                        │
│ Otay Mesa             38 min        │
│ Tecate                51 min        │
│ ─────────────────────────────────── │
│                                     │
│ [ Navegar ]    [ Ver cruce ]        │
├─────────────────────────────────────┤
│ [APP-NAV-01] Viaje | Cruces | Agente│
└─────────────────────────────────────┘
```

### A01 — Agent Welcome (`/agent`)
```
┌─────────────────────────────────────┐
│ [APP-HEAD-01] CRUZE  MX|USA   [≡]   │
├─────────────────────────────────────┤
│                                     │
│ Hola. Soy Cruze.                    │
│                                     │
│ Puedo ayudarte a entender la        │
│ frontera, comparar cruces o         │
│ revisar tu viaje.                   │
│                                     │
│ [ ¿Qué cruces están disponibles? ]  │
│ [ ¿Cuál me conviene más? ]          │
│ [ Revisa mi viaje ]                 │
│ [ ¿Qué debo revisar? ]              │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ [ Escribe una pregunta... ]  ↑      │  ← Fixed input bar
├─────────────────────────────────────┤
│ [APP-NAV-01] Viaje | Cruces | Agente│
└─────────────────────────────────────┘
```

### N01 — Avisos (`/alerts`)
```
┌─────────────────────────────────────┐
│ [APP-HEAD-01] CRUZE  MX|USA   [≡]   │
├─────────────────────────────────────┤
│                                     │
│ AVISOS                              │
│ 3 avisos                            │
│                                     │
│ HOY                                 │
│                                     │
│ 12:42  Tu recomendación cambió      │
│        San Luis ya no es la mejor   │
│        opción. Ahora: Lukeville     │
│        (+14 min)          Hace 8min │
│                                     │
│ 10:15  Tiempo aumentó en San Luis   │
│        +12 min          Hace 21min  │
├─────────────────────────────────────┤
│ [APP-NAV-01] Viaje | Cruces | Agente│
└─────────────────────────────────────┘
```

---

## 10. Component Type Matrix

| Type | Purpose | Primitives | Examples |
|------|---------|------------|----------|
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

## 11. Primitive → Variation Matrix

| Primitive | Base | Variations | Important States |
|-----------|------|------------|------------------|
| `Button` | Primary | Secondary, Ghost, Destructive | Default, pressed, disabled, loading |
| `IconButton` | Standard | Compact, prominent | Default, pressed, disabled |
| `SearchInput` | Search | Directory, destination | Empty, typing, results, no results |
| `SegmentedControl` | Standard | Filter | Selected, disabled |
| `RadioGroup` | Standard | Card radio | Selected, error |
| `Checkbox` | Standard | Checklist | Checked, unchecked, disabled |
| `Toggle` | Standard | Settings | On, off, disabled |
| `StatusBadge` | Operational | Freshness | Open, limited, closed, unknown |
| `EmptyState` | Standard | Product-specific | Empty |
| `Skeleton` | Text | Card, list, metric | Loading |
| `Spinner` | Standard | Inline, page | Loading |
| `DataMetric` | Numeric | Large, compact | Normal, unavailable |
| `DataDelta` | Change | Positive, negative, neutral | Normal |
| `DataTimestamp` | Time | Compact, verbose | Current, stale |
| `DataStatus` | Semantic | Operational, freshness | All status states |

---

## 12. Domain Component Variation Matrix

### Crossing
| Component | Base | Context Variations |
|-----------|------|-------------------|
| `CrossingOptionCard` | Standard list | Nearby, directory, search, alternatives |
| `CrossingStatusBadge` | Operational | Open, limited, closed, unknown |
| `CrossingWaitTime` | Standard | Large, compact, unavailable |
| `CrossingFreshness` | Timestamp | Live, recent, stale |

### Trip
| Component | Base | Context Variations |
|-----------|------|-------------------|
| `BestCrossingCard` | Full | Compact (trip), Full (recommendation) |
| `CrossingOptionCard` | Standard | Alternatives, directory, nearby |
| `TripChecklistSection` | Checklist | Pre-crossing, warning |

---

## 13. State Matrix (Implemented)

| State | Required? | Applies To |
|-------|-----------|------------|
| Default | Yes | All interactive |
| Focus | Yes | Keyboard/input |
| Pressed | Yes | Interactive controls |
| Disabled | When applicable | Controls |
| Loading | When async | Data/action |
| Empty | When applicable | Lists/results |
| Error | When applicable | Inputs/data |
| Stale | Data components | Live intelligence |
| Unavailable | Data components | Live intelligence |
| Selected | Selection controls | Filters/modes |
| Expanded | Disclosure | Directory/detail |
| Collapsed | Disclosure | Directory/detail |

---

## 14. Implementation Checklist (Page Level)

| Check | Question | Status |
|-------|----------|--------|
| Purpose | Clear user problem? | ✅ |
| Entry | All entry points identified? | ✅ |
| Exit | Actions lead somewhere intentional? | ✅ |
| Header | Correct header pattern? | ✅ |
| Navigation | Primary navigation preserved? | ✅ |
| Hierarchy | Primary decision dominant? | ✅ |
| Data | Dependencies defined? | ✅ |
| Freshness | Live data exposes freshness? | ✅ |
| Loading | Loading behavior defined? | ✅ |
| Empty | Empty state defined? | ✅ |
| Error | Error state defined? | ✅ |
| Stale | Stale state defined? | ✅ |
| Accessibility | Navigable without color/map? | ✅ |
| Responsive | Survives smaller screens? | ✅ |
| Localization | Terminology consistent? | ✅ |
| Privacy | Unnecessary personal info avoided? | ✅ |

---

## 13. Component Checklist

| Check | Question | Status |
|-------|----------|--------|
| Responsibility | One obvious responsibility? | ✅ |
| Name | Domain + context + function? | ✅ |
| Reuse | Reusable without becoming generic? | ✅ |
| Inputs | Required props/state explicit? | ✅ |
| Outputs | Emitted actions explicit? | ✅ |
| States | All applicable states implemented? | ✅ |
| Accessibility | Semantics and labels correct? | ✅ |
| Responsive | Adapts to screen width? | ✅ |
| Data | Distinguishes unavailable from zero? | ✅ |
| Freshness | Live data displays freshness? | ✅ |
| Interaction | Touch targets sufficient (44-48px)? | ✅ |
| Loading | Async content has defined state? | ✅ |
| Error | Failure has recoverable state? | ✅ |
| Tokens | Design tokens used (no arbitrary values)? | ✅ |
| Localization | Text externalized/localizable? | ✅ |

---

## 15. Data Type Level (Implemented)

### Crossing
| Type | Verify | Status |
|------|--------|--------|
| `Crossing` | Stable ID, name, location, operational state | ✅ |
| `CrossingDirection` | Direction explicit | ✅ |
| `CrossingLane` | Lane type and wait explicit | ✅ |
| `CrossingAccess` | Compatibility explicit | ✅ |
| `CrossingObservation` | Timestamp + source + confidence | ✅ |

### Location
| Type | Verify | Status |
|------|--------|--------|
| `LocationState` | Explicit lifecycle state | ✅ |
| `LocationAccuracy` | Numeric accuracy | ✅ |
| `LocationTimestamp` | Acquisition time | ✅ |
| `LocationConfidence` | Semantic confidence | ✅ |
| `LocationPermission` | Granted/denied/restricted | ✅ |

### Trip
| Type | Verify | Status |
|------|--------|--------|
| `Trip` | Stable state | ✅ |
| `TripOrigin` | Coordinate/place | ✅ |
| `TripDestination` | Coordinate/place | ✅ |
| `TravelMode` | Walking/private/commercial | ✅ |
| `Direction` | Derived/explicit | ✅ |
| `AccessType` | Compatibility context | ✅ |
| `DocumentProfile` | High-level only | ✅ |
| `TripRecommendation` | Crossing + reasons + metrics | ✅ |

---

## 14. Zero vs Unknown vs Stale

| Display | Meaning |
|---------|---------|
| `0 min` | Verified zero wait |
| `—` | Unavailable / unknown |
| `11 min / Actualizado hace 47 min` | Known value, but stale |

---

## 15. Navigation Consistency Matrix

| From | Destination | Mechanism | Behavior |
|------|-------------|-----------|----------|
| Viaje | Cruces | Bottom nav | Switch primary tab |
| Viaje | Crossing Detail | Row tap | Open detail |
| Viaje | Agent | Bottom nav | Preserve trip context |
| Nearby crossing | Detail | Row tap | No trip creation |
| Detail | Trip | `Usar este cruce` | Enter Trip Setup |
| Cruces | Detail | Row tap | Canonical detail |
| Detail | Compare | Compare | Preserve selection |
| Compare | Trip | `Usar` action | Start trip with selected |
| Agent | Crossing | Result action | Canonical detail |
| Agent | Trip | Result action | Relevant trip surface |
| Aviso | Crossing | Action | Canonical detail |
| Aviso | Trip | Action | Relevant trip |
| Settings | Favorites | Row | Open favorites |
| Settings | My Trips | Row | Open completed trips |
| Trip | Settings | Gear | Global settings |
| Any | Avisos | Bell | Open Avisos |
| Any | Settings | Gear | Open Settings |

---

## 13. Navigation Invariants (Enforced)

1. **Exactly three primary tabs**: Viaje, Cruces, Agente
2. **Bell** always → Avisos
3. **Gear** always → Configuración
4. **Crossing** always resolves to canonical Crossing Detail
4. **Trip recommendation** and **Crossing Detail** are different surfaces
5. **Map** never becomes a 4th primary destination
6. **Favorites** never becomes a primary destination
6. **Completed trips** belong in My Trips
7. **Active trips** belong in Viaje
8. **Agent actions** deep-link to canonical surfaces

---

## 15. File Structure (v2.0)

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                    # Root: providers, html/body
│   │   ├── page.tsx                      # Home → onboarding or viaje
│   │   ├── onboarding/                   # 3-step flow
│   │   ├── (main)/
│   │   │   ├── layout.tsx                # MainLayout + AppShell
│   │   │   ├── viaje/page.tsx            # TripSummary
│   │   │   ├── crossings/page.tsx        # CrossingsFilterProvider + list
│   │   │   ├── favorites/page.tsx        # Saved crossings
│   │   │   ├── alerts/page.tsx           # Grouped alerts
│   │   │   ├── agente/page.tsx           # AgentProvider + AgentChat
│   │   │   └── viaje/configure/page.tsx  # TripSetupFlow
│   │   └── crossing/[id]/page.tsx        # CrossingIntelligenceView
│   └── layout.tsx                        # Root: providers, html/body
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx                  # Unified shell with slots
│   │   ├── TopAppBar.tsx                 # Header with variants
│   │   └── BottomNavigation.tsx          # 5 tabs
│   ├── crossing/
│   │   ├── BestCrossingCard.tsx          # Recommended (full/compact)
│   │   ├── CrossingOptionCard.tsx        # Standard list item
│   │   ├── CrossingsFilterContext.tsx    # Shared filter state
│   │   └── CrossingIntelligenceView.tsx  # Detail page
│   ├── viaje/
│   │   └── TripSummary.tsx               # Trip view
│   ├── agent/
│   │   ├── AgentChat.tsx                 # Fixed input bar
│   │   └── AgentProvider.tsx
│   └── shared/
│       ├── EmptyState.tsx
│       ├── LoadingSkeleton.tsx
│       ├── PageSpinner.tsx
│       └── LangSetter.tsx
├── hooks/
│   ├── use-locale.ts
│   ├── use-crossings-data.ts
│   └── use-share.ts
├── lib/
│   ├── display.ts                        # Formatters, status colors
│   ├── border-data.ts                    # Static data
│   ├── border-data-service.ts            # Merged + CBP API
│   ├── recommendation.ts                 # Engine
│   └── crossing-estimator.ts             # Time calculations
├── stores/
│   ├── trip.ts
│   ├── traveler.ts
│   ├── favorites.ts
│   ├── alerts.ts
│   └── agent.ts
└── types/
    └── place.ts
```

---

*Updated: 2026-09-02 | v2.0 | Based on 7 atomic commits*
