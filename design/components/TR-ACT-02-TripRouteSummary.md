# TR-ACT-02 — 02
**Version:** 1.3 — 2026-09-11 — LIVE-01 consumer alignment; `waitTime` primary source is `LiveCrossingSnapshot`; `totalTime` remains frozen from `SelectedCrossing`; live refresh contract added. If version differs, revisit.

> **Canonical:** `design/workflows/W6-active-trip.md` — source of truth for active trip state. See `design/components/README.md`.

# 28. `TR-ACT-02` --- TripRouteSummary

### ASCII

``` text
CRUCE RECOMENDADO

San Ysidro
35 min espera · 65 min total
```

### Purpose

Compact summary of the selected crossing during an active trip. Shows crossing name, live wait time, and total journey time. `waitTime` updates from live crossing intelligence; `totalTime` is frozen from the committed selection.

### Props

```typescript
interface TripRouteSummaryProps {
  crossingName: string;
  waitTime: number;
  totalTime: number;
  className?: string;
}
```

### Data source

| Prop | Primary Source | Fallback | Notes |
|------|---------------|----------|-------|
| `crossingName` | `SelectedCrossing.crossingName` | — | Never changes (committed context) |
| `waitTime` | `LiveCrossingSnapshot.waitTime` | `SelectedCrossing.waitTime` | Updated by live refresh via `useLiveCrossingSnapshot` |
| `totalTime` | `SelectedCrossing.totalJourneyTime` | — | Frozen; never live-refreshed (LIVE-01 invariant #11) |

### Tokens

``` text
Section title:
  Inter 11px / 700 uppercase
  Text Secondary

Crossing name:
  Sora 16px / 600
  Text Primary

Metrics:
  Sora 16px / 700 tabular
  Text Primary
  Separator: "·" Text Secondary
```

### Rule

- Conditionally rendered: only when `recommendedCrossing` is non-null
- Wait and total use `formatDuration()` from `@/lib/display`
- Section title uses `useTranslations()` via `t("trip.routeSummary.title")`

### Live refresh contract

- `waitTime` updates when `LiveCrossingSnapshot` changes (same cadence as TR-ACT-01 status)
- `totalTime` never updates — it reflects the journey estimate at selection time
- No animation on wait time changes — instant update
- When `LiveCrossingSnapshot` is unavailable, falls back to `SelectedCrossing.waitTime`

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W6-active-trip.md`
- Catalog index: `design/components/README.md`
