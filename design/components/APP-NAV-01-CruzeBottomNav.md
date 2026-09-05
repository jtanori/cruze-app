# APP-NAV-01 — CruzeBottomNav

## Component ID
APP-NAV-01

## Name
CruzeBottomNav

## Purpose
Primary navigation for the application.

## ASCII
```text
┌──────────────────────────────────────────────┐
│                                              │
│        ◉              ◯              ◯       │
│      Viaje          Cruces         Agente     │
│       ━━━                                     │
└──────────────────────────────────────────────┘
```

## Destinations
```text
Viaje
Cruces
Agente
```

## Active State
```text
Icon:      Cruze Mint
Label:     Cruze Mint
Indicator: Cruze Mint
```

## Inactive State
```text
Icon:      Text Secondary
Label:     Text Secondary
```

## Tokens
```text
Height:          80–96px + safe area
Background:      Surface / translucent Midnight
Top border:      1px #1F3A54
Item width:      33.333%
Touch target:    ≥48px
Label:           Inter 14–16px
Icon:            24–28px
Active accent:   #00E0A0
```

## Rules
Exactly three primary destinations.

Do not add:
```text
Mapa
Favoritos
Avisos
Configuración
```
to this navigation.

## Composition
```text
APP-NAV-01
├── Viaje (TR-EMPTY-01 context)
│   ├── Icon (Navigation, 24-28px)
│   ├── Label (Inter 14-16px)
│   └── Active indicator (Cruze Mint, 3px)
├── Cruces (C01 context)
│   ├── Icon (Compass, 24-28px)
│   ├── Label (Inter 14-16px)
│   └── Active indicator (conditional)
└── Agente (A01 context)
    ├── Icon (MessageCircle, 24-28px)
    ├── Label (Inter 14-16px)
    └── Active indicator (conditional)
```

## States
| State | Icon | Label | Indicator |
|-------|------|-------|-----------|
| Active | Cruze Mint | Cruze Mint | 3px bar |
| Inactive | Text Secondary | Text Secondary | none |

## Integration
Used in: `APP-NAV-01` (CruzeAppShell) as bottom navigation.
Routes: `/trip`, `/crossings`, `/agent`

## File Reference
- Implementation: `src/components/layout/BottomNavigation.tsx`