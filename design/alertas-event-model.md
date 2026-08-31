# CRUZE — Alertas Change-Event Model (P06)
**Document ID:** `CRUZE-ALERTAS-01`
**Status:** Draft for v1 (planning — no implementation yet)
**Owner:** Product / IA
**Related:** `design/plans/02` (P06 Alertas), `design/cruze-navigation-spec.md` (bottom-tab 3 + unread badge)

---

# 01 — PURPOSE

The **Alertas** bottom-tab (tab 3) is a high-signal, time-stamped **border change-detection feed**. It replaces the deprecated standalone "Actividad" social feed. Its job is to answer:

> *"What changed at the crossings I care about?"*

Every entry is a **derived event**, never raw crowd noise. Each event carries temporal provenance and semantic meaning, consistent with the product principle *"No Fake Dashboard Clutter."*

---

# 02 — EVENT TYPES & THRESHOLDS

All thresholds are evaluated client-side against the resolved live snapshot (`resolveLiveSnapshot`) diffed against a short rolling baseline.

| `type` | Trigger (vs rolling baseline) | Severity | Counts toward unread badge? |
| :--- | :--- | :--- | :--- |
| `WAIT_SURGE` | `current - baseline >= +15 min` **or** `+40%` of baseline, whichever first | `high` | **Yes** |
| `WAIT_DROP` | `current - baseline <= -15 min` | `info` | No |
| `LANE_STATUS_CHANGE` | `lanesOpen` string changes, or `sentri`/`ready` flips `open → limited/closed` | `high` (closure/limited) / `medium` (reopen) | **Yes** when closure/limited |
| `CONSTRUCTION` | `construction` field value changes | `medium` | No |
| `CONFIDENCE_DROP` | `confidenceScore` drops `>= 15 pts`, or provenance degrades (`cbp_direct → cbp_stale`/`static_baseline`) | `low` | No |

**Badge rule:** only `WAIT_SURGE` and `LANE_STATUS_CHANGE` (closure/limited) increment the unread badge. `info`/`medium`/`low` events appear in the feed but do not demand attention.

---

# 03 — EVENT SHAPE

```ts
type AlertEventType =
  | "WAIT_SURGE"
  | "WAIT_DROP"
  | "LANE_STATUS_CHANGE"
  | "CONSTRUCTION"
  | "CONFIDENCE_DROP";

interface BorderAlertEvent {
  id: string;            // `${crossingId}:${mode}:${type}:${observedAt}`
  crossingId: CrossingId;
  mode: CrossingMode;    // standard | sentri | ready | pedestrian | commercial
  type: AlertEventType;
  severity: "high" | "medium" | "info" | "low";
  before: number | null; // previous wait (min)
  after: number;         // new wait (min)
  observedAt: string;    // ISO timestamp
  provenance: SnapshotProvenance; // cbp_direct | cbp_sibling | cbp_stale | static_baseline | peer_average
  message: string;       // localized, e.g. "San Ysidro SENTRI +18 min"
}
```

---

# 04 — DERIVATION (client-side, no server)

1. `LiveBorderProvider` already bumps a `version` counter on every refresh. Maintain a `prevByCruceId` map of the last resolved live snapshot keyed by `crossingId + mode`.
2. On each refresh, compute `current` vs `prev` per crossing/mode and evaluate the thresholds in §02.
3. **Dedup:** the same `type` for the same `crossingId + mode` within a **10-minute** window collapses into one event (update `observedAt`, `before`, `after`); do not spam the feed.
4. **Baseline:** exponential moving average of `current` over the last ~6 samples, seeded from the static snapshot `current` as the floor.
5. **Provenance:** every event inherits `provenance` from `resolveLiveSnapshot`; `cbp_stale` / `static_baseline` / `peer_average` events are labeled *"estimated"* in the UI.

---

# 05 — FEED (P06 Alertas) RENDERING

- Chronological, newest first, grouped by calendar day.
- Each row: crossing name + mode chip, `message`, `TimeAgo` (relative time, client-only), and a provenance tag when not `cbp_direct`.
- Tap a row → navigates to `/crossings/:id` (Crossing Detail).
- **Empty state:** *"No changes — the border is steady."*
- **Unread badge** (bottom-tab 3): count = events with `observedAt > alertsLastSeenAt` whose `type` is in the badge set (§02). Cleared when the Alertas tab is opened (set `alertsLastSeenAt = now`).

---

# 06 — SEEN-STATE OWNERSHIP (v1)

- `alertsLastSeenAt: string` (ISO) lives in the Zustand store, **persisted to `localStorage`** (device-local, no account/server needed — auth is off for v1).
- Cross-device sync is **out of scope** for v1; if accounts ship later, move seen-state to the user record.
- This matches the earlier agreed suggestion: client-only, cleared on Alertas open.

---

# 07 — OPEN SUB-DECISIONS (small, can close during build)

- Exact `WAIT_SURGE` baseline window (6 samples ≈ how many minutes at typical refresh cadence).
- Whether `COMMERCIAL` mode events surface in the default feed or only when the user's vehicle class is commercial.
- Badge cap display (`9+`).

---

*This document is the event-model contract for P06. Implementation begins only after the planning sign-off above.*
