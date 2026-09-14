# TR-NEAR-02 — 02
**Version:** 1.1 — 2026-09-04 — radii 4/8/12/16/20, W5 1.1. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 17. `TR-NEAR-02` --- TripNearbyCrossingRow

### ASCII

``` text
┌────────────────────────────────────────────────────────┐
│  San Ysidro                                      11 min│
│  ● Abierto  Norte                          Hace 2 min  │
└────────────────────────────────────────────────────────┘
```

### Required information

``` text
Row 1: crossing name (left, truncate) + wait (right, tabular)
Row 2 (single line): status dot + label + direction + freshness (ml-auto)
```

Status vocabulary: Operativo / Limitado / Cerrado / Desconocido (muted,
non-semantic color; unknown is default, never coerced to open).
Freshness short-form via shared `formatFreshness` ("Hace X min" / "Ahora").
Container: bg-surface, border-subtle, rounded-xl (12px).

Optional useful contextual metric:

``` text
Estimated travel time from current location (omitted until route data exists)
```

### Tokens

``` text
Surface:             Surface
Border:              1px #1F3A54 (subtle variant)
Radius:               12px (rounded-xl)
Padding:             12px
Name:                Inter 14px / 600
Wait:                Inter 14px / 600 tabular
Operativo:           Cruze Mint
Limitado:            Amber
Cerrado:             Alert Red
Desconocido:         Muted (non-semantic)
Direction:           Text Secondary
Freshness:           Text Secondary
```

### Do not include

``` text
Full lane details
Document requirements
Hours
Services
Address
Map
Detailed restrictions
```

Those belong to Crossing Detail.

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`