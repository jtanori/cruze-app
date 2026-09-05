# Cruce Comprobation Checklists

> **Source of truth for implementation:** `design/components/<ID>-<Name>.md` (see `design/components/README.md` — 83) + `design/workflows/W*.md` (W1-W10) `design/TESTING_INTEGRATION_PLAN.md` (P0-P5 wiring) — checklists §§18-34 now reference those per-component/per-workflow specs. Original spec sections (`docs/CRUZE — UI Architecture & Implementation Reference.v1.md` §§18-34, `docs/CRUZE — Product, UX & Design System Specification.v1.md` §27) remain rationale only. Integration order: `design/INTEGRATION_PLAN.md` Addendum. Testing strategy: `docs/TESTING_TOOLS.md`.


Source: `design/components/README.md` + `design/workflows/W*.md` (canonical) — original: `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` §§18-34 + `docs/CRUZE — Product, UX & Design System Specification.v1.md` §27 (rationale)
Generated: 2026-09-03 — refer to this file for all QA/comprobation runs.

---

## 18. Page Level — `Reference:18`

| Check | Question |
|-------|----------|
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

## 19. Component Level — `Reference:19`

| Check | Question |
|-------|----------|
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

## 20. Primitive Level — `Reference:20`

| Primitive | Verify |
|-----------|--------|
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

## 21. Data Type Level — `Reference:21`

**Crossing**

| Type | Verify |
|------|--------|
| `Crossing` | Stable ID, name, location, operational state |
| `CrossingDirection` | Direction is explicit |
| `CrossingLane` | Lane type and wait are explicit |
| `CrossingAccess` | Compatibility is explicit |
| `CrossingHours` | Timezone-aware |
| `CrossingRequirement` | Source-backed |
| `CrossingRestriction` | Source-backed |
| `CrossingService` | Current/verified |
| `CrossingObservation` | Timestamp + source + confidence |

**Location**

| Type | Verify |
|------|--------|
| `LocationState` | Explicit lifecycle state |
| `LocationAccuracy` | Numeric accuracy available |
| `LocationTimestamp` | Acquisition time |
| `LocationConfidence` | Semantic confidence |
| `LocationPermission` | Granted/denied/restricted |

**Trip**

| Type | Verify |
|------|--------|
| `Trip` | Stable state |
| `TripOrigin` | Coordinate/place |
| `TripDestination` | Coordinate/place |
| `TravelMode` | Walking/private/commercial |
| `Direction` | Derived/explicit |
| `AccessType` | Compatibility context |
| `DocumentProfile` | High-level only |
| `TripRecommendation` | Crossing + reasons + metrics |
| `TripChecklistState` | Per-item state |

## 22. Data Semantic Checklist — `Reference:22`

Every live value must answer: WHAT? WHEN? SOURCE? CONFIDENCE? DIRECTION?

Example:
```
Wait: 11 min
Direction: Northbound
Observed: 12:42 PM
Source: Border data provider
Confidence: High
```
UI may hide fields, but data model must not.

## 23. Zero vs Unknown vs Stale — `Reference:23`

- `0 min` = verified zero
- `—` = unavailable / unknown
- `11 min\nActualizado hace 47 min` = known but stale
Never conflate.

## 24. Operational vs Freshness Matrix — `Reference:24`

| Operational | Freshness | UI |
|-------------|-----------|----|
| Open | Live | Green/open + current |
| Open | Recent | Green/open + recent |
| Open | Stale | Open + stale warning |
| Limited | Live | Limited + current |
| Closed | Live | Closed + current |
| Unknown | Live | Unknown |
| Open | Unavailable | Open + data unavailable |
Never use one status to represent both.

## 25. Navigation Consistency Matrix — `Reference:25`

| From | Destination | Mechanism | Expected |
|------|-------------|-----------|----------|
| Viaje | Cruces | Link | Switch primary tab |
| Viaje | Crossing Detail | Row/action | Open detail |
| Viaje | Agent | Bottom nav | Preserve trip context |
| Nearby crossing | Detail | Row tap | No trip creation |
| Detail | Trip | `Usar este cruce` | Enter adaptive Trip Setup |
| Cruces | Detail | Row tap | Open canonical detail |
| Detail | Compare | Compare | Preserve selection |
| Compare | Trip | Use action | Start trip with selected |
| Agent | Crossing | Result action | Open canonical detail |
| Agent | Trip | Result action | Open relevant trip surface |
| Aviso | Crossing | Action | Open canonical detail |
| Aviso | Trip | Action | Open relevant trip |
| Settings | Favorites | Row | Open favorites |
| Settings | My Trips | Row | Open completed trips |
| Trip | Settings | Gear | Global settings |
| Any | Avisos | Bell | Open Avisos |
| Any | Settings | Gear | Open Settings |

## 26. Navigation Invariants — `Reference:26`

1. Exactly 3 primary tabs: Viaje / Cruces / Agente
2. Bell = Avisos
3. Gear = Configuración
4. Crossing → canonical Crossing Detail
5. Trip recommendation ≠ Crossing Detail

## 27. Pre-Crossing Checklist — `Product Spec:830`

Data-driven categories: Operational, Data freshness, Route availability, Access compatibility, Required documentation, Restrictions, Lane availability. Must be source-backed, never invent legal requirements.

## 29. Location Consistency — `Reference:29`

| Check | Requirement |
|-------|-------------|
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

## 30. Agent Consistency — `Reference:30`

Determine context: Current location? Active trip? Selected crossing? Travel mode? Direction? Recommendation? Recent Aviso? Checklist?
- IF context exists → contextual answer/action
- ELSE → general Cruze answer
Never ask for information already in Cruze state.

## 31. Avisos Consistency — `Reference:31`

An Aviso must answer: WHAT CHANGED? WHY DOES IT MATTER? WHAT CAN I DO?
Example: `San Luis wait increased. WHY: Lukeville is now faster. ACTION: [Ver recomendación]`

## 32. Design Consistency — `Reference:32`

Typography Sora display / Inter UI, Cruze Mint primary, Midnight bg, Surface/Elevated, 1px borders, restrained radius, one primary CTA, strong numeric hierarchy, semantic status, freshness separate, single icon family, 4px spacing, 44-48px touch, never color-only status, cards for grouping not decoration.

## 33. Component QA Matrix — `Reference:33`

```
□ Correct domain
□ Correct contextual name
□ Single responsibility
□ Uses primitives correctly
□ No duplicated domain logic
□ Responsive
□ Accessible
□ Loading state
□ Empty state where applicable
□ Error state where applicable
□ Stale state where applicable
□ Correct semantic colors
□ Correct typography tokens
□ Correct spacing tokens
□ Correct interaction states
□ Localization-ready
□ Analytics where appropriate
□ Unit/component tests
```

## 34. Page QA Matrix — `Reference:34`

```
□ Entry point works
□ Back behavior works
□ Primary navigation works
□ Header actions work
□ Main action obvious
□ Data loaded correctly
□ Data freshness correct
□ Loading state correct
□ Empty state correct
□ Error state correct
□ Stale state correct
□ Overlay/bottom nav correct
□ Accessibility correct
□ Responsive correct
□ Analytics correct
□ Localization correct
```

---

*Use `docs/PHASE-7-QA.md` for the last full run. Update this file, not the source specs, when adding project-specific checks.*
