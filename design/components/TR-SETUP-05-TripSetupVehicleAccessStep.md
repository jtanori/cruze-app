# TR-SETUP-05 — 05

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 14. `TR-SETUP-05` --- TripSetupVehicleAccessStep

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 4 DE 5                                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━                  │
│                                              │
│ TIPO DE ACCESO                               │
│ ¿Qué tipo de acceso tienes?                  │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 🚗  Estándar                         ○  │ │
│ │     Carriles generales                  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ⚡  Ready Lane                       ○  │ │
│ │     Carriles Ready Lane                 │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ◉   SENTRI                           ○  │ │
│ │     Carriles SENTRI                     │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│                 Continuar →                  │
└──────────────────────────────────────────────┘
```

### Component

``` text
TR-SETUP-05
TripSetupVehicleAccessStep
```

### Tokens

``` text
Selected:       Cruze Mint
Option surface: Surface
Border:         #1F3A54
Selected border: Cruze Mint
Radius:          8px
Padding:        16px
```

### Values

``` text
STANDARD
READY_LANE
SENTRI
```

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`
