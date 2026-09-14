# CR-DET-02 — CrossingDetailMap
**Version:** 2.0 — 2026-09-07 — contextual map with route overlay; graceful degradation chain (interactive → static → unavailable). If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`CR-DET-02`

## Name
CrossingDetailMap

## Responsibility
Contextual geographic map for a crossing. Displays the selected crossing location and, when valid trip context is available, renders an origin → crossing → destination route overlay.

## Details

### Two modes

| Context | Map behavior |
|---------|-------------|
| No trip context | Crossing marker + popup |
| Valid origin + destination | Journey route + 3 markers + bounds |
| Directions unavailable | Crossing map without route |
| Interactive map unavailable | Static crossing map |
| All map rendering unavailable | "Mapa no disponible" |

### Journey mode
Both origin AND destination must exist with valid coordinates before rendering the route. No partial routing (origin→crossing or crossing→destination alone). Route overlay = two-layer glow + solid line (mint #43E0B0). Three markers: origin (white), crossing (pulsing mint), destination (green). Bounds fitted to encompass all three points.

### Graceful degradation chain
(mapbox-gl v3 requires WebGL2, not just WebGL1):
1. Interactive GL map (dark-v11, zoom 14 crossing-only / zoom 6 journey, markers + route).
2. Static map image (same style + marker, no WebGL needed) when WebGL2 is unavailable or interactive init throws.
3. "Map no disponible" card only when the token is missing or the static image itself fails.

Route failure is non-fatal: if Directions API fails, the interactive map remains usable with markers but no route line.

### Props
```ts
interface CrossingDetailMapProps {
  lat?: number;
  lng?: number;
  crossingName?: string;
  origin?: MapPoint | null;      // { lat, lng, label? }
  destination?: MapPoint | null;  // { lat, lng, label? }
  className?: string;
}
```

### Trip context
C03 wires origin/destination via `useTripMapContext()` which derives valid context from the trip store. The map is domain-agnostic — it receives points, not store objects.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §CR for canonical definition.

## Status
- Spec: defined
- Implementation: `src/components/crossing/CrossingDetailMap.tsx`
- Route primitives: `src/lib/map-route.ts`
- Context hook: `src/hooks/useTripMapContext.ts`
- Workflow usage: see `design/workflows/W7-crossings.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Embedded in C03 (Crossing Detail). Consumed via `useTripMapContext()` for journey mode.

## File Reference
- Spec doc: `design/components/CR-DET-02-CrossingDetailMap.md` (this file)
- Implementation: `src/components/crossing/CrossingDetailMap.tsx`
- Route primitives: `src/lib/map-route.ts`
- Context hook: `src/hooks/useTripMapContext.ts`
- Catalog index: `design/components/README.md`
