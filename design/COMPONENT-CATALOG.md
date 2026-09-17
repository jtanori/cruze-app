# Cruze Domain Component Catalog

> **Source of truth for implementation:** `design/components/<ID>-<Name>.md` (per-component specs) + `design/components/README.md` (index).
> Canonical tokens: `design/workflows/W5_component_level_design_spec.md` §1-2.
> Workflow bindings: `design/workflows/W*.md`.
> Testing: `docs/TESTING_TOOLS.md` P0-P5 → `design/TESTING_INTEGRATION_PLAN.md`.
> Original spec catalogs: `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` §5-10 and `docs/CRUZE — Product, UX & Design System Specification.v1.md` — now **superseded** by the per-component specs for implementation. Refer to original docs only for product rationale.

## 1. Naming Convention

All domain components follow **Domain + Surface + Responsibility** pattern.

```
Domain + Surface + Responsibility
```

### Examples

| Component | Domain | Surface | Responsibility |
|-----------|--------|---------|----------------|
| CrossingListRow | Crossing | List | Row |
| CrossingDetailHero | Crossing | Detail | Hero |
| TripRecommendationPrimaryCard | Trip | Recommendation | Primary Card |
| TripSetupDestinationStep | Trip | Setup | Destination Step |
| AgentCrossingResult | Agent | Crossing | Result |
| AvisoRecommendationChange | Aviso | Recommendation | Change |

### Rules

1. **Never use** ambiguous names: Card, Panel, Box, Item, Widget, Section, ListItem
2. **Always include** the domain it belongs to
3. **Always include** where it is used (surface)
4. **Always include** what it does (responsibility)

---

## 2. UI Primitive Variations

### Button (`src/components/primitives/Button.tsx:7-14` — 5 variants, sizes sm/md/lg/xl per `:48-53`)

| Variant | States |
|---------|--------|
| Primary (hollow-disabled: `disabled:bg-surface-elevated disabled:text-faint disabled:border disabled:border-border disabled:shadow-none` — never bare opacity, `Button.tsx:34-41`) | Default, Pressed, Disabled (hollow), Loading (spinner + sr-only `t("common.loading")`, `Button.tsx:64-88`) |
| Secondary | Default, Pressed, Disabled (`disabled:opacity-50`, `Button.tsx:42`) |
| Ghost | Default, Pressed, Disabled (`disabled:opacity-50`, `Button.tsx:43`) |
| Destructive | Default, Pressed, Disabled (`disabled:opacity-50`), Loading (`Button.tsx:44,64-88`) |
| Outline (5th variant: `border border-border bg-transparent`, `Button.tsx:45`) | Default, Pressed, Disabled (`disabled:opacity-50`) |

### Select (`src/components/primitives/Select.tsx` — native select, no variant prop; `label/error/hint/placeholder/options` per `Select.tsx:13-19`)

| Variant | States |
|---------|--------|
| Standard (h-12, custom chevron bg, `Select.tsx:44-45`) | Default, Focused (`focus:border-cruze-mint` + ring, `:45`), Error (`aria-invalid` + `role="alert"` text, `:59,75-79`), Disabled (`disabled:opacity-50`, `:45,57,61`), With hint (`:80-84`), With placeholder (disabled empty option, `:64-68`), Option-disabled (`:70`) |

### Avatar (`src/components/primitives/Avatar.tsx`)

| Variant | States |
|---------|--------|
| Circle / Square (`shape`, `Avatar.tsx:12,54-57`) × xs / sm / md / lg / xl (`Avatar.tsx:11,31-37`) with status dot online / offline / busy / away (`Avatar.tsx:13,47-52,81-86`) | Image, Initial-fallback (`name` char or `?`, `Avatar.tsx:73-79`), Status-dotted |

### Inline (`src/components/primitives/Inline.tsx` — layout only, no interactive states)

| Variant | States |
|---------|--------|
| gap none / xs / sm / md / lg / xl (`Inline.tsx:8,23-30`); align start / center / end (`:9,32-36`); wrap bool (`:10,41`) | Layout only (DEVIATION flagged: `items-${align}` template literal at `Inline.tsx:41` cannot resolve to a Tailwind class) |

### Stack (`src/components/primitives/Stack.tsx` — layout only, no interactive states)

| Variant | States |
|---------|--------|
| direction vertical / horizontal (`Stack.tsx:8,56`); gap none / xs / sm / md / lg / xl / 2xl / 3xl (`:9,27-36`); align start / center / end / stretch (`:10,38-43`); justify start / center / end / between / around (`:11,45-51`); wrap bool (`:12,56`) | Layout only |

### Section (`src/components/primitives/Section.tsx` — layout only, no interactive states)

| Variant | States |
|---------|--------|
| default (`bg-transparent`) / card (`bg-surface border border-border rounded-lg`) / elevated (`bg-surface-elevated`) / outlined (`bg-surface border border-border`) — `Section.tsx:8,22-27` | padding none / sm / md / lg / xl (`Section.tsx:9,29-35`) |

### IconButton

| Variant | States |
|---------|--------|
| Standard | Default, Pressed, Disabled |
| Compact | Default, Pressed, Disabled |
| Prominent | Default, Pressed, Disabled |

### TextInput

| Variant | States |
|---------|--------|
| Standard | Empty, Focused, Filled, Error, Disabled |
| Search | Empty, Focused, Filled, Error, Disabled |
| Location | Empty, Focused, Filled, Error, Disabled |
| Destination | Empty, Focused, Filled, Error, Disabled |

### SearchInput

| Variant | States |
|---------|--------|
| Directory (h-11, native clear suppressed, custom far-right clear) | Empty, Typing, Results, No Results |
| Destination | Empty, Typing, Results, No Results |

### SegmentedControl

| Variant | States |
|---------|--------|
| Standard | Selected, Unselected, Disabled |
| Filter | Selected, Unselected, Disabled |

### RadioGroup

| Variant | States |
|---------|--------|
| Standard | Selected, Unselected, Error |
| Card Radio | Selected, Unselected, Error |

### Checkbox

| Variant | States |
|---------|--------|
| Standard | Checked, Unchecked, Disabled |
| Checklist | Checked, Unchecked, Disabled, Indeterminate |

### Toggle

| Variant | States |
|---------|--------|
| Standard | On, Off, Disabled |
| Settings | On, Off, Disabled |

### Badge

| Variant | States |
|---------|--------|
| Neutral | Default |
| Recommendation | Default |
| Count | Default |

### StatusBadge

| Variant | States |
|---------|--------|
| Operational | Open |
| Freshness | Limited, Closed, Unknown |

### Banner

| Variant | States |
|---------|--------|
| Informational | Visible, Dismissed |
| Warning | Visible, Dismissed |
| Error | Visible, Dismissed |
| Success | Visible, Dismissed |

### Toast

| Variant | States |
|---------|--------|
| Info | Visible, Auto-hiding, Dismissed |
| Success | Visible, Auto-hiding, Dismissed |
| Warning | Visible, Auto-hiding, Dismissed |
| Error | Visible, Auto-hiding, Dismissed |

### EmptyState

| Variant | States |
|---------|--------|
| Standard | Empty |
| Product-specific | Empty |

### ErrorState

| Variant | States |
|---------|--------|
| Standard | Error |

### Skeleton

| Variant | States |
|---------|--------|
| Text | Loading |
| Card | Loading |
| List | Loading |
| Metric | Loading |

### Spinner

| Variant | States |
|---------|--------|
| Standard | Loading |
| Inline | Loading |
| Page | Loading |

### Divider

| Variant | States |
|---------|--------|
| Standard | Default |
| Section | Default |

### BottomSheet

| Variant | States |
|---------|--------|
| Standard (portal to body, guaranteed width, scroll-lock) | Open, Closed |
| Action | Open, Closed |
| Detail | Open, Closed |
| Footer toolbar (optional fixed slot, e.g. Aplicar; disabled until changed) | Open, Closed |

### Modal

| Variant | States |
|---------|--------|
| Standard | Open, Closed |
| Confirmation | Open, Closed |

### Drawer

| Variant | States |
|---------|--------|
| Left | Open, Closed |
| Right | Open, Closed |

### DataMetric

| Variant | States |
|---------|--------|
| Numeric | Normal, Unavailable |
| Large | Normal, Unavailable |
| Compact | Normal, Unavailable |

### DataMetricPair

| Variant | States |
|---------|--------|
| Default | Normal |

### DataDelta

| Variant | States |
|---------|--------|
| Positive | Normal |
| Negative | Normal |
| Neutral | Normal |

### DataTimestamp

| Variant | States |
|---------|--------|
| Compact | Current, Stale |
| Verbose | Current, Stale |

### DataStatus

| Variant | States |
|---------|--------|
| Operational | All status states |
| Freshness | All status states |

### PageHeader

| Variant | States |
|---------|--------|
| Default | With title, With title + subtitle |

### BackButton

| Variant | States |
|---------|--------|
| Default | Default, Pressed |

### Tab

| Variant | States |
|---------|--------|
| Default | Active, Inactive, Disabled |

---

## 3. State Matrix (12 States)

Every interactive component must support these 12 states:

| State | Description |
|-------|-------------|
| Default | Initial state |
| Hover | Pointer over element |
| Pressed | Active press |
| Focused | Keyboard focus |
| Disabled | Not interactive |
| Loading | Async operation in progress |
| Error | Validation or server error |
| Empty | No data available |
| Partial | Incomplete data |
| Stale | Data outdated |
| Success | Operation completed |
| Warning | Non-critical issue |

### State Color Mapping

| State | Color |
|-------|-------|
| Default | `text-ink` |
| Hover | `text-ink` + `bg-surface-elevated` |
| Pressed | `text-ink` + `bg-surface-elevated` |
| Focused | `ring-cruze-mint/50` |
| Disabled | `opacity-50 cursor-not-allowed` |
| Loading | `animate-pulse` |
| Error | `text-danger` |
| Empty | `text-muted` |
| Partial | `text-warning` |
| Stale | `text-warning` |
| Success | `text-success` |
| Warning | `text-warning` |

---

## 4. Touch Target Compliance

All interactive elements must meet WCAG 2.5.8 minimum:

| Element | Minimum Size |
|---------|--------------|
| Button | 44x44px |
| IconButton | 44x44px |
| Tab | 44x44px |
| Toggle | 44x24px |
| Checkbox | 44x44px |
| Radio | 44x44px |
| List Item | 44px height |

---

## 5. Catalog Index (Generated)

All 116 component spec files live in `design/components/` (107 live, 9 retired: CR-DIR-05, CR-DET-11, CR-CARD-01, AV-CROSS-01, AV-REC-01, AV-TRIP-01, AV-CHECK-01, AV-DATA-01, TR-REC-04) — see [`design/components/README.md`](components/README.md) for the full indexed table (APP 9 / LOC 10 / TR 22 files · 21 live / CR 30 files · 27 live / AG 15 / AV 12 files · 7 live / SET 7 / SPLASH 7 / PWA 1 / LEGAL 1 / PRIV 2).

Each entry in `README.md` links to its `design/components/<ID>-<Name>.md`.

## 6. Integration Plan

See [`design/INTEGRATION_PLAN.md`](../INTEGRATION_PLAN.md) for the phased implementation order, and `design/components/README.md` §How to use for the component → workflow → verification flow.

- **Foundations → Primitives → Domain Components → Screen Compositions → Workflow** (W5 §37).
- Implement per `W5_component_level_design_spec.md` tokens; verify via `design/workflows/W*.md` ASCII + Product spec §36-38 operational vs freshness rule.

