# TR-SETUP-04 — 04
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

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
│ {"¿Cómo cruzas?"} hardcoded (TripSetupTravelModeStep.tsx:21) + "Selecciona tu modo de cruce" hardcoded (TripSetupTravelModeStep.tsx:22) — known deviation │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │  👟  A pie                               │ │
│ │      Cruce peatonal                      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ Vehículo privado / Comercial (+ A pie) hardcoded (TripSetupTravelModeStep.tsx:12-16); icons Footprints/Car/Truck (TripSetupTravelModeStep.tsx:3,12-16) │
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
Selected surface: bg-cruze-mint/10 border-cruze-mint/50 (TripSetupTravelModeStep.tsx:34-35)
Selected border: Cruze Mint
Icon selected: w-10 h-10 bg-cruze-mint + text-midnight icon; unselected bg-surface-elevated + text-muted (TripSetupTravelModeStep.tsx:39-40)
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