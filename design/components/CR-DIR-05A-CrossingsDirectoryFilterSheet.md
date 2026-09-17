# CR-DIR-05A — CrossingsDirectoryFilterSheet
**Version:** 1.3 — 2026-09-16 — implementation sync; new; progressive disclosure replacing CR-DIR-05.If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## Component ID
CR-DIR-05A

## Name
CrossingsDirectoryFilterSheet

## Purpose
Progressive filter disclosure: scope, mode, state. Draft-then-apply; closing discards the draft. Fixed footer toolbar (optional `BottomSheet` footer slot).

## ASCII
```text
Filtros                                  ×
─────────────────────────────────────────
UBICACIÓN
  ● Cerca de ti
  ○ México
  ○ Estados Unidos
  ○ Toda la frontera

MODO
  ● Todos
  ○ Vehículo
  ○ A pie
  ○ Comercial

ESTADO
  ● Todos
  ○ Abiertos
  ○ Limitados
─────────────────────────────────────────
[              Aplicar                   ]
```

## Tokens
```text
Sheet:
  BottomSheet (portal to body, guaranteed width, scroll-lock)
  Title "Filtros", handle, X close

Groups:
  RadioGroup, space-y-6 between groups
  Labels: Inter 14px/500 uppercase section labels

Footer (fixed, sticky):
  border-t #1F3A54, px-5 py-4
  Aplicar: Button-mirror hollow-disabled — base border-transparent + bg-cruze-mint text-midnight; disabled:bg-surface-elevated/text-faint/border-border (NOT opacity-40). Impl CrossingsDirectoryFilterSheet.tsx:65.
```

## Props
```text
open: boolean
onClose: () => void
filters: DirectoryFilters { scope, mode, status }
onApply: (filters: DirectoryFilters) => void
nearbyAvailable: boolean  // NEARBY disabled with explanation when false
```

## Rules
- Estado follows W7 exactly: Todos / Abiertos / Limitados (no Cerrados option).
- NEARBY requires resolved country; disabled + "Requiere ubicación con país resuelto" otherwise. Never manufacture "Cerca de ti".
- Aplicar disabled until draft differs from applied filters (hasChanges = scope/mode/status diff, CrossingsDirectoryFilterSheet.tsx:48-51). Sheet fully i18n via crossings.filter.* keys (title/apply/scopeLabel/nearby/nearbyNeedsCountry/mx/us/allBorder/modeLabel/allModes/vehicle/walk/commercial/statusLabel/open/limited). KNOWN ISSUE (minor bug): status ALL row reuses crossings.filter.allModes (CrossingsDirectoryFilterSheet.tsx:110) — should be a dedicated status-all key; record, fix in alignment pass.
- Vocabulary: Vehículo (never "Auto").

## Composition
```text
CR-DIR-05A (CrossingsDirectoryFilterSheet)
├── BottomSheet[title=Filtros, footer=Aplicar]
│   ├── RadioGroup UBICACIÓN
│   ├── RadioGroup MODO
│   └── RadioGroup ESTADO
```

## Integration
Used in: C01 (FilterSheet state lives in page; applied filters feed `useCrossingsDirectory`).

## File Reference
- Implementation: `src/components/crossing/CrossingsDirectoryFilterSheet.tsx`
- Primitive: `src/components/primitives/BottomSheet.tsx` (+ footer slot)
- Catalog index: `design/components/README.md`
