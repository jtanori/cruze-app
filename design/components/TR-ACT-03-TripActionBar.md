# TR-ACT-03 — 03
**Version:** 1.3 — 2026-09-16 — implementation sync; W6 audit; 5 actions (Navegar, Ver cruce, Comparar, Configurar, Finalizar); labels hardcoded → should use `useTranslations()`. If version differs, revisit. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

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
| Navegar | t("trip.actions.navigate") (TripActionBar.tsx:24) | Primary Cruze Mint h-[48px] rounded-lg (TripActionBar.tsx:23) | `trackEvent("trip_action_navigate")` (TripActionBar.tsx:23) |
| Ver cruce | t("trip.actions.viewCrossing") (TripActionBar.tsx:29) | Secondary h-[48px] rounded-lg (TripActionBar.tsx:28) | `trackEvent("trip_action_view_crossing")` (TripActionBar.tsx:28) |
| Comparar | t("trip.actions.compare") (TripActionBar.tsx:35) | h-[40px] rounded-md (TripActionBar.tsx:35) | `trackEvent("trip_action_compare")` (TripActionBar.tsx:35) |
| Configurar | t("trip.actions.configure") (TripActionBar.tsx:40) | h-[40px] rounded-md (TripActionBar.tsx:40) | `trackEvent("trip_action_configure")` (TripActionBar.tsx:40) |
| Finalizar | t("trip.actions.complete") (TripActionBar.tsx:46) | text-only muted h-[40px], no bg/border (TripActionBar.tsx:45) | `trackEvent("trip_action_complete")` (TripActionBar.tsx:45) |

### Tokens

``` text
Container:
  flex gap-2

Layout two-row: row1 h-12 rounded-lg (TripActionBar.tsx:21-32) + row2 h-10 rounded-md (TripActionBar.tsx:33-49)

Primary (Navegar):
  bg-cruze-mint text-midnight

Secondary:
  bg-surface-elevated border border-border text-ink
```

### Rule

- All buttons fire `trackEvent()` before calling their handler
- "Finalizar" navigates to `/trip/completion` (does NOT call `store.complete()` — that happens on the completion page)
- Labels already via t("trip.actions.*") (TripActionBar.tsx:24,29,35,40,46)

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W6-active-trip.md`
- Catalog index: `design/components/README.md`
