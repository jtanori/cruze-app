# PWA Art Assets — preparation checklist

> ✅ Final art installed 2026-09-15 from `IconKitchen-Output/web/`
> (apple-touch-icon 180, icon-192, icon-512, maskable-512 + favicon.ico).
> Verify on-device (DevTools → Application → Manifest, Lighthouse PWA) before
> announcing installability. Keep this file as the replacement procedure.

## Required files

| File | Size | Format | Purpose | Safe zone / notes |
|------|------|--------|---------|-------------------|
| `public/icons/apple-touch-icon.png` | 180×180 | PNG, opaque | iOS home screen | No transparency (iOS fills black); keep mark ≥20px from edges |
| `public/icons/icon-192.png` | 192×192 | PNG, opaque | Android install prompt minimum | Must exist or Chrome skips the prompt |
| `public/icons/icon-512.png` | 512×512 | PNG, opaque | Splash + store listing | Crisp at 1x; no text smaller than ~48px |
| `public/icons/maskable-512.png` | 512×512 | PNG, `purpose: maskable` | Adaptive icons (Android) | Keep mark inside centered **80% circle** (~51px padding); full-bleed background (no transparency) |

## Source art to prepare

1. **Cruze mark** (mint `#00E0A0` on midnight `#071A31`) as vector (SVG/Figma).
2. Background must be **opaque** for apple-touch + maskable.
3. No embedded text in the mark if possible (legibility at 48px).

## Generate + verify

```bash
# From a 1024px master (sips ships with macOS):
sips -z 180 180  master.png --out public/icons/apple-touch-icon.png
sips -z 192 192  master.png --out public/icons/icon-192.png
sips -z 512 512  master.png --out public/icons/icon-512.png
sips -z 512 512  master-padded.png --out public/icons/maskable-512.png

# Verify: DevTools → Application → Manifest (no warnings),
# Lighthouse → PWA category green, real-device iOS + Android pass.
```

## Out of scope (explicitly deferred)

- Web push (needs backend keys — SYNC-01 territory).
- Offline maps (tile storage is prohibitive; shell + API resilience only).
- Forced in-browser fullscreen (platform-forbidden; standalone via install is the path).
