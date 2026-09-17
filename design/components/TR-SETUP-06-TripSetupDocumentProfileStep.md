# TR-SETUP-06 — 06
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

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
│ Title t("trip.setup.documentStep.title") + subtitle t("trip.setup.documentStep.subtitle") + disclaimer t("trip.setup.documentStep.disclaimer") (TripSetupDocumentProfileStep.tsx:25-33) — fully i18n │
│                                              │
│ Esto ayuda a filtrar opciones de acceso.     │
│ No necesitamos números de documentos.        │
│                                              │
│ 5 options via t(): trip.document.passport / visa / usCitizen / trip.trustedTraveler / trip.document.unknown (TripSetupDocumentProfileStep.tsx:14-20,46); skip via t("trip.setup.skip") (TripSetupDocumentProfileStep.tsx:59) │
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