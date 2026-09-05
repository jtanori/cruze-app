# TR-SETUP-02 — 02
**Version:** 1.1 — 2026-09-04 — radii 4/8/12/16/20, W5 1.1. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 10. `TR-SETUP-02` --- TripSetupDestinationStep

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ ←  Nuevo viaje                               │
│                                              │
│ 1 DE 5                                       │
│ ━━━━━━━━━                                    │
│                                              │
│ ¿A dónde vas?                                │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ⌕  Buscar en EE.UU...                    │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ San Diego, CA                         🇺🇸    │
│ Los Angeles, CA                       🇺🇸    │
│ Phoenix, AZ                           🇺🇸    │
│                                              │
│                 Siguiente →                  │
└──────────────────────────────────────────────┘
```

### Tokens

``` text
Page background: body gradient
Header:          app shell
Search:          Surface Elevated
Search border:   #1F3A54
Result text:     Text Primary
Secondary data:  Text Secondary
Selected:        Cruze Mint
```

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`