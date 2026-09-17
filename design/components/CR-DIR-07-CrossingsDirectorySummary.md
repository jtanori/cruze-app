# CR-DIR-07 — CrossingsDirectorySummary
**Version:** 1.3 — 2026-09-16 — implementation sync; new; count reflects total matching query.If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
CR-DIR-07

## Name
CrossingsDirectorySummary

## Purpose
Result count (total matching query, not loaded viewport) + scope copy. Renders opposite the sort control.

## ASCII
```text
42 cruces · Toda la frontera              Más cercanos ↓
```

```text
8 cruces · Cerca de ti                    Más cercanos ↓
```

## Tokens
```text
Count:
  Inter 14px, Text Primary, tabular
  role="status"

Scope copy:
  NEARBY → "Cerca de ti"
  MX → "México"
  US → "Estados Unidos"
  ALL → "Toda la frontera"

Separator: "·" (single-line metadata, never wraps to two lines)
```

## Props
```text
total: number
scope: CrossingsScope
sort: CrossingsSort
onSortChange: (sort: CrossingsSort) => void
isSearching?: boolean
className?: string
```

## Rules
- Count = `total` from query response, never `items.length`.
- Singular "cruce" at total === 1. isSearching (impl CrossingsDirectorySummary.tsx:11,37,44): true → "N cruces encontrados" (search result), false → "N cruces · scope" (scope copy).

## Composition
```text
CR-DIR-07 (CrossingsDirectorySummary)
├── Count + scope (role=status)
└── CR-DIR-08 SortControl
```

## Integration
Used in: C01 below the companion toolbar.

## File Reference
- Implementation: `src/components/crossing/CrossingsDirectorySummary.tsx`
- Catalog index: `design/components/README.md`
