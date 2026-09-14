# TR-REC-03 — 03
**Version:** 1.2 — 2026-09-08 — T07 locked; alternatives use `RecommendationAlternative[]` with coordinates; "Usar este cruce" calls `setSelectedCrossing` (commitment). If version differs, revisit.

> **Canonical:** `design/workflows/T07-recommendation.md` — source of truth for alternative data. See `design/components/README.md`.

# 25. `TR-REC-03` --- TripAlternativeListSection

### ASCII

``` text
OTRAS OPCIONES

┌──────────────────────────────────────────────┐
│ Otay Mesa                                    │
│ Tijuana ↔ San Diego                    +12→ │
├──────────────────────────────────────────────┤
│ ▼ expanded                                   │
│ 47 min    77 min                             │
│ [ Usar este cruce ]                          │
└──────────────────────────────────────────────┘
```

### Purpose

Shows alternative crossings ranked by the engine. Each alternative can be expanded to view details and selected as the trip crossing.

### Props

```typescript
interface TripAlternativeListSectionProps {
  alternatives: RecommendationAlternative[];
  onSelect?: (crossingId: string) => void;
  className?: string;
}
```

### Data source

Props come from `TripRecommendation.alternatives`:
- `crossingId` ← `alt.crossingId`
- `crossingName` ← `alt.crossingName`
- `mexicanCity` ← `alt.mexicanCity`
- `usCity` ← `alt.usCity`
- `waitTime` ← `alt.waitTime`
- `totalJourneyTime` ← `alt.totalJourneyTime`
- `deltaMinutes` ← `alt.deltaMinutes`
- `status` ← `alt.status`

### Commitment boundary

When "Usar este cruce" is clicked on an alternative:
1. Parent calls `setSelectedCrossing(crossing)` — persists to TripState
2. Parent navigates to `/trip`

This is a commitment — the selected alternative becomes `recommendedCrossing` in the store.

### Tokens

``` text
Heading:    Inter 11px / 700 uppercase
            Text Secondary

Row:
  Surface:  Surface
  Border:   1px Border
  Radius:   12px (var(--radius-lg))

Crossing name:
  Inter 14px / 500
  Text Primary

Cities:
  Inter 11px
  Text Secondary

Delta:
  Inter 11px / 500
  Warning color

Expanded:
  Wait/Total: Sora 18px / 700 tabular
  CTA: h-40px, Surface Elevated, border, rounded-md
```

### Rule

- Delta shows `+N min total` relative to primary
- Expand/collapse per row (single expand at a time)
- "Usar este cruce" on alternative commits that crossing (not the primary)

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/T07-recommendation.md`
- Catalog index: `design/components/README.md`
