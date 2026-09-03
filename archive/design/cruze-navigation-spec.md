# CRUZE NAVIGATION SYSTEM

## Header + Bottom Navigation · Pixel-Level Specification
**Version:** 1.1 — Dark Theme  
**Status:** Locked Specification

---

# 01 — NAVIGATION PHILOSOPHY

> **Navigation is infrastructure. Border intelligence is the product.**

Navigation helps the user move through border intelligence without competing with it. It does not squeeze page height or force content into a single viewport.

```text
                     BORDER INTELLIGENCE
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
      CURRENT               SPACE                CHANGE
         │                    │                    │
      CRUCES                 MAPA                ALERTAS
         │               (Contextual)
     PERSONAL
         │
     FAVORITOS
```

---

# 02 — NAVIGATION TOKENS

```css
@theme {
  /* Navigation dimensions */
  --nav-header-height: 68px;
  --nav-header-compact-height: 56px;

  --nav-bottom-height: 72px;
  --nav-bottom-safe-area: env(safe-area-inset-bottom);

  /* Navigation spacing */
  --nav-header-padding-x: 20px;
  --nav-header-gap: 12px;

  --nav-bottom-padding-x: 20px;
  --nav-bottom-padding-y: 8px;

  /* Navigation controls */
  --nav-control-size: 44px;
  --nav-icon-size: 20px;
  --nav-icon-size-large: 22px;

  /* Navigation radii */
  --nav-control-radius: 12px;
  --nav-active-radius: 10px;

  /* Navigation motion */
  --nav-transition-duration: 180ms;
  --nav-transition-collapse: 200ms;

  /* Navigation layers */
  --nav-z-header: 40;
  --nav-z-bottom: 40;
  --nav-z-overlay: 100;
}
```

---

# 03 — HEADER SPECIFICATIONS

### 3.1 Dimensions & Grid
- **Height:** `68px` (collapsing to `56px` when `scrollY > 48px`).
- **Horizontal Padding:** `20px`.
- **Layout Grid:** 3-column mathematical centering:
  ```css
  grid-template-columns: minmax(44px, 1fr) auto minmax(44px, 1fr);
  ```
- **Touch Target:** Minimum `44 × 44px` with `20–22px` visual icons.

### 3.2 Header State Matrix

| State | Height | Leading (Left) | Center (Context) | Trailing (Right) |
| :--- | :--- | :--- | :--- | :--- |
| **Root** | 68px | Cruze Wordmark | — | Account / Live Status |
| **Context** | 68px | Back (`←`) | `Tijuana → San Diego ⇄` | Action / Overflow (`⋯`) |
| **Detail** | 68px | Back (`←`) | Crossing Name (`San Ysidro`) | Favorite (`☆`/`★`) |
| **Search** | 68px | Close (`×`) | Search input (`44px` height) | — |
| **Filter** | 68px | Close (`×`) | "Filters" | "Done" (Text action) |
| **Selection** | 68px | Close (`×`) | "2 selected" | "Done" (Text action) |
| **Compare** | 68px | Back / Close | "Compare" | "Done" (Text action) |
| **Focused** | 68px | Close (`×`) | Focused Topic | Contextual Action |
| **Collapsed** | 56px | Back (`←`) | Compact Title | Contextual Action |

---

# 04 — BOTTOM NAVIGATION SPECIFICATIONS (v1.1)

### 4.1 Destinations (Exactly 3)

| Destination | Icon | Purpose | Badge |
| :--- | :--- | :--- | :--- |
| **Cruces** | Road / Crossing | Current live border intelligence & decisions | No |
| **Favoritos** | Star (`☆`) | Monitored personal crossings & quick access | No |
| **Alertas** | Bell (`🔔`) | Actionable state changes (wait surges, closures) | Yes (1-9, 9+) |

*Explicitly Removed from Bottom Nav:*
- `Mapa` → Contextual visualization component inside cards & details.
- `Más` / `Settings` / `Profile` → Infrastructure, accessible via root header menu.
- `Actividad` → Replaced by actionable `Alertas`.

### 4.2 Layout & Sizing
- **Height:** `72px` content container + `env(safe-area-inset-bottom)`.
- **Columns:** 3 equal columns (`33.33%` each).
- **Stack per item:** `22px` icon + `4px` gap + `12px` label (`42px` vertical stack inside `72px` container).
- **Background & Border:** `bg-surface` with `border-t border-border-subtle`.
- **Active State Indicator:**
  - Active label & icon in **Cruze Green** (`#43D69A`, 600 weight).
  - Subtle top indicator bar (`20–24px` wide, `2–3px` high).
  - Inactive in `text-secondary` (`#A8B4C1`, 500 weight).

### 4.3 Safe Area & Scrolling Guarantee
- The page container owns natural vertical scrolling.
- Page content has bottom breathing padding:
  ```css
  padding-bottom: calc(var(--nav-bottom-height) + env(safe-area-inset-bottom));
  ```
- No squeezing of content sections or artificial viewport clamping.

### 4.4 Focus / Modal Visibility
- Bottom navigation is automatically hidden during full-screen search, comparisons, filter sheets, and modal flows.

---

# 05 — COMPONENT CONTRACTS

```ts
type HeaderVariant =
  | "root"
  | "context"
  | "detail"
  | "search"
  | "filter"
  | "selection"
  | "compare"
  | "focused"
  | "collapsed";

type BottomNavDestination = "crossings" | "favorites" | "alerts";

interface HeaderProps {
  variant: HeaderVariant;
  title?: string;
  subtitle?: string;
  direction?: "MX_TO_US" | "US_TO_MX";
  leadingAction?: { icon: string; label: string; onPress: () => void };
  trailingActions?: Array<{ id: string; icon: string; label: string; onPress: () => void; badge?: number }>;
  collapsed?: boolean;
}

interface BottomNavigationProps {
  activeDestination: BottomNavDestination;
  unreadAlerts?: number;
  onNavigate: (destination: BottomNavDestination) => void;
}
```
