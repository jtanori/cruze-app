# Cruze Domain Component Catalog

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

### Button

| Variant | States |
|---------|--------|
| Primary | Default, Pressed, Disabled, Loading |
| Secondary | Default, Pressed, Disabled |
| Ghost | Default, Pressed, Disabled |
| Destructive | Default, Pressed, Disabled, Loading |

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
| Directory | Empty, Typing, Results, No Results |
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
| Standard | Open, Closed |
| Action | Open, Closed |
| Detail | Open, Closed |

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
