Absolutely. This version is much closer to the direction we established: **the page is a vertically scrolling intelligence surface**, not a collection of cards squeezed into a phone viewport.

I would formalize this as the **Cruze “Crossing Intelligence / Recommended Route” page**. It is essentially the primary **Cruces** destination with a specific border direction selected.

---

# CRUZE — CROSSING INTELLIGENCE PAGE

## 01. Page purpose

The page answers one question:

> **“Given where I am going and current border conditions, which crossing should I use?”**

It combines:

1. **Current route context**
2. **Live data freshness**
3. **Recommended crossing**
4. **Lane-specific intelligence**
5. **Operational information**
6. **Alternative crossings**
7. **Decision/action controls**

The page should **not** attempt to behave like a conventional dashboard.

The hierarchy is:

```text
WHERE AM I GOING?
        ↓
WHAT IS THE BEST CROSSING?
        ↓
WHY IS IT THE BEST?
        ↓
WHAT ARE MY OTHER OPTIONS?
        ↓
WHAT SHOULD I DO?
```

---

# 02. Overall page anatomy

```text
┌─────────────────────────────────────┐
│ STATUS BAR                          │
├─────────────────────────────────────┤
│                                     │
│ HEADER                              │
│ Cruze   Tijuana → San Diego   ...   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│                                     │
│          ROUTE / MAP                │
│                                     │
│       You ──────────────●           │
│                          San Ysidro  │
│                                     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ LIVE STATUS                         │
│ ● LIVE   Updated 1 min ago          │
│ Data sources ⓘ                      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ BEST CROSSING RIGHT NOW             │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ San Ysidro              ● Open  │ │
│ │ Port of Entry                    │ │
│ │                                  │ │
│ │ [ Ready Lane ]                   │ │
│ │                                  │ │
│ │ ◷ 15 min      🚗 17 min         │ │
│ │ Wait at port   Total journey     │ │
│ │                                  │ │
│ │ ✓ Fastest overall right now      │ │
│ │   2 min faster than Otay Mesa   │ │
│ │                                  │ │
│ │ Lane times                       │ │
│ │ ┌──────┐ ┌──────┐ ┌──────┐     │ │
│ │ │Ready │ │SENTRI│ │Stand.│     │ │
│ │ │15min │ │ 4min │ │22min │     │ │
│ │ └──────┘ └──────┘ └──────┘     │ │
│ │                                  │ │
│ │ About this crossing              │ │
│ │ ◷ Open 24 hours                  │ │
│ │ 🚗 Passenger vehicles...         │ │
│ │ 🚶 Pedestrian access available   │ │
│ │                                  │ │
│ │ View full details             ›  │ │
│ └─────────────────────────────────┘ │
│                                     │
│                                     │
│ OTHER CROSSING OPTIONS              │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Otay Mesa              21 min › │ │
│ │ Via Otay Mesa Port               │ │
│ │              +4 min vs San Ysidro│ │
│ ├─────────────────────────────────┤ │
│ │ Tecate                 28 min › │ │
│ │ Via Tecate Port                  │ │
│ │             +11 min vs San Ysidro│ │
│ ├─────────────────────────────────┤ │
│ │ Calexico East          45 min › │ │
│ │ Via Calexico East Port           │ │
│ │             +28 min vs San Ysidro│ │
│ └─────────────────────────────────┘ │
│                                     │
│ Times are estimates...              │
│ Conditions can change.              │
│                                     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │          START TRIP          →   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌──────────────┐ ┌────────────────┐ │
│ │ Compare      │ │ View Details   │ │
│ │ Crossings    │ │ San Ysidro     │ │
│ └──────────────┘ └────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ BOTTOM NAV                          │
│                                     │
│  Cruces   Favoritos   Mapa  Alertas│
└─────────────────────────────────────┘
```

The critical point is that **the diagram represents a scrollable document**.

There is no requirement for the entire thing to fit inside a 390×844-ish viewport.

---

# 03. Recommended scroll structure

I would actually increase the breathing room slightly from the supplied design.

The conceptual document should look like:

```text
                    TOP
                     │
                     ▼
┌───────────────────────────────┐
│ HEADER                        │
├───────────────────────────────┤
│                               │
│                               │
│           MAP                 │
│                               │
│                               │
│                               │
└───────────────────────────────┘

            ↓ SCROLL

┌───────────────────────────────┐
│ LIVE STATUS                   │
└───────────────────────────────┘

            ↓

       BEST CROSSING
            │
            ▼
┌───────────────────────────────┐
│                               │
│ SAN YSIDRO                    │
│                               │
│ Ready Lane                    │
│                               │
│ 15 min        17 min          │
│                               │
│ ───────────────────────────   │
│ Fastest overall               │
│                               │
│ ───────────────────────────   │
│ Lane times                    │
│                               │
│ [Ready] [SENTRI] [Standard]   │
│                               │
│ ───────────────────────────   │
│ About this crossing           │
│                               │
│ ...                           │
│                               │
└───────────────────────────────┘

            ↓

       OTHER OPTIONS
            │
            ▼
┌───────────────────────────────┐
│ Otay Mesa                     │
├───────────────────────────────┤
│ Tecate                        │
├───────────────────────────────┤
│ Calexico East                 │
└───────────────────────────────┘

            ↓

       DATA DISCLAIMER

            ↓

┌───────────────────────────────┐
│         START TRIP →          │
└───────────────────────────────┘

            ↓

┌──────────────┐ ┌──────────────┐
│ Compare      │ │ Details      │
└──────────────┘ └──────────────┘

            ↓

       BOTTOM NAV
```

This is the important design philosophy:

> **Vertical space is not the enemy. Cognitive density is.**

---

# 04. Screen/canvas specification

The supplied reference is approximately:

**395 × 1525 px**

I would treat that as a **design-board rendering**, not a strict device viewport.

For production:

### Mobile content width

```text
Viewport
│
├── 16px outer gutter
│
├────── Content ──────┤
│                     │
│                     │
└─────────────────────┘
```

Recommended:

```text
Horizontal page padding: 16px
Card internal padding: 16px
Section spacing: 32–40px
Major section spacing: 44–56px
```

The content should be allowed to become substantially taller.

---

# 05. Page hierarchy

The visual hierarchy should be:

### Level 01 — Destination

```text
Tijuana → San Diego
```

### Level 02 — Live state

```text
LIVE · Updated 1 min ago
```

### Level 03 — Recommendation

```text
BEST CROSSING RIGHT NOW

San Ysidro
```

### Level 04 — Decision evidence

```text
15 min
17 min total
Fastest overall
Lane times
```

### Level 05 — Supporting information

```text
Open 24 hours
Passenger vehicles
Pedestrian access
```

### Level 06 — Alternatives

```text
Otay Mesa
Tecate
Calexico East
```

### Level 07 — Actions

```text
START TRIP
COMPARE CROSSINGS
VIEW DETAILS
```

That hierarchy is excellent for Cruze because it follows the user's decision-making process.

---

# 06. Design system — foundation

I would establish the following token architecture.

```text
CRUZE DESIGN SYSTEM
│
├── Color
├── Typography
├── Spacing
├── Radius
├── Borders
├── Shadows
├── Elevation
├── Iconography
├── Motion
├── Layout
└── Semantic states
```

---

# 07. Color tokens

The dark theme should be **deep blue-black**, not pure black.

### Base colors

```css
@theme {
  --color-bg: #06111A;
  --color-bg-elevated: #091722;
  --color-surface: #0B1A26;
  --color-surface-raised: #0E202D;
  --color-surface-interactive: #122635;

  --color-border: #243440;
  --color-border-subtle: #1A2A36;

  --color-text-primary: #F5F7F8;
  --color-text-secondary: #AAB5BC;
  --color-text-tertiary: #75838D;
  --color-text-disabled: #52616B;

  --color-cruze: #45D9A0;
  --color-cruze-bright: #5BE6AF;
  --color-cruze-dark: #1A765B;

  --color-success: #45D9A0;
  --color-warning: #F3AA32;
  --color-danger: #F16B6B;
  --color-info: #72A9FF;
}
```

The exact hexadecimal values can later be calibrated against the brand palette.

---

# 08. Color philosophy

The green should be **semantic**, not decorative.

Green means:

```text
LIVE
OPEN
READY
RECOMMENDED
GOOD
ACTIVE
```

It should **not** simply be applied to every icon.

The current design occasionally gets close to overusing green.

The strongest green moments should be:

```text
● LIVE
● Open
Ready Lane
15 min
START TRIP
Active navigation
```

Everything else can remain neutral.

---

# 09. Map palette

The map needs its own token namespace.

```css
--map-background: #07131D;
--map-land: #0B1822;
--map-road: #1C2C37;
--map-road-major: #293B46;
--map-label: #87949D;

--map-route: #43E0B0;
--map-route-glow: rgba(67, 224, 176, .25);

--map-origin: #F5F7F8;
--map-destination: #45D9A0;
```

The map should remain subdued.

The route is the hero.

---

# 10. Typography system

The reference uses a clean contemporary sans-serif.

I would establish:

```css
--font-sans:
  Inter,
  ui-sans-serif,
  system-ui,
  sans-serif;
```

If the final brand typography differs, replace this globally.

### Type scale

```text
Display
32 / 38 / 700

Heading 1
28 / 34 / 700

Heading 2
20 / 26 / 650

Heading 3
16 / 22 / 600

Body Large
16 / 24 / 400

Body
14 / 20 / 400

Body Small
13 / 18 / 400

Label
12 / 16 / 500

Caption
11 / 16 / 400
```

---

# 11. Important typography distinction

Numbers deserve slightly more visual weight than descriptive text.

For example:

```text
15 min
```

should visually dominate:

```text
Wait at port
```

Recommended:

```text
15 min
24px / 28px / 650

Wait at port
13px / 18px / 400
```

This makes the decision data immediately scannable.

---

# 12. Numeric typography

For time values:

```css
font-variant-numeric: tabular-nums;
```

This is important for live intelligence.

If:

```text
15 min
```

changes to:

```text
16 min
```

the layout shouldn't jump horizontally.

---

# 13. Spacing tokens

Use a 4px base grid.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-7: 28px;
--space-8: 32px;
--space-9: 36px;
--space-10: 40px;
--space-12: 48px;
--space-14: 56px;
--space-16: 64px;
```

---

# 14. Page spacing tokens

These are more useful than arbitrary spacing.

```css
--page-gutter: 16px;

--section-gap: 36px;
--section-gap-large: 48px;

--card-gap: 12px;
--card-padding: 16px;

--content-max-width: 720px;
```

On a mobile device the page remains narrow.

On tablet/web, the intelligence content should not become excessively wide.

---

# 15. Vertical rhythm

The most important new rule:

```text
Section → 36–48px
```

not:

```text
Section → 12px
```

For example:

```text
LIVE STATUS

        ↓ 36px

BEST CROSSING RIGHT NOW

        ↓ 16px

[Recommendation Card]

        ↓ 48px

OTHER CROSSING OPTIONS

        ↓ 16px

[Alternatives]
```

This gives the page the breathing room you specifically want.

---

# 16. Radius system

Keep the system restrained.

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 14px;
--radius-xl: 18px;
--radius-pill: 999px;
```

Usage:

```text
Buttons        10px
Cards          12–14px
Lane chips     8px
Status pills   999px
Bottom nav     0px / shell
```

---

# 17. Borders

Borders should be subtle.

```css
--border-default:
1px solid var(--color-border);

--border-subtle:
1px solid var(--color-border-subtle);
```

Avoid bright outlines.

The dark UI should derive hierarchy primarily from:

```text
surface
spacing
typography
contrast
```

not heavy borders.

---

# 18. Elevation

This design doesn't need traditional Material-style shadows.

Use subtle elevation:

```css
--shadow-card:
0 8px 24px rgba(0, 0, 0, .20);

--shadow-floating:
0 12px 32px rgba(0, 0, 0, .28);
```

But the card should still work without its shadow.

---

# 19. Glass / blur

Use sparingly.

The current map/header treatment works because the map can remain visible.

However:

> **Cruze should not become a glassmorphism application.**

No translucent card everywhere.

No glowing borders.

No excessive backdrop blur.

---

# 20. Live indicator

The live indicator is one of the product's core visual primitives.

```text
● LIVE    Updated 1 min ago
```

Token:

```css
--live-dot-size: 6px;
--live-color: var(--color-cruze);
```

Animation should be extremely subtle, if used:

```text
opacity:
1 → .55 → 1

duration:
2000ms
```

No pulsing neon effect.

---

# 21. Status semantics

```text
LIVE       → green
OPEN       → green
READY      → green

DELAYED    → amber
STALE      → amber

CLOSED     → red
CRITICAL   → red

UNKNOWN    → gray
```

These meanings should remain consistent throughout the entire application.

---

# 22. Recommendation card

This is the most important component on the page.

Component:

```text
<CrossingRecommendationCard />
```

Anatomy:

```text
┌────────────────────────────────────┐
│ San Ysidro                 ● Open  │
│ Port of Entry                      │
│                                    │
│ [ Ready Lane ]                     │
│                                    │
│ ◷ 15 min       🚗 17 min           │
│ Wait at port    Total journey      │
│                                    │
│ ────────────────────────────────   │
│ ✓ Fastest overall right now        │
│   2 min faster than Otay Mesa      │
│                                    │
│ ────────────────────────────────   │
│ Lane times                         │
│                                    │
│ [ Ready ] [ SENTRI ] [ Standard ]  │
│   15 min      4 min       22 min   │
│                                    │
│ ────────────────────────────────   │
│ About this crossing                │
│                                    │
│ ◷ Open 24 hours                    │
│ 🚗 Passenger vehicles...           │
│ 🚶 Pedestrian access available     │
│                                    │
│ ────────────────────────────────   │
│ View full details               ›  │
└────────────────────────────────────┘
```

---

# 23. Recommendation card tokens

```css
--recommendation-padding: 16px;
--recommendation-radius: 12px;

--recommendation-title-size: 28px;
--recommendation-title-weight: 700;

--recommendation-primary-number: 24px;
--recommendation-secondary-number: 22px;
```

The card should feel important without becoming oversized.

---

# 24. Lane card component

```text
┌──────────────┐
│ Ready Lane   │
│              │
│ 15 min       │
└──────────────┘
```

Recommended:

```text
width: flexible
height: 64–72px
radius: 8px
padding: 12px
```

Selected:

```text
border: Cruze green
background: subtle Cruze-green tint
```

Unselected:

```text
surface-raised
border-subtle
```

---

# 25. Alternative crossing component

This should be a **list**, not three large cards.

```text
┌────────────────────────────────────┐
│  Otay Mesa              21 min  › │
│  Via Otay Mesa Port                │
│                         +4 min     │
├────────────────────────────────────┤
│  Tecate                 28 min  › │
│  Via Tecate Port                   │
│                        +11 min     │
├────────────────────────────────────┤
│  Calexico East          45 min  › │
│  Via Calexico East Port            │
│                        +28 min     │
└────────────────────────────────────┘
```

This is an excellent use of density.

The **primary recommendation gets breathing room**.

Alternatives can be denser because they're secondary.

---

# 26. Alternative comparison language

I particularly like:

```text
+4 min vs San Ysidro
```

because it transforms:

```text
21 min
```

into:

```text
21 min
+4 min vs San Ysidro
```

The user immediately understands the trade-off.

This should become a reusable pattern:

```text
{delta} vs {recommended crossing}
```

---

# 27. Disclaimer

The current disclaimer is appropriately quiet.

```text
Times are estimates based on live data and typical traffic.
Conditions can change.
```

Style:

```text
12px
line-height: 17px
text-tertiary
```

It should never visually compete with the decision data.

---

# 28. Primary CTA

```text
┌────────────────────────────────────┐
│             START TRIP         →   │
└────────────────────────────────────┘
```

Height:

```text
48px
```

Radius:

```text
10px
```

Typography:

```text
16px
600
```

The CTA should be full width.

---

# 29. CTA hierarchy

There is a clear hierarchy:

```text
PRIMARY

START TRIP
```

Secondary:

```text
Compare Crossings
View Details
```

Don't make the secondary buttons green.

They should remain neutral.

---

# 30. Secondary actions

Current:

```text
Compare Crossings
View Details: San Ysidro
```

I'd simplify the second label to:

```text
San Ysidro Details
```

or simply:

```text
View Details
```

because the card already establishes the crossing.

---

# 31. Route/map component

The map occupies a large amount of vertical space.

That's good.

I would preserve this.

Something like:

```text
MAP HEIGHT

~300–360px mobile
```

rather than shrinking it to 220px just to get more content above the fold.

The route itself should remain visually dominant.

---

# 32. Map hierarchy

```text
                    SAN DIEGO

                         ●
                         │
                         │
                    ╱────╯
                ╱───
             ╱──
          ╱──
       ●
      YOU

                    TIJUANA
```

The route should have:

```text
solid bright line
+
very subtle glow
+
clear origin
+
clear destination
```

No unnecessary map decoration.

---

# 33. Header over map

The header and map should feel like one geographic context.

```text
HEADER
────────────────────
MAP
────────────────────
```

The map should visually begin immediately below the header.

This is stronger than placing the map inside another rounded card.

---

# 34. Section labels

Current:

```text
BEST CROSSING RIGHT NOW
OTHER CROSSING OPTIONS
```

Good.

Use:

```text
12px
500
letter-spacing: .06em
uppercase
```

These are one of the few places where uppercase typography is appropriate.

---

# 35. Page background

The entire page should remain:

```text
#06111A
```

rather than alternating between many background shades.

Cards establish hierarchy through:

```text
#0B1A26
```

and:

```text
#0E202D
```

---

# 36. Component inventory for this page

The page can be decomposed into:

```text
CrossingIntelligencePage
│
├── Header
│
├── RouteMap
│
├── LiveDataStatus
│
├── SectionHeader
│
├── CrossingRecommendationCard
│   ├── CrossingHeader
│   ├── StatusBadge
│   ├── LaneBadge
│   ├── JourneyMetrics
│   ├── RecommendationReason
│   ├── LaneTimeGrid
│   ├── CrossingFacts
│   └── DetailLink
│
├── AlternativeCrossings
│   └── CrossingOptionRow
│
├── DataDisclaimer
│
├── PrimaryAction
│
├── SecondaryActions
│
└── BottomNavigation
```

That's a very clean component architecture.

---

# 37. Page-specific data model

The UI can be driven by something approximately like:

```ts
type CrossingIntelligencePage = {
  direction: {
    origin: string;
    destination: string;
  };

  userLocation: {
    label: string;
    city: string;
  };

  recommendation: Crossing;

  alternatives: Crossing[];

  dataStatus: {
    state: "live" | "stale" | "offline";
    updatedAt: string;
    sourcesAvailable: number;
  };
};
```

And:

```ts
type Crossing = {
  id: string;
  name: string;
  portName: string;

  status: "open" | "closed" | "delayed";

  recommendedLane?: string;

  waitTime: number;
  totalJourneyTime?: number;

  lanes: LaneTime[];

  reason?: {
    title: string;
    detail: string;
  };

  facts: CrossingFact[];
};
```

---

# 38. The visual token hierarchy

Putting it all together:

```text
                    CRUZE
                      │
             ┌────────┴────────┐
             │                 │
          CONTEXT           DECISION
             │                 │
      Tijuana → San Diego   San Ysidro
             │                 │
           MAP              15 min
                              │
                         17 min total
                              │
                        Fastest overall
                              │
                       Lane intelligence
                              │
                       Crossing facts
                              │
                         ALTERNATIVES
                              │
                           ACTION
```

This is the key design logic.

---

# 39. Tailwind token foundation

For the actual implementation, I'd make the theme block roughly:

```css
@theme {
  /* ─────────────────────────
     COLOR
  ───────────────────────── */

  --color-bg: #06111A;
  --color-surface: #0B1A26;
  --color-surface-raised: #0E202D;
  --color-surface-interactive: #122635;

  --color-border: #243440;
  --color-border-subtle: #1A2A36;

  --color-text-primary: #F5F7F8;
  --color-text-secondary: #AAB5BC;
  --color-text-tertiary: #75838D;
  --color-text-disabled: #52616B;

  --color-cruze: #45D9A0;
  --color-cruze-bright: #5BE6AF;
  --color-cruze-dark: #1A765B;

  --color-success: #45D9A0;
  --color-warning: #F3AA32;
  --color-danger: #F16B6B;
  --color-info: #72A9FF;


  /* ─────────────────────────
     TYPOGRAPHY
  ───────────────────────── */

  --font-sans:
    Inter,
    ui-sans-serif,
    system-ui,
    sans-serif;


  /* ─────────────────────────
     SPACING
  ───────────────────────── */

  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-7: 28px;
  --spacing-8: 32px;
  --spacing-9: 36px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-14: 56px;
  --spacing-16: 64px;


  /* ─────────────────────────
     RADIUS
  ───────────────────────── */

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-pill: 999px;


  /* ─────────────────────────
     SHADOW
  ───────────────────────── */

  --shadow-card:
    0 8px 24px rgba(0, 0, 0, .20);

  --shadow-floating:
    0 12px 32px rgba(0, 0, 0, .28);


  /* ─────────────────────────
     LAYOUT
  ───────────────────────── */

  --page-gutter: 16px;
  --content-max-width: 720px;

  --section-gap: 36px;
  --section-gap-large: 48px;

  --card-padding: 16px;
}
```

---

# 40. Semantic component tokens

I'd additionally establish these above the raw tokens:

```css
:root {
  --page-background: var(--color-bg);

  --card-background: var(--color-surface);
  --card-background-raised: var(--color-surface-raised);
  --card-border: var(--color-border-subtle);

  --primary-action: var(--color-cruze);
  --primary-action-hover: var(--color-cruze-bright);

  --live-indicator: var(--color-cruze);
  --positive-state: var(--color-success);
  --warning-state: var(--color-warning);
  --critical-state: var(--color-danger);

  --primary-text: var(--color-text-primary);
  --secondary-text: var(--color-text-secondary);
  --muted-text: var(--color-text-tertiary);
}
```

This gives us an important abstraction:

**components don't need to know the brand's raw hex values.**

---

# 41. Responsive behavior

The design should not simply scale the 395px screenshot.

### Mobile

```text
16px gutters
single column
map 300–360px
full-width cards
full-width CTA
bottom navigation
```

### Tablet

```text
24–32px gutters
content max-width
map becomes taller
recommendation card remains readable
```

### Desktop

I would **not** simply stretch the mobile page.

Instead:

```text
             ┌─────────────────────────────┐
             │        CONTENT              │
             │                             │
             │  MAP                        │
             │                             │
             │  Recommendation             │
             │                             │
             │  Alternatives               │
             └─────────────────────────────┘
```

with a constrained intelligence column.

The product is about **decision clarity**, not filling every pixel.

---

# 42. One important change from the supplied design

I would **not put the complete bottom navigation into the visual height calculation of the page**.

It is a fixed shell.

Therefore the page's content should have:

```css
padding-bottom:
calc(
  var(--bottom-nav-height)
  + env(safe-area-inset-bottom)
  + 24px
);
```

This ensures:

```text
last content
    ↓
breathing room
    ↓
bottom nav
```

rather than:

```text
last content
↓
BOTTOM NAV
```

That little distinction makes the entire experience feel less cramped.

---

# 43. Final page specification

### Page

**Crossing Intelligence — Recommended Route**

### Primary user goal

Select the best border crossing based on current conditions.

### Primary content

**San Ysidro**

### Secondary content

Otay Mesa, Tecate, Calexico East.

### Global context

**Tijuana → San Diego**

### Primary decision metrics

```text
Wait time
Total journey time
Lane-specific times
Relative advantage
```

### Secondary intelligence

```text
Hours
Vehicle restrictions
Pedestrian availability
Data freshness
```

### Primary action

**Start Trip**

### Secondary actions

**Compare Crossings**

**View Details**

### Global navigation

```text
Cruces
Mapa
Favoritos
Alertas
```

---

# 44. The design principle I would lock into the system

This page demonstrates something important about the entire Cruze product:

> **Cruze is not a dashboard. It is a decision interface.**

The interface therefore shouldn't try to maximize:

```text
information / screen
```

It should maximize:

```text
decision confidence / cognitive effort
```

That's why the large map works.

That's why the recommendation gets a large card.

That's why lane times deserve their own space.

That's why alternatives can be compact.

And that's why **scrolling is not a failure state**.

The user should be able to look at the top of the page and immediately understand **where they're going and what's happening**, then progressively scroll into the evidence supporting the recommendation. The page becomes a **vertical narrative of a border-crossing decision**, rather than a cramped dashboard trying to show everything simultaneously.

