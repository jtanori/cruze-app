# CRUZE — INFORMATION ARCHITECTURE & PAGE INVENTORY
## Section 03, 04, 05 & 06: IA Model, Finite Page Inventory, Hierarchy Map & Archetype Matrix
**Document ID:** `CRUZE-PLAN-02`  
**Status:** Approved Specification

---

# 01 — THE 5-LEVEL INFORMATION ARCHITECTURE MODEL

CRUZE organizes all user experiences across a cohesive 5-level functional model:

```text
CRUZE BORDER INTELLIGENCE
│
├── 01. DISCOVER
│   └── Crossing Intelligence (Live corridor overview, aggregate queue health, operational pulse)
│
├── 02. DECIDE
│   ├── Trip Recommendation (Point-to-point fastest crossing engine with evidence)
│   └── Multi-Port Comparison (Side-by-side metric matrix)
│
├── 03. INSPECT
│   └── Crossing Detail (Complete operational dossier, live lane breakdown, hours, restrictions, history)
│
├── 04. MONITOR
│   ├── Favoritos / Personal Monitor (Saved frequent ports & fast queue delta tracking)
│   └── Alertas / Change Feed (Time-stamped border change detection log)
│
└── 05. ACT & SUPPORT
    ├── Navigation Handoff (Turn-by-turn launcher for Google Maps / Apple Maps / Waze)
    ├── Search & Corridor Switcher (Instant port search and quick filter)
    └── Settings & Data Provenance (Account, notification rules, methodology, CBP sources)
```

---

# 02 — DERIVED FINITE PAGE INVENTORY

Following strict product scoping rules—where components are not pages, states are not pages, and maps are embedded evidence rather than standalone tabs—CRUZE requires exactly:

> **CRUZE requires 4 Primary Pages, 2 Secondary Monitoring Pages, and 3 Focused Task/Utility Pages (9 Total Pages).**

### Category Breakdown

```text
1. CORE INTELLIGENCE & DECISION (4 PRIMARY PAGES)
   ├── P01: Cruces / Intelligence Feed (/crossings)
   ├── P02: Crossing Detail (/crossings/:id)
   ├── P03: Recommendation (hero of P01 `/`)
   └── P04: Comparison (/compare)

2. PERSONAL MONITORING (2 SECONDARY PAGES)
   ├── P05: Favoritos (/favorites)
   └── P06: Alertas (/alerts)

3. FOCUSED TASKS & UTILITY (3 SUPPORTING PAGES / MODAL SHEETS)
   ├── P07: Search (/search) — **DEFERRED to v1.1**
   ├── P08: Filters (/filters)
   └── P09: Settings & Account (/settings)
```

---

# 03 — GLOBAL PAGE HIERARCHY MAP

```text
                                CRUZE ROOT
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       │                            │                            │
   [BOTTOM NAV]                 [BOTTOM NAV]                 [BOTTOM NAV]
       │                            │                            │
  P01: CRUCES                  P05: FAVORITOS                P06: ALERTAS
 (Live Intelligence)        (Personal Monitor)             (Change Feed)
       │                            │                            │
       ├──────────────┬─────────────┘                            │
       │              │                                          │
       ▼              ▼                                          │
  P03: RECOMMEND  P04: COMPARE                                   │
 (Decision Engine) (Multi-Port)                                  │
       │              │                                          │
       └──────┬───────┴──────────────────────────────────────────┘
              │
              ▼
      P02: CROSSING DETAIL
      (Operational Dossier)
              │
              ▼
      [NAVIGATION HANDOFF]
     (Google/Apple Maps/Waze)

┌────────────────────────────────────────────────────────────────────────┐
│ MODAL / FOCUSED TASK OVERLAYS (Bottom Navigation Hidden)                │
│ ├── P07: Search (/search) — **DEFERRED to v1.1**                                              │
│ ├── P08: Filters (/filters)                                            │
│ └── P09: Settings & Account (/settings)                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 04 — PAGE ARCHETYPE MATRIX

CRUZE maps all 9 pages to 7 strictly defined architectural archetypes:

| Page ID | Page Name | Route | Archetype ID & Name | Priority | Bottom Nav Visible? | Primary User Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P01** | **Cruces** | `/crossings` | `A01` — Intelligence Feed | **Primary** | **Yes** (Active) | Scan corridor queue health & tap crossing row or recommend banner |
| **P02** | **Crossing Detail** | `/crossings/:id` | `A03` — Crossing Detail | **Primary** | **Yes** (Contextual) | Inspect lane queues, operating rules, historical trends & trigger navigation |
| **P03** | **Recommendation** | hero of `/` (P01) | `A02` — Recommendation | **Primary** | **Yes** (Contextual) | Review fastest crossing evidence, review alternatives & tap `START ROUTE` |
| **P04** | **Comparison** | `/compare` | `A04` — Comparison | **Primary** | **No** (Modal header) | Stack up to 3 ports side-by-side & select winning crossing |
| **P05** | **Favoritos** | `/favorites` | `A05` — Personal Monitor | **Secondary** | **Yes** (Active) | Rapidly scan saved ports & observe wait deltas |
| **P06** | **Alertas** | `/alerts` | `A06` — Change Feed | **Secondary** | **Yes** (Active) | Review chronological change logs & tap affected crossing |
| **P07** | **Search** | `/search` | `A07` — Focused Task | **Supporting** | **No** (Close `×`) | Type to filter ports by city, corridor, or lane program |
| **P08** | **Filters** | `/filters` | `A07` — Focused Task | **Supporting** | **No** (Close `×`) | Toggle direction, vehicle class, and lane eligibility filters |
| **P09** | **Settings** | `/settings` | `A07` — Focused Utility | **Supporting** | **No** (Close `×`) | Adjust notification threshold, language, units & inspect CBP sources |

---

# 05 — ARCHITECTURAL EXCLUSIONS (WHAT DOES NOT EXIST)

To maintain extreme focus and prevent visual clutter, the following patterns are **strictly prohibited** from existing as standalone pages:
1. **No Standalone "Map" Page:** Geography serves as evidence inside P01, P02, P03, and P04 via `<MapContext />`. A detached map tab lacks actionable decision context.
2. **No "Activity / Social" Feed:** Replaced by high-signal, time-stamped border status transitions in P06 Alertas.
3. **No Standalone "Analytics" Page:** Historical trends belong inside P02 Crossing Detail directly under the live lane queue, where they provide operational perspective.
4. **No Standalone "Error / Empty" Full-Page Routes:** Errors, empty lists, and stale network states are inline container states within each respective archetype.
