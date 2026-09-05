# TR-EMPTY-01 — TripDestinationSearch
**Version:** 1.1 — 2026-09-04 — radii 4/8/12/16/20, W5 1.1. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
TR-EMPTY-01

## Name
TripDestinationSearch (formerly TripEmptyActionPanel)

## Purpose
Destination search with country filter as the primary entry point for trip planning on T01.

## ASCII
```text
TU VIAJE

¿A dónde vas?

Busca tu destino en Estados Unidos para recibir
inteligencia personalizada para tu cruce.

┌──────────────────────────────────────────────┐
│  ⌕  Buscar destino en EE.UU...              │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│                Siguiente  →                  │
└──────────────────────────────────────────────┘

        Selecciona un destino para continuar
```

## Tokens
```text
Eyebrow:
  Sora 16–18px / 700
  Cruze Mint

Hero:
  Sora 40–48px / 700–800
  Text Primary

Body:
  Inter 17–20px / 400
  Text Secondary

Search:
  Surface Elevated
  Border #1F3A54
  Radius  8px
  Height 56–64px

CTA:
  Cruze Mint
  Text on mint: Midnight
  Radius  8px
  Height ≥48px
```

## States
```text
Empty
Typing
Results
Selected
Invalid
Loading
```

## Important Rule
The button is disabled until a destination is selected.

## Composition
```text
TR-EMPTY-01 (TripDestinationSearch)
├── Eyebrow: "TU VIAJE" (Sora 16-18px/700, Cruze Mint)
├── Hero: "¿A dónde vas?" (Sora 40-48px/700-800, Text Primary)
├── Body: "Busca tu destino..." (Inter 17-20px/400, Text Secondary)
├── Search Input (DestinationSearch component)
│   ├── Search icon
│   ├── Input (filtered to target country)
│   ├── Results dropdown
│   └── Clear button
├── Selected destination display (when selected)
└── Next button (disabled until selection)
    └── "Siguiente →" (Cruze Mint, ≥48px)
```

## Integration
Used in: T01 (TripPage) as primary empty state
Replaces: Former `TripEmptyActionPanel`
Navigates to: `/trip/setup` with destination pre-filled

## File Reference
- Implementation: `src/components/trip/TripDestinationSearch.tsx`
- Search component: `src/components/trip/DestinationSearch.tsx`