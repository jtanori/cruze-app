# TR-ACT-01 — 01
**Version:** 1.3 — 2026-09-16 — implementation sync; W6 locked; full rewrite: added status badge, crossing status, freshness, props, data source, states, live refresh contract, composition rules. If version differs, revisit. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> **Canonical:** `design/workflows/W6-active-trip.md` — source of truth for active trip state. See `design/components/README.md`.

# 27. `TR-ACT-01` --- TripStatusHeader

### ASCII

``` text
┌────────────────────────────────────────────┐
│ ● ACTIVE                                   │
│                                            │
│ Tijuana → San Diego                        │
│                                            │
│ Open · Updated 12 min ago                  │
└────────────────────────────────────────────┘
```

### Purpose

Top-level frame for the active trip. Establishes trip identity (origin → destination, font-display Sora utility — `font-sora` does not exist, fixed 2026-09-16) and live operational context (crossing status + data freshness). Receives live data during active-trip intelligence updates without duplicating information from TR-ACT-02.

### Props

```typescript
interface TripStatusHeaderProps {
  originLabel: string;
  destinationLabel: string;
  status: "active" | "stale";
  crossingStatus: "open" | "limited" | "closed" | "unknown";
  lastUpdated: string | null;    // ISO timestamp or null
  className?: string;
}
```

### Data source

| Prop | Source | Notes |
|------|--------|-------|
| `originLabel` | `TripState.start` → `getDisplayName()` | Always set when `hasTrip` |
| `destinationLabel` | `TripState.destination` → `getDisplayName()` | Always set when `hasTrip` |
| `status` | Derived from `useTripStaleness()` | `"stale"` when `isStale && showStalePrompt` |
| `crossingStatus` | Prop-driven parent-supplied `CrossingStatus`; component has no store/snapshot import (TripStatusHeader.tsx:8-15,39-46) | Parent resolves live vs fallback; header only renders |
| `lastUpdated` | Prop-driven ISO string or null (TripStatusHeader.tsx:12,44); displayed via getRelativeTime() (TripStatusHeader.tsx:17-23,74-77) | Null hides freshness line |

### Tokens

``` text
Status badge:
  Inter 11px / 700 uppercase tracking-wider
  Active:  Cruze Mint dot + label
  Stale:   Caution dot + label

Trip identity:
  Sora 16px / 700
  Text Primary
  Separator: "→" Inter 14px Text Secondary

Operational context:
  Inter 13px / 400
  Status dot: 8px circle
    Open:     text-success
    Limited:  text-warning
    Closed:   text-error
    Unknown:  text-muted
  Separator: "·" Text Secondary
  Freshness: relative time via getRelativeTime()
```

### States

| State | Badge | Status Dot | Freshness | When |
|-------|-------|------------|-----------|------|
| ACTIVE | ● ACTIVE (Cruze Mint) | Colored by crossingStatus | Relative time shown | Trip in progress, data fresh |
| STALE | ● STALE (Caution) | Colored by crossingStatus | Relative time shown | Data >12h old, stale prompt visible |

COMPLETED is not rendered — the page navigates to `/trip/completion` before this state occurs.

### Composition

``` text
page (space-y-6)
 ├── TripStalePrompt          ← conditional, above header
 ├── TR-ACT-01 StatusHeader   ← this component (always rendered)
 ├── TR-ACT-02 RouteSummary   ← conditional, crossing name + wait + total
 ├── TR-ACT-03 ActionBar      ← action buttons
 └── TR-ACT-04 Checklist      ← pre-crossing checklist
```

The header provides the **frame**. TR-ACT-02 provides the **data detail**. They never duplicate the same information.

### Rules

- Always rendered when `hasTrip` is true
- `status` prop derives from staleness hook, not from the store directly
- `crossingStatus` is prop-driven; component never reads the store (TripStatusHeader.tsx:39-46,68-69) — resolves Data-source vs Rules contradiction toward prop-driven truth
- `lastUpdated` is displayed as relative time: "Updated X min ago" / "Updated X h ago"
- When `lastUpdated` is null, freshness line is hidden (only status dot shown)
- All labels use `useTranslations()` — no hardcoded Spanish

### Live refresh contract

When live intelligence is implemented:

1. **Crossing status changes** → `crossingStatus` prop updates → dot color changes instantly
2. **Freshness degrades** → `lastUpdated` prop updates → relative time updates
3. **Stale detection** → `status` prop flips to `"stale"` → badge changes
4. **No animation** — all updates are instant (no transitions)

The header consumes the same authoritative data source as the rest of the active trip. No second source of truth.

### Responsive

- Container: `px-4 sm:px-5` page inset (inherited from parent)
- No horizontal scroll at any breakpoint
- Single-column layout at all sizes

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W6-active-trip.md`
- Catalog index: `design/components/README.md`
