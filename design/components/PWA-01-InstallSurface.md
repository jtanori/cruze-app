# PWA-01 — Install Surface
**Version:** 1.1 — 2026-09-16 — implementation sync; backfilled for shipped install UX (D4 decision). If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`PWA-01`

## Name
Install Surface

## Responsibility
Home-screen installation UX: Android one-tap install, iOS share-sheet guidance,
 Pau offline shell (manifest + service worker + metadata contract).

## Details
- `PwaInstallRow` (settings page-placed section, NOT inside `SettingsRoot` — see
  `src/app/[locale]/settings/page.tsx:18`): eyebrow `t("pwa.section")`
  (`PwaInstallRow.tsx:20`, es `INSTALAR` / en `INSTALL`) above card
  (`PwaInstallRow.tsx:19-21` wrapper `space-y-2`); card
  `bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-3`
  (`PwaInstallRow.tsx:21`); one-tap `beforeinstallprompt` install button on
  Android/Chrome; illustrated Share → Add to Home Screen guidance on iOS;
  hidden when installed or dismissed (dismissal persisted via
  `cruze-pwa-install-dismissed` in `usePwaInstall.ts:10,27,62-69`).
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
  `public/manifest.webmanifest`, `public/sw.js`, `src/app/layout.tsx` metadata,
  `src/components/pwa/ServiceWorkerRegister.tsx` (null-render effect: registers
  `/sw.js` on window load, no-op without service-worker support or on failure —
  `ServiceWorkerRegister.tsx:6-23`; mounted in `src/app/layout.tsx:42`; folded
  into PWA-01, no separate PWA-02 ID)
- Workflow usage: S01 settings page section (page-placed above `SettingsRoot`, not a `SettingsRoot` row — corrects prior "S01 settings row" wording)

## Tokens
W5 §1-2 foundations. Primary install button matches send-button treatment.

## Integration
Final art per `docs/PWA_ASSETS.md` (IconKitchen set installed).

## File Reference
- Spec doc: `design/components/PWA-01-InstallSurface.md` (this file)
- Implementation: `src/components/pwa/`, `src/hooks/usePwaInstall.ts`
- Catalog index: `design/components/README.md`
