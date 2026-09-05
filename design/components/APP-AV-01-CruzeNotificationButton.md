# APP-AV-01 — CruzeNotificationButton

## Component ID
APP-AV-01

## Name
CruzeNotificationButton

## Purpose
Entry point to Avisos (notifications/alerts).

## ASCII
```text
     ╭──────╮
     │  ♧   │
     │    • │
     ╰──────╯
```

## Responsibility
Entry point to Avisos (notifications/alerts).

## States
```text
Default
Unread
Pressed
Disabled
```

## Tokens
```text
Touch target: 48px
Icon:          24px
Color:         Text Primary
Unread badge:  Cruze Mint
Badge size:    7–8px
```

## Rule
`Avisos` is not a bottom-navigation destination.

## States Detail
| State | Visual |
|-------|--------|
| Default | Bell icon, Text Primary |
| Unread | Bell + Cruze Mint badge (7-8px) |
| Pressed | Surface Elevated background |
| Disabled | 40% opacity |

## Composition
```text
APP-AV-01
├── Bell icon (24px, Text Primary)
└── Unread badge (conditional)
    └── Dot (7-8px, Cruze Mint)
```

## Integration
Used in: `APP-HEAD-01` (CruzeAppHeader)
Opens: `/avisos` (AvisosList)

## File Reference
- Implementation: `src/components/layout/CruzeNotificationButton.tsx`