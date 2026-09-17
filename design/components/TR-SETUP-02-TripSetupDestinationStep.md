# TR-SETUP-02 — 02
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

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
│ Title t("trip.setup.destinationStep.title") + subtitle t("trip.setup.destinationStep.subtitle") (TripSetupDestinationStep.tsx:18-19) — fully i18n │
│                                              │
│ <DestinationSearch userLat/userLng/userCountry onSelect={mapPlaceToDestination} /> (TripSetupDestinationStep.tsx:22-29) — no onNext passed │
│                                              │
│ San Diego, CA                         🇺🇸    │
│ Los Angeles, CA                       🇺🇸    │
│ Phoenix, AZ                           🇺🇸    │
│                                              │
│ (no CTA / no onNext — advance is auto onSelect → setStep("origin") in Flow (TripSetupFlow.tsx:213-219)) │
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