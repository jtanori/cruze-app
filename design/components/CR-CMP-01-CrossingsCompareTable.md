# CR-CMP-01 — CrossingsCompareTable
**Version:** 2.0 — 2026-09-07 — comparison matrix with per-row actions; winner/fastest/alternative semantics. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`CR-CMP-01`

## Name
CrossingsCompareTable

## Responsibility
Decision comparison matrix (§31): shared-attribute rows with crossing names as column headers. Per-row candidate action below the matrix. NOT a directory list, NOT a recommendation screen — a surface for choosing between candidates.

## Details

### Matrix structure
Vertically structured attribute rows (Estado, Norte, Sur, Distancia, Datos) with crossing names as sticky column headers. Matrix scrolls horizontally on narrow viewports (`overflow-x-auto`, `min-w-[480px]` inner); page stays fixed. Winner column gets subtle tint (`bg-cruze-mint/[0.04]`).

### Winner / Fastest / Alternative semantics
- `isWinner`: best overall (shortest computable viaje, else shortest wait) — label: "Mejor opción"
- `isFastest`: lowest comparable wait in active direction (may differ from winner when distance matters) — label: "Más rápido"
- `isAlternative`: eligible but not winner or fastest — label: "Alternativa"
- `excluded`: incompatible mode — no action, dimmed, no label

Exactly one winner, exactly one fastest (when different from winner). Labels are mutually exclusive per row.

### Both directions
When `bothDirections` is true (direction context is null / UNKNOWN), the matrix shows both Norte and Sur rows. Direction hierarchy: trip direction → contextual country direction → null (both). Never defaults to MX_TO_US.

### Per-row action
Each candidate gets a compact footer row below the matrix: crossing name + winner label + "Usar este cruce →" text-link. Excluded rows show "No compatible" with no action.

### Freshness
Uses shared `formatFreshness` vocabulary: "Ahora" / "Hace X min" / "Datos desactualizados · X h" / "Sin datos". No "En vivo".

### Data honesty
Absence renders as "—". Fabricated data (status, wait, timestamps) forbidden.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §CR for canonical definition.

## Status
- Spec: defined (aligned 2026-09-16)
- Implementation: `src/components/crossing/CrossingsCompareTable.tsx` — winnerLabel carries i18n KEYS (`crossings.compare.bestOption/fastestOption/alternativeOption`, lib `crossings-compare.ts:28-32,171-179`), rendered via t() (CompareTable.tsx:186); distances via formatDistance (CompareTable.tsx:133); headers font-display (Sora utility — `font-sora` does not exist, fixed 2026-09-16); matrix + action cards rounded-[var(--radius-lg)] (CompareTable.tsx:43,164). Fully i18n.
- Workflow usage: see `design/workflows/W7-crossings.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via C04 compare page, reachable from C03 detail ("Comparar cruces →") and from Trip context.

## File Reference
- Spec doc: `design/components/CR-CMP-01-CrossingsCompareTable.md` (this file)
- Implementation: `src/components/crossing/CrossingsCompareTable.tsx`
- Domain: `src/lib/crossings-compare.ts`
- Hook: `src/hooks/useCrossingsCompare.ts`
- Route: `src/app/[locale]/(main)/crossings/compare/page.tsx`
- Catalog index: `design/components/README.md`
