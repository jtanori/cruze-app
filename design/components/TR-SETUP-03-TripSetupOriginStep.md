# TR-SETUP-03 — 03
**Version:** 1.1 — 2026-09-04 — radii 4/8/12/16/20, W5 1.1. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 11. `TR-SETUP-03` --- TripSetupOriginStep

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 2 DE 5                                       │
│ ━━━━━━━━━━━━━                                │
│                                              │
│ ¿Desde dónde sales?                          │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ◎  Mi ubicación actual               ✓  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Tijuana, BC                                  │
│ México                                       │
│                                              │
│ O busca otro lugar                           │
│ ┌──────────────────────────────────────────┐ │
│ │ ⌕  Buscar origen en México...           │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│                 Continuar →                  │
└──────────────────────────────────────────────┘
```

### Component

``` text
TR-SETUP-03
TripSetupOriginStep
```

### Tokens

``` text
Selection:      Cruze Mint
Surface:        Surface
Selected border: Cruze Mint
Radius:          8px
Padding:        16px
```

### Rule

Default origin is the established current location, but the user can
override it.

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`