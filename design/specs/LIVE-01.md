# LIVE-01 — Active Trip Live Intelligence Contract
**Version:** 1.0 — 2026-09-11 — initial spec.

> **Canonical:** `design/workflows/W6-active-trip.md` — source of truth for active trip state.

# LIVE-01. `LiveCrossingSnapshot`

## Purpose

Defines the live operational intelligence layer for an active trip. Separates **committed trip context** (`SelectedCrossing` in `TripState`) from **current operational state** (`LiveCrossingSnapshot` in `LiveCrossingStore`). The live layer fetches, caches, and exposes crossing status without mutating `TripState`.

## Architecture

```text
TripState (persisted)              LiveCrossingStore (ephemeral)
───────────────────                ────────────────────────────
recommendedCrossing                snapshot (LiveCrossingSnapshot)
origin                             lastFetchAt
destination                        error
travelMode
direction
accessType
documentProfile

        SelectedCrossing                    LiveCrossingSnapshot
        = committed decision                = current operational state
        = never mutated by live refresh     = replaced on each successful fetch
```

## Data types

```typescript
type CrossingFreshness = "live" | "recent" | "stale" | "unavailable";

type CrossingOperationalStatus = "open" | "limited" | "closed";

interface LiveCrossingSnapshot {
  crossingId: string;
  status: CrossingOperationalStatus;
  waitTime: number;
  totalJourneyTime: number;   // frozen from SelectedCrossing, never live-refreshed
  isLive: boolean;            // derived: freshness === "live"
  generatedAt: string;        // ISO timestamp of last successful data acquisition
  freshness: CrossingFreshness;
}
```

## Freshness thresholds

```text
0 ──────── 5m ──────── 30m ──────── 120m ────────►
    LIVE       RECENT        STALE       UNAVAILABLE
```

Freshness is calculated from `generatedAt`, not from fetch outcome:

```typescript
calculateCrossingFreshness(generatedAt: string, now?: number): CrossingFreshness
```

- Successful fetch → new `generatedAt` → freshness resets to `live`
- Failed fetch → `generatedAt` unchanged → freshness naturally degrades

## Invariants

1. `TripState` is never mutated by live refresh.
2. `SelectedCrossing` remains the committed crossing context.
3. `snapshot.generatedAt` only changes after successful data acquisition.
4. `lastFetchAt` records the latest fetch attempt (success or failure).
5. Freshness is calculated from `generatedAt`.
6. Failed refreshes retain the last valid operational snapshot.
7. Failed refreshes never fabricate `UNKNOWN`.
8. `isLive === freshness === "live"` — consumers must never see inconsistent state.
9. Initial fetch produces no change event.
10. Refreshes only emit changes crossing existing alert thresholds.
11. `totalJourneyTime` is never live-refreshed.
12. `direction` remains contextual and is never silently defaulted.
13. W6's `useTripStaleness()` remains independent from crossing-data freshness.
14. No UI consumer fetches `/api/crossings/merged` independently — one live source, many consumers.

## Refresh lifecycle

```text
ACTIVE
  │
  ├── initial fetch (on mount / crossing selection)
  │
  ├── interval refresh (every 5 min, aligned with CBP server cache)
  │
  ├── visibility regain (tab refocus)
  │
  └── manual retry (user action)
          │
          ▼
    fetchCrossingData(crossingId)
          │
    ┌─────┴─────┐
    ▼           ▼
  success     failure
    │           │
    ▼           ▼
  replace     retain previous
  snapshot    snapshot
    │         increase staleness
    │
    ▼
  detectCrossingChanges(previous, current)
          │
    ┌─────┴─────┐
    ▼           ▼
  no change   change detected
                  │
            ┌─────┴─────┐
            ▼           ▼
          WAIT_SURGE   WAIT_DROP
          STATUS_CHANGE
```

## Change detection

Compares previous snapshot against current snapshot. Uses thresholds from `alert-engine.ts`:

| Event | Threshold |
|-------|-----------|
| `WAIT_SURGE` | absolute ≥ +15 min OR relative ≥ +40% |
| `WAIT_DROP` | absolute ≤ -15 min |
| `STATUS_CHANGE` | `current.status !== previous.status` |

**No previous snapshot = no change event.** Initial acquisition is baseline, not a change.

## API source

```text
GET /api/crossings/merged
  → MergedCrossingData[]
  → filter by crossingId
  → map to LiveCrossingSnapshot
```

Browser code never calls `bwt.cbp.gov` directly.

## Hook API

```typescript
function useLiveCrossingSnapshot(
  crossingId: string | null,
  direction: TripDirection | null,
  initialTotalJourneyTime: number
): {
  snapshot: LiveCrossingSnapshot | null;
  isLoading: boolean;
  error: string | null;
  previousSnapshot: LiveCrossingSnapshot | null;
  refresh: () => Promise<void>;
}
```

## Consumer mapping

| Consumer | Reads | Writes |
|----------|-------|--------|
| TR-ACT-01 StatusHeader | snapshot.status, snapshot.freshness, snapshot.generatedAt | — |
| TR-ACT-02 RouteSummary | snapshot.waitTime | — |
| TR-ACT-04 Checklist | snapshot.status, snapshot.freshness | — |
| Avisos | previousSnapshot, snapshot (change events) | — |
| Agent | snapshot (full) | — |

## Failure semantics

```text
current snapshot
     │
     ├── refresh succeeds
     │      └── new generatedAt
     │      └── freshness = "live"
     │      └── replace snapshot
     │
     └── refresh fails
            └── same generatedAt
                  └── freshness naturally degrades
                  └── retain previous snapshot
                  └── set error in store
```

## File structure

```text
lib/live-crossing/
  ├── types.ts           LiveCrossingSnapshot, CrossingFreshness
  ├── freshness.ts       calculateCrossingFreshness()
  └── changes.ts         detectCrossingChanges(), CrossingChange

stores/
  └── live-crossing.ts   LiveCrossingStore (ephemeral Zustand)

hooks/
  └── useLiveCrossingSnapshot.ts   main hook

lib/__tests__/
  ├── live-crossing-freshness.test.ts
  └── live-crossing-changes.test.ts

stores/__tests__/
  └── live-crossing.test.ts
```

---

## File Reference
- Spec doc: `design/specs/LIVE-01.md` (this file) — canonical
- Workflow: `design/workflows/W6-active-trip.md`
- Catalog index: `design/components/README.md`
