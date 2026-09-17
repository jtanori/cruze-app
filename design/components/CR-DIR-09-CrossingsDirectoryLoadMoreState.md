# CR-DIR-09 — CrossingsDirectoryLoadMoreState
**Version:** 1.2 — 2026-09-07 — new; cursor pagination control. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
CR-DIR-09

## Name
CrossingsDirectoryLoadMoreState

## Purpose
Progressive loading control. Rendered only when `hasMore`; spinner while appending.

## ASCII
```text
t("crossings.directory.loadMore")
```

```text
◌  (loadingMore)
```

## Tokens
```text
Button:
  Cruze Mint, 14px/500, underline on hover
  min-h-44px touch target
  role="status" wrapper
```

## Props
```text
loadingMore: boolean
onLoadMore: () => void
className?: string
```

## Rules
- Never rendered when `hasMore` is false.
- Appends via cursor; total/count unchanged semantics (see `useCrossingsDirectory`).

## Composition
```text
CR-DIR-09
└── Cargar más | Spinner(md)
```

## Integration
Used in: C01 list footer via CrossingsDirectoryList.

## File Reference
- Implementation: `src/components/crossing/CrossingsDirectoryLoadMoreState.tsx`
- Catalog index: `design/components/README.md`
