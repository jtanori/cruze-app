# TR-EMPTY-01 — TripDestinationSearch
**Version:** 1.2 — 2026-09-07 — compound input canon: icon-only CTA, no eyebrow/hero/button/helper in this component (hero lives in TR-HERO-01). If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
TR-EMPTY-01

## Name
TripDestinationSearch (formerly TripEmptyActionPanel)

## Purpose
Destination search with country filter as the primary entry point for trip planning on T01. Single compound control: search field + contextual icon-only CTA.

## ASCII
```text
┌──────────────────────────────────────────────┐
│  ⌕  Busca un destino en EE.UU...        (→)  │
└──────────────────────────────────────────────┘
```

## Tokens
```text
Search:
  Surface Elevated
  Border #1F3A54
  Radius  8px
  Height 56px

CTA (icon-only ArrowRight):
  w-10 h-10 rounded-full, floating inside input right
  Cruze Mint bg + Midnight icon when selected
  dimmed/disabled (opacity-40, not-allowed) until selection
  No text label — the arrow appears once

Placeholder:
  short country names only ("EE.UU." / "México" — never long form)
  UNKNOWN country → generic ("Busca un destino")

Results dropdown:
  Surface Elevated, opposite country + border-relevant same-country rows
  (strict Mapbox server filter + `filterDestinations` admission).
  Relevant same-country rows carry a `Cruce cercano · X` subtitle and attach
  the nearest gate as `crossingCandidateId` — destination never rewritten.
  See `design/specs/BORDER-RELEVANCE.md`.
```

## States
```text
Empty
Focused
Typing
Results
Selected
Disabled
Loading
```

## Important Rule
Country comes from the resolved location (`userCountry` prop: MX/US/UNKNOWN). UNKNOWN never forces a side: unfiltered + generic copy. Legacy coordinate detection remains only for callers without the prop.

## Composition
```text
TR-EMPTY-01 (DestinationSearch)
├── Search icon + input (filtered to target country)
├── Clear button (custom, far right)
├── Floating icon-only CTA (→)
├── Results dropdown
└── Selected destination display (when selected)
```

## Integration
Used in: T01 (TripPage) as primary empty state.
Replaces: Former `TripEmptyActionPanel` button layout.
Navigates to: `/trip/setup` with destination pre-filled (via `buildSetupUrl`).

## File Reference
- Implementation: `src/components/trip/DestinationSearch.tsx`
- Country: `src/lib/country-resolution.ts` (`userCountry` prop)
- Search: `src/lib/geocoding.ts` (`searchPlaces` strict country param)
