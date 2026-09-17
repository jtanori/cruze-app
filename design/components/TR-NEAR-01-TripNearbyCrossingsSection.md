# TR-NEAR-01 — 01
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 16. `TR-NEAR-01` --- TripNearbyCrossingsSection

### ASCII

``` text
CERCA DE TI
Cruces relevantes ahora (text-xs, stacked — never same-line parity)

┌──────────────────────────────────────────────┐
│ TR-NEAR-02                                   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ TR-NEAR-02                                   │
└──────────────────────────────────────────────┘

              Ver todos los cruces →
```

### Tokens

``` text
Section gap:       24–32px
Heading:           text-[18px] font-semibold uppercase tracking-wider text-[color:var(--color-text-primary)] (TripNearbyCrossingsSection.tsx:55)
Link:              text-cruze-mint (TripNearbyCrossingsSection.tsx:38,74)
Supporting text:   Text Secondary
```

### Rules

Maximum:

``` text
2–3 crossings
```

The section is not a duplicate of the Cruces directory.

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`