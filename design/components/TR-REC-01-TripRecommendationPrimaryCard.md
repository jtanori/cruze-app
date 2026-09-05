# TR-REC-01 — 01

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 23. `TR-REC-01` --- TripRecommendationPrimaryCard

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ RECOMENDADO                                  │
│                                              │
│ San Ysidro                                   │
│ Ready Lane                                   │
│                                              │
│ 12 min              40 min total             │
│ Espera              Tiempo estimado          │
│                                              │
│ ● Abierto                                    │
│ Actualizado hace 2 min                       │
└──────────────────────────────────────────────┘
```

### Purpose

Primary decision surface.

### Tokens

``` text
Surface:          Surface Elevated
Border:           1px #1F3A54
Radius:           12px
Padding:          20–24px

Recommendation:
  Sora 12–14px / 700
  Cruze Mint

Crossing:
  Sora 28–34px / 700

Primary metric:
  Sora 36–48px / 700
  Cruze Mint

Secondary metric:
  Sora 20–28px / 600
  Text Primary
```

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`
