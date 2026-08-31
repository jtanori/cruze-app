# CRUZE — `MapContext` Component Spec (C5)
**Status:** Component contract (planning). No standalone map page; map is contextual evidence.
**Embed points (decided):** P01 Cruces rows (mini), P01 header (expandable block), P02 Crossing Detail (prominent), P03 Recommendation hero (prominent), P04 Compare (mini per port).

---

## 1. Purpose
Show *physical* transit context (approach roads, POE geometry, lane-program location) to explain a wait or recommendation. Never a navigation surface on its own.

## 2. Props (API)
```ts
type MapVariant = "mini" | "prominent" | "expandable";

interface MapContextProps {
  crossingId: CrossingId;
  mode?: CrossingMode;          // highlight SENTRI / Ready / standard lane approach
  variant: MapVariant;
  showApproach?: boolean;       // draw drive-time vector from trip origin
  height?: number;              // px; default per variant (mini 96, prominent 180, expandable 220)
  onExpand?: () => void;        // expandable only: opens /crossings/:id
}
```

## 3. Data source
- `southboundOverlay` (Caltrans approach) + `liveOverlay` for current conditions.
- Static geo (port centroid, approach polyline) from a local `geo.ts` table — no network for the base map.
- If live geometry unavailable, render the **mini static thumbnail** + a "map unavailable" caption (inline state, never a full error).

## 4. Behavior by variant
| Variant | Where | Interaction |
| :--- | :--- | :--- |
| `mini` | P01 row, P04 compare row | Static thumbnail; non-interactive |
| `prominent` | P02 detail, P03 hero | Tap → expand to `expandable` or navigate to detail |
| `expandable` | P01 header block | Tap → opens `/crossings/:id` (detail) |

## 5. Accessibility
- Decorative by default: `aria-hidden="true"` with a text sibling summarizing the delta ("12 min drive from Tijuana").
- When it conveys a wait delta, provide an `aria-label`.
- Respect `prefers-reduced-motion` (no pan/zoom animation).

## 6. Forbidden
- No bottom-nav entry. No full-screen map route. No ad overlay on the map surface.
