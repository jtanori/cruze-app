# Testing Integration Plan

**Version:** 1.1 — 2026-09-04 — W5 1.1 canon (radii 4/8/12/16/20, nav 56/80+safe), 83 specs, 6 W5 stubs scaffolded. If any source doc version differs, revisit `TESTING_TOOLS.md` P0-P5.

> **Source of truth:** `docs/TESTING_TOOLS.md` (P0-P5 architecture, evidence, Testing Report) — this plan is the **integration wiring** from that spec to the actual codebase: `design/components/README.md` (84), `design/workflows/W*.md` (W1-W10), `docs/PAGES_WORKFLOWS_REPORT.md` (28×10 matrix), `design/INTEGRATION_PLAN.md` (Phases 0-14).
> Companion: `docs/CHECKLISTS.md` §§18-34 (QA gates), `docs/PHASE-7-QA.md` (snapshot).

**Scope:** How to execute `docs/TESTING_TOOLS.md` incrementally against the existing stack (`apps/web/vitest.config.ts` + `playwright.config.ts` + 4 lib tests + `playwright/tests/screens-evidence.test.ts` skip) — not a second testing spec.
**Status:** Plan — P0-P1 bootstrap exists, P2-P5 wiring next.

---

## 0. What exists vs what the spec expects

| Spec (`TESTING_TOOLS.md`) | Actual codebase | Gap |
|---|---|---|
| `P0 Types` — `TEST-P0-TYPE-*` | `apps/web/src/lib/__tests__/trip-setup-flow.test.ts`, `location-state-machine.test.ts`, `direction-detection.test.ts`, `trip-lifecycle.test.ts` (4 files) | No `TEST-P0-*` IDs, no coverage table |
| `P1 Primitives` — `TEST-P1-PRIM-*` | 33 primitives in `src/components/primitives/` | 0 tests |
| `P2 Components` — `TEST-P2-*` | 83 component specs in `design/components/` (28 enriched + 55 stubs) | 0 tests, 0 Stories (6 W5 domain stubs `CR-STATUS-*` `TR-REC-04` just scaffolded `apps/web/src/components/crossing/*.tsx` + `trip/TripAlternativeListRow.tsx:1` — still 0 tests) |
| `P3 Compositions` — `TEST-P3-*` | 28 pages in `docs/PAGES_WORKFLOWS_REPORT.md` | 0 tests |
| `P4 Navigation` — `TEST-P4-NAV-*` | `AppShell` 3 tabs (Viaje/Cruces/Agente) + bell + gear | `screens-evidence.test.ts` is `describe.skip`, asserts 5 tabs (outdated) |
| `P5 Workflows` — `TEST-P5-WF-*` / `WF-01..08` | `design/workflows/W*.md` (W1-W10) | W1 has `W1.1-W1.14` scenarios but no `TEST-P5-*` IDs |
| Fixtures (`§26`) | Mock data inline in hooks/stores | No `fixtures/` directory |
| Evidence (`§29-37`) + Testing Report (`§39-45`) | `test-evidence/` not created, no report HTML | Not wired |

> **Current spec:** radii 4/8/12/16/20 (`globals.css:94` / `W5:1.4`), nav 56/80+safe (HIG 49+21=83 / Material 80), W5 1.1. If source version differs, revisit.

**Tooling that already works:** `apps/web/vitest.config.ts:1` (`jsdom`, `src/test/setup.ts`, `include: ["src/**/*.test.{ts,tsx}"]`, `globals: true`) + root `playwright.config.ts:1` (`testDir: playwright/tests`, `webServer: pnpm --filter cruce-web dev`, `viewport 375x667`, projects `Chromium`/`Mobile Chrome`) + `apps/web/package.json:12` (`vitest run`) + `package.json:15` (`turbo run test`). Reuse these — do not rebuild.

---

## 1. Test ID convention (wires `TESTING_TOOLS.md` §3 to codebase)

```text
TEST-P{LAYER}-{DOMAIN}-{NNN}
LAYER  0 Types / pure logic      1 Primitives  2 Domain components
       3 Compositions           4 Navigation  5 Workflows
DOMAIN TYPE, PRIM, LOC, TR, CR, AG, AV, SET, NAV, WF
```

Examples (use these IDs in file headers + code comments so `Testing Report` §57 can index):

```text
TEST-P0-TYPE-001  classifyFreshness LIVE/RECENT/STALE/UNAVAILABLE
TEST-P1-PRIM-001  Button primary/disabled/loading
TEST-P2-LOC-001   LocationStatusBanner LIVE vs STALE (CR-STATUS-05 vs LOC-STATUS-01 must not collapse — §7.1)
TEST-P2-TR-001    TripRecommendationPrimaryCard RECOMENDADO vs stale
TEST-P3-TRIP-001  T07 default recommendation composition
TEST-P4-NAV-001   Viaje → Cruces → Agente (3-tab invariant §26)
TEST-P5-WF-001    W1 Location: permission → acquiring → ready → T01
TEST-P5-WF-005    W5 Private Northbound: T01→T02→T03→TR-SETUP-05→TR-SETUP-06→T07
```

File location convention:

```text
apps/web/src/lib/__tests__/<pure>.test.ts              P0
apps/web/src/components/primitives/__tests__/*.test.tsx  P1
apps/web/src/components/<domain>/__tests__/*.test.tsx    P2  (co-located, or src/components/<ID>/)
apps/web/src/app/[locale]/(main)/trip/__tests__/*.test.tsx  P3
playwright/tests/navigation.test.ts                      P4
playwright/tests/workflows/W{1..10}-*.test.ts            P5
```

Each file must declare `subject_type` + `execution` in a top comment (per §3 taxonomy) so the future `cruze report generate` can parse it.

---

## 2. P-layer → Component mapping (84 IDs grouped)

Derived from `design/components/README.md` + `W5_component_level_design_spec.md` §1-2 tokens.

| P-layer | Component set (IDs) | TESTING_TOOLS § | Priority |
|---------|---------------------|-----------------|----------|
| **P0 Types** | `trip-lifecycle.ts` (`DRAFT→COMPLETED`), `direction-detection.ts` (`deriveDirection`), `location-state-machine.ts` (9 states), `trip-setup-flow.ts` (`getRequiredSteps`), `avisos.ts`, `crossing-types.ts`, `freshness.ts` (`classifyFreshness`), `parseWaitTime` | §23-25 (Types) | **First** — 4 files already exist, add boundary cases (§25) |
| **P1 Primitives** | 33 primitives: `Button`, `IconButton`, `SearchInput`, `SegmentedControl`, `RadioGroup`, `Checkbox`, `Toggle`, `Badge`, `StatusBadge`, `Banner`, `EmptyState`, `Skeleton`, `Spinner`, `Stack`, `Divider`, `BottomSheet`, `Modal`, `DataMetric`, `DataDelta`, `DataTimestamp`, `DataStatus`, … | §4-5 | Second — per Primitive Test Matrix (§4.2) + Variations (§5), Storybook recommended |
| **P2 Domain** — enriched (28) | `APP-HEAD-01`, `APP-AV-01`, `APP-SET-01`, `APP-NAV-01`, `LOC-STATUS-01`, `TR-EMPTY-01`, `TR-NEAR-01/02`, `TR-SETUP-01..06`, `TR-REC-01..04`, `TR-ACT-01..04`, `TR-COMP-01`, `CR-STATUS-01..05` | §6-7 (have W5 tokens §4-33) | **Third** — per Component Test Contract §6.2; wire §33 matrix (correct domain/name/responsibility/tokens) |
| **P2 Domain** — stubs (56) | `CR-DIR-01..05`, `CR-DET-01..10`, `CR-CMP-01`, `AG-* (11)`, `AV-* (9)`, `SET-* (7)`, `LOC-GATE-01`, `LOC-PROMPT-01`, `LOC-ACQ-01`, `LOC-ACQ-DOTS-01`, `LOC-REC-01`, `LOC-SEARCH-01`, `LOC-SUGGEST-01`, `LOC-CONF-01`, `LOC-NET-01` | §6 (stub — Source: Architecture spec only) | After enriched — still need §33 QA, but tokens are generic (§1-2 only) |
| **P3 Compositions** | 11 screen groups: L01-L03 (inline gating), T01 Viaje intelligence, T02-T04+DIR+ACC+DOC setup, T07 recommendation, T08 active, T10 completion, C01 directory, C03 detail, C04 compare, C05 map, A01/A02 agent, N01/N02 avisos, S01-S06 settings | §8-9 | After P2 — per §9 strategy: default + most important alternate + critical edge + interaction |
| **P4 Navigation** | 3 tabs invariant (§26), header bell → Avisos, gear → Settings, canonical Detail, Trip↔Crossings↔Agent | §10-11 + `CHECKLISTS.md` §§25-26 | Parallel to P3 — Navigation Test Matrix §10.1 (18 transitions) |
| **P5 Workflows** | W1-W10 per `design/workflows/` | §13-22 (8 critical workflows WF-01..08) | Last — each WF per §22 rules (intent/preconditions/steps/transitions/assertions) |

**Order:** P0 → P1 → P2(enriched) → P2(stubs) → P3 → P4/P5. Matches `INTEGRATION_PLAN.md` Phases 0-10 (Phase 0 = P1, Phase 1 = P2 LOC, Phase 2 = P2 TR-SETUP, etc. — see §7).

---

## 3. Workflow → Test scenarios (10 workflows → TEST-P5-WF-*)

Trace: `design/workflows/W*.md` → `WF-01..08` in `TESTING_TOOLS.md` §14-21. Keep both IDs: W1 = WF-01, W5 = WF-02, etc.

| Workflow | Design doc | TESTING_TOOLS WF | Test IDs | Scenarios (critical assertions) |
|----------|------------|------------------|----------|---------------------------------|
| **W1 Location** | `W1-location.md` (9-state machine + manual fallback) | WF-01 First Launch | `TEST-P5-WF-001..014` | W1.1 granted→ready, W1.2 denied→recovery, W1.3 timeout, W1.4 low accuracy→needs_confirmation, W1.5 services_disabled, W1.6 restricted, W1.7 retry, W1.8 previously_granted, W1.9 previously_denied, W1.10 stale→needs_refreshing, W1.11 manual search fallback, W1.12 network offline, W1.13 no fake personalization when unknown, W1.14 confidence sufficient gate |
| **W2 Walking** | `W2-trip-walking.md` | WF-03 | `TEST-P5-WF-015..017` | T01→T02→T03(walking)→T07 minimal, no access/docs step appears, direction derived still valid |
| **W3 Commercial** | `W3-trip-commercial.md` | WF-04 | `TEST-P5-WF-018..020` | T01→T02→T03(commercial)→T07 only compatible crossings (filter), incompatible never as normal rec |
| **W4 Private SB** | `W4-trip-private-southbound.md` | — | `TEST-P5-WF-021..023` | T01→T02→T03(private)→DIR(south)→T07, no access/docs, derived southbound |
| **W5 Private NB** | `W5-trip-private-northbound.md` + `W5_component_level_design_spec.md` §8-15 | WF-02 | `TEST-P5-WF-024..032` | Full: T01→T02→T03(private)→DIR(north)→TR-SETUP-05→TR-SETUP-06→T07, access compatibility affects rec, RECOMENDADO label, alternatives compatible, detail canonical, stale not as live (§7.1 guard) |
| **W6 Active Trip** | `W6-active-trip.md` | WF-06 | `TEST-P5-WF-033..037` | T07→T08→T10→S04, lifecycle DRAFT→PLANNING→READY→ACTIVE→AT_BORDER→COMPLETED, checklist data-driven, `isEligibleForMyTrips` only completed |
| **W7 Crossings** | `W7-crossings.md` | WF-05 | `TEST-P5-WF-038..042` | C01→C03→C04→Trip(Usar), canonical detail regardless of entry (Trip/Crossings/Agent/Avisos), 7 metrics, map contextual not competing |
| **W8 Agent** | `W8-agent.md` | WF-07 | `TEST-P5-WF-043..046` | A01→A02±context (location/trip/crossing/avisos), AG-RESULT-01..04 with same domain truth as Trip/Crossings, no ask for known Cruze state |
| **W9 Avisos** | `W9-avisos.md` | WF-08 | `TEST-P5-WF-047..050` | N01→N02→Trip/Agent, grouping today/yesterday/earlier, WHAT/WHY/ACTION, Aviso→Crossing→Rec→Trip chain (Data→Aviso→Crossing→Rec→Trip) |
| **W10 Settings** | `W10-settings.md` | — | `TEST-P5-WF-051..054` | S01→S02/S03/S04/S05/S06 isolation, Favorites persist, My Trips only completed, DataSharing "Próximamente", About links |

Each `TEST-P5-WF-*` must define per `TESTING_TOOLS.md` §22: `Workflow ID / intent / preconditions / starting surface / actions / expected transitions / final state / critical assertions / failure conditions / evidence profile`.

---

## 4. Fixtures — `TESTING_TOOLS.md` §26 (small canonical, not a mock-data universe)

Location: `apps/web/src/test/fixtures/` (new) — one file per domain state, meaningful states not permutations.

```text
src/test/fixtures/
├── crossing/
│   ├── open-live.ts            # CrossingStatusBadge OPEN + CrossingFreshness LIVE  (fresh < 15m)
│   ├── open-stale.ts           # OPEN + STALE  → must NOT render "EN VIVO" (§7.1 invalid case)
│   ├── limited.ts
│   ├── closed.ts
│   └── unknown.ts
├── trip/
│   ├── empty.ts                # T01 — no destination yet (TR-EMPTY-01 + TR-NEAR-01)
│   ├── planning.ts             # T02-T04 setup in progress
│   ├── recommendation.ts       # T07 with TR-REC-01 + TR-REC-03
│   ├── active.ts               # T08 ACTIVE + checklist
│   └── completed.ts            # T10 → S04 isEligibleForMyTrips
├── traveler/
│   ├── walking.ts
│   ├── private-northbound.ts
│   ├── private-southbound.ts
│   └── commercial.ts
└── agent/
    ├── recommendation.ts       # AG-RESULT-02 + actions
    ├── crossing.ts             # AG-RESULT-01
    ├── checklist.ts            # AG-RESULT-04
    └── warning.ts
```

Reuse, do not duplicate: `border-data.ts` `BORDER_CROSSINGS`, `border-data-service.ts` mock → later live CBP. Fixtures are for test assertions, not for wiring live data.

---

## 5. Evidence gathering (§29-37) — opt-in, not per-test

Per `TESTING_TOOLS.md` §37 evidence states: `NOT_TESTED / PASS / FAIL / BLOCKED / MISSING_SUITE / MISSING_STORY / MISSING_EVIDENCE / NOT_APPLICABLE / SKIPPED / STALE` — never collapse into test PASS/FAIL.

Pipeline (§31): `Resolve suite → Check Storybook → Start Storybook if needed → Browser → Capture (screenshot+logs+metadata) → Evidence Matrix → Testing Report`.

Naming (§51): `CR-STATUS-01__open.png`, `WF-02__07-recommendation.png`. Directory (§47):

```text
test-evidence/
├── runs/<ISO-timestamp>/manifest.json + tests/ + screenshots/ + logs/
├── components/CR-STATUS-01/{open,limited,closed,unknown}/screenshot.png + result.json
├── workflows/WF-02/checkpoints/ + screenshots/ + logs/
└── navigation/NAV-001/screenshots/ + logs/
```

Manifest per §48: `evidence_id / test_id / subject_id / subject_type / variation / workflow / timestamp / git_commit / browser / viewport / environment / result / screenshot_path / log_path / storybook_story`.

---

## 6. Execution phasing (mapped to `INTEGRATION_PLAN.md` Phases 0-14)

| INTEGRATION_PLAN Phase | This plan layer | Test IDs | Existing to reuse | New work |
|---|---|---|---|---|
| **Phase 0** Foundations (3w) | P0 Types | `TEST-P0-TYPE-*` | 4 lib test files | Add boundary cases per §25 (`valid/missing/null/empty/unexpected/legacy/unknown`) for `classifyFreshness`, `parseWaitTime`, `deriveDirection`, `canTransitionTrip` |
| **Phase 1** Location (W1) | P2 LOC (10 IDs) | `TEST-P2-LOC-*` | `LOC-*` specs enriched | `LOC-GATE-01`, `LOC-STATUS-01`, `LOC-CONF-01` render + state-machine integration |
| **Phase 2** Trip Setup (W2-W5) | P2 TR-SETUP (6) | `TEST-P2-TR-SETUP-*` | `TR-SETUP-*` enriched (§9-15) | Adaptive stepper, direction derived MX→US, branching per `getRequiredSteps` |
| **Phase 3** Recommendation + Active (W5-W6) | P2 TR-REC + TR-ACT | `TEST-P2-TR-REC-*`, `TEST-P2-TR-ACT-*` | `TR-REC-*`, `TR-ACT-*` enriched | `RECOMENDADO` badge + stale guard (§7.1), checklist data-driven |
| **Phase 4** Crossings (W7) | P2 CR-* (21) | `TEST-P2-CR-*` | `CR-STATUS-*` enriched, `CR-DIR/DET` stubs | Directory filter (MX/US/mode), expanded row, canonical Detail from any entry |
| **Phase 5** Agent (W8) | P2 AG-* (11) | `TEST-P2-AG-*` | `AG-*` stubs | `AG-RESULT-01..04` compatibility with Trip/Crossings domain truth |
| **Phase 5b** Avisos (W9) | P2 AV-* (9) | `TEST-P2-AV-*` | `AV-*` stubs | `AV-ROW-01` + grouping + WHAT/WHY/ACTION |
| **Phase 6** Settings (W10) | P2 SET-* (7) | `TEST-P2-SET-*` | `SET-*` stubs | `SET-TRIP-01` only completed via `isEligibleForMyTrips` |
| **Phase 8** Compositions | P3 (11 groups) | `TEST-P3-TRIP-*`, `TEST-P3-CROSSING-*`, `TEST-P3-AGENT-*`, … | 28 pages in `PAGES_WORKFLOWS_REPORT.md` §3 | Default + most important alternate + critical edge + interaction per §9 |
| **Phase 9-10** Workflows | P4 + P5 | `TEST-P4-NAV-*`, `TEST-P5-WF-*` (54 scenarios) | `W*.md` 10 workflows, `PAGES_WORKFLOWS_REPORT.md` matrix | 18 nav transitions (§10.1) + 54 workflow scenarios (§3) |
| **Evidence + Report** | (outside layers) | — | `TESTING_TOOLS.md` §39-45 spec | Storybook setup + `test-evidence/` + Testing Report HTML (see §8) |

**Fast development loop** (per §59): `pnpm --filter cruce-web test` (P0 only, no browser) → `pnpm --filter cruce-web test -- component CR-STATUS-01` → optional `cruze evidence component CR-STATUS-01` (when CLI exists) — browser only on `--evidence`.

---

## 7. Progress tracking — wiring to `CHECKLISTS.md` + `PAGES_WORKFLOWS_REPORT.md`

Each component/workflow/page must declare status per `TESTING_TOOLS.md` §53 Implementation Checklist + `CHECKLISTS.md` §§33-34:

```text
Component: CR-STATUS-01
  spec:     design/components/CR-STATUS-01-CrossingStatusBadge.md ✓ (enriched, W5 §24)
  p-layer:  P2
  test:     TEST-P2-CR-STATUS-01  — apps/web/src/components/crossing/__tests__/CrossingStatusBadge.test.tsx  [ ]
  story:    stories/CrossingStatusBadge.stories.tsx  [ ]
  evidence: test-evidence/components/CR-STATUS-01/*.png  [ ]
  checklists: CHECKLISTS.md §19 (component) + §24 (operational≠freshness) + §33
  workflow: W5, W7 (PAGES_WORKFLOWS_REPORT.md §3 matrix: C03, T07)
```

Tracking table lives in the Testing Report (§39-43), not duplicated here. This doc owns the **mapping**; the report owns the **status**.

---

## 8. Testing Report + Evidence — implementation path (reuse, do not green-field)

`TESTING_TOOLS.md` §39-45 defines the HTML Testing Report (knowledge graph: `TYPE→PRIMITIVE→COMPONENT→COMPOSITION→SCREEN→WORKFLOW→TEST→EVIDENCE→screenshot/log`). Build it incrementally:

1. **Manifest first** (§48-49): every `vitest` + `playwright` run writes `test-evidence/runs/<ts>/manifest.json` — no HTML needed for traceability.
2. **Report second**: static HTML that reads `manifest.json` + parses test file headers (`TEST-P*-*` + `subject_type`) + checks `design/components/README.md` index + `design/workflows/W*.md` → renders `§41 dashboard + §42 sections (Types/Primitives/Components/Compositions/Navigation/Workflows/Evidence/Missing/Failures)` + `§43 component page + §45 workflow page`.
3. **CLI later** (§58): `cruze test {types,primitives,components,navigation,workflows}` / `cruze evidence {component,workflow,suite}` / `cruze report {generate,serve}` / `cruze story scaffold` — all are thin wrappers around `vitest run`, `playwright test`, and manifest generation.

---

## 9. What should not be automated initially (§60)

Do not build in v1: automatic screenshot diff every commit, full visual regression across 84 components, hundreds of auto-generated stories, browser for every unit test, full network simulation, synthetic user DB, AI-generated cases without human-defined contracts. Objective is **traceability**, not volume — pies at §64: stories≠tests≠screenshots≠workflows.

---

## 10. Next immediate actions

1. **Wire P0** — add `TEST-P0-TYPE-*` boundary tests to the 4 lib files + `src/test/fixtures/` (1 day, no browser).
2. **Wire P1** — scaffold `src/components/primitives/__tests__/` per §4.2 matrix + `§5` variations (2 days, `vitest` only).
3. **Rewrite `playwright/tests/screens-evidence.test.ts:132`** — un-skip, update from 5-tab to 3-tab (`APP-NAV-01` CruzeBottomNav), replace `getByText('Favoritos')` with `getByRole('tab', {name: 'Viaje'})` etc., assert bell→Avisos + gear→Settings, fix viewport to `playwright.config.ts:31` (375x667) — then it becomes `TEST-P4-NAV-*`.
4. **Scaffold `TEST-P5-WF-001` (W1)** — derive from `design/workflows/W1-location.md` `W1.1-W1.14` into `playwright/tests/workflows/W1-location.test.ts` with manual fallback assertions (no fake personalization when unknown — `CHECKLISTS.md` §29).
5. **Create `design/TESTING_INTEGRATION_PLAN.md` ↔ `docs/TESTING_TOOLS.md` wiring** — `TESTING_TOOLS.md` §6 immediate: add two lines under §6.0 and §13 (done in this PR — see diff); `design/INTEGRATION_PLAN.md` Addendum already maps Phases 0-10 → this plan §6.

---

## 11. Cross-reference map (keep sweepable)

| Doc | Role | Points to |
|-----|------|-----------|
| `docs/TESTING_TOOLS.md` §§1-64 | Canonical testing architecture | `design/components/README.md`, `design/workflows/W*.md`, `docs/PAGES_WORKFLOWS_REPORT.md`, `design/TESTING_INTEGRATION_PLAN.md` |
| `design/TESTING_INTEGRATION_PLAN.md` (this) | Integration wiring P0-P5 → codebase | `design/components/<ID>`, `design/workflows/W*.md`, `W5_component_level_design_spec.md` §1-2 tokens, `docs/CHECKLISTS.md` §§18-34 |
| `design/INTEGRATION_PLAN.md` Phases 0-14 + Addendum | Delivery sequencing | `design/components/README.md` (84), `design/workflows/W*.md`, `design/TESTING_INTEGRATION_PLAN.md` §6 |
| `docs/PAGES_WORKFLOWS_REPORT.md` §§1-6 | 28 pages × 10 workflows matrix | `design/components/README.md`, `design/workflows/W*.md`, `docs/CHECKLISTS.md` |
| `docs/CHECKLISTS.md` §§18-34 | QA gates | `design/components/<ID>`, `design/workflows/W*.md` (via `design/TESTING_INTEGRATION_PLAN.md` §7) |
| `docs/PHASE-7-QA.md` | Point-in-time snapshot | “See `CHECKLISTS.md` + `TESTING_INTEGRATION_PLAN.md`” banner |
| `design/components/<ID>-<Name>.md` (84) | Per-component source of truth ASCII/tokens/states | `W5_component_level_design_spec.md` §1-2 + workflow ASCII |
| `playwright.config.ts:37` / `apps/web/vitest.config.ts:1` | Tooling | `playwright/tests/*`, `src/**/*.test.{ts,tsx}` |

---

*Plan version: 1.0 — 2026-09-04. Execution starts at §10.1; progress via Testing Report §41 dashboard (once `test-evidence/runs/**/manifest.json` exists).*
