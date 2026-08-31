# CRUZE — COMPONENT & DATA ARCHITECTURE
## Section 07, 08, 09 & 13: Global Shell, Domain Components, Data Contracts & Dependency Map
**Document ID:** `CRUZE-PLAN-03`  
**Status:** Approved Specification

---

# 01 — GLOBAL SHELL COMPONENTS

Global shell components manage window framing, persistent navigation, and system-level chrome.

```text
GLOBAL SHELL ARCHITECTURE
├── <AppShell />
│   ├── <TopAppBar /> (Adaptive 68px/56px header with 9 state variants)
│   ├── <MainContentContainer /> (Centered, responsive width container with natural scroll)
│   ├── <BottomNavigation /> (Persistent 72px 3-destination tab bar with safe area)
│   ├── <ConnectivityBanner /> (Offline / Stale data warning indicator)
│   └── <ModalSheetContainer /> (Full-screen overlay for Search, Filters, Settings)
```

### Component Catalog: Global Shell

| Component | Props Contract | Responsibility & Behavior |
| :--- | :--- | :--- |
| `<TopAppBar />` | `variant: HeaderVariant`<br>`title?: string`<br>`subtitle?: string`<br>`direction?: CorridorDirection`<br>`onBack?: () => void`<br>`onAction?: () => void` | Renders the adaptive top bar. Supports 9 states: `root`, `context`, `detail`, `search`, `filter`, `selection`, `compare`, `focused`, `collapsed`. Smoothly compacts from 68px to 56px on scroll. |
| `<BottomNavigation />` | `active: 'crossings' \| 'favorites' \| 'alerts'`<br>`unreadAlerts?: number`<br>`onSelect: (dest) => void` | Persistent bottom bar rendering 3 equal tabs (`33.33%` width each) with active teal indicator bar and unread alert badge. Hides during modal flows. |
| `<ConnectivityBanner />` | `isOnline: boolean`<br>`lastSync: Date`<br>`onRetry: () => void` | Sticky warning bar appearing under the header when live data feed is stale (>15 min) or network is offline. |
| `<DirectionSelector />` | `direction: CorridorDirection`<br>`onToggle: () => void` | Interactive contextual toggle (`TIJUANA → SAN DIEGO ⇄`) rendered directly into top page context. |

---

# 02 — DOMAIN-SPECIFIC BORDER COMPONENTS

Domain components encapsulate cross-border operational logic and data presentation.

### Component Catalog: Domain Intelligence

| Component | Role & Anatomy | Used In |
| :--- | :--- | :--- |
| `<CrossingRow />` | Non-card editorial row displaying port name, corridor direction, dominant wait time (`28–32px`), status pill (`● Open`), lane tags (`Ready · SENTRI`), freshness tag, and navigation arrow (`→`). | P01, P05, P07 |
| `<PrimaryIntelligenceHero />` | Editorial summary block featuring the dominant aggregate metric (`48–56px`), label (`Average border wait`), and operational status indicator (`● BORDER MOVING NORMALLY`). | P01 |
| `<RecommendationCard />` | High-conviction card displaying best crossing name, border wait, approach transit, estimated total journey, bulleted evidence points, and `Why this is best →` expander. | P01, P03 |
| `<LaneBreakdownGrid />` | Detailed structured rows for `Standard`, `Ready Lane`, `SENTRI`, and `Pedestrian` queues with lane capacity, open status, and wait times. | P02 |
| `<OperatingRulesList />` | Definition list format detailing 24h hours, vehicle eligibility, pedestrian walkway access, and commercial cargo restrictions. | P02 |
| `<HistoricalTrendChart />` | Uncompressed `260–320px` hourly queue chart comparing today's live trend against typical historical averages. | P02 |
| `<ComparisonStack />` | Attribute-stacked comparative grid (Wait Times → Total Drive Times → Lane Availability) across up to 3 selected ports. | P04 |
| `<AlertItem />` | Structured anomaly log item displaying timestamp (`10:42 AM`), port name, change delta (`15 → 24 min`), and severity indicator. | P06 |
| `<MapContext />` | Reusable geographic canvas (`220–280px` mobile, `280–360px` desktop) illustrating spatial approach routes and border fork vectors. | P01, P02, P03, P04 |
| `<StartRouteButton />` | Full-width action button (`44px` height, `brand: #148F79`) launching external turn-by-turn navigation (Google Maps, Apple Maps, Waze). | P02, P03, P04 |

---

# 03 — DATA MODEL REQUIREMENTS

The application state is driven by a normalized, strongly typed TypeScript domain schema:

```ts
// Directionality
type CorridorDirection = 'MX_TO_US' | 'US_TO_MX';

// Lane Programs
type LaneProgram = 'STANDARD' | 'READY_LANE' | 'SENTRI' | 'PEDESTRIAN' | 'COMMERCIAL';

// Operational Port Status
type PortOperatingStatus = 'OPEN' | 'LIMITED' | 'CONGESTED' | 'DELAYED' | 'CLOSED' | 'UNKNOWN';

// Individual Lane Queue
interface LaneQueueData {
  program: LaneProgram;
  isOpen: boolean;
  lanesOpenCount?: number;
  totalLanesCount?: number;
  currentWaitMinutes: number;
  trend: 'IMPROVING' | 'STABLE' | 'WORSENING';
  operationalNote?: string;
}

// Complete Crossing Entity
interface CrossingEntity {
  id: string; // e.g., 'san-ysidro', 'otay-mesa', 'tecate'
  name: string; // 'San Ysidro'
  cityOrigin: string; // 'Tijuana'
  cityDestination: string; // 'San Diego'
  direction: CorridorDirection;
  status: PortOperatingStatus;
  statusMessage?: string;
  is24Hours: boolean;
  operatingHoursText: string;
  lanes: Record<LaneProgram, LaneQueueData>;
  dominantWaitMinutes: number; // Primary scan metric (usually standard or active lane filter)
  typicalWaitMinutes: number;
  lastUpdated: string; // ISO 8601 string
  coordinates: { lat: number; lng: number };
  restrictions: {
    commercialAllowed: boolean;
    pedestrianAllowed: boolean;
    specialNotices?: string[];
  };
  historicalHourlyProfile: Array<{
    hour: number; // 0 - 23
    typicalWait: number;
    todayActualWait?: number;
  }>;
}

// Recommendation Result Entity
interface CrossingRecommendation {
  tripId: string;
  originName: string;
  destinationName: string;
  direction: CorridorDirection;
  selectedCrossingId: string;
  fastestCrossingName: string;
  borderWaitMinutes: number;
  approachTransitMinutes: number;
  totalEstimatedMinutes: number;
  evidence: string[]; // e.g. ["Shortest border wait", "Fastest total journey", "All required lanes available"]
  alternatives: Array<{
    crossingId: string;
    crossingName: string;
    totalEstimatedMinutes: number;
    deltaMinutes: number; // e.g. +6
  }>;
  generatedAt: string;
}

// Chronological Alert Log Entity
interface BorderAlertEvent {
  id: string;
  crossingId: string;
  crossingName: string;
  direction: CorridorDirection;
  timestamp: string;
  type: 'QUEUE_SURGE' | 'LANE_STATUS_CHANGE' | 'PORT_CLOSURE' | 'WEATHER_INCIDENT';
  severity: 'NORMAL' | 'NOTABLE' | 'IMPORTANT' | 'CRITICAL';
  headline: string;
  description: string;
  previousValue?: string;
  currentValue?: string;
}
```

---

# 04 — COMPONENT DEPENDENCY GRAPH

```text
LAYER 0: DESIGN TOKENS (CSS Variables & Tailwind @theme)
    │
    ▼
LAYER 1: PRIMITIVES
    ├── <Button /> (Primary, Secondary, Ghost, Icon)
    ├── <Badge /> / <StatusPill /> (Soft-translucent fills)
    ├── <Typography /> (Data tabular numerals, editorial headings)
    ├── <Divider /> (1px subtle rule)
    └── <Icon /> (Lucide Icons with consistent 20px/22px sizing)
    │
    ▼
LAYER 2: REUSABLE DATA MODULES
    ├── <MetricValue /> (Tabular numerical display)
    ├── <FreshnessTag /> (Temporal context label)
    ├── <LaneBadge /> (Program chip)
    ├── <MapContext /> (Canvas vector map)
    └── <TrendIndicator /> (Up/Down/Stable chevron)
    │
    ▼
LAYER 3: DOMAIN COMPOSITIONS
    ├── <CrossingRow />
    ├── <PrimaryIntelligenceHero />
    ├── <RecommendationCard />
    ├── <LaneBreakdownGrid />
    ├── <OperatingRulesList />
    ├── <HistoricalTrendChart />
    ├── <ComparisonStack />
    └── <AlertItem />
    │
    ▼
LAYER 4: PAGE ARCHETYPES
    ├── A01: Intelligence Feed
    ├── A02: Recommendation
    ├── A03: Crossing Detail
    ├── A04: Comparison
    ├── A05: Personal Monitor
    ├── A06: Change Feed
    └── A07: Focused Task / Utility
    │
    ▼
LAYER 5: CONCRETE APPLICATION PAGES (P01 – P09)
```
