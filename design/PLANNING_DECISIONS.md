# CRUZE — Locked Planning Decisions (v1)
**Status:** Frozen pending build sign-off.
**Authority:** `design/` master plan is canonical; this log records the resolved decisions on top of it.

---

## 1. Navigation & Information Architecture
- **Bottom nav = exactly 3 tabs:** `Cruces` (`/crossings`), `Favoritos` (`/favorites`), `Alertas` (`/alerts`). `Mapa` / `Actividad` / `Más` are **removed as pages**.
- **Entry point = `/`** → Recommendation (P03). `/crossings` is the Cruces intelligence feed (P01).
- **Search (P07) DEFERRED to v1.1** — crossing corpus is tiny (San Ysidro, Otay Mesa, Tecate, Calexico); Filters covers discovery.
- **Filters (P08) KEPT** — dimensions: direction (MX↔US) + vehicle class + lane program (Standard/SENTRI/Ready); persisted in the store.
- **Deferred surfaces (kept in code, outside v1 9-page inventory):** `/pro`, `/emergency`, `/assistant`, `/more`. Assistant deferred ⇒ monetization intent/partner taxonomy deferred.

## 2. Visual & Design Tokens
- **Canonical brand green = `#43D69A`** (active states + chart primary line).
- **Card radius lowered globally to `10px`** (was `14px`); token `--radius-lg = 10px`.
- **Chart restraint (hard gate):** gridlines `rgba(255,255,255,0.08)`, area fill `0.14 → 0.00`, primary line `#43D69A`, reserved contrast for the departure-hour milestone.
- Surface palette per `cruze-design-system.md` (`#081830` bg, `#0C1C34` surface, `#14243A` elevated, `#1A2A40` subtle, `#F5F7FA` ink).
- All metrics use `tabular-nums`; audit before build.

## 3. Alertas (P06)
- Change-event model specified in `design/alertas-event-model.md`.
- **Seen-state: client-only** (Zustand + `localStorage`); badge counts `WAIT_SURGE` + lane closure/limited events since `alertsLastSeenAt`.

## 4. Maps
- `MapContext` embedded in P01 rows (mini), P02 Detail, P03 Recommendation, P04 Compare, **plus an expandable map block in the P01 header**. No standalone `/map` page.

## 5. Splash / Logo
- `SplashScreen` shown at app start, **cross-fades out before first content paint** (boot transition, not a timed splash). `Logo` wired into the root header wordmark.

## 6. Monetization (Day-0)
- Ship **invisible** scaffolding: `monetization-policy` config, consent records, analytics event names (decision→navigate, etc.). **No ad UI in v1.**
- Ad placement planned in `design/ad-placement-spec.md` but UI deferred; ads **forbidden** on decision surfaces (P03 Recommendation, P04 Compare).

---

*Supersedes earlier 5-tab references. Any doc contradicting this log is stale and should be reconciled to it.*
