# CR-DIR-08 — CrossingsDirectorySortControl
**Version:** 1.2 — 2026-09-07 — new; single affordance, NEAREST default. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
CR-DIR-08

## Name
CrossingsDirectorySortControl

## Purpose
Compact sort selector. Exactly one affordance (`Más cercanos ↓`) — native select appearance suppressed, custom chevron only.

## ASCII
```text
Más cercanos ↓
```

## Tokens
```text
Control:
  h-9 (36px), transparent bg
  Inter 14px, Text Secondary (faint)
  appearance-none, single ↓ chevron (no native + custom duplicate)
```

## Options (this order)
```text
NEAREST  → Más cercanos  (default)
RELEVANCE → Relevancia
FASTEST  → Más rápidos
NAME     → Nombre
```

## Props
```text
sort: CrossingsSort
onSortChange: (sort: CrossingsSort) => void
```

## Rules
- Default NEAREST (operator decision; W7 §13 canon is RELEVANCE — deviation recorded here).
- Lives inside CR-DIR-07; no standalone placement.

## Composition
```text
CR-DIR-08 (SortControl)
└── select (appearance-none) + ↓
```

## Integration
Used in: C01 via CrossingsDirectorySummary. Feeds `useCrossingsDirectory` sort.

## File Reference
- Implementation: part of `src/components/crossing/CrossingsDirectorySummary.tsx`
- Catalog index: `design/components/README.md`
