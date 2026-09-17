# TR-NEAR-02 — 02
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

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
Row 1: crossing name (left, truncate) + distanceKm !== undefined ? formatDistance(distanceKm) : formatDuration(waitTime) (TripNearbyCrossingRow.tsx:57-59)
Row 2: placeLine (3rd-city logic mexicanCity/usCity vs name — TripNearbyCrossingRow.tsx:31-35) + wait again when distance shown (TripNearbyCrossingRow.tsx:65-69)
Row 3: status dot + label + direction + freshness ml-auto (TripNearbyCrossingRow.tsx:71-82)
```

Status labels via t("common.open/closed/limited/unknown") (TripNearbyCrossingRow.tsx:41-44); direction "MX → US" / "US → MX" (TripNearbyCrossingRow.tsx:76) are locale-invariant ISO code pairs — intentionally literal, not t(). Unknown default non-coerced (muted,
non-semantic color; unknown is default, never coerced to open).
Freshness short-form via shared `formatFreshness` ("Hace X min" / "Ahora").
Container: bg-surface, border-subtle, rounded-[var(--radius-lg)] (12px, TripNearbyCrossingRow.tsx:53).

Optional useful contextual metric:

``` text
Distance via formatDistance(distanceKm) shown Row 1 when provided; wait persists Row 2 (TripNearbyCrossingRow.tsx:57-69)
```

### Tokens

``` text
Surface:             Surface
Border:              1px #1F3A54 (subtle variant)
Radius:               12px (radius-lg token)
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