# TR-SETUP-04 — 04

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 12. `TR-SETUP-04` --- TripSetupTravelModeStep

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 3 DE 5                                       │
│ ━━━━━━━━━━━━━━━━━━━━━                        │
│                                              │
│ ¿Cómo vas a cruzar?                          │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │  👟  A pie                               │ │
│ │      Cruce peatonal                      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │  🚗  Vehículo personal               ●  │ │
│ │      Cruce en auto                       │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │  🚛  Comercial                           │ │
│ │      Transporte / carga                  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│                 Continuar →                  │
└──────────────────────────────────────────────┘
```

### Component

``` text
TR-SETUP-04
TripSetupTravelModeStep
```

### Tokens

``` text
Option surface: Surface
Selected surface: Surface Elevated
Selected border: Cruze Mint
Icon selected: Cruze Mint
Text: Text Primary
Secondary: Text Secondary
Radius:  8px
Gap: 12px
```

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`
