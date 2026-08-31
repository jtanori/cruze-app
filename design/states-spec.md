# CRUZE — Inline States Spec (G1 + G2)
**Status:** Interaction/state contract (planning).
**Principle:** No full-page error / empty / loading routes. Every state is **inline** within its archetype.

---

## 1. State taxonomy (per archetype)
| State | Visual | Copy (ES / EN) |
| :--- | :--- | :--- |
| **Loading** | Skeleton shimmer matching card layout | — (no text; respect reduced-motion) |
| **Empty** | Centered icon + one line + optional action | see §2 |
| **Error** | Inline card, no navigation | "Live data unavailable — showing last known" + Retry |
| **Stale** | Provenance tag on metrics (`estimated`, `stale`) | handled by existing `TimeAgo` / confidence badge |
| **Refreshing** | Subtle header `· refreshing…` | existing |

## 2. Empty states (G2 — notifications deferred)
- **P05 Favoritos:** "No saved crossings yet — tap ☆ on any crossing." / "Aún no guardas cruces — toca ☆ en cualquiera."
- **P06 Alertas:** "No changes — the border is steady." / "Sin cambios — la frontera está estable."
- **P01 Cruces (no data):** inline "Add your home crossing to personalize" → opens Favoritos.
- **Search:** deferred (P07) — N/A in v1.

## 3. Loading skeletons
- **P01 feed:** 3 shimmer rows (crossing name + wait bar).
- **P02 detail:** hero shimmer + 2 section shimmers.
- **P03 hero:** recommendation card shimmer (name + total time + delta).
- **P04 compare:** 3 column shimmers.

## 4. Error / offline
- Inline retry card; never replaces the shell.
- If `provenance = static_baseline`, show `estimated` tag (already specified) — not an error.

## 5. Accessibility
- Loading/empty/error regions use `aria-live="polite"` and a descriptive `role="status"`.
- Skeletons carry `aria-hidden="true"` (avoid double-announce).

## 6. Notifications (G2)
- Push/permission prompts for Alertas are **deferred** to a future phase. Empty states above stand until then.
