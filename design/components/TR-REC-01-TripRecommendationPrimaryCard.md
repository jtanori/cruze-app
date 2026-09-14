# TR-REC-01 — 01
**Version:** 1.2 — 2026-09-08 — T07 locked; consumes `TripRecommendation.primary`; displays crossing name, cities, wait/total, status, rank badge, freshness. If version differs, revisit.

> **Canonical:** `design/workflows/T07-recommendation.md` — source of truth for data contract. See `design/components/README.md`.

# 23. `TR-REC-01` --- TripRecommendationPrimaryCard

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ MEJOR CRUCE PARA TU VIAJE                    │
│                                              │
│ San Ysidro                                   │
│ Tijuana, MX ↔ San Diego, US                  │
│                                              │
│ ● Abierto          Recomendado               │
│                                              │
│ 35 min              65 min                   │
│ Tiempo de espera    Viaje total              │
│                                              │
│ Actualizado hace 2 min                       │
│                                              │
│ [ Usar este cruce ]                          │
└──────────────────────────────────────────────┘
```

### Purpose

Primary decision surface. Shows the engine's recommended crossing with key metrics and the primary CTA.

### Props

```typescript
interface TripRecommendationPrimaryCardProps {
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  waitTime: number;
  totalJourneyTime: number;
  rank?: "recommended" | "fastest" | "best_overall" | "alternative";
  status?: "open" | "limited" | "closed";
  generatedAt: string;
  onUseCrossing?: () => void;
  className?: string;
}
```

### Data source

Props come from `TripRecommendation.primary`:
- `crossingName` ← `primary.crossing.name`
- `mexicanCity` ← `primary.crossing.mexicanCity`
- `usCity` ← `primary.crossing.usCity`
- `waitTime` ← `primary.waitTime`
- `totalJourneyTime` ← `primary.totalJourneyTime`
- `status` ← `primary.status`
- `generatedAt` ← `recommendation.generatedAt`

### Tokens

``` text
Surface:          Surface Elevated
Border:           1px Cruze Mint/30
Radius:           12px (var(--radius-lg))
Padding:          20px

Recommendation:
  Inter 11px / 700 uppercase
  Text Secondary

Crossing:
  Sora 20px / 700
  Text Primary

Cities:
  Inter 11px
  Text Secondary

Status dot:
  Open:    8px circle bg-success
  Limited: 8px circle bg-warning
  Closed:  8px circle bg-danger

Rank badge:
  Inter 11px / 600 uppercase
  px-2 py-0.5 rounded-full
  bg-cruze-mint/15 text-cruze-mint

Primary metric (wait):
  Sora 20px / 700 tabular
  Text Primary

Secondary metric (total):
  Sora 20px / 700 tabular
  Text Primary

Metric labels:
  Inter 11px
  Text Secondary

Freshness:
  Inter 11px
  Text Secondary

CTA:
  h-48px w-full
  bg-cruze-mint text-midnight
  Inter 14px / 600
  rounded-lg
```

### Rule

- Rank badge shows localized label: Recomendado / Más rápido / Mejor opción / Alternativa
- Freshness computes relative time from `generatedAt`
- CTA only renders when `onUseCrossing` is provided

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/T07-recommendation.md`
- Catalog index: `design/components/README.md`
