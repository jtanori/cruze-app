# TR-ACT-05 — TripStalePrompt
**Version:** 1.2 — 2026-09-07 — extracted from TripPage T08 block. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
TR-ACT-05

## Name
TripStalePrompt

## Purpose
Stale-trip recovery prompt on T08 when the trip exceeds the staleness threshold (12h via `isTripStale`). Confirms the trip is still current or starts a new one.

## ASCII
```text
┌──────────────────────────────────────────────┐
│ ⚠ El viaje puede estar desactualizado        │
│   Tu viaje se configuró hace más de…         │
│                                              │
│  [ Sí, sigue vigente ]  [ Iniciar nuevo ]    │
└──────────────────────────────────────────────┘
```

## Tokens
```text
Container:
  bg-caution/10
  Border caution/30
  Radius 12px (lg)
  Padding 16px
  space-y-3

Title:
  Inter 14px / 500
  Text Primary

Description:
  Inter 12px / 400
  Text Secondary (faint)

Primary action:
  Cruze Mint bg, Midnight text
  h-9 (36px), Radius 8px (md)

Secondary action:
  Surface bg, Border #1F3A54
  h-9 (36px), Radius 8px (md)
```

## Props
```text
title: string
description: string
stillCurrentLabel: string
startNewLabel: string
onStillCurrent: () => void
onStartNew: () => void
className?: string
```

## Rules
- Owned by `useTripStaleness` (auto-marks stale, never unmarks — recovery is explicit user action).
- Trip-lifecycle staleness only; never crossing-data freshness.

## Composition
```text
TR-ACT-05 (TripStalePrompt)
├── AlertTriangle + title + description
└── stillCurrent (mint) + startNew (surface)
```

## Integration
Used in: T08 (TripPage) via `useTripStaleness()`.
i18n: `trip.stale.*` (es/en).

## File Reference
- Implementation: `src/components/trip/TripStalePrompt.tsx`
- State: `src/hooks/useTripStaleness.ts`, `src/lib/trip-staleness.ts`
- Catalog index: `design/components/README.md`
