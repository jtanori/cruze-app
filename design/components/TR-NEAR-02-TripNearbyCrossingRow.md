# TR-NEAR-02 — 02
**Version:** 1.1 — 2026-09-04 — radii 4/8/12/16/20, W5 1.1. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 17. `TR-NEAR-02` --- TripNearbyCrossingRow

### ASCII

``` text
┌────────────────────────────────────────────────────────┐
│                                                        │
│  🚗   San Ysidro                         11 min       │
│       ● Abierto   Norte                2 min ago  →  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Required information

``` text
Crossing name
Operational status
Current wait
Direction
Freshness
```

Optional useful contextual metric:

``` text
Estimated travel time from current location
```

### Tokens

``` text
Surface:             transparent / Surface
Border:              1px #1F3A54
Radius:               8px
Padding:             16px
Name:                Sora 18–20px / 700
Wait:                Sora 28–32px / 600–700
Open:                Cruze Mint
Limited:             Amber
Closed:              Alert Red
Direction:           Text Secondary
Freshness:           Text Secondary
Chevron:             Text Secondary
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