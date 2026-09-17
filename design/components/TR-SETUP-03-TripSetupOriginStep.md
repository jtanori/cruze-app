# TR-SETUP-03 — 03
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

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
Selected: unselected bg-cruze-mint/10 border-cruze-mint/30; isSelected bg-cruze-mint/15 border-cruze-mint/40 (TripSetupOriginStep.tsx:133-137); manual-selected border-cruze-mint/40 bg-cruze-mint/5 (TripSetupOriginStep.tsx:203-207)
Radius:          8px
Padding:        16px
```

### Rule

Title {"¿Desde dónde sales?"} (TripSetupOriginStep.tsx:125), card "Mi ubicación actual" (TripSetupOriginStep.tsx:49,65,83,147), toggle "Ingresar punto de partida" (TripSetupOriginStep.tsx:173) all hardcoded — known deviation. Default origin is the established current location, but the user can
override it.

Preselection applies only when the location country is known (MX/US):
the card renders selected with resolved place + country lines. UNKNOWN
locations show the card unselected; tapping resolves via live
reverse-geocode instead of guessing. Manual search offers real geocoded
results only — fabricated coordinates/country are prohibited. Entry-step
back exits the flow via history; deeper steps walk back within the wizard.

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`