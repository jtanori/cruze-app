# CRUZE — PAGE SPECIFICATIONS MATRIX
## Section 10: High-Density Specification Matrix Across P01 – P09
**Document ID:** `CRUZE-PLAN-04`  
**Status:** Approved Specification

---

# 01 — MASTER PAGE SPECIFICATION MATRIX

The following comprehensive matrix defines the operational contract for every page in the CRUZE application:

| Page ID & Route | Page Name | Archetype | Primary User Question | Dominant Metric / Visual Anchor | Primary User Action | Required Data Inputs | Key Sub-Components | Responsive Adaptation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P01**<br>`/crossings` | **Cruces (Feed)** | `A01`<br>Intelligence Feed | *"What is happening at the border right now?"* | Aggregate average wait (`48–56px`) + `● BORDER MOVING NORMALLY` | Tap crossing row or tap `[ FIND BEST CROSSING ]` | Corridor queue stats, crossing summaries, active notices, corridor direction | `<TopAppBar variant="root">`, `<PrimaryIntelligenceHero>`, `<CrossingRow>`, `<RecommendationCard>`, `<MapContext>` | Mobile: Single column, 20px padding.<br>Desktop: 1120px container with side-by-side feed and map context. |
| **P02**<br>`/crossings/:id` | **Crossing Detail** | `A03`<br>Crossing Detail | *"Tell me everything relevant about this specific crossing."* | Port current wait (`32px`) + multi-lane breakdown | Tap `[ START ROUTE ]` or toggle favorite (`☆`) | Complete `CrossingEntity` with lane breakdown, rules, history profile | `<TopAppBar variant="detail">`, `<LaneBreakdownGrid>`, `<OperatingRulesList>`, `<HistoricalTrendChart>`, `<StartRouteButton>` | Mobile: Natural vertical stack.<br>Desktop: 2-column layout (Live Queue + Rules on left, History + Map on right). |
| **P03**<br>hero of P01 (`/`) | **Recommendation** | `A02`<br>Recommendation | *"Which crossing should I use and why?"* | Best port name + total time estimate (`17 min`) + `FASTEST OVERALL` | Tap `[ START ROUTE ]` to launch navigation | `CrossingRecommendation` result with delta comparisons & route vectors | `<TopAppBar variant="context">`, `<RecommendationCard>`, `<ComparisonStack>`, `<MapContext>`, `<StartRouteButton>` | Mobile: Sequential decision flow.<br>Desktop: Side-by-side recommendation evidence and route comparison canvas. |
| **P04**<br>`/compare` | **Comparison** | `A04`<br>Comparison | *"Which of these crossings is better for my trip?"* | Delta time comparison + winner verdict block | Tap `[ START ROUTE ]` or toggle compared ports | 2 to 3 `CrossingEntity` instances with aligned metric values | `<TopAppBar variant="compare">`, `<ComparisonStack>`, `<MapContext>`, `<StartRouteButton>` | Mobile: Attribute-first vertical card stack.<br>Desktop: Multi-column tabular comparison matrix. |
| **P05**<br>`/favorites` | **Favoritos** | `A05`<br>Personal Monitor | *"How are my saved crossings doing right now?"* | High-contrast tabular wait times + change badges (`↑ +8 min`) | Tap saved crossing to inspect or tap `[ ADD FAVORITE ]` | User saved crossing IDs, live queue data, delta from 1h ago | `<TopAppBar variant="root">`, `<CrossingRow variant="monitored">`, `<DirectionSelector>`, `<EmptyState>` | Mobile: Fast-scanning compact list.<br>Desktop: Grid of monitored port cards with trend sparks. |
| **P06**<br>`/alerts` | **Alertas** | `A06`<br>Change Feed | *"What changed at the border that I need to know about?"* | Chronological time-grouped change badges (`15 → 24 min`) | Tap alert item to jump to affected crossing | List of `BorderAlertEvent` objects grouped into `Today` and `Yesterday` | `<TopAppBar variant="root">`, `<AlertItem>`, `<FreshnessTag>`, `<FilterPills>` | Mobile: Vertical timeline feed.<br>Desktop: Centered 760px timeline column with filter chips. |
| **P07**<br>`/search` (DEFERRED v1.1) | **Search** | `A07`<br>Focused Task | *"Where is the crossing I'm looking for?"* | Instant search input (`44px` height) with auto-complete | Select port from recent or filtered results | Full corridor crossing search index, recent search storage | `<TopAppBar variant="search">`, `<SearchInput>`, `<RecentSearchList>`, `<CrossingRow>` | Mobile: Full-screen overlay modal.<br>Desktop: 640px centered search dialog with keyboard shortcuts. |
| **P08**<br>`/filters` | **Filters** | `A07`<br>Focused Task | *"Filter crossings by my vehicle and pass credentials."* | Segmented filter controls for direction, vehicle, and passes | Tap `Done` to apply filter set to feed | Current active filter state (`direction`, `vehicleType`, `laneProgram`) | `<TopAppBar variant="filter">`, `<SegmentedControl>`, `<CheckboxList>`, `<Button variant="primary">` | Mobile: Full-screen modal sheet.<br>Desktop: Centered 560px modal dialog. |
| **P09**<br>`/settings` | **Settings** | `A07`<br>Focused Utility | *"Manage my notifications, units, and data sources."* | Grouped settings rows (Account, Alerts, Data Provenance) | Toggle notification settings or view CBP data sources | User profile settings, notification preferences, legal/source metadata | `<TopAppBar variant="focused">`, `<SettingsSection>`, `<ToggleSwitch>`, `<DataSourcesList>` | Mobile: Grouped list layout.<br>Desktop: 760px clean settings layout with section dividers. |

---

# 02 — SYSTEM STATES PER PAGE SPECIFICATION

Every page must systematically implement these standard state transitions:

```text
STATE TRANSITION CONTRACT
├── 1. LOADING: Structural skeleton preserving exact macro layout and line heights.
├── 2. LOADED (LIVE): Normal operational view with green active beacon (● LIVE · Updated 1 min ago).
├── 3. DELAYED / STALE: Subdued caution banner indicating feed latency (> 15 min).
├── 4. PARTIAL: Individual lane queue displays "— min (No data)" while port remains operational.
├── 5. OFFLINE: Sticky ConnectivityBanner displays cached state with timestamp.
├── 6. EMPTY: Explicit guidance copy with a direct action button (e.g., [ FIND A CROSSING ]).
└── 7. ERROR: Calm operational recovery block ([ Unable to refresh · Tap to retry ]).
```
