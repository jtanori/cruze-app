# APP-HEAD-01 — CruzeAppHeader
**Version:** 1.1 — 2026-09-04 — radii 4/8/12/16/20, W5 1.1. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
APP-HEAD-01

## Name
CruzeAppHeader

## Purpose
Global header for primary application surfaces.

## ASCII
```text
┌──────────────────────────────────────────────┐
│                                              │
│  CRUZE                         ◉     ⚙      │
│                                              │
└──────────────────────────────────────────────┘
```

## Anatomy
```text
CruzeAppHeader
├── Brand
│   └── CRUZE
├── CruzeNotificationButton
│   └── unread badge when required
└── CruzeSettingsButton
```

## Tokens
```text
Height:       72–88px depending on device shell
Padding X:    24px
Background:   transparent / background layer
Brand:        Sora, 24–28px, 700–800
Icon size:    24–28px
Icon color:   Text Primary
Gap:          20–24px
Border:       1px #1F3A54
```

## Rules
- No drawer.
- No account avatar.
- No logout.
- No primary navigation inside the header.
- Bell opens **Avisos**.
- Gear opens **Configuración**.

## Variants
| Variant | Description |
|---------|-------------|
| Default | Standard header |
| With notification badge | Bell shows unread count |
| With settings | Gear opens Settings |

## Composition
```text
APP-HEAD-01
├── Brand
│   └── CRUZE (Sora, 24-28px, 700-800, Text Primary)
├── CruzeNotificationButton (APP-AV-01)
│   └── unread badge (Cruze Mint, 7-8px)
└── CruzeSettingsButton (APP-SET-01)
    └── Settings icon (24-28px, Text Primary)
```

## States
| State | Description |
|-------|-------------|
| Default | Standard header |
| With unread | Bell shows badge |
| Pressed | Button press state |

## Integration
Used in: `APP-NAV-01` (CruzeAppShell) as top-level shell component.
Appears on: All primary surfaces (Viaje, Cruces, Agente, Settings, Crossing Detail).

## File Reference
- Implementation: `src/components/layout/TopAppBar.tsx`
- Brand: `src/components/layout/CruzeAppHeader.tsx` (if separated)