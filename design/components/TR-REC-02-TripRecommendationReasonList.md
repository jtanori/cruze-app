# TR-REC-02 — 02
**Version:** 1.2 — 2026-09-08 — T07 locked; reasons now use `RecommendationReasonCode` (structured codes + data, not prose). If version differs, revisit.

> **Canonical:** `design/workflows/T07-recommendation.md` — source of truth for reason codes. See `design/components/README.md`.

# 24. `TR-REC-02` --- TripRecommendationReasonList

### ASCII

``` text
¿POR QUÉ ESTE CRUCE?

✓ Menor tiempo total
✓ Datos en vivo
```

### Purpose

Explains why the engine recommended this crossing. Reasons are data-derived from `RecommendationReason.code` + `data`.

### Props

```typescript
interface TripRecommendationReasonListProps {
  reasons: string[];  // pre-mapped i18n strings from code + data
  className?: string;
}
```

### Reason code mapping

The page component maps `RecommendationReason.code` to i18n strings:

| Code | Spanish | English |
|------|---------|---------|
| `fastest_total_time` | Menor tiempo total | Fastest total time |
| `shortest_wait` | Menor tiempo de espera | Shortest wait |
| `best_access_match` | Mejor compatibilidad de acceso | Best access match |
| `only_open_option` | Única opción abierta | Only open option |
| `closest_to_route` | Más cercano a tu ruta | Closest to route |
| `candidate_preference` | Cruce seleccionado previamente | Previously selected crossing |

Data fields (e.g. `accessType`, `deltaMinutes`) are interpolated into the localized string.

### Tokens

``` text
Heading:     Inter 12px / 700 uppercase
             Text Secondary

Reason:      text-sm text-muted (TripRecommendationReasonList.tsx:24)

Check:       w-5 h-5 rounded-full bg-success/15 circled + Check w-3 h-3 text-success (TripRecommendationReasonList.tsx:21-22)

Gap:         12px between reasons
```

### Rule

- Reasons should be data-derived and explain the recommendation
- Engine never produces human-readable text — UI layer handles i18n
- Returns null if reasons array is empty

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/T07-recommendation.md`
- Catalog index: `design/components/README.md`
