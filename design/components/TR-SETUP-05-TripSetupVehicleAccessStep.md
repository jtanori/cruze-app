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
Selected:       bg-cruze-mint/10 border-cruze-mint/50 (TripSetupVehicleAccessStep.tsx:34); title t("trip.setup.accessStep.title") + subtitle t("trip.setup.accessStep.subtitle") (TripSetupVehicleAccessStep.tsx:23-24) — fully i18n
Option surface: Surface
Border:         #1F3A54
Selected border: Cruze Mint
Radius:          8px
Padding:        16px
```

### Values

``` text
standard / readyLane / sentri / unknown (TripSetupVehicleAccessStep.tsx:12-17); labels+descs via labelKey/descKey t("trip.setup.accessStep.*") (TripSetupVehicleAccessStep.tsx:12-17) — fully i18n
```

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`