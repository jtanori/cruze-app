# TR-HERO-01 — TripHero
**Version:** 1.2 — 2026-09-07 — eyebrow + title + body contract; T01 passes no eyebrow. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
TR-HERO-01

## Name
TripHero

## Purpose
Reusable hero block: optional eyebrow + Sora display title + Inter body. Owns typography, scale, rhythm, hierarchy — never search, CTA, or location state.

## ASCII
```text
[eyebrow] (optional, text-xs uppercase)

¿A dónde vas? (text-3xl)

…body… (text-base, balance)
```

## Tokens
```text
Eyebrow:
  Inter 12px / 600 uppercase tracking-wider
  Text Muted

Title:
  Sora 30px (text-3xl) / 700
  Text Primary
  leading-tight

Body:
  Inter 16px (text-base) / 400
  Text Secondary (faint)
  leading-relaxed, text-balance

Stack:
  space-y-2 sm:space-y-3 (8/12px)
```

## Props
```text
eyebrow?: string
title: string
body?: string
className?: string
```

## Rules
- T01 passes no eyebrow (TU VIAJE stays removed).
- Body always balanced, never clamped.
- No CTA, search, or location logic inside.

## Composition
```text
TR-HERO-01 (TripHero)
├── Eyebrow (optional)
├── Title (h1)
└── Body (p, text-balance)
```

## Integration
Used in: T01 (TripPage) hero block.
Replaces: ad-hoc h1+p pairs (e.g. TripEmptyActionPanel carries its own — migrate on touch).

## File Reference
- Implementation: `src/components/trip/TripHero.tsx`
- Catalog index: `design/components/README.md`
