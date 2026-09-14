# TR-ACT-03 — 03
**Version:** 1.2 — 2026-09-08 — W6 audit; 5 actions (Navegar, Ver cruce, Comparar, Configurar, Finalizar); labels hardcoded → should use `useTranslations()`. If version differs, revisit.

> **Canonical:** `design/workflows/W6-active-trip.md` — source of truth for active trip actions. See `design/components/README.md`.

# 29. `TR-ACT-03` --- TripActionBar

### ASCII

``` text
┌──────────────────────────────────────────────┐
│ Navegar  │ Ver cruce │ Comparar │ Config │ Fin│
└──────────────────────────────────────────────┘
```

### Purpose

Action buttons for the active trip. All buttons are optional — only rendered when handler is provided.

### Props

```typescript
interface TripActionBarProps {
  onNavigate?: () => void;
  onViewCrossing?: () => void;
  onCompare?: () => void;
  onConfigure?: () => void;
  onComplete?: () => void;
  className?: string;
}
```

### Actions

| Action | Label | Style | Event |
|--------|-------|-------|-------|
| Navegar | Navegar | Primary (Cruze Mint) | `trackEvent("trip_navigate")` |
| Ver cruce | Ver cruce | Secondary | `trackEvent("trip_view_crossing")` |
| Comparar | Comparar | Secondary | `trackEvent("trip_compare")` |
| Configurar | Configurar | Secondary | `trackEvent("trip_configure")` |
| Finalizar | Finalizar | Secondary | `trackEvent("trip_complete")` → navigates to `/trip/completion` |

### Tokens

``` text
Container:
  flex gap-2

Button:
  h-44px px-4
  rounded-md
  Inter 13px / 500

Primary (Navegar):
  bg-cruze-mint text-midnight

Secondary:
  bg-surface-elevated border border-border text-ink
```

### Rule

- All buttons fire `trackEvent()` before calling their handler
- "Finalizar" navigates to `/trip/completion` (does NOT call `store.complete()` — that happens on the completion page)
- Labels should use `useTranslations()` (currently hardcoded Spanish)

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W6-active-trip.md`
- Catalog index: `design/components/README.md`
