# TR-SETUP-06 — 06

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 15. `TR-SETUP-06` --- TripSetupDocumentProfileStep

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 5 DE 5                                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━            │
│                                              │
│ DOCUMENTO DE VIAJE                           │
│ ¿Qué documento utilizas para viajar?         │
│                                              │
│ Esto ayuda a filtrar opciones de acceso.     │
│ No necesitamos números de documentos.        │
│                                              │
│ ○  Pasaporte / documento de viaje             │
│ ○  Visa                                       │
│ ○  Ciudadano / residente de EE.UU.            │
│ ○  No estoy seguro                            │
│                                              │
│                    Omitir                    │
│                                              │
│              Ver recomendación →             │
└──────────────────────────────────────────────┘
```

### Component

``` text
TR-SETUP-06
TripSetupDocumentProfileStep
```

### Tokens

``` text
Title:          Sora 24–28px / 700
Body:           Inter 16–18px
Option:         Surface
Selected:       Cruze Mint
Radio:          20–24px
Radius:          8px
Primary CTA:    Cruze Mint
Secondary:      Text Secondary
```

### Rules

Never collect:

``` text
Passport number
Document number
Credential
Sensitive document identifier
```

The profile is recommendation context, not legal eligibility
verification.

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`
