# APP-SET-01 — CruzeSettingsButton
**Version:** 1.1 — 2026-09-04 — radii 4/8/12/16/20, W5 1.1. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
APP-SET-01

## Name
CruzeSettingsButton

## Purpose
Opens Settings.

## ASCII
```text
     ╭──────╮
     │  ⚙   │
     ╰──────╯
```

## Responsibility
Opens Settings.

## Tokens
```text
Touch target: 48px
Icon:          24px
Color:         Text Primary
```

## States
```text
Default
Pressed
Disabled
```

## Rule
Opens `/settings` (Settings root).

## Composition
```text
APP-SET-01
└── Settings icon (24px, Text Primary)
```

## Integration
Used in: `APP-HEAD-01` (CruzeAppHeader)
Opens: `/settings` (Settings root)

## File Reference
- Implementation: `src/components/layout/CruzeSettingsButton.tsx`