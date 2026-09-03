# CRUZE — Updated Integration Plan
## Post-Implementation Integration Status · v2.0

---

## Executive Summary

This document reflects the **actual implemented state** of the Cruze border intelligence application as of the v2.0 release (7 atomic commits). It supersedes the original v1 integration plan and design system specification.

**Status**: ✅ **COMPLETE** — All primary integration work is done. The application has a unified navigation system, consistent design tokens, and a cohesive component architecture.

---

## Implementation Summary

### What Was Delivered (v2.0)

| Area | Status | Notes |
|------|--------|-------|
| **Unified Navigation** | ✅ Complete | AppShell with headerCompanion/bottomCompanion slots |
| **Consistent Header** | ✅ Complete | TopAppBar with dropdown menu, MX\|USA next to app name |
| **Consistent Bottom Nav** | ✅ Complete | 5 tabs (Viaje, Cruces, Agente, Favoritos, Alertas) |
| **Crossings Page** | ✅ Complete | Default MX filter, fixed invisible Mexico pill, filter pills in content |
| **Trip View** | ✅ Complete | BestCrossingCard + CrossingOptionCard for alternatives |
| **Agent Chat** | ✅ Complete | Fixed input bar above bottom nav |
| **All Pages Unified** | ✅ Complete | Viaje, Cruces, Alertas, Favoritos, Agente, Onboarding, Home |
| **Design Tokens** | ✅ Complete | Semantic colors, spacing, radius, typography in globals.css |
| **Component Library** | ✅ Partial | BestCrossingCard, CrossingOptionCard, CrossingOptionCard, shared hooks |
| **i18n** | ✅ Complete | ES/EN with new keys for crossings/viaje/agent |

### Architecture Decisions Finalized

| Decision | Implementation |
|----------|----------------|
| **Layout System** | Next.js App Router with `app/[locale]/(main)/layout.tsx` as unified MainLayout |
| **App Shell** | `AppShell` with `headerCompanion` (search, filters) + `bottomCompanion` (agent input) |
| **Header** | `TopAppBar` with variants (root, search, filter), dropdown menu (3-dots), MX\|USA next to app name |
| **Bottom Nav** | Fixed 5 tabs, consistent across all screens |
| **State Management** | Zustand stores with localStorage persistence |
| **Filter Pills** | Moved from header to content area; active state uses `bg-cruze-mint text-midnight` |
| **Component Naming** | Domain + Surface + Responsibility (e.g., `BestCrossingCard`, `CrossingOptionCard`) |

---

## Remaining Work (Post-v2.0)

### High Priority
| Item | Effort | Description |
|------|--------|-------------|
| **Crossing Detail Page** | Medium | Update `CrossingIntelligenceView` to use new layout; remove its own header/bottom nav |
| **Agent Results** | Medium | Implement structured result cards (`AgentCrossingResult`, `AgentRecommendationResult`) |
| **Crossing Detail Actions** | Medium | "Usar este cruce" flow to Trip Setup |
| **Avisos List/Detail** | Low | Implement `AvisosPage` with structured rows |

### Medium Priority
| Item | Effort | Description |
|------|--------|-------------|
| **Trip Setup Flow** | High | Dynamic `TripSetupFlow` controller (adaptive steps) |
| **Trip Recommendation** | High | `BestCrossingCard` with "Por qué" section, alternatives |
| **Active Trip View** | High | `TripSummary` with checklist, navigate/view actions |
| **Crossings Compare** | Medium | `CrossingCompareTable` with delta metrics |
| **Agent Structured Results** | Medium | `AgentCrossingResult`, `AgentRecommendationResult` cards |

### Low Priority / Nice to Have
| Item | Effort | Description |
|------|--------|-------------|
| **Map Integration** | High | Mapbox GL in Crossing Detail, Trip Active |
| **Offline Support** | Medium | Cache crossings, stale indicators |
| **Push Notifications** | Medium | Avisos push with deep links |
| **Settings Pages** | Low | Profile, Favorites, My Trips, Data Sharing, About |
| **Accessibility Audit** | Medium | WCAG AA compliance check |

---

## Design System Tokens (Finalized)

### Colors (globals.css @theme)
```css
--color-midnight: #071A31;           /* Background */
--color-surface: #0E223F;            /* Cards, inputs */
--color-surface-elevated: #132B4A;   /* Elevated cards */
--color-border: #1F3A5A;             /* Borders */
--color-text-primary: #F5F7FA;       /* Primary text */
--color-text-secondary: #A7B3CC;     /* Secondary text */
--color-cruze-mint: #00E0A0;         /* Brand, primary actions, OPEN */
--color-amber: #FFB020;              /* Warning, deltas, LIMITED */
--color-alert-red: #FF4D4F;          /* CLOSED, critical, destructive */
--color-info-blue: #3BA7FF;          /* Info, navigation */
```

### Semantic Aliases
```css
--color-background: #071A31;
--color-ink: #F5F7FA;
--color-faint: #A7B3CC;
--color-muted: #6B7D99;
```

### Status Colors
```css
--color-improving: #22924A;          /* OPEN */
--color-caution: #F4A01B;            /* LIMITED */
--color-critical: #E33332;           /* CLOSED */
--color-info: #2E9DD6;               /* INFO */
```

### Spacing (4px base)
```css
--spacing-xs: 4px;  --spacing-sm: 8px;  --spacing-md: 12px;
--spacing-lg: 16px; --spacing-xl: 24px; --spacing-2xl: 32px;
```

### Radius
```css
--radius-sm: 6px;     /* Small controls */
--radius-md: 10px;    /* Cards, buttons */
--radius-lg: 16px;    /* Panels */
--radius-full: 999px; /* Pills */
```

### Typography
- **Sora**: Hero headings, display numbers, major recommendations, crossing names
- **Inter**: Body text, navigation, labels, metadata, controls, secondary info

---

## Component Library (Current State)

### Implemented Domain Components
| Component | File | Status |
|-----------|------|--------|
| `BestCrossingCard` | `src/components/crossing/BestCrossingCard.tsx` | ✅ Full + Compact variants |
| `CrossingOptionCard` | `src/components/crossing/CrossingOptionCard.tsx` | ✅ Standard list item |
| `TripSummary` | `src/components/viaje/TripSummary.tsx` | ✅ Uses BestCrossingCard + CrossingOptionCard |
| `CrossingOptionCard` | `src/components/crossing/CrossingOptionCard.tsx` | ✅ Detailed expandable card |
| `CrossingOptionCard` | `src/components/crossing/CrossingOptionCard.tsx` | ✅ Detailed expandable card |
| `TopAppBar` | `src/components/layout/TopAppBar.tsx` | ✅ Variants, dropdown, MX\|USA |
| `BottomNavigation` | `src/components/layout/BottomNavigation.tsx` | ✅ 5 tabs |
| `AppShell` | `src/components/layout/AppShell.tsx` | ✅ headerCompanion, bottomCompanion |
| `CrossingsFilterTabs` | `src/components/crossing/CrossingsFilterContext.tsx` | ✅ Filter pills |
| `CrossingsFilterProvider` | `src/components/crossing/CrossingsFilterContext.tsx` | ✅ Context provider |

### Shared Hooks
| Hook | File | Purpose |
|------|------|---------|
| `useLocale` | `src/hooks/use-locale.ts` | Extract locale from pathname |
| `useCrossingsData` | `src/hooks/use-crossings-data.ts` | Fetch merged crossings data |
| `useShare` | `src/hooks/use-share.ts` | Web Share API + clipboard fallback |

### Utilities
| Utility | File | Purpose |
|---------|------|---------|
| `formatDuration` | `src/lib/display.ts` | Minutes → "11 min" / "8h 35m" |
| `getDisplayName` | `src/lib/display.ts` | Best place name from Place object |
| `getStatusColor` | `src/lib/display.ts` | Status → Tailwind class |

---

## Navigation Structure (Finalized)

### Primary Tabs (Invariant)
```
Viaje → Cruces → Agente
```

### Header Variants
| Variant | Used By | Elements |
|---------|---------|----------|
| `root` | Viaje, Favoritos, Alertas, Agente | App name + MX\|USA + dropdown (3-dots) |
| `search` | Cruces | Search input |
| `filter` | (unused) | Filter bar |

### Bottom Nav (Invariant - 5 tabs)
```
Viaje | Cruces | Agente | Favoritos | Alertas
```

### Header Companion Slots
| Page | Companion |
|------|-----------|
| Crossings | Search input (hasSearch) |
| (others) | None |

### Bottom Companion Slots
| Page | Companion |
|------|-----------|
| Agent | Fixed input bar (fixed bottom) |
| (others) | None |

---

## Data Flow (Implemented)

### Crossings Data
```
getMergedCrossingsData() → MergedCrossingData[]
  ↓
CrossingsFilterContext (filter: "all" | "MX" | "US")
  ↓
CrossingsPage → filteredCrossings → CrossingOptionCard[]
```

### Trip Data
```
useTripStore (Zustand + localStorage)
  ↓
TripSummary → BestCrossingCard (recommended) + CrossingOptionCard[] (alternatives)
```

### Agent Data
```
useAgentStore + useAgent (processMessage)
  ↓
AgentChat (fixed input bar) → RichResponse
```

---

## File Structure (Post-v2.0)

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                    # Root: providers, html/body
│   │   ├── page.tsx                      # Home: redirects to onboarding or viaje
│   │   ├── onboarding/
│   │   │   ├── layout.tsx                # Centered container
│   │   │   ├── page.tsx                  # Redirect to destination
│   │   │   ├── destination/page.tsx      # Destination search
│   │   │   ├── starting-point/page.tsx   # Origin + mode
│   │   │   └── recommendation/page.tsx   # BestCrossingCard + CTA
│   │   ├── (main)/
│   │   │   ├── layout.tsx                # MainLayout with AppShell
│   │   │   ├── viaje/page.tsx            # TripSummary + stale prompt
│   │   │   ├── crossings/page.tsx        # CrossingsFilterProvider + list
│   │   │   ├── favorites/page.tsx        # Saved crossings
│   │   │   ├── alerts/page.tsx           # Grouped alerts
│   │   │   ├── agente/page.tsx           # AgentProvider + AgentChat
│   │   │   └── viaje/configure/page.tsx  # TripSetupFlow
│   │   └── crossing/[id]/page.tsx        # CrossingIntelligenceView
│   └── layout.tsx                        # Root layout with html/body
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx                  # Unified shell with companions
│   │   ├── TopAppBar.tsx                 # Header with variants, dropdown
│   │   ├── BottomNavigation.tsx          # 5 tabs
│   │   └── AppShell.tsx
│   ├── crossing/
│   │   ├── BestCrossingCard.tsx          # Recommended crossing (full/compact)
│   │   ├── CrossingOptionCard.tsx        # Standard list item (expandable)
│   │   ├── CrossingOptionCard.tsx        # Detailed card (map view)
│   │   ├── CrossingOptionCard.tsx        # Detailed card (map view)
│   │   ├── CrossingIntelligenceView.tsx  # Crossing detail page
│   │   ├── CrossingsFilterContext.tsx    # Filter context + tabs
│   │   └── BestCrossingCard.tsx          # Recommended crossing card
│   ├── viaje/
│   │   ├── TripSummary.tsx               # Trip view with BestCrossingCard
│   │   └── TravelerProfileForm.tsx
│   ├── agent/
│   │   ├── AgentChat.tsx                 # Fixed input bar
│   │   ├── AgentProvider.tsx
│   │   └── RichResponse.tsx
│   ├── layout/
│   │   ├── TopAppBar.tsx                 # Header with dropdown
│   │   ├── BottomNavigation.tsx          # 5 tabs
│   │   └── AppShell.tsx
│   └── onboarding/
│       └── RecommendationView.tsx
├── hooks/
│   ├── use-locale.ts
│   ├── use-crossings-data.ts
│   └── use-share.ts
├── lib/
│   ├── display.ts                        # Formatters, status colors
│   ├── border-data.ts                    # Static crossing data
│   ├── border-data-service.ts            # Merged crossings + CBP API
│   ├── recommendation.ts                 # Recommendation engine
│   └── crossing-estimator.ts             # Time calculations
├── stores/
│   ├── trip.ts                           # Zustand + persist
│   ├── traveler.ts
│   ├── favorites.ts
│   ├── alerts.ts
│   └── agent.ts
└── types/
    └── place.ts                          # Core types
```

---

## Integration Checklist (v2.0 Status)

| Check | Status | Notes |
|-------|--------|-------|
| Unified layout for all main pages | ✅ | `MainLayout` wraps all `(main)` pages |
| Consistent header across screens | ✅ | `TopAppBar` with variants |
| Consistent bottom nav | ✅ | 5 tabs everywhere |
| Header companion (search) | ✅ | Crossings page |
| Bottom companion (agent input) | ✅ | Fixed above bottom nav |
| Filter pills in content | ✅ | Crossings page |
| Default MX filter | ✅ | `CrossingsFilterProvider` default "MX" |
| Visible active pill | ✅ | `bg-cruze-mint text-midnight` |
| Agent input fixed above nav | ✅ | Fixed positioning |
| Trip view uses BestCrossingCard | ✅ | Recommended + alternatives |
| Agent input fixed above nav | ✅ | Fixed positioning |
| TypeScript clean | ✅ | 0 errors |
| Build passes | ✅ | `rtk tsc --noEmit` clean |

---

## Migration Notes (v1 → v2)

### Files Removed
- `src/components/onboarding/SplashScreen.tsx` (unused)
- `src/app/%5B%5D/` (duplicate onboarding routes)

### Files Added
- `src/components/crossing/BestCrossingCard.tsx`
- `src/components/crossing/CrossingOptionCard.tsx`
- `src/components/crossing/CrossingsFilterContext.tsx`
- `src/components/shared/LangSetter.tsx`
- `src/hooks/use-locale.ts`
- `src/hooks/use-crossings-data.ts`
- `src/hooks/use-share.ts`
- `src/components/crossing/BestCrossingCard.tsx`
- `src/components/crossing/CrossingOptionCard.tsx`
- `src/components/crossing/CrossingsFilterContext.tsx`

### Modified
- All `(main)` pages: removed AppShell, use layout
- `src/app/[locale]/(main)/layout.tsx`: New MainLayout
- `src/components/layout/AppShell.tsx`: Added headerCompanion, bottomCompanion
- `src/components/layout/TopAppBar.tsx`: Dropdown menu, MX|USA position
- `src/components/crossing/CrossingsFilterContext.tsx`: Fixed active pill visibility
- `src/app/globals.css`: Added semantic tokens, fixed background

---

## Next Steps (Suggested Sprint Order)

1. **Sprint 1**: Crossing Detail page integration + "Usar este cruce" flow
2. **Sprint 2**: Trip Setup Flow controller + Active Trip view
3. **Sprint 3**: Agent structured results + Crossing Compare
4. **Sprint 4**: Avisos implementation + Map integration
5. **Sprint 5**: Settings pages + Accessibility audit

---

*Generated: 2026-09-02 | Based on v2.0 implementation (7 commits)*