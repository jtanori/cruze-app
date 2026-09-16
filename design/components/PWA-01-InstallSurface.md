# PWA-01 — Install Surface
**Version:** 1.0 — 2026-09-15 — backfilled for shipped install UX (D4 decision).

## ID
`PWA-01`

## Name
Install Surface

## Responsibility
Home-screen installation UX: Android one-tap install, iOS share-sheet guidance,
 Pau offline shell (manifest + service worker + metadata contract).

## Details
- `PwaInstallRow` (settings): one-tap `beforeinstallprompt` install button on
  Android/Chrome; illustrated Share → Add to Home Screen guidance on iOS;
  hidden when installed or dismissed (dismissal persisted).
- `usePwaInstall`: captures the install prompt, detects iOS/standalone,
  exposes `canInstall/showIOSGuide/promptInstall/dismiss`.
- Installability contract: `manifest.webmanifest` (standalone, 192+512+
  maskable icons), `sw.js` (shell precache, navigation fallback, never caches
  `/api/*`), layout metadata (manifest link, appleWebApp, touch icons).
- No web push (SYNC-01 territory). No offline maps.

## Source
D4 decision (code preceded spec; this file closes the gap).

## Status
- Spec: defined
- Implementation: `src/components/pwa/PwaInstallRow.tsx`, `src/hooks/usePwaInstall.ts`,
  `public/manifest.webmanifest`, `public/sw.js`, `src/app/layout.tsx` metadata
- Workflow usage: S01 settings row

## Tokens
W5 §1-2 foundations. Primary install button matches send-button treatment.

## Integration
Final art per `docs/PWA_ASSETS.md` (IconKitchen set installed).

## File Reference
- Spec doc: `design/components/PWA-01-InstallSurface.md` (this file)
- Implementation: `src/components/pwa/`, `src/hooks/usePwaInstall.ts`
- Catalog index: `design/components/README.md`
