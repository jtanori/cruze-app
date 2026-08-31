# CRUZE — DETAILED PAGE SPECIFICATION OUTLINES
## Section 11: Comprehensive Block-by-Block Page Construction Blueprints
**Document ID:** `CRUZE-PLAN-05`  
**Status:** Approved Specification

---

# P01 — CRUCES (INTELLIGENCE FEED)
**Route:** `/crossings` · **Archetype:** `A01 — Intelligence Feed` · **Bottom Nav:** Active

### Block Construction Sequence:
1. **Header:** Root Header (`68px`), Left: `CRUZE` wordmark, Right: Account icon (`◉`). No back button.
2. **Top Context (Spacing: Header ↓ 28px):**
   - Direction row: `TIJUANA → SAN DIEGO` + Interactive direction toggle (`⇄`).
   - Timestamp row (↓ 6px): `Updated 1 min ago` (`12px / 500`).
3. **Primary Intelligence Hero (Spacing: Context ↓ 40px):**
   - Micro-label: `RIGHT NOW · 3 CROSSINGS OPEN`
   - Dominant Metric: `18` (`48–56px`, `font-bold`, tabular) + `min` (`24px`).
   - Supporting label: `Average border wait`.
   - Operational Status Badge: `● BORDER MOVING NORMALLY` (`improving-soft` fill).
4. **Crossing Section (Spacing: Hero ↓ 48–64px):**
   - Section Header: `CROSSINGS` (`12px`, uppercase, tracking-wider) + Right action `[ Compare ]`.
   - List Rows: Non-card editorial list separated by 1px `border-subtle` rules.
     - Row 1: `SAN YSIDRO` (`15 min`, `● Open`, `Ready Lane · SENTRI · Standard`, `→`).
     - Row 2: `OTAY MESA` (`21 min`, `● Open`, `Ready Lane · SENTRI · Standard`, `→`).
     - Row 3: `TECATE` (`28 min`, `● Open`, `Standard · Commercial`, `→`).
5. **Recommendation Callout (Spacing: List ↓ 48px):**
   - *If trip context known:* High-conviction `<RecommendationCard />` (`Best: San Ysidro · 15 min wait · Fastest overall`).
   - *If no destination:* Direct banner `[ FIND BEST CROSSING ]` with prompt to set destination.
6. **Contextual Map (Spacing: Reco ↓ 48px):**
   - Canvas height `220–280px` illustrating live port queue vectors.
   - Accompanying interpretation copy: *"San Ysidro is currently 12 minutes faster than Otay Mesa."*
7. **Operational Conditions (Spacing: Map ↓ 48px):**
   - Hours, lane availability, and active construction/traffic notices.
8. **Historical Context (Spacing: Conditions ↓ 48px):**
   - Hourly typical wait timeline clearly marked as `HISTORICAL CONTEXT`.
9. **Data Source & Page Footer (Spacing: Historical ↓ 48px, Pre-Nav Gap ↓ 80px):**
   - Data provenance tag: `Official CBP & community verified data · Updated 1 min ago · [ View Sources ]`.

---

# P02 — CROSSING DETAIL
**Route:** `/crossings/:id` · **Archetype:** `A03 — Crossing Detail` · **Bottom Nav:** Visible

### Block Construction Sequence:
1. **Header:** Detail Header (`68px`), Left: Back button (`←`), Center: Port Name (`San Ysidro`), Right: Favorite toggle (`☆`/`★`).
2. **Identity & Live Status:**
   - Port title (`SAN YSIDRO`), corridor direction (`Tijuana → San Diego`).
   - Live badge: `● OPEN · 24 Hours` + Temporal tag `Updated 1 min ago`.
3. **Live Conditions Hero:**
   - Primary port wait metric (`32px`, `font-bold`).
   - Multi-lane queue cards:
     - `Standard`: `12 min` (`● Open`)
     - `Ready Lane`: `9 min` (`● Open`)
     - `SENTRI`: `4 min` (`● Open`)
     - `Pedestrian`: `8 min` (`● Open`)
4. **Operating Rules & Access:**
   - Hours: `24 Hours daily`.
   - Vehicle eligibility: `Private passenger vehicles only` (Commercial diverted to Otay).
   - Pedestrian gates: `PedEast (24h) · PedWest (6:00 AM - 10:00 PM)`.
5. **Restrictions & Active Notices:**
   - High-contrast notices (e.g. Sentri renewal grace periods, oversized vehicle prohibitions).
6. **Contextual Location Map:**
   - Port geometry, approach vector roads, and full-width `[ Open in Google Maps / Apple Maps → ]` action.
7. **Wait Time History & Patterns:**
   - Uncompressed `260–320px` chart displaying today's live trend against historical hourly average.
8. **Data Provenance & Source:**
   - CBP Port ID, feed timestamp, and reporting accuracy notes.

---

# P03 — RECOMMENDATION
**Route:** hero of P01 (`/`) · **Archetype:** `A02 — Recommendation` · **Bottom Nav:** Visible

### Block Construction Sequence:
1. **Header:** Context Header (`68px`), Left: Back (`←`), Center: `Trip Recommendation`, Right: Share icon.
2. **Trip Context Bar:**
   - Origin (`Tijuana Centro`) → Destination (`San Diego Downtown`) · Mode: `Ready Lane`.
3. **Hero Decision Block:**
   - Label: `YOUR BEST CROSSING`
   - Dominant Recommendation: `SAN YSIDRO`
   - Metrics: `15 min border wait` · `17 min estimated total journey` · `FASTEST OVERALL`.
4. **Why San Ysidro? (Evidence Breakdown):**
   - `✓ Shortest border wait (6 min faster than Otay Mesa)`
   - `✓ Direct freeway access to I-5 North`
   - `✓ Ready Lane fully open and operating normally`
5. **Alternative Crossings Stack:**
   - `Otay Mesa`: `21 min wait · 27 min total (+6 min)`
   - `Tecate`: `28 min wait · 42 min total (+21 min)`
6. **Decision Map Canvas:**
   - Route comparison map visualizing both options from the user's current origin.
7. **Primary Action:**
   - Full-width CTA: `[ START ROUTE ]` (`brand: #148F79`, `44px` height).
   - Subtitle: `Launches turn-by-turn in Google Maps / Apple Maps / Waze`.

---

# P04 — COMPARISON
**Route:** `/compare` · **Archetype:** `A04 — Comparison` · **Bottom Nav:** Hidden

### Block Construction Sequence:
1. **Header:** Compare Header (`68px`), Left: Close (`×`), Center: `Compare Crossings (2 Selected)`, Right: `Done`.
2. **Port Selector Pills:**
   - Active chips: `[ San Ysidro ✕ ]` `[ Otay Mesa ✕ ]` `[ + Add Crossing ]`.
3. **Attribute Stacking Matrix:**
   - **Wait Time:**
     - San Ysidro: `15 min` (`Fastest`)
     - Otay Mesa: `21 min` (`+6 min`)
   - **Total Estimated Drive Time:**
     - San Ysidro: `17 min`
     - Otay Mesa: `27 min`
   - **Lane Availability:**
     - San Ysidro: `Standard · Ready · SENTRI · Ped`
     - Otay Mesa: `Standard · Ready · SENTRI · Commercial`
   - **Hours & Rules:**
     - San Ysidro: `24 Hours`
     - Otay Mesa: `24 Hours (Commercial closes 7PM)`
4. **Comparison Map Canvas:**
   - Side-by-side geographic overview of both ports.
5. **Winner Summary & Primary Action:**
   - `San Ysidro is the optimal choice for your trip.`
   - Full-width CTA: `[ START ROUTE TO SAN YSIDRO ]`.

---

# P05 — FAVORITOS (PERSONAL MONITOR)
**Route:** `/favorites` · **Archetype:** `A05 — Personal Monitor` · **Bottom Nav:** Active

### Block Construction Sequence:
1. **Header:** Root Header (`68px`), Left: `CRUZE`, Center: `Favoritos`, Right: `[ Edit ]`.
2. **Direction Filter Bar:**
   - `TIJUANA → SAN DIEGO ⇄`
3. **Saved Crossings List:**
   - High-density rows for user's pinned crossings.
   - Row: `SAN YSIDRO` (`15 min`, `● Open`, `↑ +8 min surge since 9:00 AM`, `→`).
   - Row: `OTAY MESA` (`21 min`, `● Open`, `↓ -4 min improving`, `→`).
4. **Recent Delta Summary:**
   - Quick callout: *"San Ysidro wait times increased 8 min over the last 30 minutes."*
5. **Empty State (If no favorites saved):**
   - Clean illustration + copy: *"Save crossings you frequently use for instant one-tap monitoring."*
   - Action: `[ BROWSE CROSSINGS ]`.

---

# P06 — ALERTAS (CHANGE FEED)
**Route:** `/alerts` · **Archetype:** `A06 — Change Feed` · **Bottom Nav:** Active (Unread Badge)

### Block Construction Sequence:
1. **Header:** Root Header (`68px`), Left: `CRUZE`, Center: `Alertas (2 New)`, Right: `[ Mark all read ]`.
2. **Filter Chips:**
   - `All Alerts` · `Wait Surges` · `Lane Changes` · `Port Closures`.
3. **Time-Grouped Alert Timeline:**
   - **Section: TODAY**
     - `10:42 AM · SAN YSIDRO`: `Wait increased 15 → 24 min (Significant surge)` (`caution-soft` fill).
     - `08:15 AM · OTAY MESA`: `Ready Lane experiencing partial delays` (`info-soft` fill).
   - **Section: YESTERDAY**
     - `06:30 PM · TECATE`: `Port closed for commercial traffic` (`critical-soft` fill).
4. **Data Sources & Alert Sensitivity Note:**
   - Explanation of automated queue change detection algorithms.

---

# P07–P09 — FOCUSED TASKS (SEARCH, FILTERS, SETTINGS)

### P07: Search (`/search`) — DEFERRED to v1.1 · Archetype `A07`)
- **Header:** Close (`×`), 44px Search input (`Search by port name, city, or highway...`).
- **Recent Searches:** List of recently viewed ports (`San Ysidro`, `Otay Mesa`).
- **Live Search Results:** Auto-complete matching port names, crossing types, and directions.
- **Bottom Navigation:** Suppressed.

### P08: Filters (`/filters` · Archetype `A07`)
- **Header:** Close (`×`), `Filters`, `Done` (Applies filters).
- **Direction:** `Mexico → US` vs `US → Mexico` (Segmented control).
- **Vehicle Class:** `Private Passenger`, `Commercial Cargo`, `Pedestrian`.
- **Pass Credentials:** `Standard Only`, `Ready Lane (RFID)`, `SENTRI / Global Entry`.
- **Bottom Navigation:** Suppressed.

### P09: Settings & Account (`/settings` · Archetype `A07`)
- **Header:** Close (`×`), `Settings & Account`.
- **Preferences:** Default direction, alert sensitivity threshold (e.g. notify on >10 min increase), measurement units (Minutes, Miles/KM).
- **Data & Provenance:** Official CBP data feed status, methodology disclosure, terms, privacy.
- **Account:** Saved preferences sync, sign-in/sign-out controls.
- **Bottom Navigation:** Suppressed.
