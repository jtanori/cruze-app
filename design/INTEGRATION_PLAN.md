# Cruze Integration Plan

Based on `design/cruze-review-01-09-26-05.md` and `design/cruze-data-layer.md`

---

## Overview

This plan integrates the architectural decisions from both reviews into a cohesive implementation roadmap. The core principle: **Trip as organizing context, not competing feature.**

---

## Phase 1: Domain Model Stabilization (Week 1-2)

### 1.1 Trip Domain (`src/domain/trip/`)

```
src/domain/trip/
├── types.ts          # Trip, Place, Direction, TripStatus
├── repository.ts     # TripRepository interface
├── local-repo.ts     # LocalTripRepository (localStorage)
├── service.ts        # TripService (business logic)
└── validation.ts     # Trip validation rules
```

**Key types from review:**
```ts
// Level 1: Trip
interface Trip {
  id: string;
  origin: Place;
  destination: Place;
  direction: "MX_TO_US" | "US_TO_MX";
  status: "configuring" | "active" | "monitoring" | "completed";
  createdAt: string;
  updatedAt: string;
}

// Level 2: Mode
type TravelMode = "walking" | "personal_vehicle" | "commercial_vehicle" | "public_transport";

// Level 3: Lane eligibility
interface TrustedTraveler {
  sentri: boolean;
  globalEntry: boolean;
}

// Level 4: Documentation
interface BorderDocumentation {
  passportCountry: string;
  mexicoStatus: VisaStatus;
  usStatus: VisaStatus;
}

interface TravelerProfile {
  travelMode: TravelMode;
  trustedTraveler: TrustedTraveler;
  documentation: BorderDocumentation;
}
```

### 1.2 Crossing Domain (`src/domain/crossing/`)

```
src/domain/crossing/
├── types.ts          # Crossing, Lane, CrossingStatus, LaneRestrictions
├── repository.ts     # CrossingRepository interface
├── local-repo.ts     # LocalCrossingRepository (static data)
├── cbp-provider.ts   # CBPWaitTimeProvider
└── eligibility.ts    # LaneEligibilityEngine
```

### 1.3 Recommendation Engine (`src/domain/recommendation/`)

```
src/domain/recommendation/
├── types.ts          # Candidate, Eligibility, Ranking, Recommendation
├── engine.ts         # RecommendationEngine interface
├── mock-engine.ts    # MockRecommendationEngine (current)
├── candidate.ts      # getCrossingCandidates()
├── eligibility.ts    # filterEligibleCrossings()
├── ranking.ts        # rankCrossings()
└── explain.ts        # explainRecommendation()
```

**Contract from review:**
```ts
interface RecommendationEngine {
  recommend(input: RecommendationInput): Promise<CrossingRecommendation[]>;
}

interface CrossingRecommendation {
  crossing: Crossing;
  reasons: RecommendationReason[];
  totalTimeMinutes: number;
  borderWaitMinutes: number;
  approachTimeMinutes: number;
  comparison?: {
    deltaMinutes: number;
    comparedToCrossingId: string;
  };
}

type RecommendationReason =
  | "fastest_overall"
  | "shortest_wait"
  | "best_for_sentry"
  | "best_for_pedestrians"
  | "best_for_commercial"
  | "best_alternative"
  | "only_open_option"
  | "lowest_total_time";
```

---

## Phase 2: Navigation & Home Logic (Week 2)

### 2.1 Home State Resolution

```ts
// src/lib/navigation/home-resolver.ts
function getHomeTab(): "viaje" | "crossings" {
  const trip = tripRepository.get();
  if (trip && trip.status !== "configuring") return "viaje";
  return "crossings";
}

// In AppShell or root layout
useEffect(() => {
  const homeTab = getHomeTab();
  if (currentTab !== homeTab) router.push(`/${locale}/${homeTab}`);
}, []);
```

### 2.2 Onboarding Flow Update

**Current:** Destination → Starting Point → Traveler Profile → Recommendation
**New:** Destination → Starting Point → Recommendation → "Personalize" (optional, progressive)

### 2.3 Progressive Traveler Profile

```
Level 1 (Trip):     Origin + Destination           → Always required
Level 2 (Mode):     Walking / Vehicle / Commercial → Prompt on first trip start
Level 3 (Eligibility): SENTRI / Global Entry       → Prompt when relevant
Level 4 (Docs):     Passport / Visa status         → Prompt when needed
```

---

## Phase 3: Data Layer Architecture (Week 2-3)

### 3.1 Three-Layer Storage (from cruze-data-layer.md)

```
┌─────────────────────────────────────────────┐
│                 CRUZE APP                    │
└───────────────────┬─────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌───────┐      ┌─────────┐      ┌──────────┐
│CLIENT │      │  CACHE  │      │ DATABASE │
│ STATE │      │ / DATA  │      │ / DATA   │
└───────┘      └─────────┘      └──────────┘
  local         short-lived      durable
  storage       (CBP, traffic)   (crossings, history)
```

### 3.2 Repository Pattern (Implement Now)

```ts
// src/infrastructure/persistence/local/local-trip-repo.ts
class LocalTripRepository implements TripRepository {
  async get(): Promise<Trip | null> { ... }
  async save(trip: Trip): Promise<void> { ... }
  async clear(): Promise<void> { ... }
}

// src/infrastructure/persistence/local/local-favorites-repo.ts
class LocalFavoritesRepository implements FavoritesRepository {
  async list(): Promise<Crossing[]> { ... }
  async add(id: string): Promise<void> { ... }
  async remove(id: string): Promise<void> { ... }
}
```

### 3.3 Server/API Boundary (Next.js Route Handlers)

```
src/app/api/
├── crossings/
│   ├── route.ts          # GET /api/crossings
│   └── [id]/
│       └── route.ts      # GET /api/crossings/[id]
├── recommendations/
│   └── route.ts          # POST /api/recommendations
├── cbp/
│   └── route.ts          # GET /api/cbp/wait-times
└── alerts/
    └── route.ts          # GET /api/alerts
```

---

## Phase 4: Tab Architecture Updates (Week 3)

### 4.1 Viaje Tab = Home (when trip exists)

**Viaje Screen (Active Trip):**
```
┌─────────────────────────────────────┐
│ 🏠 VIAJE (selected)                 │
├─────────────────────────────────────┤
│ Tijuana → Los Angeles               │
│                                     │
│ BEST CROSSING                       │
│ San Luis                            │
│ 23 min border wait                  │
│ 8h 47m total                        │
│                                     │
│ [ Iniciar viaje ]                   │
│                                     │
│ [ Personalize recommendation ]      │
└─────────────────────────────────────┘
```

**Crossings Tab = Exploratory (no trip or bypass)**

```
┌─────────────────────────────────────┐
│ 🧭 CROSSINGS                        │
├─────────────────────────────────────┤
│ ALL CROSSINGS           [MX→US] [US→MX]
│                                     │
│ San Ysidro       15 min  🟢         │
│ Otay Mesa        21 min  🟡         │
│ Tecate           28 min  🟠         │
│ Calexico West    12 min  🟢         │
│ ...                                  │
└─────────────────────────────────────┘
```

### 4.2 Navigation Flow

```
Viaje (Active Trip)
    │
    ├── Recommendation changes → Alerts (high priority)
    ├── Need more options → Crossings
    ├── Save crossing → Favorites
    └── Ask why → Agent
```

---

## Phase 5: Component Refactors (Week 3-4)

### 5.1 Crossing Detail Page Hierarchy

```
CROSSING DETAIL
    ↓
LIVE STATUS
    ↓
WAIT TIMES (lanes with eligibility badges)
    ↓
YOUR ELIGIBILITY (based on profile level)
    ↓
ACCESS / HOURS
    ↓
OTHER CROSSINGS IN CORRIDOR
    ↓
FULL DETAILS (modal)
```

### 5.2 Map Height Control

- Fixed height map (not full hero)
- Card overlay with live wait time
- Lanes below map

### 5.3 Compare Crossings Screen

```
COMPARE CROSSINGS
               Wait   Total
San Ysidro     15m    2h17
Otay Mesa      21m    2h21
Tecate         28m    2h38

WHY?
San Ysidro
✓ Fastest overall
✓ 6 min faster than Otay Mesa
✓ Open 24 hours
```

---

## Phase 6: Alert Intelligence (Week 4)

### 6.1 Route-Aware Alerts

```ts
// When user has active trip with recommended crossing
// and that crossing changes significantly:
interface TripAlert {
  type: "RECOMMENDATION_CHANGED";
  crossing: Crossing;
  previousWait: number;
  currentWait: number;
  betterAlternative?: Crossing;
  message: "Your recommended crossing changed. Wait time increased 15→41 min. Otay Mesa is now 18 min faster.";
  action: "View alternatives";
}
```

---

## Implementation Order

| Priority | Task | Est. Days |
|----------|------|-----------|
| **P0** | Domain models (Trip, Crossing, TravelerProfile) | 2 |
| **P0** | Repository interfaces + localStorage implementations | 2 |
| **P0** | Recommendation engine contract + mock impl | 2 |
| **P1** | Home tab resolver (Viaje = Home when trip active) | 1 |
| **P1** | Onboarding flow: remove mandatory traveler profile | 1 |
| **P1** | Progressive traveler profile (4 levels) | 2 |
| **P1** | Crossing detail page hierarchy + map height | 2 |
| **P1** | Compare Crossings first-class screen | 2 |
| **P1** | Route-aware alerts | 2 |
| **P2** | Server/API boundary (route handlers) | 2 |
| **P2** | Navigation: tab badges, states, deep-links | 1 |
| **P3** | Page archetypes derivation | 1 |

**Total: ~20 days**

---

## What NOT To Do (Per Reviews)

- ❌ Don't add user database yet
- ❌ Don't make Traveler Profile mandatory in onboarding
- ❌ Don't converge Viaje and Crossings UI
- ❌ Don't let localStorage become architecture (use repositories)
- ❌ Don't store passport/visa server-side without clear product reason
- ❌ Don't build all screens before domain model is stable
- ❌ Don't turn Crossing Detail into giant map app

---

## Migration Path (Future)

```
V1 (Now)
  │
  ├─ localStorage via Repository interfaces
  ├─ MockRecommendationEngine
  └─ Anonymous trips
         │
         ▼
V2 (Pre-payments)
  │
  ├─ Database + Authentication
  ├─ Account migration (local → cloud)
  ├─ LiveRecommendationEngine
  └─ Cruze-owned intelligence in DB
         │
         ▼
V3 (Premium)
  │
  ├─ Payments (Stripe)
  ├─ Pro features
  └─ Historical wait analytics
```

---

## Files to Create/Modify

### New Files
- `src/domain/trip/types.ts`
- `src/domain/trip/repository.ts`
- `src/domain/trip/local-repo.ts`
- `src/domain/crossing/types.ts`
- `src/domain/crossing/repository.ts`
- `src/domain/crossing/eligibility.ts`
- `src/domain/recommendation/types.ts`
- `src/domain/recommendation/engine.ts`
- `src/domain/recommendation/mock-engine.ts`
- `src/domain/recommendation/candidate.ts`
- `src/domain/recommendation/eligibility.ts`
- `src/domain/recommendation/ranking.ts`
- `src/domain/recommendation/explain.ts`
- `src/infrastructure/persistence/local/local-trip-repo.ts`
- `src/infrastructure/persistence/local/local-favorites-repo.ts`
- `src/infrastructure/persistence/local/local-profile-repo.ts`
- `src/lib/navigation/home-resolver.ts`
- `src/app/api/crossings/route.ts`
- `src/app/api/recommendations/route.ts`
- `src/app/api/cbp/route.ts`
- `src/components/viaje/ViajeHome.tsx` (refactor)
- `src/components/crossings/CrossingsList.tsx` (refactor)
- `src/components/crossing/CompareCrossings.tsx` (new)

### Modified Files
- `src/stores/trip.ts` → use TripRepository
- `src/stores/favorites.ts` → use FavoritesRepository
- `src/stores/traveler.ts` → use TravelerProfileRepository
- `src/lib/recommendation.ts` → implement RecommendationEngine
- `src/app/[locale]/(main)/viaje/page.tsx` → Viaje as Home
- `src/app/[locale]/(main)/crossings/page.tsx` → Exploratory
- `src/app/[locale]/crossing/[id]/page.tsx` → New hierarchy
- `src/components/onboarding/*` → Progressive profile
- `src/components/layout/AppShell.tsx` → Home resolver

---

## Decisions to Validate with Team

1. **Viaje = Home default**: Confirm with product
2. **Progressive profile levels**: Confirm prompting UX
3. **Recommendation reason types**: Confirm taxonomy
4. **Alert severity for recommendation changes**: Confirm priority
5. **Map height on Crossing Detail**: Design review
6. **Compare Crossings placement**: Tab or modal?

---

This plan respects both reviews:
- **cruze-review**: Trip as context, Viaje as Home, progressive profile, explainable recommendations
- **cruze-data-layer**: Repository pattern, three storage layers, API boundary, no DB yet