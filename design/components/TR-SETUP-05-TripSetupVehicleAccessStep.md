# TR-SETUP-05 — 05
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

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
Selected:       bg-cruze-mint/10 border-cruze-mint/50 (TripSetupVehicleAccessStep.tsx:33); title {"¿Cómo cruzas normalmente?"} hardcoded (TripSetupVehicleAccessStep.tsx:21) — known deviation
Option surface: Surface
Border:         #1F3A54
Selected border: Cruze Mint
Radius:          8px
Padding:        16px
```

### Values

``` text
standard / readyLane / sentri / unknown (TripSetupVehicleAccessStep.tsx:11-16); labels "Cruce estándar" / "Ready Lane" / "SENTRI / Global Entry" / "No estoy seguro" hardcoded (TripSetupVehicleAccessStep.tsx:12-15) — known deviation
```

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`