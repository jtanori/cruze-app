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

## States Detail (corrected to implementation 2026-09-16 — component implements ONLY the established strip; low-confidence/refreshing/unavailable live in LOC-REC-01 + LOC-CONF-01)
| State | Visual |
|-------|--------|
| Established | Inline strip, MapPin + t("onboarding.location.banner.established", { placeName }) (StatusBanner.tsx:35-37) |
| Refresh action | Optional button, spinning RefreshCw while refreshing, aria t("onboarding.location.banner.refresh") (StatusBanner.tsx:42-51) |
| Dismiss action | Optional button, aria t("common.close") (StatusBanner.tsx:52-60) |

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