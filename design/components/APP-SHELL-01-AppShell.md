# APP-SHELL-01 — AppShell
**Version:** 1.0 — 2026-09-16 — new spec backfilling shipped composition root. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`APP-SHELL-01`

## Name
AppShell

## Responsibility
Application composition root: header, content offsets, companions, bottom nav.

## Details
Props (`AppShell.tsx:16-28,37-49`): `children`, `headerVariant = "root"` (`HeaderVariant`), `headerTitle`, `hideBottomNav = false`, search (`searchValue/onSearchChange/searchPlaceholder`, `hasSearch = false`), `tripActions`, `bottomCompanion`, `headerCompanion`. Composes `TopAppBar` with variant/title/search/tripActions (`AppShell.tsx:63-70`). `headerCompanion` renders `fixed top-[var(--nav-header-height)] ... z-[var(--z-header)] bg-background border-b border-border-subtle` (`AppShell.tsx:72-76`). `main` top offset: `hasSearch ? header+80px : headerCompanion ? header+64px : header` (`AppShell.tsx:80-85`); bottom padding `calc(var(--nav-bottom-height) + env(safe-area-inset-bottom) + 24px)` (`AppShell.tsx:86`). `bottomCompanion` renders `fixed bottom-[var(--nav-bottom-height)] ... z-[var(--z-overlay)]` (`AppShell.tsx:92-96`). Bottom nav unless `hideBottomNav`; active destination from pathname — `/trip`→`trip`, `/agent`→`agent`, else `crossings` (`AppShell.tsx:30-35,98-100`); select pushes `/{locale}/trip|crossings|agent` (`AppShell.tsx:55-59`). Root wrapper `min-h-dvh bg-background` (`AppShell.tsx:62`). i18n: shell owns no user strings — clean.

### Details — SafeAreaWrapper (folded; no separate ID)
`SafeAreaWrapper({ children, className })` (`SafeAreaWrapper.tsx:5-8,15`) renders `pt-safe pb-safe px-safe` utilities + className passthrough (`SafeAreaWrapper.tsx:15-20`); "uses CSS `env()` for iOS safe-area insets" (`SafeAreaWrapper.tsx:10-14`). Mounted once in root `src/app/layout.tsx:43-45` wrapping all children; `ServiceWorkerRegister` is its sibling (`layout.tsx:42`).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §APP for canonical definition.

## Status
- Spec: defined (v1.0 2026-09-16)
- Implementation:
  - `src/components/layout/AppShell.tsx` — composition root: header variant, search/companion offsets, companions, bottom padding `calc(var(--nav-bottom-height))`
  - `src/components/layout/SafeAreaWrapper.tsx` — safe-area padding shell (folded pattern, no separate ID)
  - `src/components/layout/TopAppBar.tsx` — header renderer (variant `root` default, measured centering)
  - `src/components/layout/BottomNavigation.tsx` — bottom nav renderer
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Consumed by `src/app/[locale]/(main)/layout.tsx:91-98` (`headerVariant/headerTitle/headerCompanion/tripActions`); location-state content switch (loading/prompt/acquiring/error/ready) lives in the layout (`(main)/layout.tsx:71-88`), not in the shell. Shell chrome renders on all `(main)` routes.

## File Reference
- Spec doc: `design/components/APP-SHELL-01-AppShell.md` (this file)
- Implementation: `src/components/layout/AppShell.tsx`, `src/components/layout/SafeAreaWrapper.tsx`
- Catalog index: `design/components/README.md`
