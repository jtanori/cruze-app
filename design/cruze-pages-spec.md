# CRUZE — PAGE SPECIFICATIONS

## Build-Ready Page Contracts v1.0 · Dark Theme
**Status:** Locked Specification

---

### Page Inventory & Scope

```text
CRUZE APPLICATION EXPERIENCES (9 ROUTES)
│
├── CORE INTELLIGENCE & DECISION
│   ├── P01: Cruces / Intelligence Feed (/crossings)
│   ├── P02: Crossing Detail (/crossings/:id)
│   ├─   ─ P03: Recommendation (hero of P01 `/`)
│   └── P04: Comparison (/compare)
│
├── PERSONAL MONITORING
│   ├── P05: Favoritos (/favorites)
│   └── P06: Alertas (/alerts)
│
└── FOCUSED TASKS & UTILITIES
    ├─   ─ P07: Search (/search) — **DEFERRED to v1.1**
    ├── P08: Filters (/filters)
    └── P09: Settings & Account (/settings)
```

---

# P01 — CRUCES (INTELLIGENCE FEED)

- **Archetype:** A01 — Intelligence Feed
- **Route:** `/crossings`
- **Primary User Question:** *"What is happening at the border right now, and where should I cross?"*

### 01. Shell & Header
- **Header:** Root Header (`68px`), Left: `CRUZE` wordmark, Right: Account access (`◉`). No back button.
- **Bottom Navigation:** `Cruces` active (Item 1 of 3).

### 02. Content Container & Max Width
- **Mobile:** `100%` width, `padding-inline: 20px` (or `16px` on small mobile).
- **Tablet / Desktop:** `max-width: 760px` (Tablet) / `1120px` (Desktop), centered with `margin-inline: auto`.

### 03. Top Context & Direction Selector
```text
TIJUANA → SAN DIEGO ⇄
Updated 1 min ago
```
- **Spacing:** Header → `28px` → Direction (`17px/600`) → `6px` → Timestamp (`12px/500`) → `40px` → Primary Intelligence.
- **Visual:** Page context text only—**no container card**.

### 04. Primary Intelligence & Dominant Metric
- **Dominant Metric:** `48–56px`, `font-weight: 650–700`, `line-height: 0.95`, tabular numeric.
- **Label:** `Average border wait` + Status indicator `● BORDER MOVING NORMALLY`.
- **Spacing:** Major section gap of `48–64px` before the crossing list.

### 05. Crossing List (`CROSSINGS`)
- **Structure:** Non-card editorial list (`Crossing row → subtle divider → Crossing row`).
- **Row Anatomy:**
  1. Crossing name (`San Ysidro`) + Direction (`Tijuana → San Diego`) + Navigation arrow (`→`).
  2. Wait time (`28–32px`, `font-weight: 650`, tabular).
  3. Status (`● Open`, `● Limited`, `● Closed`, `● Delayed`, `? Unknown`).
  4. Lane pills (`Ready Lane · SENTRI · Standard`).
  5. Freshness (`Updated 1 min ago`).

### 06. Recommendation Section (Context-Dependent)
- **Configuration A (Trip Context Provided):** Surfaces `<CrossingRecommendation />` directly (Best crossing, wait at port, approach time, total journey estimate, bulleted evidence).
- **Configuration B (No Destination):** Banner action `[ FIND BEST CROSSING ]` prompting destination input.

### 07. Contextual Map & Operational Conditions
- **Map Height:** `220–280px` (Mobile) / `280–360px` (Desktop). Map is accompanied by explicit decision interpretation.
- **Operational Conditions:** Hours, lane availability, restrictions, incidents.
- **Historical Context:** Typical hourly chart clearly separated from live data.
- **Footer:** Data sources link + `80px` bottom breathing space above Bottom Navigation.

---

# P02 — CROSSING DETAIL

- **Archetype:** A03 — Crossing Detail
- **Route:** `/crossings/:id`
- **Primary User Question:** *"What do I need to know about this crossing?"*

### Structural Sequence:
1. **Header:** Back button (`←`), Crossing name (`San Ysidro`), Favorite toggle (`☆`/`★`).
2. **Identity & Live Status:** Port name, corridor direction, `● OPEN`, last updated timestamp.
3. **Live Condition Block:** Dominant current wait (`32px`) + breakdown by lane type (`Standard: 12 min`, `Ready Lane: 9 min`, `SENTRI: 4 min`).
4. **Lane Statuses:** Structured rows for each lane program with open/closed states.
5. **Operational Rules:** Definition-list layout for hours (24 hrs), vehicle types, and pedestrian access.
6. **Restrictions:** High-contrast notices (commercial restrictions, permit requirements).
7. **Contextual Map:** Port geography, approach vector, and `Open in Maps →` navigation link.
8. **Historical Pattern Chart:** `260–320px` uncompressed hourly trend graph.
9. **Data Provenance:** Official data sources and methodology notes.

---

# P03 — RECOMMENDATION

- **Archetype:** A02 — Recommendation
- **Route:** hero of P01 (`/`)
- **Primary User Question:** *"Which crossing should I use and why?"*

### Structural Sequence:
1. **Trip Context:** Origin · Destination · Travel program.
2. **Hero Decision:** Best crossing name (`SAN YSIDRO`), border wait (`15 min`), estimated total (`17 min`), `FASTEST OVERALL`.
3. **Evidence ("Why San Ysidro?"):**
   - `✓ Shortest border wait`
   - `✓ Fastest total journey`
   - `✓ All required lanes available`
4. **Alternative Crossings:** Competing options with explicit deltas (`Otay Mesa: 21 min (+6 min)`, `Tecate: 28 min (+14 min)`).
5. **Decision Map:** Visualizing the fork in the road (`You → San Ysidro vs Otay Mesa`).
6. **Primary Action ("START ROUTE"):** Full-width CTA launching external turn-by-turn navigation (Google Maps, Apple Maps, Waze).

---

# P04 — COMPARISON

- **Archetype:** A04 — Comparison
- **Route:** `/compare`
- **Primary User Question:** *"Which crossing is better?"*

### Structural Sequence:
1. **Header:** Back / Close (`×`), `Compare`, `Done`. **Bottom navigation hidden**.
2. **Crossings Selected:** Up to 3 crossings maximum.
3. **Mobile Stacking Grid:** Attribute-first stacking:
   - **Wait Time:** Crossing A (`15 min`) vs Crossing B (`21 min`) vs Crossing C (`28 min`).
   - **Total Time:** Crossing A (`17 min`) vs Crossing B (`27 min`) vs Crossing C (`42 min`).
   - **Status & Lanes:** Side-by-side operational status.
4. **Verdict / Winner Block:** Clear declaration of the optimal choice + `Start Route` action.

---

# P05 — FAVORITOS (PERSONAL MONITOR)

- **Archetype:** A05 — Personal Monitor
- **Route:** `/favorites`
- **Primary User Question:** *"How are my saved crossings doing?"*

### Structural Sequence:
1. **Header:** `Favoritos` + Direction switcher.
2. **My Crossings List:** Fast-scanning list of saved ports with live tabular wait times, status indicators, and change badges (`↑ +8 min`, `WAIT INCREASED`).
3. **Empty State:** Spacious guidance explaining how to save crossings + `[ FIND A CROSSING ]` button.

---

# P06 — ALERTAS (CHANGE FEED)

- **Archetype:** A06 — Change Feed
- **Route:** `/alerts`
- **Primary User Question:** *"What changed that requires my attention?"*

### Structural Sequence:
1. **Header:** `Alertas` with unread badge counter.
2. **Time-Grouped Change Feed:** Grouped into `Today`, `Yesterday`, `Earlier`.
3. **Structured Alert Item:**
   - Timestamp (`10:42 AM`)
   - Crossing name (`San Ysidro`)
   - State transition (`Wait increased 15 → 24 min` / `Ready Lane delayed`).
   - Operational severity without rainbow color clutter.

---

# P07–P09 — FOCUSED TASKS & UTILITY

### P07: Search (`/search`) — DEFERRED to v1.1
- Focused header (Close `×` + `Search crossings` input).
- Recent searches + live auto-complete filtered by port, city, or corridor.
- Bottom navigation suppressed.

### P08: Filters (`/filters`)
- Focused header (Close `×` + `Filters` + `Done`).
- Direction selection (`Mexico → US` / `US → Mexico`).
- Vehicle type selection (`Private`, `Commercial`, `Pedestrian`).
- Lane program filtering (`Standard`, `Ready Lane`, `SENTRI`).
- Bottom navigation suppressed.

### P09: Settings & Account (`/settings`)
- Subdued utility layout covering user profile, notification preferences, measurement units, default direction, and data provenance.

---

# GLOBAL PAGE RULES (HIG)

1. **Content Can Be Tall:** The page owns vertical scrolling; do not squeeze content to fit above the fold.
2. **One Dominant Question Per Page:** Every screen is dedicated to a distinct user question.
3. **One Dominant Answer Per Scroll Region:** Every scroll depth provides clear, focused answers.
4. **Comprehension Density Over Packing:** Generous whitespace, tabular figures, and clear grouping take precedence over raw compactness.
5. **Freshness Is Part of Data:** Every volatile metric must display its timestamp/freshness status.
6. **Maps Explain Decisions:** Maps only appear when geography adds evidence to the decision.
7. **Recommendations State Evidence:** Never declare a "best" option without displaying the concrete reasons why.
