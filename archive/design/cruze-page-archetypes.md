# CRUZE — PAGE ARCHITECTURE

## Page Archetypes v1.0
**Status:** Locked Specification

---

### Core Principle

> **An archetype defines how information behaves, not how a particular page looks.**

A page can have a different dataset, title, or composition while still strictly conforming to repeatable rules for hierarchy, density, scrolling, data presentation, and decision-making.

---

# 01 — THE CRUZE 5-LEVEL PAGE MODEL

The product operates across five functional levels:

```text
CRUZE
│
├── DISCOVER
│   └── Crossing Intelligence (Live overview & corridor status)
│
├── DECIDE
│   └── Recommendation / Comparison (Optimal crossing determination)
│
├── INSPECT
│   └── Crossing Detail (Operational dossier, historical patterns, lanes)
│
├── MONITOR
│   ├── Favorites (Personalized corridor monitoring)
│   └── Alerts (Time-stamped border change detection)
│
└── ACT
    └── Route handoff / Contextual actions (Google/Apple Maps handoff)
```

---

# 02 — ARCHETYPE INVENTORY

Cruze defines **7 core page archetypes** and **1 contextual visual pattern**:

### Core Archetypes

| # | Archetype | Primary Job | User Question |
| :--- | :--- | :--- | :--- |
| **A01** | **Intelligence Feed** | Understand current border conditions | *"What's happening at the border right now?"* |
| **A02** | **Recommendation** | Decide which crossing makes the most sense | *"Which crossing should I use and why?"* |
| **A03** | **Crossing Detail** | Deeply inspect one crossing | *"Tell me everything relevant about this crossing."* |
| **A04** | **Comparison** | Evaluate multiple crossings side-by-side | *"Which of these crossings is better for my situation?"* |
| **A05** | **Personal Monitor** | Monitor saved/frequent crossings | *"What is happening at the crossings I care about?"* |
| **A06** | **Change Feed** | Understand what has changed | *"What changed that I need to know about?"* |
| **A07** | **Focused Task** | Perform a contained action | *"Execute this specific workflow."* |

### Contextual Visual Pattern (Not a Destination)

| Pattern | Role | Architectural Rule |
| :--- | :--- | :--- |
| **Contextual Map** (`<MapContext />`) | Geographic evidence & spatial orientation | Embedded inside recommendations, details, and comparisons. **Never a standalone tab or route.** |

---

# 03 — ARCHETYPE SPECIFICATIONS

## A01: Intelligence Feed (`/crossings`)

- **Purpose:** Primary entry into border intelligence (powers *Cruces*).
- **Density:** Medium → Low. Structured progressive disclosure from summary to depth.
- **Vertical Rhythm:**
  ```text
  [ HEADER (Context / Direction ⇄ / Timestamp) ]
      ↓ (32-48px breathing)
  [ PRIMARY INTELLIGENCE (Top recommendation & live status) ]
      ↓ (32-48px breathing)
  [ DECISION-RELEVANT OPTIONS (Alternative crossings & wait times) ]
      ↓ (32-48px breathing)
  [ DEEPER OPERATIONAL DATA (Corridor notes, trends, lane statuses) ]
      ↓ (32-48px breathing)
  [ PROVENANCE & METHODOLOGY (Data sources, freshness) ]
  ```

---

## A02: Recommendation (hero of P01 `/`)

- **Purpose:** High-conviction decision-making engine.
- **Critical Rule:** Must answer **Why**, not just **What**.
- **Structural Blueprint:**
  ```text
  [ TRIP CONTEXT (Origin · Destination · Direction) ]
      ↓
  [ BEST OPTION (Crossing name, border wait, approach time, total journey estimate) ]
      ↓
  [ WHY / REASONING (Explicit bulleted evidence: fastest overall, open lanes, delta) ]
      ↓
  [ ALTERNATIVES (Competing crossings with explicit +X min deltas) ]
      ↓
  [ CONTEXTUAL MAP (Spatial evidence: You → Crossing route comparison) ]
      ↓
  [ PRIMARY ACTION ("START ROUTE" handoff to external navigation) ]
  ```

---

## A03: Crossing Detail (`/crossings/:id`)

- **Purpose:** Comprehensive operational dossier for a specific port of entry.
- **Tone:** Infrastructure intelligence dossier, not a noisy consumer dashboard.
- **Structural Sequence:**
  1. Header with back button, crossing name, and persistent favorite toggle (`☆`/`★`).
  2. Identity & live operating status (`● OPEN`, hours, direction).
  3. Live wait times by lane type (`Standard`, `Ready Lane`, `SENTRI`, `Pedestrian`).
  4. Operational rules, vehicle restrictions, and access guidance.
  5. Contextual location map and approach vectors.
  6. Historical wait-time patterns & live trend indicators.
  7. Warnings, operational notes, and authoritative data sources.

---

## A04: Comparison (`/compare`)

- **Purpose:** Focused side-by-side evaluation of 2–3 competing crossings.
- **Mobile Rule:** Stack metrics by attribute (`Wait Time → A/B/C`, `Total Time → A/B/C`, `Restrictions → A/B/C`) rather than squeezing illegible multi-column cards.
- **Structural Sequence:**
  1. Selection summary (`2 selected`).
  2. Metric-by-metric comparison blocks.
  3. Key differences and operational trade-offs.
  4. Contextual comparison map.
  5. Clear verdict / recommended choice.

---

## A05: Personal Monitor (`/favorites`)

- **Purpose:** Fast, personalized monitoring of frequent crossings.
- **Key Difference:** Answers *"What is happening to MINE?"* rather than global discovery.
- **Structural Sequence:**
  1. Header with active direction.
  2. Saved crossings list with high-contrast tabular wait times and status pills.
  3. Quick-toggle corridor switcher and "Manage Favorites" action.

---

## A06: Change Feed (`/alerts`)

- **Purpose:** Time-stamped border change detection log (replaces generic activity feeds).
- **Hierarchy:** Prioritizes significant anomalies (surges, closures, lane openings) over noise.
- **Structural Sequence:**
  1. Header with unread alert count.
  2. Grouped time buckets (`Today`, `Yesterday`, `Earlier`).
  3. Structured change items:
     - Timestamp (`10:42 AM`)
     - Crossing name (`San Ysidro`)
     - State delta (`Wait increased 15 → 24 min` / `Ready Lane experiencing delays`)

---

## A07: Focused Task (Search, Filters, Selection, Settings)

- **Purpose:** Contained user action flows where bottom navigation is suppressed.
- **Structural Sequence:**
  1. Focused header (Close `×` + Title + Action `Done`).
  2. Single-purpose interactive form or list.
  3. Dedicated primary/secondary submission actions.

---

# 04 — REUSABLE COMPONENT VS ARCHETYPE BOUNDARIES

To prevent architectural bloat, components and actions must never be conflated with page archetypes:

```text
PAGE ARCHETYPES (Structural containers)
├── Intelligence Feed
├── Recommendation
├── Crossing Detail
├── Comparison
├── Personal Monitor
├── Change Feed
└── Focused Task

REUSABLE DATA COMPONENTS (Building blocks)
├── CrossingCard (Used in Feed, Favorites, Comparison, Search)
├── RecommendationCard (Used in Feed, Recommendation, Comparison)
├── Metric / TabularWaitTime
├── LaneGrid / LaneTimeBadge
├── ContextualMap (<MapContext />)
├── LiveStatusIndicator / FreshnessBar
└── TrendIndicator / HourlyTimeline

CONTEXTUAL ACTIONS (In-flow interactions)
├── Start Route (External navigation handoff)
├── Compare
├── Save / Favorite (☆)
├── Share
└── Filter / Search
```

---

# 05 — APPLICATION PAGE INVENTORY & ROUTING

The entire Cruze experience maps to exactly **9 concise routes**:

```text
ROUTING MODEL
│
├── INTELLIGENCE
│   ├── /crossings       → A01: Intelligence Feed (Cruces)
│   ├── /crossings/:id   → A03: Crossing Detail
│   ├── /       → A02: Recommendation
│   └── /compare         → A04: Comparison
│
├── MONITORING
│   ├── /favorites       → A05: Personal Monitor
│   └── /alerts          → A06: Change Feed
│
└── TASKS
    ├── /search          → A07: Focused Task
    ├── /filters         → A07: Focused Task
    └── /settings        → A07: Focused Utility
```

---

# 06 — VERTICAL BREATHING & SPACING SYSTEM

Cruze enforces **comprehension density over raw information packing**:

```text
MACRO SPACING TOKENS
--spacing-cruze-xs:  8px;
--spacing-cruze-sm:  12px;
--spacing-cruze-md:  16px;
--spacing-cruze-lg:  24px;
--spacing-cruze-xl:  32px;
--spacing-cruze-2xl: 48px;
--spacing-cruze-3xl: 64px;
--spacing-cruze-4xl: 80px;

MAJOR SECTION GAPS: 48px – 80px
CARD INTERNAL PADDING: 20px – 24px
CONTAINER MAX WIDTH: 720px (centered on desktop/tablet)
```

---

# 07 — GLOBAL SYSTEM STATES (PER ARCHETYPE)

Every archetype must consistently implement these 7 fundamental states:

1. **Loading:** Structural skeletons preserving macro layout.
2. **Live:** Green active indicator with precise timestamp (`● LIVE · Updated 1 min ago`).
3. **Stale / Delayed:** Subdued warning badge (`● DATA DELAYED · Last updated 18 min ago`).
4. **Partial:** Transparent indication of missing lane/metric feeds.
5. **Offline:** Clear `ConnectivityBanner` showing cached data.
6. **Empty:** Contextual guidance and exploration entry points.
7. **Error:** Calm operational recovery button (`Unable to refresh · [ Try again ]`).
