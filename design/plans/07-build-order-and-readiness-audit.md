# CRUZE — BUILD ORDER & READINESS AUDIT
## Section 14, 15 & 16: Phased Construction Sequence, Completeness Audit & Open Decisions
**Document ID:** `CRUZE-PLAN-07`  
**Status:** Approved Specification

---

# 01 — RECOMMENDED BUILD ORDER (10 PHASES)

Construction must follow strict dependency logic, ensuring foundation tokens and global shell elements precede concrete page assembly:

```text
PHASED CONSTRUCTION ROADMAP
│
├── PHASE 1: TOKEN & FOUNDATION ENFORCEMENT
│   └── Validate Tailwind theme tokens, typography (tabular-nums), deep navy surfaces, and status colors.
│
├── PHASE 2: GLOBAL SHELL & NAVIGATION INFRASTRUCTURE
│   └── Implement <AppShell />, <TopAppBar /> (9 state variants), <BottomNavigation /> (3 tabs), and <ConnectivityBanner />.
│
├── PHASE 3: PRIMITIVES & REUSABLE DATA MODULES
│   └── Build <Button />, <Badge />, <StatusPill />, <MetricValue />, <FreshnessTag />, and <TrendIndicator />.
│
├── PHASE 4: CORE CROSSING & MAP DOMAIN COMPONENTS
│   └── Implement <CrossingRow />, <PrimaryIntelligenceHero />, <RecommendationCard />, and <MapContext />.
│
├── PHASE 5: P01 CRUCES (PRIMARY INTELLIGENCE FEED)
│   └── Assemble P01 Feed: direction toggle, aggregate metric, editorial list, contextual reco banner, and long-scroll breathing.
│
├── PHASE 6: P02 CROSSING DETAIL (OPERATIONAL DOSSIER)
│   └── Build P02: multi-lane queue breakdown (<LaneBreakdownGrid />), rules, notices, historical charts, and external map handoff.
│
├── PHASE 7: P03 & P04 DECISION ENGINES (RECOMMENDATION & COMPARISON)
│   └── Build P03 Recommendation with evidence breakdown and P04 Comparison with attribute-first mobile stacking.
│
├── PHASE 8: P05 & P06 MONITORING SUITE (FAVORITOS & ALERTAS)
│   └── Implement P05 Personal Monitor with wait deltas and P06 Alertas with chronological time-grouped anomaly logging.
│
├── PHASE 9: P07, P08 & P09 FOCUSED TASK OVERLAYS
│   └── Implement P07 Instant Search, P08 Modal Filters, and P09 Settings/Data Provenance sheets.
│
└── PHASE 10: RESPONSIVE HARDENING & INTEGRATION AUDIT
    └── Execute desktop/tablet max-width checks, touch targets (≥44px), network error boundaries, and browser QA smoke tests.
```

---

# 02 — SPECIFICATION COMPLETENESS AUDIT

| Audit Dimension | Verification Standard | Status | Audit Findings & Resolution |
| :--- | :--- | :--- | :--- |
| **Coverage** | Does every product capability have an explicit UI home? | **PASS** | Live queues (P01), deep dossiers (P02), route decisions (P03), multi-port evaluation (P04), personal monitoring (P05), anomaly alerts (P06), filtering (P08) covered; Search (P07) deferred to v1.1. |
| **Duplication** | Are multiple pages solving the same problem? | **PASS** | Redundant map tab eliminated (embedded as contextual evidence); activity feed streamlined into actionable alerts; settings moved to header utility. |
| **Orphan Pages** | Does any page exist without a meaningful entry point? | **PASS** | Every page is reachable via Bottom Nav, in-card actions, search, or contextual header controls. |
| **Missing States** | Does every page define loading, live, delayed, empty, and error behavior? | **PASS** | The 7 global system states are systematically mapped across all archetypes. |
| **Data Gaps** | Does every information block have a defined data source? | **PASS** | The normalized `CrossingEntity`, `CrossingRecommendation`, and `BorderAlertEvent` data schemas satisfy all rendering needs. |
| **Component Gaps** | Does every recurring visual pattern have a reusable component? | **PASS** | All rows, badges, charts, and header states are codified in the component catalog. |
| **Navigation Gaps** | Can the user navigate seamlessly between discovery, decision, and action? | **PASS** | Navigation flows naturally from high-level corridor overview to route execution in under 3 taps. |
| **Scope Discipline** | Are there unsolicited features or speculative screens? | **PASS** | No social feeds, no arbitrary gamification, no ads, and no unrequested backend clutter. |

---

# 03 — OPEN ARCHITECTURAL DECISIONS (RESOLVED)

1. **Map Tab vs Contextual Component:** **RESOLVED.** Map is strictly an embedded evidence component (`<MapContext />`) inside P01, P02, P03, and P04. No standalone map tab.
2. **Bottom Navigation Tab Count:** **RESOLVED.** Exactly 3 destinations: `Cruces` (`/crossings`), `Favoritos` (`/favorites`), `Alertas` (`/alerts`).
3. **Multi-Port Comparison Layout on Mobile:** **RESOLVED.** Squeezing 3 cards into horizontal columns is forbidden. Mobile comparison uses attribute-first vertical stacking (`Wait Times → Drive Times → Lane Availability`).
4. **Historical Chart Dimensions:** **RESOLVED.** Charts are uncompressed (`260–320px` height) to preserve legibility and temporal context.
5. **Turn-by-Turn Navigation:** **RESOLVED.** External handoff to Google Maps / Apple Maps / Waze with pre-configured port approach coordinates.

---

# 04 — CONCLUSION & READINESS STATEMENT

The CRUZE Product UI Building Plan is **complete, rigorous, and locked**. 

Product designers and frontend engineers can now directly execute the pixel-level specification and component build phases without ambiguity regarding information architecture, page scope, or component boundaries.
