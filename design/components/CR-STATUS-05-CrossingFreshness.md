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

No "en vivo" anywhere — freshness never implies liveness.

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