# Monetization Integration Plan

**Source:** `docs/MONETIZATION_STRATEGY.md`
**Status:** Implementation plan — phased approach
**Last updated:** 2026-08-31

---

## Overview

This plan translates the locked monetization strategy into concrete implementation phases. The strategy is ad-first free tier, intent-aware Assistant, trip-scoped "break", data contribution for ad-light, and Pro tier. All revenue surfaces respect decision integrity — ads never change gate ranking.

---

## Day-0 Foundation (Current Phase)

Ship invisible scaffolding before any ad UI. These are type definitions, config objects, and analytics event shapes.

### 1. Monetization Policy Config

**New file:** `src/lib/monetization-policy.ts`

```ts
interface MonetizationPolicy {
  break: {
    maxDurationHours: number;        // e.g. 4
    maxPerWeekFree: number;          // e.g. 3
    suppresses: AdType[];            // ["display", "interstitial"]
    assistantPartnersAllowed: boolean; // true — intent rules still apply
  };
  contribute: {
    signals: ContributableSignal[];   // ["mode_used", "queue_sample", "crossing_used", "geofence_coarse"]
    reward: "ad_light";
    revocable: boolean;
  };
  pro: {
    priceBandUSD: { monthly: [4, 8]; annual: [36, 72] };
    features: ProFeature[];
  };
  intentBands: Record<IntentBand, { commerceAllowed: boolean; partnerAllowed: boolean }>;
  caps: {
    adsPerSession: number;           // e.g. 5
    partnerImpressionsPerTurn: number; // e.g. 1
  };
}
```

### 2. Consent Types

**New file:** `src/types/monetization.ts`

```ts
type AdType = "display" | "interstitial" | "native" | "partner_card";
type IntentBand = "guidance_only" | "service_seek" | "mixed" | "crisis";
type ContributableSignal = "mode_used" | "queue_sample" | "crossing_used" | "geofence_coarse";
type ProFeature = "smart_alerts" | "departure_optimizer" | "history_extended" | "export" | "multi_leg";

interface ConsentRecord {
  id: string;
  type: "contribution" | "break" | "pro";
  granted: boolean;
  timestamp: string;
  version: string; // policy version
}

interface MonetizationEvent {
  type: "ad_impression" | "partner_impression" | "break_start" | "break_end" | 
        "contribute_opt_in" | "contribute_opt_out" | "intent_classified" | "pro_purchase";
  payload: Record<string, unknown>;
  timestamp: string;
}
```

### 3. Analytics Event Shapes

**New file:** `src/lib/analytics.ts`

```ts
// Event names (string constants for consistency)
export const EVENTS = {
  AD_IMPRESSION: "monetization.ad_impression",
  PARTNER_IMPRESSION: "monetization.partner_impression",
  BREAK_START: "monetization.break_start",
  BREAK_END: "monetization.break_end",
  CONTRIBUTE_OPT_IN: "monetization.contribute_opt_in",
  CONTRIBUTE_OPT_OUT: "monetization.contribute_opt_out",
  INTENT_CLASSIFIED: "assistant.intent_classified",
  PRO_PURCHASE: "monetization.pro_purchase",
  DECISION_VIEWED: "decision.viewed",
  DECISION_NAVIGATED: "decision.navigated",
} as const;

export function trackEvent(type: string, payload?: Record<string, unknown>) {
  // Placeholder — integrate with analytics provider
  console.debug(`[analytics] ${type}`, payload);
}
```

### 4. Feature Flags

**New file:** `src/lib/feature-flags.ts`

```ts
const FLAGS = {
  ADS_ENABLED: false,
  ASSISTANT_PARTNERS: false,
  BREAK_ENABLED: false,
  CONTRIBUTE_ENABLED: false,
  PRO_ENABLED: false,
} as const;

export function isEnabled(flag: keyof typeof FLAGS): boolean {
  return FLAGS[flag];
}
```

---

## Phase 1: Assistant Guidance + Curated Partners

**Goal:** Make the Agent tab useful with guidance content and contextual partner suggestions.

### Components to Build

| Component | Location | Description |
|-----------|----------|-------------|
| `IntentClassifier` | `src/lib/intent-classifier.ts` | Rule/keyword-based classifier that maps user messages to intent bands |
| `PartnerCard` | `src/components/agent/PartnerCard.tsx` | Sponsored partner suggestion card with clear "Partner" label |
| `GuidanceResponse` | `src/components/agent/GuidanceResponse.tsx` | Rich response with checklists, links, structured info |
| `PartnerCatalog` | `src/lib/partners.ts` | Partner taxonomy: insurance, tires, FX, parking, clinic — corridor-tagged |

### Intent Classification Rules

```
crisis_signals = ["emergency", "accident", "help me", "stuck", "injured", "crime", "robbery", "ambulance"]
guidance_signals = ["checklist", "documents", "passport", "visa", "insurance required", "what do i need", "rules", "hours"]
service_signals = ["insurance", "mechanic", "tire", "parking", "clinic", "exchange", "money", "gas", "fuel"]
```

### Partner Display Rules

- Maximum 1 partner card per meaningful turn
- Never after crisis responses
- Never inside decision/recommendation cards
- Clear `Partner` / `Patrocinado` label
- Corridor-tagged (Tijuana-San Diego partners for TJ-SD crossings)

---

## Phase 2: Break + Contribute Flows

**Goal:** Let users suppress ads during trips and contribute data for ad-light.

### Break Flow

1. User taps "Break" in Viaje tab or Assistant
2. Confirmation: "Ads hidden until you cross or for 4 hours"
3. Store `breakActive: true, breakStartedAt: timestamp` in traveler store
4. Suppress display/interstitial ads while active
5. End conditions: user confirms crossing, geofence detection, or timeout

### Contribute Flow

1. Settings/Data contribution toggle in profile
2. Granular signal toggles (mode, queue samples, crossing used, coarse location)
3. Purpose explanation: "Improve wait estimates for everyone"
4. What is NOT included: "We never sell personal data to third parties"
5. While active → ad-light (fewer/smaller ads)
6. Revocable anytime → ads resume

### New Store: `src/stores/monetization.ts`

```ts
interface MonetizationState {
  breakActive: boolean;
  breakStartedAt: string | null;
  contributionActive: boolean;
  contributionSignals: ContributableSignal[];
  consentRecords: ConsentRecord[];
  
  startBreak: () => void;
  endBreak: () => void;
  toggleContribution: (signal: ContributableSignal) => void;
  recordConsent: (type: string, granted: boolean) => void;
}
```

---

## Phase 3: Pro Tier

**Goal:** Paid subscription for zero ads + power features.

### Pro Features

| Feature | Description |
|---------|-------------|
| No ads | Complete ad removal |
| Smart alerts | Custom alert rules (wait threshold, lane changes, specific crossings) |
| Departure optimizer | Best time to leave based on historical patterns |
| Extended history | 30-day crossing history vs 7-day free |
| Export | CSV/PDF export of trip data |
| Multi-leg | Multi-stop trip planning |

### Implementation

- `src/stores/pro.ts` — subscription state
- `src/components/pro/ProPaywall.tsx` — upsell modal
- `src/components/pro/ProBadge.tsx` — "Pro" indicator
- Payment integration (Stripe or similar) — deferred to actual launch

---

## Phase 4: Subtle Native Ads

**Goal:** Non-disruptive ads on secondary surfaces.

### Ad Placement Rules

| Surface | Ad Type | Notes |
|---------|---------|-------|
| Agent chat | Partner card (intent-driven) | Only on `service_seek` turns |
| Viaje tab | Native card | Below trip summary, not blocking |
| Crossing detail | Banner | Bottom of page, not inside decision card |
| Favorites | Native card | Between items |

### Ad Placement Prohibitions

- ❌ Inside recommendation/decision cards
- ❌ Overriding crossing ranking
- ❌ During crisis intent
- ❌ As interstitials between screens
- ❌ Disguised as evidence or data

---

## Decisions (Locked)

| Question | Decision | Rationale |
|----------|----------|-----------|
| **LLM provider** | Claude (Anthropic) for quality; GPT-4o-mini as fallback for cost | Claude excels at structured, context-aware responses. GPT-4o-mini for high-volume/low-cost needs. |
| **Alert baseline** | localStorage (persists across sessions) | Better baseline accuracy; rolling EMA survives app restarts |
| **Partner model** | Hybrid (manual outreach + self-serve portal) | Start manual for corridor control; self-serve at scale |
| **Break geofence** | Both (geolocation + manual) + intelligent crossing detection | See Crossing Detection Flow below |
| **Payment provider** | Stripe (don't configure yet) | Standard API, supports MXN, web + mobile |

---

## Crossing Detection Flow (Break End + Trip Completion)

This is the intelligent system for detecting when a user has crossed the border and completing their trip phase.

### Overview

The system uses a combination of **time estimation**, **geolocation monitoring**, and **journey context** to determine when a user has crossed. It adapts in real-time as conditions change.

### Flow Diagram

```
User starts trip / activates break
  ↓
Calculate estimated crossing time from wait time + approach time
  ↓
Start geolocation monitoring (background)
  ↓
┌─ Timer check: Has estimated time elapsed?
│   ├─ YES → Check user position
│   │         ├─ Position shows crossed → Show "Confirm Crossing" gate
│   │         └─ Position NOT crossed → Re-estimate (wait time may have changed)
│   └─ NO → Continue monitoring
│
└─ Position check: Has user crossed the border line?
    ├─ YES (user is on destination side) → Show "Confirm Crossing" gate
    └─ NO → Continue monitoring
```

### Crossing Detection States

```ts
type CrossingPhase = 
  | "waiting"      // User is waiting to cross
  | "approaching"  // User is moving toward the crossing
  | "at_booth"     // User is at the crossing booth
  | "crossing"     // User is in the process of crossing
  | "completed"    // User has confirmed crossing
  | "timeout";     // Estimation window expired

interface CrossingDetectionState {
  phase: CrossingPhase;
  estimatedCrossingTime: number;    // minutes, recalculated dynamically
  estimatedArrivalAt: string;       // ISO timestamp
  monitoringStartedAt: string;
  lastPositionCheck: string;
  lastWaitTime: number;             // at time of last estimation
  hasJourneyContext: boolean;       // origin → destination configured
  destinationArrived: boolean;      // GPS shows user at destination
  borderCrossed: boolean;           // GPS shows user on other side
  reEstimateCount: number;          // how many times we've re-estimated
}
```

### Detection Logic

#### 1. Calculate Initial Estimate

```ts
function calculateEstimatedCrossingTime(
  waitTime: number,           // current wait at crossing (minutes)
  approachTime: number,       // time to reach crossing from origin (minutes)
  crossingMode: CrossingMode  // walking/vehicle affects speed
): number {
  // Wait time + estimated approach + buffer
  const buffer = crossingMode === "walking" ? 10 : 5;
  return waitTime + approachTime + buffer;
}
```

#### 2. Monitor Position (Background)

```ts
// Geofence: ~2km radius around crossing coordinates
// If user enters this zone → phase = "approaching"
// If user exits on destination side → borderCrossed = true

const CROSSING_GEOFENCE_RADIUS_KM = 2;

function checkBorderCrossed(
  userPosition: { lat: number; lng: number },
  crossingCoordinates: { lat: number; lng: number },
  direction: TripDirection
): boolean {
  // Simple heuristic: check if user is on the destination side of the border
  // US-Mexico border runs roughly along latitude 32.5 (Tijuana-San Diego)
  // More accurate: check if user crossed the crossing's lat/lng
  
  const distance = haversineDistance(userPosition, crossingCoordinates);
  if (distance > CROSSING_GEOFENCE_RADIUS_KM) return false;
  
  // Check directional movement
  if (direction === "MX_TO_US") {
    return userPosition.lat > crossingCoordinates.lat - 0.01;
  } else {
    return userPosition.lat < crossingCoordinates.lat + 0.01;
  }
}
```

#### 3. Dynamic Re-Estimation

```ts
// Every 5 minutes, re-check the wait time
// If wait time changed significantly (>5 min), recalculate

function shouldReEstimate(
  currentWaitTime: number,
  lastWaitTime: number,
  timeSinceLastEstimate: number
): boolean {
  if (timeSinceLastEstimate < 5 * 60 * 1000) return false; // min 5 min between checks
  const waitDelta = Math.abs(currentWaitTime - lastWaitTime);
  return waitDelta >= 5; // re-estimate if wait changed by 5+ min
}

function reEstimate(
  originalEstimate: number,
  oldWaitTime: number,
  newWaitTime: number
): number {
  const diff = newWaitTime - oldWaitTime;
  return Math.max(originalEstimate + diff, 0);
}
```

#### 4. Show Confirmation Gate

When crossing is detected (or estimated time elapsed + position confirms):

```
┌─────────────────────────────────────────┐
│  ✅ Did you cross at San Ysidro?        │
│                                         │
│  Your trip: Tijuana → San Diego         │
│  Estimated time: 45 min                 │
│  Actual time: ~38 min                   │
│                                         │
│  [Yes, crossed ✓]   [No, still waiting] │
│                                         │
│  Submit feedback to improve estimates   │
└─────────────────────────────────────────┘
```

#### 5. Journey Context Handling

| Scenario | Behavior |
|----------|----------|
| **Journey context present** (origin → destination configured) | Wait for GPS to show arrival at destination. Then show crossing summary. |
| **No journey context** (user browsing, no trip) | If GPS shows user crossed border → show "Confirm Crossing" gate immediately |
| **Break active** | Same detection, but end break on confirmed crossing |

### Crossing Summary Page (Post-Crossing)

After user confirms crossing, show:

```
┌─────────────────────────────────────────┐
│  🎉 Crossing Complete                   │
│                                         │
│  San Ysidro                            │
│  Tijuana, BC → San Diego, CA           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Estimated    │ Actual           │    │
│  │ 45 min       │ 38 min           │    │
│  │ ████████░░   │                  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  You crossed 7 min faster than expected │
│                                         │
│  [Rate your experience]                 │
│  [Share crossing time]                  │
│  [View other crossings]                 │
│                                         │
│  ─────────────────────────────────      │
│  Help improve CRUZE:                    │
│  Share your crossing time? (contribute) │
│                                         │
│  [Share data ✓]  [No thanks]            │
└─────────────────────────────────────────┘
```

### Implementation Files

| # | What | Files |
|---|------|-------|
| 1 | Crossing detection state | `types/crossing-detection.ts` — CrossingPhase, CrossingDetectionState |
| 2 | Detection store | `stores/crossing-detection.ts` — Zustand + persist, state management |
| 3 | Estimation engine | `lib/crossing-estimator.ts` — Calculate/re-estimate crossing time |
| 4 | Geofence monitor | `lib/geofence-monitor.ts` — Background position tracking, border detection |
| 5 | Re-estimation logic | `lib/crossing-estimator.ts` — Dynamic wait time monitoring |
| 6 | Confirmation gate UI | `components/crossing/CrossingConfirmGate.tsx` — "Did you cross?" prompt |
| 7 | Crossing summary page | `app/[locale]/crossing/[id]/summary/page.tsx` — Post-crossing results |
| 8 | Break integration | `stores/monetization.ts` — End break on crossing confirmation |
| 9 | Contribute prompt | `components/contribute/ContributePrompt.tsx` — Post-crossing data sharing |

---

## Implementation Order (Updated)

| Order | Phase | Est. Time | Dependencies |
|-------|-------|-----------|--------------|
| 1 | Phase 0: Bug Fixes | 30 min | None |
| 2 | Phase 1: Alert Engine | 2-3 hours | None |
| 3 | Phase 2: Agent Tier 1 | 3-4 hours | None |
| 4 | Phase 3: Day-0 Monetization | 1-2 hours | None |
| 5 | Phase 4: Crossing Detection | 3-4 hours | Phase 0, geolocation |
| 6 | Phase 5: Alerts × Agent | 1 hour | Phase 1 + Phase 2 |
| 7 | Phase 6: Agent LLM | Future | Phase 2 |
| 8 | Phase 7: Partners | Future | Phase 3 + Phase 2 |
| 9 | Phase 8: Pro/Break/Contribute | Future | Phase 3, Phase 4 |

**Total for Phases 0-5: ~11-15 hours of implementation**

---

## Open Questions (Resolved)

| Question | Answer |
|----------|--------|
| LLM provider | Claude (primary), GPT-4o-mini (fallback) |
| Alert baseline | localStorage with EMA persistence |
| Partner model | Hybrid (manual + self-serve) |
| Break geofence | Both (geolocation + manual) + crossing detection |
| Payment provider | Stripe (don't configure yet) |
| B2B API | Deferred to scale |

## Remaining Open Questions

1. **Geolocation background permission:** iOS Safari limits background geolocation. Should we use a foreground timer approach instead (check every 30s when app is open)?
2. **Crossing confirmation UX:** Should the confirmation gate be a modal, a banner, or a full-screen overlay?
3. **Contribute prompt timing:** Show immediately after crossing, or after a delay?
4. **Re-estimation frequency:** Every 5 minutes, or based on crossing-specific patterns?
5. **Border detection accuracy:** Simple latitude check vs. more sophisticated route analysis?
