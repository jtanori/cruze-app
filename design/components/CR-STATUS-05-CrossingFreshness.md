# CR-STATUS-05 — 05

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 22. `CR-STATUS-05` --- CrossingFreshness

### ASCII

``` text
Actualizado hace 2 min
```

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
