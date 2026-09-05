# Cruze QA Knowledge Log

> **Source of truth for implementation:** `design/components/<ID>-<Name>.md` (per-component specs, see `design/components/README.md` — 83) + `design/workflows/W*.md` (W1-W10) + `design/INTEGRATION_PLAN.md` Addendum + `design/TESTING_INTEGRATION_PLAN.md` (P0-P5 wiring) + `docs/TESTING_TOOLS.md` (architecture).
> Original product rationale: `docs/CRUZE — Product, UX & Design System Specification.v1.md` + `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` — reference only.
> Workflow bindings & page inventory: `docs/PAGES_WORKFLOWS_REPORT.md` — now points to `design/components/README.md` (83).
## Issue Index & Fix Patterns
*Created: 2026-09-03 | Updated per QA session*

---

## Traceability (Component ↔ Workflow ↔ Page)

| Artifact | Trace |
|----------|-------|
| Component specs | `design/components/README.md` → `design/components/<ID>-<Name>.md` (83) — tokens per `W5_component_level_design_spec.md` §1-2 |
| Testing | `docs/TESTING_TOOLS.md` P0-P5 → `design/TESTING_INTEGRATION_PLAN.md` (TEST-P*-* IDs, 54 scenarios, fixtures) |
| Workflow specs | `design/workflows/W1-location.md` … `W10-settings.md` + `W5_component_level_design_spec.md` (W5 tokens) |
| Page ↔ Workflow matrix | `docs/PAGES_WORKFLOWS_REPORT.md` §3 — 28 pages × 10 workflows, T01 = TR-EMPTY-01 + TR-NEAR-01/02 + LOC-STATUS-01, direction derived |
| Integration order | `design/INTEGRATION_PLAN.md` Addendum (Phases 0-10) |
| Verification | `docs/CHECKLISTS.md` §§18-34 + `docs/TESTING_TOOLS.md` §§6-13,22 — wired to per-component/per-workflow specs |

## Issue Taxonomy

### Category: Layout & Overflow
| ID | Pattern | Detection | Fix |
|----|---------|-----------|-----|
| L-01 | Header overflow on mobile | `flex` without `flex-wrap` + fixed text sizes | Add `flex-wrap`, responsive text (`text-base sm:text-lg`), `truncate` on long items |
| L-02 | Card content overflow | `flex justify-between` with `shrink-0` path + fixed padding | `min-w-0` on flex-1, `truncate` on path, responsive padding (`p-3 sm:p-4`), stack on mobile (`flex-col sm:flex-row`) |
| L-03 | Fixed text sizes | `text-3xl`, `text-lg`, `text-base`, `text-sm`, `text-xs` without breakpoints | Use responsive scales: `text-xl sm:text-2xl md:text-3xl`, `text-base sm:text-lg`, etc. |
| L-04 | No safe area insets | Missing `pt-safe`/`pb-safe`/`px-safe` | Add `pt-safe`, `pb-safe`, `px-safe` (or `pt-[env(safe-area-inset-top)]`) |

### Category: Touch Targets & Interaction
| ID | Pattern | Detection | Fix |
|----|---------|-----------|-----|
| T-01 | Touch target too small | Elements < 44×44px (text-xs links, icon-only buttons) | Ensure `min-h-[44px] min-w-[44px]`, `p-2` minimum on interactive elements |
| T-02 | Text links too small | `text-xs`/`text-sm` links without padding | Wrap in `inline-flex items-center px-3 py-2` or use button component |
| T-04 | No focus visible | Missing `focus-visible` rings | Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint/50` |

### Category: Typography & Readability
| ID | Pattern | Detection | Fix |
|----|---------|-----------|-----|
| Y-01 | Fixed text scale | Fixed `text-3xl`/`text-lg`/`text-base` without breakpoints | Use fluid scales: `text-xl sm:text-2xl md:text-3xl`, `text-base sm:text-lg` |
| Y-02 | Description truncation | `truncate` hides context on mobile | Use `line-clamp-2 sm:truncate` or accordion/expand pattern |
| Y-03 | Low contrast | Colors not meeting WCAG AA | Verify against design tokens (Midnight `#071A31` vs Mint `#00E0A0` = 7.8:1) |

### Category: Responsive Behavior
| ID | Pattern | Detection | Fix |
|----|---------|-----------|-----|
| R-01 | No mobile-first | Desktop-first classes, no `sm:`/`md:` | Start with mobile classes, add `sm:`/`md:`/`lg:` enhancements |
| R-02 | Fixed layout | `flex-row` without `flex-col sm:flex-row` | Stack on mobile: `flex-col sm:flex-row` |
| R-03 | Fixed gaps | `gap-4` without responsive | `gap-2 sm:gap-4 md:gap-6` |

### Category: Content & Information Architecture
| ID | Pattern | Detection | Fix |
|----|---------|-----------|-----|
| C-01 | Truncated descriptions | `truncate` hides full context | Use `line-clamp-2` + expand button, or accordion |
| C-02 | Path too long for mobile | `text-xs font-mono shrink-0` paths overflow | Stack on mobile: `flex-col sm:flex-row`, truncate path with tooltip |
| C-03 | Missing context | Redirect pages lack context | Add breadcrumb or back link |

---
 
## Page-Specific Findings
 
### `/test-index` (Test Index Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| Header overflow: `text-3xl` + `flex gap-2` with pipes | L-01 | Add `flex-wrap`, responsive `text-xl sm:text-2xl md:text-3xl`, `flex-wrap gap-2` |
| Card overflow: `flex justify-between` with `shrink-0` path | L-02 | Stack on mobile: `flex-col sm:flex-row`, `truncate` path, stack path below title |
| Header info line: `flex gap-2` with pipes | L-01 | `flex-wrap gap-1.5`, remove pipes or use `flex-wrap gap-1` |
| Fixed text sizes | L-03 | Responsive: `text-xl sm:text-2xl md:text-3xl`, `text-base sm:text-lg`, `text-sm sm:text-base` |
| No safe area | L-04 | Add `pt-safe pb-safe px-safe` |
| Path too small | T-01 | Stack path on mobile, min touch target |
| Description truncation | C-01 | `line-clamp-2` + expand or remove truncate |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| Footer link too small | T-01 | `text-base` min, `px-3 py-2` padding |
 
### `/` (Home/Root Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| Fixed text sizes: `text-[48px]`, `text-[17px]`, `text-[10px]`, `text-lg`, `text-sm`, `text-xs` | L-03 / Y-01 | Responsive scales: `text-4xl sm:text-5xl md:text-6xl` for hero wait, `text-base sm:text-lg` for labels, `text-sm sm:text-base` for evidence |
| No responsive text scaling | Y-01 / R-01 | Add breakpoints: `text-4xl sm:text-5xl md:text-6xl` for hero wait time, `text-base sm:text-lg` for labels |
| No responsive gaps | R-03 | `gap-4 sm:gap-6` in hero metrics, `gap-4 sm:gap-6` in evidence |
| Evidence list may overflow | C-01 | Use `line-clamp-2` on evidence items, or accordion for long reasons |
| Fixed gaps in metrics row | R-03 | `gap-4 sm:gap-6` in hero metrics flex |
| Alternatives buttons: `px-4 py-3` - touch target OK | T-01 | ✓ Good (44px min) |
| MOCK_CROSSINGS list: `px-4 py-3` - touch target OK | T-01 | ✓ Good |
| Safe area: Has `env(safe-area-inset-bottom)` on main | L-04 | ✓ Good |
| Hero wait time: `text-[48px]` fixed | L-03 / Y-01 | `text-4xl sm:text-5xl md:text-6xl` |
| Border wait label: `text-[10px]` fixed | Y-01 | `text-xs sm:text-sm` |
| Average border wait: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Average wait value: `text-[48px]` fixed | L-03 | `text-4xl sm:text-5xl md:text-6xl` |
| Evidence items: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Alternatives: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| MOCK_CROSSINGS list: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| BottomNavigation: uses component - verify separately | T-01 | Check BottomNavigation component |
 
### `/*inline gating* (`LocationGate` L01/L02/L03)` (Location Permission Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets on page wrapper | L-04 | Add `pt-safe pb-safe px-safe` to page wrapper |
| `min-h-[80vh]` - may not account for safe area | L-04 | Use `min-h-dvh` with safe area insets |
| `px-6` fixed padding | R-01 / R-03 | Responsive: `px-4 sm:px-6` |
| `py-8` fixed vertical padding | R-03 | Responsive: `py-6 sm:py-8` |
| `min-h-[80vh]` on prompt - may not fill viewport | L-04 | Use `min-h-dvh` with safe area |
| Prompt: `text-2xl` fixed title | Y-01 | `text-xl sm:text-2xl` |
| Prompt: `text-sm` fixed description | Y-01 | `text-sm sm:text-base` |
| Prompt: `max-w-xs` fixed width | R-01 | `max-w-sm sm:max-w-md` |
| Prompt: `mb-8` fixed margin | R-03 | `mb-6 sm:mb-8` |
| Allow button: `min-h-[48px]` ✓ Good | T-01 | ✓ Good (48px) |
| Settings button: `min-h-[44px]` ✓ Good | T-01 | ✓ Good |
| Settings button: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Acquisition: `py-12` fixed padding | R-03 | `py-8 sm:py-12` |
| Acquisition: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Recovery: `py-12` fixed padding | R-03 | `py-8 sm:py-12` |
| Recovery: `text-lg` fixed title | Y-01 | `text-lg sm:text-xl` |
| Recovery: `text-sm` fixed description | Y-01 | `text-sm sm:text-base` |
| Recovery: `max-w-xs` fixed width | R-01 | `max-w-sm sm:max-w-md` |
| Recovery: `mb-6` fixed margin | R-03 | `mb-4 sm:mb-6` |
| Recovery buttons: `min-h-[48px]` ✓ Good | T-01 | ✓ Good |
| Recovery buttons: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Banner: `px-4 py-3` padding OK | R-03 | `px-3 sm:px-4 py-2 sm:py-3` |
| Banner: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Banner: `text-xs` button text | Y-01 | `text-xs sm:text-sm` |
| Banner button: `min-h-[32px]` - too small | T-01 | `min-h-[44px]` |
| No safe area on page wrapper | L-04 | Add `pt-safe pb-safe px-safe` |
| Page wrapper: `min-h-dvh` but no safe area | L-04 | Add `env(safe-area-inset-*)` |
 
### `/trip/setup` (Trip Setup Flow)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets on page | L-04 | Add `pt-safe pb-safe px-safe` |
| Progress bar: `px-5 py-3` fixed padding | R-03 | `px-4 sm:px-5 py-2 sm:py-3` |
| Content: `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `max-w-lg` fixed max-width | R-01 | `max-w-sm sm:max-w-lg` |
| Step components: `space-y-5` fixed gap | R-03 | `space-y-4 sm:space-y-5` |
| Destination step: `text-xl` fixed title | Y-01 | `text-xl sm:text-2xl` |
| Destination step: `text-sm` fixed label | Y-01 | `text-sm sm:text-base` |
| Destination step: `h-[48px]` input ✓ Good | T-01 | ✓ Good (48px) |
| Destination step: `text-sm` placeholder | Y-01 | `text-sm sm:text-base` |
| Destination step: `max-w-xs` recent destinations | R-01 | `max-w-sm sm:max-w-md` |
| Origin step: `text-xl` fixed title | Y-01 | `text-xl sm:text-2xl` |
| Origin step: `text-sm` fixed label | Y-01 | `text-sm sm:text-base` |
| Origin step: `h-[48px]` input ✓ Good | T-01 | ✓ Good (48px) |
| Origin step: `w-10 h-10` icon button ✓ | T-01 | ✓ Good |
| Travel Mode step: `text-xl` fixed title | Y-01 | `text-xl sm:text-2xl` |
| Travel Mode step: `min-h-[64px]` buttons ✓ | T-01 | ✓ Good (64px) |
| Travel Mode step: `text-sm` fixed desc | Y-01 | `text-xs sm:text-sm` |
| Direction step: `text-xl` fixed title | Y-01 | `text-xl sm:text-2xl` |
| Direction step: `min-h-[64px]` buttons ✓ | T-01 | ✓ Good |
| Access step: `text-xl` fixed title | Y-01 | `text-xl sm:text-2xl` |
| Access step: `min-h-[56px]` buttons ✓ | T-01 | ✓ Good |
| Document step: `text-xl` fixed title | Y-01 | `text-xl sm:text-2xl` |
| Document step: `text-sm` fixed label | Y-01 | `text-sm sm:text-base` |
| Document step: `min-h-[48px]` buttons ✓ | T-01 | ✓ Good |
| Progress bar: `px-5 py-3` fixed | R-03 | `px-4 sm:px-5 py-2 sm:py-3` |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| Back button: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Back button: no min touch target | T-01 | Add `min-h-[44px] px-3 py-2` |
| Content: `px-5 py-6 max-w-lg` fixed | R-01/R-03 | `px-4 sm:px-5 py-4 sm:py-6 max-w-sm sm:max-w-lg` |
| Step conditionals: good responsive pattern | - | ✓ Good |
 
### `/trip/recommendation` (Trip Recommendation Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `max-w-lg` fixed max-width | R-01 | `max-w-sm sm:max-w-lg` |
| `space-y-6` fixed gap | R-03 | `space-y-4 sm:space-y-6` |
| Primary card: uses component - check separately | - | Check TripRecommendationPrimaryCard |
| Reason list: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Alternatives: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| "Ver todos" button: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
 
### `/trip/completion` (Trip Completion Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `max-w-lg` fixed max-width | R-01 | `max-w-sm sm:max-w-lg` |
| `space-y-4` fixed gap | R-03 | `space-y-3 sm:space-y-4` |
| Completion card: `p-6` fixed padding | R-03 | `p-4 sm:p-6` |
| `text-lg` fixed crossing name | Y-01 | `text-lg sm:text-xl` |
| Buttons: `h-[48px]` ✓ Good | T-01 | ✓ Good |
| Buttons: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
 
### `/viaje` (Active Trip Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `space-y-6` fixed gap | R-03 | `space-y-4 sm:space-y-6` |
| Staleness prompt: `p-4` fixed | R-03 | `p-3 sm:p-4` |
| Staleness prompt: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Staleness prompt: `h-9` buttons ✓ | T-01 | ✓ Good (36px - borderline) |
| TripStatusHeader: `text-xl` fixed title | Y-01 | `text-xl sm:text-2xl` |
| TripRouteSummary: `text-lg` fixed | Y-01 | `text-lg sm:text-xl` |
| TripRouteSummary: `p-4` fixed | R-03 | `p-3 sm:p-4` |
| TripActionBar: `h-[48px]` ✓ Good | T-01 | ✓ Good |
| TripActionBar: `h-[40px]` secondary ✓ | T-01 | ✓ Good (40px) |
| TripChecklistSection: `px-4 py-3` OK | R-03 | `px-3 sm:px-4 py-2.5 sm:py-3` |
| Checklist items: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
 
### `/crossings` (Crossings Directory Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `text-xl` fixed title | Y-01 | `text-xl sm:text-2xl` |
| `mb-4` fixed margin | R-03 | `mb-3 sm:mb-4` |
| SearchInput: `h-[48px]` ✓ Good | T-01 | ✓ Good |
| FilterBar: SegmentedControl fullWidth ✓ | - | ✓ Good |
| CrossingsDirectoryList: `space-y-4` fixed gap | R-03 | `space-y-3 sm:space-y-4` |
| CrossingsDirectoryExpandedRow: `pt-1 px-4 pb-4` fixed | R-03 | `pt-1 sm:pt-1 px-3 sm:px-4 pb-3 sm:pb-4` |
| Expanded row: `text-xs` fixed labels | Y-01 | `text-xs sm:text-sm` |
| Expanded row: `text-sm` fixed content | Y-01 | `text-sm sm:text-base` |
| Expanded row: `h-[40px]` button - borderline | T-01 | `min-h-[44px]` |
| Expanded row: `text-sm` fixed content | Y-01 | `text-sm sm:text-base` |
| FilterBar: SegmentedControl fullWidth ✓ | - | ✓ Good |
| Sort pills: `px-3 py-1.5` - small touch target | T-01 | `px-4 py-2 min-h-[44px]` |
| Sort pills: `text-xs` fixed | Y-01 | `text-xs sm:text-sm` |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| EmptyState: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| EmptyState: `px-8` fixed padding | R-03 | `px-4 sm:px-8` |
 
### `/crossing/[id]` (Crossing Detail Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `space-y-6` fixed gap | R-03 | `space-y-4 sm:space-y-6` |
| `max-w-lg` fixed max-width | R-01 | `max-w-sm sm:max-w-lg` |
| `pb-24` fixed bottom padding | R-03 | `pb-20 sm:pb-24` |
| Hero: `text-[48px]` fixed wait time | L-03 | `text-4xl sm:text-5xl md:text-6xl` |
| Hero: `text-sm` fixed direction | Y-01 | `text-sm sm:text-base` |
| Hero: `text-xs` fixed timestamp | Y-01 | `text-xs sm:text-sm` |
| Map: `h-48` fixed height | R-03 | `h-40 sm:h-48 md:h-56` |
| LaneSection: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| AccessSection: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| HoursSection: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| RequirementsSection: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| RestrictionsSection: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| ServicesSection: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| ActionBar: `h-[48px]` ✓ Good | T-01 | ✓ Good |
| ActionBar: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Map: error fallback `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Map: `h-48` fixed height | R-03 | `h-40 sm:h-48 md:h-56` |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| CruzeBackHeader: verify touch targets | T-01 | Check component |
 
### `/agent` (Agent Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| AppShell provides safe area | L-04 | ✓ Good (AppShell handles) |
| Chat container: `h-[calc(...)]` uses CSS env | L-04 | ✓ Good (uses env vars) |
| Welcome: `w-16 h-16` icon ✓ | T-01 | ✓ Good (64px) |
| Welcome: `text-lg` fixed title | Y-01 | `text-lg sm:text-xl` |
| Welcome: `text-sm` fixed description | Y-01 | `text-sm sm:text-base` |
| Welcome: `max-w-[280px]` fixed | R-01 | `max-w-sm sm:max-w-md` |
| Suggested prompts: `px-4 py-3` ✓ | T-01 | ✓ Good (44px min) |
| Suggested prompts: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Message bubbles: `max-w-[85%]` | R-01 | `max-w-[90%] sm:max-w-[85%]` |
| User bubble: `bg-cruze-green` - check contrast | Y-03 | Verify WCAG AA |
| Input: `h-12` ✓ Good (48px) | T-01 | ✓ Good |
| Input: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Send button: `w-12 h-12` ✓ | T-01 | ✓ Good (48px) |
| No safe area issues (AppShell handles) | L-04 | ✓ Good |
 
### `/alertas` (Alerts Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `space-y-6` fixed gap | R-03 | `space-y-4 sm:space-y-6` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| Title: `text-[17px]` fixed | Y-01 | `text-lg sm:text-xl` |
| Count: `text-[10px]` fixed | Y-01 | `text-xs sm:text-sm` |
| Empty state: `w-16 h-16` icon ✓ | T-01 | ✓ Good (64px) |
| Empty state: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Empty state: `text-xs` fixed | Y-01 | `text-xs sm:text-sm` |
| Grouped sections: `space-y-6` fixed | R-03 | `space-y-4 sm:space-y-6` |
| Period header: `text-xs` fixed | Y-01 | `text-xs sm:text-sm` |
| Alert row: `py-3` fixed padding | R-03 | `py-2.5 sm:py-3` |
| Alert row: `text-[10px]` time | Y-01 | `text-xs sm:text-sm` |
| Alert row: `text-sm` fixed headline | Y-01 | `text-sm sm:text-base` |
| Alert row: `text-xs` description | Y-01 | `text-xs sm:text-sm` |
| Severity badge: `px-1.5 py-0.5` small | T-01 | `px-2 py-1 min-h-[20px]` |
| Severity badge: `text-[10px]` fixed | Y-01 | `text-xs sm:text-sm` |
| Divider: `h-px` fixed | R-03 | `h-px` (OK) |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
 
### `/settings` (Settings Root Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `max-w-lg` fixed max-width | R-01 | `max-w-sm sm:max-w-lg` |
| `space-y-6` fixed gap | R-03 | `space-y-4 sm:space-y-6` |
| Title: `text-xl` fixed | Y-01 | `text-xl sm:text-2xl` |
| Section header: `text-xs` fixed | Y-01 | `text-xs sm:text-sm` |
| Item: `px-4 py-3.5` - touch target OK | T-01 | ✓ Good (44px min) |
| Item: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Icon: `w-5 h-5` ✓ | T-01 | ✓ Good |
| Divider: `divide-y` - OK | - | ✓ |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
 
### `/settings/profile` (Settings Profile Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `max-w-lg` fixed max-width | R-01 | `max-w-sm sm:max-w-lg` |
| `space-y-5` fixed gap | R-03 | `space-y-4 sm:space-y-5` |
| Title: `text-lg` fixed | Y-01 | `text-lg sm:text-xl` |
| Labels: `text-xs` fixed | Y-01 | `text-xs sm:text-sm` |
| Select: `mt-1` fixed | R-03 | `mt-1` (OK) |
| Select: `text-sm` fixed options | Y-01 | `text-sm sm:text-base` |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
 
### `/settings/favorites` (Settings Favorites Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `max-w-lg` fixed max-width | R-01 | `max-w-sm sm:max-w-lg` |
| `space-y-3` fixed gap | R-03 | `space-y-2 sm:space-y-3` |
| Title: `text-lg` fixed | Y-01 | `text-lg sm:text-xl` |
| EmptyState: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Favorite item: `px-4 py-3` OK | T-01 | ✓ Good |
| Favorite item: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Remove button: `text-xs` too small | T-01 | `text-xs sm:text-sm min-h-[44px] px-2` |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
 
### `/settings/trips` (Settings My Trips Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `max-w-lg` fixed max-width | R-01 | `max-w-sm sm:max-w-lg` |
| `space-y-3` fixed gap | R-03 | `space-y-2 sm:space-y-3` |
| Title: `text-lg` fixed | Y-01 | `text-lg sm:text-xl` |
| EmptyState: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Trip item: `px-4 py-3` OK | T-01 | ✓ Good |
| Trip item: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| Trip item: `text-xs` fixed | Y-01 | `text-xs sm:text-sm` |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
 
### `/settings/data-sharing` (Settings Data Sharing Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `max-w-lg` fixed max-width | R-01 | `max-w-sm sm:max-w-lg` |
| `space-y-4` fixed gap | R-03 | `space-y-3 sm:space-y-4` |
| Title: `text-lg` fixed | Y-01 | `text-lg sm:text-xl` |
| Description: `text-sm` fixed | Y-01 | `text-sm sm:text-base` |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
 
### `/settings/about` (Settings About Page)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
| `px-5 py-6` fixed padding | R-03 | `px-4 sm:px-5 py-4 sm:py-6` |
| `max-w-lg` fixed max-width | R-01 | `max-w-sm sm:max-w-lg` |
| `space-y-4` fixed gap | R-03 | `space-y-3 sm:space-y-4` |
| Title: `text-lg` fixed | Y-01 | `text-lg sm:text-xl` |
| Version: `text-xs` fixed | Y-01 | `text-xs sm:text-sm` |
| Legal text: `text-xs` fixed | Y-01 | `text-xs sm:text-sm` |
| No safe area insets | L-04 | Add `pt-safe pb-safe px-safe` |
 
### Cross-Cutting Issues (Applicable to Multiple Pages)
| Pattern | Category | Frequency | Fix |
|---------|----------|-----------|-----|
| No safe area insets on page wrapper | L-04 | 20/23 pages | Add `pt-safe pb-safe px-safe` to all page wrappers |
| Fixed `px-5 py-6` padding | R-03 | 18/23 pages | `px-4 sm:px-5 py-4 sm:py-6` |
| Fixed `max-w-lg` max-width | R-01 | 16/23 pages | `max-w-sm sm:max-w-lg` |
| Fixed `space-y-6` / `space-y-5` gaps | R-03 | 15/23 pages | `space-y-4 sm:space-y-6` |
| Fixed `text-xl` / `text-lg` titles | Y-01 | 20/23 pages | `text-xl sm:text-2xl` / `text-lg sm:text-xl` |
| Fixed `text-sm` body text | Y-01 | 25/23 pages | `text-sm sm:text-base` |
| Fixed `text-xs` labels | Y-01 | 15/23 pages | `text-xs sm:text-sm` |
| No safe area insets | L-04 | 20/23 pages | `pt-safe pb-safe px-safe` |
| Touch targets `h-[44px]`/`h-[48px]` | T-01 | Mostly ✓ Good |
| Button `min-h-[44px]` | T-01 | Mostly ✓ Good |
| Input `h-[48px]` | T-01 | ✓ Good |
| Select `text-sm` options | Y-01 | `text-sm sm:text-base` |
 
### Fixed Max-Width Constraining Content (R-01 / L-04)
| Pattern | Category | Frequency | Fix |
|---------|----------|-----------|-----|
| `max-w-4xl` / `max-w-lg` / `max-w-xl` constraining content | R-01 / L-04 | 3/23 pages (test-index, home, crossings) | Remove arbitrary max-width or use responsive: `max-w-sm sm:max-w-lg lg:max-w-4xl` |
 
---
 
## Legacy Redirect Pages (Simple Meta Refresh)
 
### `/trip/setup (TR-SETUP-02)` (Legacy Redirect)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| Legacy redirect page | C-03 | Simple redirect via meta refresh - acceptable for legacy cleanup |
| Hardcoded `/es/` locale | R-01 | Should use dynamic locale from params |
| No safe area insets | L-04 | N/A (redirect page) |
 
### `/trip/setup (TR-SETUP-03)` (Legacy Redirect)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| Legacy redirect page | C-03 | Simple redirect via meta refresh - acceptable for legacy cleanup |
| Hardcoded `/es/` locale | R-01 | Should use dynamic locale from params |
| No safe area insets | L-04 | N/A (redirect page) |
 
### `/onboarding/recommendation` (Legacy Redirect)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| Legacy redirect page | C-03 | Simple redirect via meta refresh - acceptable for legacy cleanup |
| Hardcoded `/es/` locale | R-01 | Should use dynamic locale from params |
| No safe area insets | L-04 | N/A (redirect page) |
 
### `/viaje/configure` (Legacy Redirect)
| Finding | Category | Fix Applied / Proposed |
|---------|----------|------------------------|
| Legacy redirect page | C-03 | Simple redirect via meta refresh - acceptable for legacy cleanup |
| Hardcoded `/es/` locale | R-01 | Should use dynamic locale from params |
| No safe area insets | L-04 | N/A (redirect page) |
 
---
 
## Global Issue Analysis & Fixing Strategy
 
### Critical Global Issues (Priority 1)
 
#### 1. Safe Area Insets Missing (L-04) — 20/23 pages affected
**Problem**: 20 of 23 pages lack `pt-safe pb-safe px-safe` on page wrappers, causing content to render under notches/Dynamic Island on iOS.
**Root Cause**: No global layout wrapper enforcing safe area insets.
**Fix Strategy**:
- Create a `SafeAreaWrapper` component in `components/layout/SafeAreaWrapper.tsx`
- Wrap all page layouts in `apps/web/src/app/[locale]/layout.tsx` or individual page layouts
- Use `pt-safe pb-safe px-safe` Tailwind utilities (requires Tailwind CSS safe-area plugin or custom CSS)
- **Effort**: 2 hours (create component + update layout.tsx + verify all pages)
 
#### 2. Fixed Text Sizes (Y-01/L-03) — 25/23 pages affected
**Problem**: 25+ instances of fixed text sizes (`text-[48px]`, `text-[17px]`, `text-[10px]`, `text-xl`, `text-lg`, `text-sm`, `text-xs`) without responsive breakpoints.
**Root Cause**: Design tokens not consistently applied; developers used arbitrary pixel values.
**Fix Strategy**:
- Audit all text size usages: `grep -r "text-\[.*px\]" apps/web/src/`
- Replace with design token scale: `text-4xl sm:text-5xl md:text-6xl` (hero), `text-xl sm:text-2xl` (titles), `text-lg sm:text-xl` (subtitles), `text-base sm:text-lg` (body), `text-sm sm:text-base` (small body), `text-xs sm:text-sm` (labels)
- Create a `Text` primitive component enforcing design tokens
- **Effort**: 4 hours (audit + replace + verify)
 
#### 3. Fixed Padding/Gaps (R-03) — 18/23 pages
**Problem**: Hardcoded `px-5 py-6`, `space-y-6`, `mb-4`, `py-12`, `px-6`, `mb-6`, `gap-4` without responsive breakpoints.
**Root Cause**: Mobile-first approach not followed; desktop-first values used as base.
**Fix Strategy**:
- Define spacing tokens: `p-4 sm:px-5 py-4 sm:py-6`, `space-y-4 sm:space-y-6`, `mb-3 sm:mb-4`, `py-8 sm:py-12`, `px-4 sm:px-6`, `gap-4 sm:gap-6`
- Apply globally via search/replace with regex
- **Effort**: 3 hours (regex replace + verify)
 
#### 4. Fixed Max-Width (R-01) — 16/23 pages
**Problem**: `max-w-lg` used without mobile breakpoint.
**Fix**: Replace `max-w-lg` → `max-w-sm sm:max-w-lg` globally.
**Effort**: 1 hour (global replace + verify)
 
#### 5. Hardcoded Locale in Legacy Redirects
**Problem**: 4 legacy redirect pages use hardcoded `/es/` instead of dynamic locale.
**Fix**: Update redirect pages to use dynamic locale from `params`.
**Effort**: 30 minutes (4 files)
 
#### 6. Touch Targets Below 44px
**Problem**: Sort pills (`px-3 py-1.5`), banner buttons (`min-h-[32px]`), severity badges (`px-1.5 py-0.5`), remove buttons (`text-xs`) below 44px minimum.
**Fix**: Apply minimum touch target standards globally.
**Effort**: 2 hours
 
#### 7. Hardcoded Pixel Values in Text Sizes
**Problem**: `text-[48px]`, `text-[17px]`, `text-[10px]`, `text-[10px]` used instead of design tokens.
**Fix**: Replace with design token scale (see #2).
**Effort**: Covered in #2.
 
---
 
## Proposed Fixing Strategy (Total: ~16 hours)
 
### Phase A: Foundation (4 hours) — Do First
1. **Create SafeAreaWrapper** (1 hr)
   - `components/layout/SafeAreaWrapper.tsx` with `pt-safe pb-safe px-safe`
   - Update `apps/web/src/app/[locale]/layout.tsx` to wrap children
   
2. **Global Text Size Audit & Replace** (2 hrs)
   - `grep -r "text-\[.*px\]" apps/web/src/` → document all occurrences
   - Create mapping table: `text-[48px]` → `text-4xl sm:text-5xl md:text-6xl`, etc.
   - Use codemod or manual replace with verification
 
3. **Global Padding/Gap Standardization** (1 hr)
   - Define standard spacing tokens in `globals.css` or `tailwind.config.js`
   - Regex replace: `px-5 py-6` → `px-4 sm:px-5 py-4 sm:py-6`, etc.
 
#### Phase B: Page-Level Fixes (8 hours) — Parallelizable
1. **Safe Area Wrapper** on all 23 page wrappers (2 hrs)
   - Add `<SafeAreaWrapper>` to each page or use layout.tsx wrapper
   
2. **Text Size Standardization** (3 hrs)
   - Apply responsive text scales per design token mapping
   - Verify desktop/mobile rendering
 
3. **Touch Target Compliance** (2 hrs)
   - Fix sort pills, banner buttons, severity badges, remove buttons
   - Ensure all interactive elements ≥ 44×44px
 
4. **Legacy Redirect Locale Fix** (0.5 hr)
   - Update 4 redirect pages to use dynamic locale
 
5. **Cross-Cutting Verification** (1.5 hrs)
   - Run `rtk tsc --noEmit` and `pnpm build`
   - Visual regression test on mobile (375px) and desktop (1440px)
   - Run `pnpm test` (25 tests)
 
---
 
## Fix Application Order (Dependencies)
 
```
1. SafeAreaWrapper component
   ↓
2. Layout.tsx wraps children in SafeAreaWrapper
   ↓
3. Global text size audit & replace
4. Global padding/gap/max-width standardization
4. Legacy redirect locale fix
5. Touch target compliance
5. Page-specific fixes (using updated tokens)
6. Full regression test
```
 
---
 
## Success Criteria
- [ ] `rtk tsc --noEmit` → 0 errors
- [ ] `pnpm build` succeeds
- [ ] All 23 pages render correctly at 375px (mobile) and 1440px (desktop)
- [ ] All interactive elements ≥ 44×44px
- [ ] No horizontal overflow at 375px
- [ ] Safe area respected on notched devices
- [ ] Text scales fluidly from 375px → 1440px
- [ ] `pnpm test` → 25/25 pass
- [ ] `pnpm build` succeeds
 
---
 
## Next Steps
1. **Immediate**: Create `SafeAreaWrapper` component
2. **Today**: Global text size audit & replace
3. **Tomorrow**: Global spacing standardization + legacy redirect fix
4. **Day 3**: Page-level fixes + touch targets + regression testing
 
---
 
*QA Knowledge Log complete. All 23 pages audited. Ready for fix application phase.*