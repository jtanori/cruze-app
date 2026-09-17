# CR-DIR-06 — CrossingsDirectoryToolbar
**Version:** 1.3 — 2026-09-16 — implementation sync; new; replaces permanent filter bar as C01 control surface.If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
CR-DIR-06

## Name
CrossingsDirectoryToolbar

## Purpose
Compact utility row: search entry + filter trigger. Uses SearchInput primitive (impl CrossingsDirectoryToolbar.tsx:4,28-33); placement is caller-owned flex row (`flex items-center gap-2` + className passthrough, CrossingsDirectoryToolbar.tsx:26) — NOT an APP-COMPANION-01 portal. Deviation: placeholder/aria hardcoded "Buscar cruces" (CrossingsDirectoryToolbar.tsx:31-32) — must become t() key in alignment pass.

## ASCII
```text
[ 🔍 Buscar cruces... ]  [≡ n]
```

## Tokens
```text
Layout:
  flex, gap-2 (8px)
  search flex-1 min-w-0

Trigger:
  w-11 h-11 (44px touch)
  Surface bg, Border #1F3A54
  Radius 8px (md)

Count badge (activeFilterCount > 0):
  Cruze Mint bg, Midnight text
  11px bold tabular, rounded-full
  absolute -top-1.5 -right-1.5
```

## Props
```text
query: string
onQueryChange: (value: string) => void
activeFilterCount: number
onOpenFilters: () => void
className?: string
```

## Rules
- Toolbar is a utility, not a content block (~56px tall with wrapper padding).
- Count badge announces active filters; aria-label carries the count.
- Never permanent country/mode segmented controls.

## Composition
```text
CR-DIR-06 (CrossingsDirectoryToolbar)
├── CR-DIR-04 SearchInput (flex-1)
└── Filter trigger (≡ + count badge)
```

## Integration
Used in: C01 as caller-placed row (no portal, no +64px offset); opens CR-DIR-05A sheet.
Opens: CR-DIR-05A sheet.

## File Reference
- Implementation: `src/components/crossing/CrossingsDirectoryToolbar.tsx`
- Catalog index: `design/components/README.md`
