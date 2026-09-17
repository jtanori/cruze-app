# TR-EMPTY-01 — TripDestinationSearch
**Version:** 1.3 — 2026-09-16 — implementation sync; compound input canon: icon-only CTA, no eyebrow/hero/button/helper in this component (hero lives in TR-HERO-01). If mismatch with `apps/web/src/app/globals.css:94`, revisit.

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
  Button primitive variant="primary" size="sm" with ArrowRight icon, inline inside input right (DestinationSearch.tsx:252-261)
  Cruze Mint bg + Midnight icon when selected
  hollow-disabled primary via Button primitive disabled={!selected} (DestinationSearch.tsx:256); not opacity-40
  No text label — the arrow appears once

Placeholder:
  short country names only ("EE.UU." / "México" — never long form)
  UNKNOWN country → generic ("Busca un destino")

Results dropdown:
  Surface Elevated, opposite country + border-relevant same-country rows
  (server requests both sides via searchPlaces(q, 10, null) (DestinationSearch.tsx:99); `filterDestinations` below is the single discrimination point).
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
├── Button size=sm CTA (→) (DestinationSearch.tsx:252-261)
├── Helper paragraph t("trip.empty.searchHint") (DestinationSearch.tsx:264)
├── Results dropdown with blur guard contains(relatedTarget) (DestinationSearch.tsx:204-211) + onMouseDown preventDefault (DestinationSearch.tsx:277)
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
