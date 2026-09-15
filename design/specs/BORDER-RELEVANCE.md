# BORDER-RELEVANCE — Same-Country Destination Exception

**Version:** 1.0 — 2026-09-14 — computed geography, candidate plumbing, spec deltas.
**Status:** Implemented (Phase 2). Engine same-country routing stays Phase 3 (nice-to-have).

## Rule

Destination search admits three outcomes — never "same country vs other country" alone:

```text
Destination search
        │
        ▼
Resolve place country + coordinates + border relevance
        │
  ┌─────┴──────┐
  │            │
Different   Same country
country        │
  │       Border-relevant?
  ▼         │
NORMAL      ├── NO → excluded
DESTINATION │
            └── YES → admitted with candidate
                        │
                        ▼
               "Cross-border destination"
                        │
                        ▼
               crossing candidate(s)
```

Example: MX user searches Sonoyta → admitted with `Cruce cercano · Lukeville`.
CDMX (far interior) stays excluded. Chula Vista for a San Diego user surfaces
with `Nearby crossing · San Ysidro` — same-side surfacing is correct, not a leak.

## Model

No `isBorderTown` boolean. Relevance is computed from `BORDER_CROSSINGS`
coordinates via haversine (`lib/border-relevance.ts`):

```ts
interface BorderRelevance {
  relevant: boolean;
  crossings: string[];          // sorted nearest-first, in-range only
  distanceToCrossing?: number;  // km
  relationship?: "adjacent"     // ≤ 15 km, e.g. Sonoyta ↔ Lukeville
               | "crossing_access" // ≤ 50 km, e.g. San Diego ↔ San Ysidro
               | "border_corridor"; // reserved
}
```

Non-mainland US regions (AK/HI/territories) are dropped server-side
(`/api/places`) — out of scope for a border app regardless of country.

## Invariants (locked)

1. **Destination invariant** — the system MUST NOT replace, reinterpret, or
   fabricate the destination. Sonoyta stays Sonoyta; Lukeville is a candidate.
2. **Country invariant** — destination country MUST NOT be restricted to the
   opposite side only. Non-relevant same-country places stay excluded by default.
3. **Relevance invariant** — admission derives from computed geography, never a
   hand list. UNKNOWN user country passes everything through, candidate-free.
4. **Inference invariant** — a candidate MUST remain a candidate until selected
   (`?crossing=`) or consumed by the recommendation engine.
5. **Honesty invariant** — relevance never implies border intent. No warnings,
   no "same country" messaging; rows carry a `Cruce cercano · X` subtitle.
6. **Recommendation invariant (Phase 3)** — the engine MAY route through a
   crossing for same-country O/D. Not implemented; no engine changes in Phase 2.

## Separation

C01 (crossing browser country filter) and trip destination country remain
separate concepts: "which crossings am I looking at" vs "where am I going".

## Files

- `apps/web/src/lib/border-relevance.ts` (+ tests)
- `apps/web/src/lib/destination-filter.ts` (`filterDestinations`, `RelevantPlace`)
- `apps/web/src/components/trip/DestinationSearch.tsx` (subtitle row)
- `apps/web/src/lib/trip-destination.ts` (`crossingCandidateId` passthrough)
- `apps/web/src/lib/trip-navigation.ts` (`TripDestinationSelection.crossingCandidateId?`)
- `apps/web/src/app/[locale]/(main)/trip/page.tsx` (`?crossing=` on Next)
- Existing `TripSetupFlow` handoff banner consumes the candidate unchanged.
