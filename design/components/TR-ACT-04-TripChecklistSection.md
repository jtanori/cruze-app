# TR-ACT-04 — 04
**Version:** 2.0 — 2026-09-11 — Full rewrite for LIVE-01 consumer alignment; data-driven checklist from LiveCrossingSnapshot; props, data source, states, live refresh contract added. If version differs, revisit.

> **Canonical:** `design/workflows/W6-active-trip.md` — source of truth for active trip state. See `design/components/README.md`.

# 30. `TR-ACT-04` --- TripChecklistSection

### ASCII

``` text
┌────────────────────────────────────────────┐
│ ANTES DE CRUZAR                            │
│                                            │
│ ✓ Open           ● checked (success)       │
│ ✓ Updated 12 min ● checked (success)       │
│ ○ Documents      ○ unchecked (muted)       │
│ ○ Restrictions   ○ unchecked (muted)       │
└────────────────────────────────────────────┘
```

### Purpose

Pre-crossing readiness checklist. Derives item statuses from `LiveCrossingSnapshot` (operational status, data freshness) and leaves user-verified items (docs, restrictions) unchecked. Provides at-a-glance confirmation before the user commits to crossing.

### Props

```typescript
interface TripChecklistItem {
  id: string;
  label: string;
  status: "checked" | "warning" | "unchecked";
  detail?: string;
}

interface TripChecklistSectionProps {
  title: string;
  items: TripChecklistItem[];
  className?: string;
}
```

### Data source

| Item ID | Source | Status Logic |
|---------|--------|--------------|
| `operational` | `LiveCrossingSnapshot.status` | `"open"` → checked; `"limited"` → warning; `"closed"` → unchecked |
| `freshness` | `LiveCrossingSnapshot.generatedAt` | < 30 min → checked; 30–60 min → warning; > 60 min → unchecked |
| `docs` | User self-verify | Always unchecked (user must confirm) |
| `restrictions` | User self-verify | Always unchecked (user must confirm) |

The parent component (`trip/page.tsx`) computes item statuses from `LiveCrossingSnapshot` and passes them as props. `TripChecklistSection` is presentation-only.

### Tokens

``` text
Section title:
  Inter 11px / 700 uppercase tracking-wider
  Text Secondary

Checklist item:
  Inter 14px / 400
  Text Primary

Status icons:
  Checked:  CheckCircle — text-success (Cruze Mint)
  Warning:  AlertTriangle — text-warning (Amber)
  Unchecked: Circle — text-muted

Detail text:
  Inter 12px / 400
  Text Secondary

Container:
  bg-surface border border-border rounded-[var(--radius-lg)]
  divide-y divide-border

Row height: 48–56px
```

### States

| State | Visual | When |
|-------|--------|------|
| All checked | All green checkmarks | Crossing open, data fresh, user ready |
| Partial warning | Mix of green/amber | Crossing limited or data aging |
| Partial unchecked | Mix of green/amber/muted | Docs/restrictions not yet verified |

### Composition

``` text
TR-ACT-04 ChecklistSection
 └── TripChecklistItem[] (from parent)
      ├── operational   ← LiveCrossingSnapshot.status
      ├── freshness     ← LiveCrossingSnapshot.generatedAt
      ├── docs          ← user self-verify
      └── restrictions  ← user self-verify
```

### Rules

- Presentation-only: does not fetch or compute statuses itself
- All labels use `useTranslations()` — no hardcoded Spanish
- Conditionally rendered: only when `recommendedCrossing` is non-null
- `detail` field for freshness shows relative time (e.g. "Updated 12 min ago")

### Live refresh contract

- `operational` status updates when `LiveCrossingSnapshot.status` changes
- `freshness` status degrades as `LiveCrossingSnapshot.generatedAt` ages
- No animation on status changes — instant update
- When `LiveCrossingSnapshot` is unavailable, checklist uses `SelectedCrossing` as fallback

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W6-active-trip.md`
- Catalog index: `design/components/README.md`
