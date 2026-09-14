# APP-COMPANION-01 — HeaderCompanionContext
**Version:** 1.2 — 2026-09-07 — new; per-page fixed chrome under the header. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
APP-COMPANION-01

## Name
HeaderCompanionContext (+ HeaderCompanionProvider, useHeaderCompanion)

## Purpose
Lets a page portal fixed chrome (search/filter toolbar) into the AppShell slot directly under the header. Content area never owns search/filter layout.

## ASCII
```text
┌─────────────────────────────────────┐
│ [APP-HEAD-01] (fixed)               │
├─────────────────────────────────────┤
│ [APP-COMPANION-01] (fixed, +64px)   │
│ [ 🔍 … ]  [≡]  ← page-provided      │
├─────────────────────────────────────┤
│ PAGE CONTENT (scrolls)              │
└─────────────────────────────────────┘
```

## Tokens
```text
Slot:
  fixed, top = nav-header-height
  bg-background, border-b #1F3A54 (subtle)
  z-header

Content offset:
  header + 64px (hasSearch legacy path: +80px)
```

## API
```text
HeaderCompanionProvider — wraps (main) layout
useHeaderCompanion() → { headerCompanion, setHeaderCompanion, headerTitle, setHeaderTitle }
```

## Rules
- Pages set companion in `useEffect`, clear on unmount (`return () => setHeaderCompanion(null)`).
- Route titles (CRUCES/AGENTE/…) resolve in layout; `headerTitle` override wins when set.
- C01 portals CR-DIR-06 here.

## Composition
```text
AppShell
├── TopAppBar
├── headerCompanion slot (fixed)
└── main (offset)
```

## Integration
Provider: `(main)/layout.tsx`. Consumer: C01 crossings page.

## File Reference
- Implementation: `src/components/layout/HeaderCompanionContext.tsx`
- Catalog index: `design/components/README.md`
