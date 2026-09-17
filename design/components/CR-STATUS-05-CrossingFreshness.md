# CR-STATUS-05 — CrossingFreshness
**Version:** 1.2 — 2026-09-07 — normalized user-facing vocabulary (no "en vivo"). If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 22. `CR-STATUS-05` --- CrossingFreshness

### ASCII

``` text
Hace 2 min  (es short-form; "Ahora" at <1 min)
```

### User-facing vocabulary (canonical — shared with `formatFreshness`)

``` text
LIVE        → Ahora                    (relative dropped; <5 min IS now)
RECENT      → Hace X min               (relative only)
STALE       → Datos desactualizados    (label only)
UNAVAILABLE → Sin datos                (label only)
```

No "en vivo" anywhere — freshness never implies liveness. Canonical = lib/format-freshness.ts (formatFreshness: common.justNow/minutesAgo/hoursAgo wrapped in common.updated — format-freshness.ts:16-28). DEVIATIONS: (1) CrossingFreshness.tsx:7-9 hardcodes "Hace X min · desactualizado / Hace X min / Datos no disponibles" (no t(), STALE appends relative instead of label-only); (2) shared.updatedMinAgo calculators in CrossingOptionCard.tsx:180-184,374-379 + BestCrossingCard.tsx:164-169,215-220 (own Date.now()-generatedAt math, not formatFreshness); (3) common.live "EN VIVO/LIVE" badge violators: CrossingOptionCard.tsx:177, BestCrossingCard.tsx:98,160 — must be removed per no-liveness rule; use canonical vocabulary only.

### Freshness states

``` text
LIVE
RECENT
STALE
UNAVAILABLE
```

### Tokens

``` text
LIVE:        Cruze Mint
RECENT:      Text Secondary
STALE:       Amber
UNAVAILABLE: Text Secondary
```

### Critical rule

Operational state and freshness are independent.

Valid:

``` text
● Abierto
Actualizado hace 2 h
```

Invalid:

``` text
● Abierto
EN VIVO · Actualizado hace 2 h
```

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`