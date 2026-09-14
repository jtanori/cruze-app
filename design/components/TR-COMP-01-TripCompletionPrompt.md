# TR-COMP-01 — 01
**Version:** 1.2 — 2026-09-08 — W6 audit; completion page reads from trip store (no hardcoded data); `store.complete()` called on save; labels hardcoded → should use `useTranslations()`. If version differs, revisit.

> **Canonical:** `design/workflows/W6-active-trip.md` — source of truth for completion lifecycle. See `design/components/README.md`.

# 31. `TR-COMP-01` --- TripCompletionPrompt

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ VIAJE COMPLETADO                             │
│                                              │
│ Tijuana → San Diego                          │
│ Cruce: San Ysidro                            │
│                                              │
│ [ Guardar en Mis viajes ]                    │
│ [ Listo ]                                    │
└──────────────────────────────────────────────┘
```

### Purpose

Completion confirmation after the user finishes a trip. Shows trip summary and provides save/done actions.

### Props

```typescript
interface TripCompletionPromptProps {
  originLabel: string;
  destinationLabel: string;
  crossingName: string;
  onSave?: () => void;
  onDone?: () => void;
  className?: string;
}
```

### Data source

Props come from `TripState`:
- `originLabel` ← `start?.name ?? t("common.origin")`
- `destinationLabel` ← `destination?.name ?? t("common.destination")`
- `crossingName` ← `recommendedCrossing?.crossingName ?? t("common.crossing")`

### Lifecycle

When "Guardar en Mis viajes" is clicked:
1. Parent calls `store.complete()` — creates `CompletedTrip` record, sets `completed = true`
2. Parent navigates to `/trip`

When "Listo" is clicked:
1. Parent calls `store.complete()` — same as above
2. Parent navigates to `/trip`

### Tokens

``` text
Title:
  Inter 11px / 700 uppercase
  Text Secondary

Route:
  Inter 14px
  Text Primary

Crossing:
  Inter 13px
  Text Secondary

Primary CTA:
  h-48px w-full
  bg-cruze-mint text-midnight
  Inter 14px / 600
  rounded-lg

Secondary:
  Inter 14px
  Text Secondary
  No background
```

### Rule

- `store.complete()` MUST be called before navigation — this is the ACTIVE → COMPLETED transition
- Labels should use `useTranslations()` (currently hardcoded Spanish)
- Fallback labels for missing data should use i18n (currently hardcoded "Origen", "Destino", "Cruce")

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W6-active-trip.md`
- Catalog index: `design/components/README.md`
