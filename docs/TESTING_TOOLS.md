1. **A lightweight testing architecture** — primitives → components → compositions → navigation/workflows → types.
2. **An evidence/audit layer** — a bounded mechanism that turns selected test executions into reproducible, browser-verifiable evidence and feeds a unified HTML Testing Report.

The important distinction is that **evidence gathering is not the test itself**. A test can pass without producing evidence. Evidence gathering is an opt-in post-test operation that makes selected results auditable.

Below is the supporting document.

# CRUZE — Primitives & Data Testing Suite

## Testing Architecture, Evidence Gathering & Testing Report Specification

**Document Type:** Supporting Engineering Specification
**Scope:** UI Primitives, Domain Components, Compositions, Navigation, Workflows, Types, Evidence Gathering
**Status:** Proposed
**Testing Philosophy:** Low-level deterministic tests + high-level rendering + selective browser verification
**Primary Browser Tool:** Playwright
**Component Verification:** Storybook
**Reporting:** Static/served HTML Testing Report

---

# 1. Testing Philosophy

Cruze should not adopt a test architecture optimized around maximum test count.

The objective is **confidence per test**.

The testing system should prioritize:

1. deterministic unit tests for pure logic;
2. lightweight primitive tests;
3. component rendering tests covering meaningful variations;
4. composition rendering tests covering real UI relationships;
5. high-value navigation tests;
6. end-to-end workflow tests for critical product journeys;
7. optional browser evidence gathering;
8. a unified testing report that exposes coverage, results, missing tests, and evidence.

The system should deliberately avoid:

* excessive mocking;
* testing implementation details;
* reproducing component internals in tests;
* large numbers of nearly identical snapshots;
* mocking the entire application to make workflows pass;
* treating Storybook screenshots as a replacement for behavioral testing;
* treating Playwright screenshots as a replacement for assertions;
* creating a separate test for every CSS property;
* requiring browser execution for every unit test.

The intended testing pyramid is:

```text
                         ┌─────────────────────────┐
                         │   Evidence / Browser    │
                         │ Playwright + Storybook  │
                         └────────────┬────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │ Critical Workflows      │
                         │ Navigation + E2E        │
                         └────────────┬────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │ Compositions            │
                         │ High-level rendering    │
                         └────────────┬────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │ Domain Components       │
                         │ Render + interaction    │
                         └────────────┬────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │ UI Primitives           │
                         │ Lightweight rendering   │
                         └────────────┬────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │ Pure Types / Logic      │
                         │ Deterministic unit tests│
                         └─────────────────────────┘
```

The majority of tests should live near the bottom of this pyramid.

---

# 2. Testing Architecture

The testing system is divided into six operational layers.

| Layer | Primary Target      | Test Type            | Browser    | Evidence                        |
| ----- | ------------------- | -------------------- | ---------- | ------------------------------- |
| P0    | Types / pure logic  | Unit                 | No         | Optional                        |
| P1    | UI primitives       | Render / interaction | Usually no | Optional Storybook              |
| P2    | Domain components   | Render / interaction | No         | Storybook + Playwright optional |
| P3    | Screen compositions | Render / integration | Optional   | Playwright recommended          |
| P4    | Navigation          | Browser behavior     | Yes        | Playwright recommended          |
| P5    | Workflows           | Browser E2E          | Yes        | Playwright strongly recommended |

Evidence gathering sits **outside these layers**.

```text
TEST EXECUTION
      │
      ├── P0 Types
      ├── P1 Primitives
      ├── P2 Components
      ├── P3 Compositions
      ├── P4 Navigation
      └── P5 Workflows
              │
              ▼
      OPTIONAL EVIDENCE TASK
              │
       ┌──────┼─────────┐
       ▼      ▼         ▼
   Storybook Browser   Logs
   validation Playwright
       │      │         │
       └──────┼─────────┘
              ▼
       Evidence Matrix
              │
              ▼
       Testing Report
```

---

# 3. Test Taxonomy

Every test should have a stable identifier.

Recommended structure:

```text
TEST-[LAYER]-[DOMAIN]-[NNN]
```

Examples:

```text
TEST-P0-TYPE-001
TEST-P1-PRIM-001
TEST-P2-CROSSING-001
TEST-P3-TRIP-001
TEST-P4-NAV-001
TEST-P5-WORKFLOW-001
```

Tests should also declare their subject.

```text
subject_type:
  primitive
  component
  composition
  navigation
  workflow
  type
```

And optionally their execution class:

```text
execution:
  unit
  render
  integration
  browser
  evidence
```

---

# 4. UI Primitives Testing Suite

## 4.1 Objective

Verify that foundational UI primitives:

* render correctly;
* accept their documented API;
* expose their supported states;
* preserve accessibility;
* behave correctly under basic interaction;
* compose without unexpected behavior.

Primitive tests should remain intentionally small.

A primitive should not receive a large test suite simply because it is visually important.

---

## 4.2 Primitive Test Matrix

| Primitive Category | Primary Tests                    | Secondary Tests     | Browser  |
| ------------------ | -------------------------------- | ------------------- | -------- |
| Button             | render, disabled, loading, click | keyboard            | Optional |
| IconButton         | render, label, disabled          | keyboard            | Optional |
| Input              | value, placeholder, error        | focus, keyboard     | Optional |
| SearchInput        | value, clear, submit             | keyboard            | Optional |
| SegmentedControl   | selected state, selection        | keyboard            | Optional |
| RadioGroup         | selection, disabled              | keyboard            | Optional |
| Checkbox           | checked/unchecked                | keyboard            | Optional |
| Toggle             | on/off                           | keyboard            | Optional |
| Select             | selected value                   | keyboard            | Optional |
| Badge              | variants                         | content             | No       |
| StatusBadge        | semantic states                  | accessibility       | No       |
| Banner             | variants                         | dismissible         | Optional |
| Toast              | render, dismissal                | timeout             | Optional |
| EmptyState         | render                           | CTA interaction     | No       |
| ErrorState         | render                           | retry action        | Optional |
| Skeleton           | render                           | dimensions          | No       |
| Spinner            | render                           | accessibility       | No       |
| Stack              | layout composition               | responsive behavior | No       |
| Inline             | layout composition               | wrapping            | No       |
| Divider            | orientation                      | semantic behavior   | No       |
| Section            | title/content                    | composition         | No       |
| BottomSheet        | open/close                       | keyboard/escape     | Optional |
| Modal              | open/close                       | focus behavior      | Optional |
| Drawer             | open/close                       | keyboard            | Optional |
| DataMetric         | value/state                      | semantic formatting | No       |
| DataMetricPair     | primary/secondary                | missing data        | No       |
| DataDelta          | increase/decrease                | neutral             | No       |
| DataTimestamp      | freshness formatting             | unavailable         | No       |
| DataStatus         | state rendering                  | unknown state       | No       |

---

## 4.3 Primitive Testing Rules

Every primitive should answer:

```text
Does it render?
Does its primary API work?
Does every semantic variant render?
Does disabled/loading state behave correctly?
Does it expose accessible naming where required?
Does keyboard interaction work where applicable?
Does it fail safely with missing/empty data?
```

Do not test:

```text
"margin-left is 8px"
"this div has class X"
"Tailwind generated class Y"
"component contains exactly N child divs"
```

Those are implementation details.

---

# 5. Primitive Variations Matrix

Each primitive should expose a declared variation inventory.

Example:

### Button

```text
Button
├── variant
│   ├── primary
│   ├── secondary
│   ├── ghost
│   └── destructive
├── size
│   ├── sm
│   ├── md
│   └── lg
├── state
│   ├── default
│   ├── hover
│   ├── disabled
│   └── loading
└── icon
    ├── none
    ├── leading
    └── trailing
```

The test suite does not necessarily need one test per Cartesian combination.

Instead, test representative combinations:

```text
primary/default
primary/disabled
secondary/default
ghost/default
destructive/default
primary/loading
icon/leading
icon/trailing
```

The evidence system may later capture every declared Storybook variation.

This distinction is important:

> **Testing coverage and visual evidence coverage are not necessarily identical.**

---

# 6. Per Component Testing Suite

## 6.1 Objective

Domain components are where Cruze's design system becomes product behavior.

Examples:

```text
CrossingStatusBadge
CrossingWaitTime
CrossingDirectionTimes
CrossingDetailHero
CrossingDetailLaneSection
TripRecommendationPrimaryCard
TripAlternativeListRow
TripChecklistSection
AgentCrossingResult
AvisoRow
FavoriteCrossingsList
```

Each component should have a test contract.

---

## 6.2 Component Test Contract

Every domain component should define:

```text
1. Rendering contract
2. Data contract
3. State contract
4. Interaction contract
5. Accessibility contract
6. Composition contract
7. Storybook coverage
```

---

## 6.3 Component Test Matrix

| Test Area                |                           Required |
| ------------------------ | ---------------------------------: |
| Default rendering        |                                Yes |
| Primary data state       |                                Yes |
| Empty/missing data       |                      If applicable |
| Loading state            |                      If applicable |
| Error state              |                      If applicable |
| Semantic state variants  |                                Yes |
| Interaction              |                     If interactive |
| Accessibility            |                                Yes |
| Navigation callback      |                      If applicable |
| Boundary data            |                        Recommended |
| Storybook story          | Yes for reusable visual components |
| Browser evidence         |                           Optional |
| Screenshot per variation |                 Evidence mode only |

---

# 7. Domain-Specific Component Testing

## 7.1 Crossing Components

Crossing components require particular attention because they combine operational state and data freshness.

Example:

```text
CrossingStatusBadge
├── OPEN
├── LIMITED
├── CLOSED
└── UNKNOWN
```

Separately:

```text
CrossingFreshness
├── LIVE
├── RECENT
├── STALE
└── UNAVAILABLE
```

Tests must explicitly verify that these dimensions cannot accidentally collapse into one.

Example invalid rendering:

```text
status = OPEN
freshness = STALE

→ "EN VIVO"
```

Expected:

```text
ABIERTO
Datos desactualizados · actualizado hace 147 min
```

The exact wording is governed by the product content system, but the semantic distinction must remain.

---

## 7.2 Trip Components

Trip components should test:

```text
empty
planning
ready
active
at-border
completed
```

For recommendation components:

```text
recommended
fastest
best-overall
alternative
no-compatible-crossing
stale-data
```

---

## 7.3 Agent Components

Agent components should test contextual result types:

```text
crossing result
recommendation result
trip action
checklist result
informational response
warning
stale-data warning
```

The agent should not be tested as an isolated chatbot only.

Its results must remain compatible with the same domain components used elsewhere in Cruze.

---

# 8. High-Level Composition Testing

A composition is a screen-level or section-level arrangement of components.

Examples:

```text
Trip Empty
Trip Recommendation
Active Trip
Crossings Directory
Crossing Detail
Agent Conversation
Settings
```

Composition tests should answer:

```text
Do the correct components appear?
Do they receive coherent data?
Does hierarchy remain correct?
Do primary actions work?
Does the composition behave correctly in important states?
```

They should not duplicate every component's internal tests.

---

# 9. Composition Test Strategy

A composition should generally have:

```text
1. Default state
2. Most important alternate state
3. Critical edge state
4. Interaction path
```

Example:

### Trip Recommendation

```text
TEST-P3-TRIP-001
Default recommendation

TEST-P3-TRIP-002
No compatible crossing

TEST-P3-TRIP-003
Stale crossing data

TEST-P3-TRIP-004
Select alternative crossing
```

This is preferable to creating dozens of nearly identical tests.

---

# 10. Global Navigation Testing

Navigation is a first-class product system.

The reduced primary navigation is:

```text
Trip
Crossings
Agent
```

Global utilities:

```text
Avisos
Settings
```

Contextual surfaces:

```text
Map
Compare
Crossing Detail
Trip Setup
```

---

## 10.1 Navigation Test Matrix

| Test                             | Expected                                         |
| -------------------------------- | ------------------------------------------------ |
| App → Trip                       | Trip is default landing surface                  |
| Trip → Crossings                 | Crossings opens correctly                        |
| Crossings → Trip                 | Trip opens correctly                             |
| Trip → Agent                     | Agent opens correctly                            |
| Agent → Trip                     | Trip opens correctly                             |
| Agent → Crossings                | Crossings opens correctly                        |
| Header → Avisos                  | Avisos opens without becoming primary navigation |
| Header → Settings                | Settings opens                                   |
| Settings → Favorites             | Favorites opens                                  |
| Settings → My Trips              | Saved trips opens                                |
| Crossing → Detail                | Canonical crossing detail opens                  |
| Trip → Recommendation → Detail   | Same crossing detail surface                     |
| Crossings → Detail               | Same canonical detail                            |
| Agent → Crossing Result → Detail | Same canonical detail                            |
| Detail → Back                    | Correct previous context                         |
| Deep link → Detail               | Valid standalone detail                          |
| Browser refresh                  | State remains coherent                           |
| Unknown route                    | Safe recovery                                    |

---

# 11. Navigation Invariants

Navigation tests should verify product invariants, not merely URLs.

### Invariant 1 — Trip is the default intelligence surface

```text
App launch
   ↓
Location gate
   ↓
Trip
```

### Invariant 2 — Crossings is independent of trip planning

```text
Crossings
   ↓
Explore border conditions
```

It should not require an active trip.

### Invariant 3 — Crossing Detail is canonical

The same crossing should resolve to the same detail model regardless of entry point.

```text
Trip
   ├──→ Detail
Crossings
   ├──→ Detail
Agent
   ├──→ Detail
Avisos
   ├──→ Detail
Favorites
   └──→ Detail
```

### Invariant 4 — Map is contextual

Map should not become a competing primary destination.

### Invariant 5 — Settings and Avisos are global utilities

They should remain reachable without consuming primary navigation slots.

---

# 12. Location Gate Testing

Location is a system prerequisite for personalized and live intelligence.

The location state machine should be tested independently.

```text
REQUESTING
    ↓
ACQUIRING
    ↓
VALIDATING
    ├──→ SUCCESS
    ├──→ LOW_ACCURACY
    ├──→ TIMEOUT
    ├──→ DENIED
    ├──→ RESTRICTED
    └──→ SERVICES_DISABLED
```

Tests should verify:

```text
Success
Denied
Timeout
Low accuracy
Permission recovery
Location services disabled
Retry
Previously granted permission
Previously denied permission
```

The application must never fabricate personalized nearby intelligence when the location state is unknown.

---

# 13. Workflow Testing

Workflow tests represent real user goals.

They should be few, deliberate, and high-value.

The question is:

> "What must work for Cruze to actually be useful?"

Not:

> "How many screens can we traverse?"

---

# 14. Critical Cruze Workflows

## WF-01 — First Launch

```text
Launch
 ↓
Location gate
 ↓
Location acquired
 ↓
Trip empty state
 ↓
Nearby crossing preview
```

Verify:

* location requested;
* successful acquisition;
* correct transition;
* nearby crossings rendered;
* stale data is not represented as live;
* user can enter Trip Setup;
* user can enter Crossings.

---

# 15. WF-02 — Start Private Northbound Trip

```text
Trip
 ↓
Comenzar un viaje
 ↓
Destination
 ↓
Origin
 ↓
Private vehicle
 ↓
Access type
 ↓
Document profile
 ↓
Recommendation
 ↓
Compare alternatives
 ↓
Crossing detail
```

Verify:

* direction derived correctly;
* northbound questionnaire appears;
* access compatibility affects recommendations;
* recommendation is explainable;
* alternatives remain compatible;
* detail is canonical.

---

# 16. WF-03 — Walking Trip

```text
Trip
 ↓
Destination
 ↓
Origin
 ↓
Walking
 ↓
Recommendation
```

No unnecessary questionnaire should appear.

This workflow explicitly verifies adaptive setup.

---

# 17. WF-04 — Commercial Trip

```text
Trip
 ↓
Destination
 ↓
Origin
 ↓
Commercial
 ↓
Compatible crossing recommendations
```

Verify that incompatible crossings never appear as normal recommendations.

---

# 18. WF-05 — Browse Border Without Trip

```text
Trip
 ↓
Ver todos los cruces
 ↓
Crossings
 ↓
Search
 ↓
Filter
 ↓
Expand crossing
 ↓
Detail
```

This verifies the independent Crossings mental model.

---

# 19. WF-06 — Active Trip

```text
Recommendation
 ↓
Start trip
 ↓
Active Trip
 ↓
Before Crossing
 ↓
Crossing Detail
 ↓
Navigate
 ↓
At Border
 ↓
Complete
```

Verify lifecycle:

```text
DRAFT
  ↓
PLANNING
  ↓
READY
  ↓
ACTIVE
  ↓
AT_BORDER
  ↓
COMPLETED
```

Only completed trips become eligible for My Trips.

---

# 20. WF-07 — Agent Contextual Workflow

```text
Agent
 ↓
"¿Qué cruce me conviene?"
 ↓
Recommendation result
 ↓
Crossing detail
 ↓
Trip action
```

The agent must use the same domain truth as Trip and Crossings.

---

# 21. WF-08 — Aviso → Action

Example:

```text
Aviso
 ↓
"El tiempo de espera aumentó"
 ↓
Affected crossing
 ↓
Crossing detail
 ↓
Compare alternatives
 ↓
Trip recommendation
```

This validates the relationship between:

```text
Data
→ Aviso
→ Crossing
→ Recommendation
→ Trip
```

---

# 22. Workflow Testing Rules

Every workflow should define:

```text
Workflow ID
Business intent
Preconditions
Starting surface
Actions
Expected state transitions
Expected final state
Critical assertions
Failure conditions
Optional evidence profile
```

Example:

```text
WF-02

Intent:
Plan a private northbound trip.

Preconditions:
Location available.

Start:
Trip.

Critical assertions:
- Direction = northbound.
- Vehicle mode = private.
- Access step appears.
- Recommendation respects access.
- Crossing detail opens.
- No stale data is represented as live.

Final:
Recommendation selected.
```

---

# 23. Types Unit Testing Suite

Types are not merely TypeScript compilation concerns.

Cruze contains domain state that should be deterministic and independently testable.

The type layer should therefore include pure functions and validators wherever possible.

---

# 24. Type Test Categories

## Operational State

```text
OPEN
LIMITED
CLOSED
UNKNOWN
```

Test:

```text
valid states
invalid states
serialization
deserialization
state mapping
```

---

## Data Freshness

```text
LIVE
RECENT
STALE
UNAVAILABLE
```

Test:

```text
fresh timestamp
recent timestamp
stale timestamp
missing timestamp
future timestamp
invalid timestamp
boundary values
```

---

## Recommendation

```text
RECOMMENDED
FASTEST
BEST_OVERALL
ALTERNATIVE
```

Test:

```text
classification
priority
display mapping
fallback behavior
```

---

## Travel Mode

```text
WALKING
PRIVATE
COMMERCIAL
```

---

## Direction

```text
NORTHBOUND
SOUTHBOUND
UNKNOWN
```

---

## Trip Lifecycle

```text
DRAFT
PLANNING
READY
ACTIVE
AT_BORDER
COMPLETED
```

Test legal transitions.

Example:

```text
DRAFT → PLANNING        valid
PLANNING → READY       valid
READY → ACTIVE         valid
ACTIVE → AT_BORDER     valid
AT_BORDER → COMPLETED  valid
DRAFT → COMPLETED      invalid
COMPLETED → ACTIVE     invalid
```

---

# 25. Type Boundary Testing

Every important domain parser or mapper should test:

```text
valid input
missing input
null input
empty input
unexpected value
boundary value
legacy value
unknown value
```

Example:

```text
parseWaitTime()
formatFreshness()
deriveDirection()
classifyFreshness()
canUseCrossing()
canTransitionTrip()
resolveRecommendation()
```

Pure logic should be tested without React, Playwright, Storybook, network requests, or browser APIs.

---

# 26. Testing Data Strategy

Avoid building a giant mock-data universe.

Instead create small canonical fixtures.

```text
fixtures/
├── crossing/
│   ├── open-live
│   ├── open-stale
│   ├── limited
│   ├── closed
│   └── unknown
│
├── trip/
│   ├── empty
│   ├── planning
│   ├── recommendation
│   ├── active
│   └── completed
│
├── traveler/
│   ├── walking
│   ├── private-northbound
│   ├── private-southbound
│   └── commercial
│
└── agent/
    ├── recommendation
    ├── crossing
    ├── checklist
    └── warning
```

Fixtures should represent meaningful domain states rather than artificially generated permutations.

---

# 27. Mocking Policy

Mocks should be used sparingly.

## Prefer

```text
Pure functions
Real components
Real fixture data
Real component composition
Real Storybook stories
Real browser navigation
```

## Avoid

```text
Mock every child component
Mock the router everywhere
Mock React state
Mock the entire application
Mock domain logic in component tests
Mock visual output
```

A mock is justified when it isolates a genuinely external dependency:

```text
Geolocation API
Network boundary
Push notification service
External navigation provider
Browser-only capability
```

Even then, the mock should represent a realistic contract.

---

# 28. Storybook as the Component Contract

Every reusable visual domain component should have a Storybook story.

A story is not necessarily a test.

It is a **renderable contract**.

Recommended story structure:

```text
Component
├── Default
├── Loading
├── Empty
├── Error
├── Semantic variants
├── Interactive
└── Edge cases
```

Example:

```text
CrossingStatusBadge
├── Open
├── Limited
├── Closed
└── Unknown
```

Storybook becomes the visual source that the evidence system can inspect.

---

# 29. Evidence Gathering System

Evidence gathering is an optional post-testing operation.

It should be invoked explicitly.

Example:

```bash
cruze test navigation
```

followed by:

```bash
cruze evidence navigation
```

or:

```bash
cruze test workflow WF-02 --evidence
```

The evidence layer should never silently turn every test run into a browser screenshot operation.

---

# 30. Evidence Gathering Objective

For a selected testing scope:

```text
Primitive
Component
Composition
Navigation
Workflow
Suite
```

the evidence task determines:

1. what was tested;
2. what should have been tested;
3. whether the subject has a Storybook representation;
4. whether browser verification is applicable;
5. whether the required infrastructure is available;
6. what evidence was generated;
7. where the evidence lives;
8. what remains missing.

---

# 31. Evidence Gathering Pipeline

```text
SELECT TEST SCOPE
       │
       ▼
RESOLVE TEST SUBJECTS
       │
       ▼
CHECK TEST SUITE
       │
       ├── Missing → report missing
       │
       ▼
CHECK STORYBOOK
       │
       ├── Missing → propose/create story
       │
       ▼
START STORYBOOK
if required
       │
       ▼
RUN BROWSER VERIFICATION
       │
       ▼
CAPTURE EVIDENCE
       ├── screenshots
       ├── logs
       └── metadata
       │
       ▼
WRITE EVIDENCE MATRIX
       │
       ▼
UPDATE TESTING REPORT
```

---

# 32. Evidence Scope

Evidence can be requested at different levels.

```text
--scope primitive
--scope component
--scope composition
--scope navigation
--scope workflow
--scope suite
```

Examples:

```bash
cruze evidence component CrossingStatusBadge
```

```bash
cruze evidence workflow WF-02
```

```bash
cruze evidence suite navigation
```

```bash
cruze evidence suite primitives
```

---

# 33. Component Evidence Process

For a component:

```text
1. Resolve component ID.
2. Resolve implementation.
3. Resolve test suite.
4. Resolve Storybook stories.
5. Compare declared variations against stories.
6. Create missing stories if explicitly authorized.
7. Start Storybook if necessary.
8. Launch browser.
9. Render each declared evidence variation.
10. Capture screenshot.
11. Capture browser/test log.
12. Record status.
13. Write evidence metadata.
14. Update Testing Report.
```

---

# 34. Component Evidence Matrix

The canonical matrix should contain at least:

| Component ID | Component           | Variation | Test        | Data    | Status | Browser  | Screenshot | Logs |
| ------------ | ------------------- | --------- | ----------- | ------- | ------ | -------- | ---------- | ---- |
| CR-STATUS-01 | CrossingStatusBadge | Open      | TEST-P2-001 | OPEN    | PASS   | Chromium | path       | path |
| CR-STATUS-01 | CrossingStatusBadge | Limited   | TEST-P2-002 | LIMITED | PASS   | Chromium | path       | path |
| CR-STATUS-01 | CrossingStatusBadge | Closed    | TEST-P2-003 | CLOSED  | PASS   | Chromium | path       | path |
| CR-STATUS-01 | CrossingStatusBadge | Unknown   | TEST-P2-004 | UNKNOWN | PASS   | Chromium | path       | path |

Additional metadata:

```text
timestamp
commit
environment
viewport
browser
storybook_version
test_runner_version
evidence_id
```

---

# 35. Workflow Evidence Process

Workflow evidence is broader.

Example:

```text
WF-02 Private Northbound Trip
```

The evidence task should verify:

```text
Test suite exists
Workflow definition exists
Required screens exist
Required components exist
Required Storybook stories exist where applicable
Browser environment works
Workflow executes
Critical checkpoints can be captured
Logs are collected
Screenshots are captured
```

Evidence checkpoints might be:

```text
01-trip-start
02-destination
03-origin
04-private-mode
05-access
06-document-profile
07-recommendation
08-crossing-detail
```

Not every screen needs a screenshot.

Evidence should focus on meaningful state transitions.

---

# 36. Workflow Evidence Matrix

| Workflow | Checkpoint     | Subject                       | Expected          | Actual     | Status | Screenshot | Log  |
| -------- | -------------- | ----------------------------- | ----------------- | ---------- | ------ | ---------- | ---- |
| WF-02    | Destination    | TripSetupDestinationStep      | Render            | Rendered   | PASS   | path       | path |
| WF-02    | Travel Mode    | TripSetupTravelModeStep       | Private           | Private    | PASS   | path       | path |
| WF-02    | Access         | TripSetupVehicleAccessStep    | Northbound        | Rendered   | PASS   | path       | path |
| WF-02    | Recommendation | TripRecommendationPrimaryCard | Compatible        | Compatible | PASS   | path       | path |
| WF-02    | Detail         | CrossingDetailHero            | Selected crossing | Correct    | PASS   | path       | path |

---

# 37. Evidence Status Model

Evidence should have more states than PASS/FAIL.

```text
NOT_TESTED
PASS
FAIL
BLOCKED
MISSING_SUITE
MISSING_STORY
MISSING_EVIDENCE
NOT_APPLICABLE
SKIPPED
STALE
```

This distinction is critical.

For example:

```text
Component test = PASS
Storybook story = missing
Evidence = missing
```

The component is **not failed**.

Its evidence state is incomplete.

---

# 38. Evidence vs Test Result

Never collapse these concepts.

Example:

```text
TEST RESULT
CrossingStatusBadge / Open
PASS

EVIDENCE RESULT
Story exists
PASS

Browser rendering
PASS

Screenshot
PASS
```

Another case:

```text
TEST RESULT
CrossingStatusBadge / Closed
PASS

EVIDENCE RESULT
Story missing
MISSING_STORY
```

The test remains valid.

The audit coverage is incomplete.

---

# 39. Testing Report

Cruze should have a simple static/served HTML application:

```text
Testing Report
```

Its purpose is to expose the relationship between:

```text
Types
Primitives
Components
Compositions
Screens
Navigation
Workflows
Tests
Stories
Browser evidence
Logs
```

It should function as a **testing knowledge graph rendered as an HTML report**.

---

# 40. Testing Report Architecture

```text
                         TESTING REPORT
                               │
              ┌────────────────┼────────────────┐
              │                │                │
           TYPES          UI SYSTEM         PRODUCT
              │                │                │
              │          ┌─────┴─────┐      ┌───┴────┐
              │          │           │      │        │
           Unit       Primitives Components Screens Workflows
              │          │           │      │        │
              └──────────┴───────────┴──────┴────────┘
                               │
                            TESTS
                               │
                         ┌─────┴─────┐
                         │           │
                      Results     Evidence
                         │           │
                         └─────┬─────┘
                               │
                       Screenshots / Logs
```

---

# 41. Testing Report — Main Dashboard

The dashboard should immediately answer:

```text
How much has been tested?
What passed?
What failed?
What is missing?
What has evidence?
What has no evidence?
What is blocked?
```

Recommended summary:

```text
CRUZE TESTING REPORT

Tests
████████████████░░░░  82%

Passed      128
Failed        3
Blocked       4
Missing      12

Components
██████████████████░░  91%

Stories
████████████████░░░░  84%

Evidence
███████████░░░░░░░░░  57%

Workflows
████████████░░░░░░░░  6 / 9
```

---

# 42. Testing Report Sections

## Overview

High-level health.

## Test Suites

```text
Types
Primitives
Components
Compositions
Navigation
Workflows
```

## Components

Searchable component inventory.

## Primitives

Primitive inventory and variations.

## Workflows

Workflow execution and evidence.

## Navigation

Routes and transitions.

## Evidence

Evidence coverage.

## Missing

Explicit missing work.

## Failures

Actionable failures.

---

# 43. Component Report View

A component page should expose:

```text
CrossingStatusBadge

ID:
CR-STATUS-01

Implementation:
...

Tests:
4 / 4 PASS

Storybook:
4 / 4 variations

Browser Evidence:
4 / 4

Coverage:
100%

Variations:
────────────────────────────
Open       PASS   [Screenshot]
Limited    PASS   [Screenshot]
Closed     PASS   [Screenshot]
Unknown    PASS   [Screenshot]

Logs:
[Open]

Implementation:
[Open]

Storybook:
[Open]
```

---

# 44. Missing Component State

If no test exists:

```text
CR-STATUS-01

Testing:
MISSING

Recommended action:

Create component test suite.

Command:
cruze test scaffold component CR-STATUS-01
```

If no Storybook story exists:

```text
Storybook:
MISSING

Recommended action:

Create Storybook story.

Command:
cruze story scaffold component CR-STATUS-01
```

If evidence is missing:

```text
Evidence:
MISSING

Recommended action:

cruze evidence component CR-STATUS-01
```

The report should distinguish these conditions rather than simply marking the component "untested."

---

# 45. Workflow Report View

Example:

```text
WF-02 — Private Northbound Trip

Status:
PASS

Tests:
12 / 12

Browser:
Chromium

Checkpoints:
────────────────────────────
Trip Start              PASS
Destination             PASS
Origin                  PASS
Travel Mode             PASS
Access                  PASS
Document Profile        PASS
Recommendation          PASS
Crossing Detail         PASS

Evidence:
8 / 8 checkpoints

Screenshots:
8

Logs:
1

Last execution:
2026-09-02 14:32
```

---

# 46. Missing Workflow Infrastructure

The report should be able to say:

```text
WF-04 — Commercial Trip

Status:
NOT READY

Missing:
✓ Workflow definition
✓ Test implementation
✗ Storybook coverage for 2 components
✗ Browser evidence
✓ Required components

Actions:

[Create test]
[Create stories]
[Run workflow]
[Gather evidence]
```

Where supported, the UI should expose the exact command required.

---

# 47. Evidence Directory Structure

Evidence should be deterministic and discoverable.

Recommended:

```text
test-evidence/
├── runs/
│   └── 2026-09-02T14-32-00/
│       ├── manifest.json
│       ├── tests/
│       ├── screenshots/
│       └── logs/
│
├── components/
│   └── CR-STATUS-01/
│       ├── open/
│       │   ├── screenshot.png
│       │   └── result.json
│       ├── limited/
│       ├── closed/
│       └── unknown/
│
├── workflows/
│   └── WF-02/
│       ├── checkpoints/
│       ├── screenshots/
│       └── logs/
│
└── navigation/
    └── NAV-001/
        ├── screenshots/
        └── logs/
```

The exact filesystem location can be adapted to the Cruze repository.

---

# 48. Evidence Manifest

Every evidence run should produce a manifest.

Example conceptual structure:

```text
evidence_id
test_id
subject_id
subject_type
variation
workflow
timestamp
git_commit
browser
viewport
environment
result
screenshot_path
log_path
storybook_story
```

This allows the Testing Report to be generated without parsing arbitrary log files.

---

# 49. Evidence Run Lifecycle

```text
CREATED
   ↓
RESOLVING
   ↓
READY
   ↓
EXECUTING
   ↓
COLLECTING
   ↓
COMPLETED
```

Failure states:

```text
BLOCKED
PARTIAL
FAILED
```

---

# 50. Browser Evidence Rules

Playwright should capture:

```text
viewport
browser
URL/route
console errors
page errors
network failures where relevant
screenshot
test result
timestamp
```

The evidence system should avoid recording unnecessary sensitive information.

No:

```text
credentials
tokens
authentication cookies
personal document numbers
private user data
```

---

# 51. Screenshot Naming

Use deterministic names.

```text
CR-STATUS-01__open.png
CR-STATUS-01__limited.png
CR-STATUS-01__closed.png
CR-STATUS-01__unknown.png
```

Workflow:

```text
WF-02__01-trip-start.png
WF-02__02-destination.png
WF-02__03-origin.png
WF-02__04-travel-mode.png
WF-02__05-access.png
WF-02__06-document-profile.png
WF-02__07-recommendation.png
WF-02__08-crossing-detail.png
```

---

# 52. Test Suite Checklist Matrix

| Area        | Render | Logic | Interaction |     Browser |       Story |    Evidence |
| ----------- | -----: | ----: | ----------: | ----------: | ----------: | ----------: |
| Types       |      — |     ✓ |           — |           — |           — |    Optional |
| Primitive   |      ✓ |     ✓ |           ✓ |    Optional | Recommended |    Optional |
| Component   |      ✓ |     ✓ |           ✓ |    Optional |    Required |    Optional |
| Composition |      ✓ |     ✓ |           ✓ | Recommended | Recommended |    Optional |
| Navigation  |      ✓ |     — |           ✓ |    Required |           — | Recommended |
| Workflow    |      ✓ |     ✓ |           ✓ |    Required |  Supporting | Recommended |

---

# 53. Implementation Checklist Matrix

## Types

```text
[ ] Domain states identified
[ ] Valid values defined
[ ] Invalid values handled
[ ] State transitions tested
[ ] Boundary values tested
[ ] Pure functions tested
```

## Primitive

```text
[ ] API defined
[ ] Default render tested
[ ] Semantic variants tested
[ ] Disabled/loading tested where applicable
[ ] Accessibility tested
[ ] Story exists
[ ] Evidence variations defined
```

## Component

```text
[ ] Component ID exists
[ ] Component mapped to catalog
[ ] Data contract defined
[ ] State contract defined
[ ] Default test exists
[ ] Edge-state test exists
[ ] Interaction test exists where needed
[ ] Storybook story exists
[ ] Variations mapped
```

## Composition

```text
[ ] Screen ID exists
[ ] Component relationships defined
[ ] Default state tested
[ ] Important alternate state tested
[ ] Critical edge state tested
[ ] Primary interaction tested
```

## Navigation

```text
[ ] Route defined
[ ] Entry points defined
[ ] Exit paths defined
[ ] Back behavior tested
[ ] Deep link tested where applicable
[ ] Refresh tested
[ ] Invalid route tested
```

## Workflow

```text
[ ] Workflow ID exists
[ ] Business intent defined
[ ] Preconditions defined
[ ] Steps defined
[ ] State transitions defined
[ ] Critical assertions defined
[ ] Final state defined
[ ] Browser test exists
[ ] Evidence profile optional/defined
```

---

# 54. Navigation Consistency Matrix

| Source    | Destination | Mechanism    | Expected |
| --------- | ----------- | ------------ | -------- |
| Trip      | Crossings   | Bottom nav   | Valid    |
| Trip      | Agent       | Bottom nav   | Valid    |
| Crossings | Trip        | Bottom nav   | Valid    |
| Crossings | Agent       | Bottom nav   | Valid    |
| Agent     | Trip        | Bottom nav   | Valid    |
| Agent     | Crossings   | Bottom nav   | Valid    |
| Header    | Avisos      | Icon         | Valid    |
| Header    | Settings    | Icon         | Valid    |
| Trip      | Detail      | CTA          | Valid    |
| Crossings | Detail      | Row          | Valid    |
| Agent     | Detail      | Result       | Valid    |
| Avisos    | Detail      | Alert action | Valid    |
| Settings  | Favorites   | List         | Valid    |
| Settings  | My Trips    | List         | Valid    |
| Detail    | Compare     | CTA          | Valid    |
| Trip      | Map         | Contextual   | Valid    |
| Detail    | Map         | Contextual   | Valid    |

---

# 55. Workflow Consistency Matrix

| Workflow             | Location |     Trip | Crossings |    Agent | Detail |  Compare |   Avisos |
| -------------------- | -------: | -------: | --------: | -------: | -----: | -------: | -------: |
| First Launch         |        ✓ |        ✓ |         — |        — |      — |        — |        — |
| Private Northbound   |        ✓ |        ✓ |  Optional | Optional |      ✓ |        ✓ |        — |
| Walking              |        ✓ |        ✓ |  Optional | Optional |      ✓ | Optional |        — |
| Commercial           |        ✓ |        ✓ |  Optional | Optional |      ✓ |        ✓ |        — |
| Browse Border        |        ✓ |        — |         ✓ | Optional |      ✓ | Optional |        — |
| Active Trip          |        ✓ |        ✓ |  Optional |        ✓ |      ✓ | Optional | Optional |
| Agent Recommendation |        ✓ | Optional |  Optional |        ✓ |      ✓ |        ✓ |        — |
| Aviso Response       |        ✓ | Optional |  Optional |        ✓ |      ✓ |        ✓ |        ✓ |

---

# 56. Testing Report Relationship Model

The report should conceptually model these relationships:

```text
TYPE
  │
  ├── used_by → PRIMITIVE
  │
  ├── used_by → COMPONENT
  │
  └── used_by → WORKFLOW

PRIMITIVE
  │
  └── used_by → COMPONENT

COMPONENT
  │
  ├── appears_in → COMPOSITION
  ├── has → STORY
  ├── has → TEST
  └── has → EVIDENCE

COMPOSITION
  │
  ├── appears_in → SCREEN
  ├── has → TEST
  └── appears_in → WORKFLOW

SCREEN
  │
  ├── navigates_to → SCREEN
  └── appears_in → WORKFLOW

WORKFLOW
  │
  ├── uses → SCREEN
  ├── uses → COMPONENT
  ├── executes → TEST
  └── produces → EVIDENCE

TEST
  │
  ├── targets → SUBJECT
  └── produces → RESULT

EVIDENCE
  │
  ├── screenshot
  ├── log
  └── metadata
```

This relationship model is more valuable than a simple list of test files.

---

# 57. Report Data Model

At a high level:

```text
TestingReport
├── generatedAt
├── commit
├── environment
├── suites[]
├── types[]
├── primitives[]
├── components[]
├── compositions[]
├── navigation[]
├── workflows[]
├── tests[]
├── stories[]
├── evidence[]
└── summary
```

Each subject should have stable IDs.

This allows the report to correlate:

```text
Component
→ Story
→ Test
→ Test Result
→ Evidence
→ Screenshot
→ Log
```

---

# 58. Suggested CLI Surface

The eventual CLI does not need to be large.

Conceptually:

```bash
cruze test types
cruze test primitives
cruze test components
cruze test navigation
cruze test workflows
```

Specific:

```bash
cruze test component CR-STATUS-01
cruze test workflow WF-02
```

Evidence:

```bash
cruze evidence component CR-STATUS-01
cruze evidence workflow WF-02
cruze evidence suite navigation
```

Reporting:

```bash
cruze report generate
cruze report serve
```

Scaffolding:

```bash
cruze test scaffold component CR-STATUS-01
cruze story scaffold component CR-STATUS-01
```

The CLI should report commands that can resolve missing infrastructure rather than requiring the developer to discover the appropriate command manually.

---

# 59. Recommended Execution Modes

## Fast Development

```bash
cruze test types
cruze test primitives
```

No browser.

---

## Component Development

```bash
cruze test component CR-STATUS-01
```

Optional:

```bash
cruze evidence component CR-STATUS-01
```

---

## Feature Validation

```bash
cruze test components --feature crossing-detail
cruze test composition crossing-detail
```

Optional evidence:

```bash
cruze evidence --feature crossing-detail
```

---

## Release Validation

```bash
cruze test types
cruze test primitives
cruze test components
cruze test navigation
cruze test workflows
```

Then:

```bash
cruze evidence suite navigation
cruze evidence suite workflows
cruze report generate
```

---

# 60. What Should Not Be Automated Initially

The first version should deliberately avoid:

```text
Automatic screenshot comparison of every commit
Full visual regression across every component
Automatic generation of hundreds of Storybook stories
Browser execution for every unit test
Full network simulation
Synthetic user databases
Complex test orchestration infrastructure
AI-generated test cases without human-defined contracts
```

These can be added later.

The initial objective is **traceability**, not test volume.

---

# 61. Definition of Done

A component is considered testing-complete when:

```text
✓ Component ID exists
✓ Data contract is understood
✓ Primary states are tested
✓ Important interactions are tested
✓ Storybook story exists
✓ Accessibility basics are covered
✓ No known semantic-state collision exists
```

It is **evidence-complete** when:

```text
✓ Required variations are rendered
✓ Browser verification succeeds
✓ Screenshots exist
✓ Logs exist
✓ Evidence metadata exists
✓ Testing Report references the evidence
```

---

# 62. Definition of Done — Workflow

A workflow is testing-complete when:

```text
✓ Intent is defined
✓ Preconditions are defined
✓ Browser workflow exists
✓ Critical transitions are asserted
✓ Final state is asserted
✓ Failure conditions are covered
```

It is evidence-complete when:

```text
✓ Required checkpoints are defined
✓ Browser execution completed
✓ Relevant screenshots exist
✓ Logs exist
✓ Evidence is indexed
✓ Testing Report is updated
```

---

# 63. Final Architecture

The complete system should ultimately look like:

```text
                         CRUZE APPLICATION
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
           Types            UI System          Screens
              │                 │                 │
          Unit Tests       ┌─────┴─────┐      Compositions
              │            │           │           │
              │       Primitives  Components      │
              │            │           │           │
              └────────────┴───────────┴───────────┘
                                │
                           TEST SUITES
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
          Unit/Render       Navigation         Workflows
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                         TEST RESULTS
                                │
                     OPTIONAL EVIDENCE
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
          Storybook          Playwright          Logs
              │                 │                 │
              └─────────────────┼─────────────────┘
                                │
                         EVIDENCE MATRIX
                                │
                         TESTING REPORT
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
       Coverage              Results               Evidence
          │                     │                     │
       Missing              Failures              Screenshots
       Stories              Blocked               Logs
       Tests                Skipped               Metadata
```

---

# 64. Core Principle

The most important architectural rule is:

> **Tests establish correctness. Stories establish renderable contracts. Playwright establishes browser behavior. Evidence establishes auditability. The Testing Report establishes traceability between all four.**

None of these should be treated as interchangeable.

A passing test without evidence is still a valid test.

A Storybook story without a test is still useful, but does not prove behavior.

A screenshot without an assertion is evidence of appearance, not correctness.

A workflow passing without traceable checkpoints is useful for development, but weak as an audit artifact.

The Testing Report brings these dimensions together without forcing every execution to become a heavyweight browser test.

---

# 65. Target Outcome

The mature Cruze testing system should allow a developer to answer, from one place:

```text
What exists?
What should be tested?
What has been tested?
What passed?
What failed?
What is missing?
Which components have stories?
Which components have browser evidence?
Which workflows are verified?
Which navigation paths are verified?
Where are the screenshots?
Where are the logs?
What command should I run to fix the missing piece?
```

That is the actual purpose of the system.

Not maximum test coverage.

**Maximum useful confidence with minimum unnecessary testing infrastructure.**

I think the **Testing Report is the key architectural piece** here. If we build it around stable IDs and relationships from the beginning, it can eventually become a lightweight testing control plane rather than just another HTML report generator.

