# LOC-STATUS-01 — LocationStatusBanner
**Version:** 1.2 — 2026-09-15 — optional Actualizar action (manual refresh) wired to established banner.
**Prior:** 1.1 — 2026-09-04 — radii 4/8/12/16/20, W5 1.1. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
LOC-STATUS-01

## Name
LocationStatusBanner

## Purpose
Communicate established location and its confidence/state without becoming the primary content.

## ASCII
```text
┌──────────────────────────────────────────────┐
│  ◎  Ubicación establecida:                  │
│     Puerto Peñasco, SON                 ✓   │
└──────────────────────────────────────────────┘
```

## Responsibility
Communicate established location and its confidence/state without becoming the primary content.

## Tokens
```text
Surface:       rgba / Surface
Border:        1px #1F3A54
Radius:         8px
Padding:        12px 16px
Icon:           Cruze Mint
Primary text:   Text Primary
Location text:  Cruze Mint
Height:         ~64px
```

## States
```text
Established
Low confidence
Refreshing
Unavailable
```

## Composition
```text
LOC-STATUS-01
├── MapPin icon (Cruze Mint, 20px)
├── Location text (Cruze Mint, 14px, 600)
├── "Ubicación establecida:" label (Text Primary, 12px)
├── Refresh button (optional, RefreshCw icon, spins while acquiring)
└── Dismiss button (optional, X icon)
```

## States Detail
| State | Visual |
|-------|--------|
| Established | Green badge, location name, dismissible |
| Low confidence | Amber badge, "Baja precisión" |
| Refreshing | Spinner, "Actualizando..." |
| Unavailable | Red badge, "No disponible" |

## Rules
- Non-dismissible on T01 (Viaje)
- Dismissible on other surfaces
- Shows placeName from location store
- Auto-hides after 3s on success (configurable)

## Integration
Used in: T01 (TripPage), TripSetupFlow, CrossingDetail
Shows: `location.placeName` from location store

## File Reference
- Implementation: `src/components/location/LocationStatusBanner.tsx`