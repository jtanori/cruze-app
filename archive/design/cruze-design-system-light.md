Yes — the previous answer was still too much of a **visual description**. What you need is an **implementation contract**: a design system the coding agent can use to make every screen consistently look like CRUZE.

Below is the **CRUZE Light Theme — Visual Identity & Design System Specification v1.0**, written as a handoff document for the coding agent.

---

# CRUZE — Light Theme

## Visual Identity & Design System Specification

**Version:** 1.0
**Theme:** Light
**Platform:** Mobile-first PWA
**Primary use:** Mexico ↔ United States border intelligence
**Design philosophy:** Editorial + Geographic + Operational + Premium

---

# 1. Design North Star

CRUZE is not a generic travel application.

It is a **border-intelligence product** whose purpose is to help users answer:

> **Where should I cross right now?**

The interface should therefore feel like a combination of:

* a premium geographic publication
* a real-time operations system
* a sophisticated travel instrument
* a modern mobile application

It should **not** feel like:

* a generic SaaS dashboard
* Google Maps
* a banking app
* a generic AI application
* a logistics ERP
* a neon/cyberpunk application
* a collection of rounded cards

### Core visual principle

> **Geography provides context. Data provides confidence. Typography provides hierarchy. Whitespace provides calm.**

---

# 2. Light Theme Philosophy

The light version is **not the dark theme inverted**.

The light theme has its own visual character:

```text
Dark CRUZE
    ↓
operational / nocturnal / high contrast

Light CRUZE
    ↓
editorial / geographic / precise / premium
```

The light theme should feel like a high-quality printed map or transportation publication translated into a digital interface.

The dominant visual relationship is:

```text
Warm / cool white
        +
Deep navy typography
        +
CRUZE mint
        +
Very subtle blue-gray structure
```

---

# 3. Color System

## 3.1 Brand colors

These colors remain constant between themes.

| Token              | Value     | Purpose               |
| ------------------ | --------- | --------------------- |
| `cruze-mint`       | `#00C98B` | Primary brand/action  |
| `cruze-mint-dark`  | `#009F70` | Hover/pressed         |
| `cruze-mint-light` | `#DDF8EF` | Soft brand background |
| `cruze-navy`       | `#071A31` | Primary brand/text    |
| `cruze-blue`       | `#3BA7FF` | Information           |

The exact brand mint should be treated as a **brand color**, not simply "green."

---

# 4. Light Surface System

The light theme requires a layered neutral system.

```css
--color-background: #F7F9FC;
--color-background-subtle: #F1F5F9;

--color-surface: #FFFFFF;
--color-surface-secondary: #F8FAFC;
--color-surface-elevated: #FFFFFF;

--color-border: #D9E2EC;
--color-border-strong: #C4D1DE;
```

### Hierarchy

```text
PAGE
#F7F9FC

      SURFACE
      #FFFFFF

          ELEVATED
          #FFFFFF
          + shadow
```

Do not use pure white for everything.

The background must remain slightly tinted so white surfaces have visual separation.

---

# 5. Typography Colors

```css
--color-text-primary: #10233F;
--color-text-secondary: #61728A;
--color-text-tertiary: #8796A9;
--color-text-disabled: #AAB6C4;
--color-text-inverse: #FFFFFF;
```

### Rule

Primary text should be **deep navy**, not black.

Do not use:

```css
color: #000000;
```

for normal interface typography.

CRUZE's typography should retain its blue/navy identity.

---

# 6. Semantic Colors

## Success / Open

```css
--color-success: #00B87A;
--color-success-soft: #E4F8F1;
```

Use for:

* Open
* Available
* Recommended
* Preferred
* Live

---

## Warning

```css
--color-warning: #F2A900;
--color-warning-soft: #FFF4D6;
```

Use for:

* Limited
* Delayed
* Time penalty
* Stale-ish information

---

## Critical

```css
--color-danger: #E5484D;
--color-danger-soft: #FDEBEC;
```

Use for:

* Closed
* Critical alert
* Errors

---

## Information

```css
--color-info: #288FE8;
--color-info-soft: #E7F3FF;
```

---

# 7. Complete Tailwind Theme

The coding agent should establish the base theme approximately as follows:

```css
@theme {
  /* ========================================
     CRUZE BRAND
     ======================================== */

  --color-cruze-mint: #00C98B;
  --color-cruze-mint-dark: #009F70;
  --color-cruze-mint-light: #DDF8EF;

  --color-cruze-navy: #071A31;


  /* ========================================
     LIGHT SURFACES
     ======================================== */

  --color-background: #F7F9FC;
  --color-background-subtle: #F1F5F9;

  --color-surface: #FFFFFF;
  --color-surface-secondary: #F8FAFC;
  --color-surface-elevated: #FFFFFF;

  --color-border: #D9E2EC;
  --color-border-strong: #C4D1DE;


  /* ========================================
     TYPOGRAPHY
     ======================================== */

  --color-text-primary: #10233F;
  --color-text-secondary: #61728A;
  --color-text-tertiary: #8796A9;
  --color-text-disabled: #AAB6C4;
  --color-text-inverse: #FFFFFF;


  /* ========================================
     SEMANTIC
     ======================================== */

  --color-success: #00B87A;
  --color-success-soft: #E4F8F1;

  --color-warning: #F2A900;
  --color-warning-soft: #FFF4D6;

  --color-danger: #E5484D;
  --color-danger-soft: #FDEBEC;

  --color-info: #288FE8;
  --color-info-soft: #E7F3FF;


  /* ========================================
     TYPOGRAPHY
     ======================================== */

  --font-sans: "Sora", ui-sans-serif, system-ui, sans-serif;


  /* ========================================
     RADII
     ======================================== */

  --radius-sm: 6px;
  --radius-control: 8px;
  --radius-card: 12px;
  --radius-panel: 16px;
  --radius-modal: 20px;


  /* ========================================
     SHADOWS
     ======================================== */

  --shadow-card: 0 1px 3px rgba(7, 26, 49, 0.06);
  --shadow-elevated: 0 8px 28px rgba(7, 26, 49, 0.10);
  --shadow-modal: 0 16px 48px rgba(7, 26, 49, 0.16);
}
```

---

# 8. Typography

Use **Sora** as the primary typeface.

```css
font-family: "Sora", ui-sans-serif, system-ui, sans-serif;
```

The typography is one of the strongest components of the identity.

---

## Display

```text
56 / 64
600
```

Use sparingly.

Example:

```text
23
MIN
```

---

## H1

```text
32 / 40
600
```

Example:

```text
Mejor cruce para tu viaje
```

---

## H2

```text
24 / 32
600
```

---

## H3

```text
20 / 28
600
```

---

## Body

```text
16 / 24
400
```

---

## Small body

```text
14 / 20
400
```

---

## Label

```text
12 / 16
500
letter-spacing: 0.08em
text-transform: uppercase
```

Example:

```text
MEJOR CRUCE AHORA
```

---

# 9. Numerical Typography

This is a CRUZE signature.

Important numbers should be visually dominant.

Example:

```text
┌─────────────────────────────┐

23                  8h 47m
MIN                 TOTAL
BORDER WAIT         JOURNEY

└─────────────────────────────┘
```

Use:

```text
48 / 56
600
```

for major metrics.

Secondary numbers:

```text
24 / 32
600
```

Never bury important wait times in body text.

---

# 10. Whitespace System

Use an 8px spacing grid:

```text
4
8
12
16
24
32
40
48
64
80
96
```

But CRUZE has an explicit additional rule:

> **Whitespace is part of the information architecture.**

Do not compress content to reduce scrolling.

---

# 11. Vertical Breathing

This is a **hard design requirement**.

The coding agent must NOT attempt to make pages fit inside one viewport.

Bad:

```text
┌──────────────┐
│ everything   │
│ everything   │
│ everything   │
│ everything   │
│ everything   │
│ NAVIGATION   │
└──────────────┘
```

Correct:

```text
┌──────────────┐
│ HEADER       │
│              │
│ CONTEXT      │
│              │
│              │
│ RECOMMEND.   │
│              │
│              │
│ EVIDENCE     │
│              │
│              │
│ ALTERNATIVES │
│              │
│              │
│ ACTION       │
│              │
│ ↓ SCROLL     │
└──────────────┘
```

### Minimum section spacing

Generally:

```text
32–48px
```

between major sections.

Large hero sections can use:

```text
64–96px
```

vertical spacing.

---

# 12. Layout

Mobile page padding:

```text
20px
```

At larger screens:

```text
24px
32px
```

depending on viewport.

Maximum content width:

```text
1200–1280px
```

Do not stretch text-heavy content indefinitely.

---

# 13. Cards

Cards should have:

```text
background: #FFFFFF
border: 1px solid #D9E2EC
border-radius: 12–16px
```

Optional:

```text
box-shadow: 0 1px 3px rgba(...)
```

### Critical rule

Not everything gets a card.

Use cards for:

* crossing entities
* recommendations
* grouped data
* interactive objects

Do not wrap every section in a white rectangle.

---

# 14. Editorial Sections

A major CRUZE light-theme characteristic is the use of **open sections**.

Example:

```text
MEJOR CRUCE AHORA

San Ysidro

15 min
BORDER WAIT
```

rather than:

```text
┌──────────────────────┐
│ MEJOR CRUCE AHORA    │
│                      │
│ San Ysidro            │
│                      │
└──────────────────────┘
```

The page should alternate between:

```text
OPEN EDITORIAL SECTION
        ↓
CARD
        ↓
OPEN EDITORIAL SECTION
        ↓
LIST
```

This creates visual rhythm.

---

# 15. Borders

Borders should be extremely subtle.

Default:

```css
border: 1px solid #D9E2EC;
```

Strong border:

```css
border: 1px solid #C4D1DE;
```

Avoid dark outlines.

Avoid 2px borders except for highly specific focus/selection states.

---

# 16. Shadows

The light theme may use shadows more than the dark theme, but they should remain subtle.

Preferred:

```css
0 1px 3px rgba(7, 26, 49, 0.06)
```

Elevated:

```css
0 8px 28px rgba(7, 26, 49, 0.10)
```

Avoid floating-everything aesthetics.

---

# 17. Primary Button

Primary action:

```text
┌─────────────────────────────────┐
│             INICIAR VIAJE    →  │
└─────────────────────────────────┘
```

Properties:

```text
background: #00C98B
color: #071A31
height: 48–56px
radius: 8px
font-weight: 600
```

Hover:

```text
#009F70
```

The button should feel **solid and operational**, not glossy.

No gradients.

---

# 18. Secondary Button

```text
background: transparent
border: 1px solid #C4D1DE
color: #10233F
```

Example:

```text
┌──────────────────────────┐
│ Ver todos los cruces     │
└──────────────────────────┘
```

---

# 19. Inputs

```text
height: 48–52px
background: #FFFFFF
border: #D9E2EC
radius: 8px
```

Example:

```text
┌─────────────────────────────────┐
│  ◯  Buscar destino...           │
└─────────────────────────────────┘
```

Focus:

```text
border: #00C98B
```

with a very subtle focus ring.

Do not use a giant glowing outline.

---

# 20. Badges

Badges are semantic.

### Recommended

```text
RECOMENDADO
```

Mint background:

```text
#DDF8EF
```

Mint text:

```text
#008F68
```

### Open

```text
● OPEN
```

### Limited

Amber.

### Closed

Red.

### SENTRI

Blue/neutral.

### Ready Lane

Mint outline or soft mint fill.

---

# 21. Crossing Status

Light theme:

```text
● Open
```

should use:

```text
dot: #00B87A
text: #008F68
```

Limited:

```text
● Limited
```

Amber.

Closed:

```text
● Closed
```

Red.

Live:

```text
● LIVE
```

Mint with optional subtle pulse.

---

# 22. Recommendation Card

This is the most important card in the application.

It should be visually stronger than ordinary crossing cards.

Structure:

```text
BEST CROSSING RIGHT NOW

SAN YSIDRO
Tijuana, MX ↔ San Diego, CA

● OPEN


15 min                  17 min
BORDER WAIT             TOTAL JOURNEY


✦ FASTEST OVERALL
2 min faster than Otay Mesa


READY LANE    SENTRI    STANDARD


[        START TRIP →        ]
```

The recommendation should communicate:

```text
WHAT
+
STATUS
+
TIME
+
REASON
+
ACTION
```

---

# 23. Recommendation Styling

The recommended card may have a very subtle mint accent.

Example:

```text
┌──────────────────────────────────┐
│                                  │
│ BEST CROSSING RIGHT NOW          │
│                                  │
│ San Ysidro                 ●OPEN │
│                                  │
│ 15 min              17 min       │
│ BORDER WAIT         TOTAL        │
│                                  │
│ ✦ Fastest overall                │
│                                  │
└──────────────────────────────────┘
```

Possible treatment:

```css
border-color: rgba(0, 201, 139, 0.35);
```

Do not make the entire card green.

---

# 24. Alternative Crossings

Alternatives should communicate the **difference from the recommendation**.

Preferred:

```text
Otay Mesa                 +4 min
Tecate                   +13 min
Calexico East            +28 min
```

The delta should be amber.

Absolute journey time may appear secondarily.

---

# 25. Crossing List

The list should not look like a stack of identical dashboard cards.

Preferred:

```text
CROSSINGS

6 OPEN · 2 LIMITED · 1 CLOSED


SAN YSIDRO
Tijuana ↔ San Diego

● OPEN                         15 min
────────────────────────────────────


OTAY MESA
Tijuana ↔ San Diego

● OPEN                         21 min
────────────────────────────────────


TECATE
Tecate ↔ Tecate

● OPEN                         28 min
```

Use spacing and dividers to create rhythm.

---

# 26. Lane Component

```text
READY LANE
15 min
Wait time
```

Selected:

```text
┌──────────────────┐
│ READY LANE       │
│                  │
│ 15 min           │
└──────────────────┘
```

Selection:

```text
border: #00C98B
background: #E4F8F1
```

Inactive:

```text
background: #F8FAFC
border: #D9E2EC
```

---

# 27. Geographic Visual Language

The light map must be **lighter than the dark theme but still subdued**.

Use:

* pale geographic background
* low-contrast roads
* restrained labels
* subtle border
* mint route
* distinctive crossing marker

The map is not supposed to look like a Google Maps clone.

---

# 28. Route Line

The CRUZE route is mint.

```text
Origin ───────────────╮
                      ╰──── Crossing ─────── Destination
```

Properties:

```text
stroke: #00C98B
width: 3px
linecap: round
linejoin: round
```

Optional glow:

```text
very subtle
```

Do not make the route fluorescent.

---

# 29. Crossing Marker

The crossing marker is a signature brand component.

It should not be a generic map pin.

Use the CRUZE gate symbol.

Visual hierarchy:

```text
Origin
   ↓
small neutral marker


Destination
   ↓
small mint/neutral marker


Crossing
   ↓
larger CRUZE gate marker
```

The crossing is the decision point and therefore receives the strongest marker.

---

# 30. Country Split

The light theme should use:

```text
MÉXICO ─────────│──────── UNITED STATES
```

The dividing line is thin and understated.

Avoid:

* Mexican flag backgrounds
* US flag backgrounds
* giant flags
* patriotic decoration

The geographic relationship itself is the visual identity.

---

# 31. Live Data

Live data should always communicate freshness.

Example:

```text
● LIVE     Updated 1 min ago
```

or:

```text
● OPEN     Updated 2 min ago
```

For stale data:

```text
Updated 18 min ago
```

should be visually quieter.

The application must never imply real-time accuracy when the data is stale.

---

# 32. Navigation

Global navigation is outside individual pages.

### Header

Light theme:

```text
background: #FFFFFF
border-bottom: #D9E2EC
```

Example:

```text
┌──────────────────────────────────┐
│ CRUZE       Tijuana → San Diego  │
│                                  │
└──────────────────────────────────┘
```

The header should be compact.

---

# 33. Bottom Navigation

```text
background: #FFFFFF
border-top: #D9E2EC
```

Active:

```text
icon: CRUZE Mint
label: CRUZE Mint
```

Inactive:

```text
icon: #61728A
label: #61728A
```

Avoid floating glassmorphic navigation.

The bottom nav should feel like part of the application chrome.

---

# 34. Iconography

Use one icon family consistently.

Lucide is appropriate.

Characteristics:

* 1.75–2px stroke
* rounded
* geometric
* simple
* no filled cartoon icons

Standard:

```text
20–24px
```

Navigation:

```text
22–24px
```

Data icons:

```text
20–28px
```

---

# 35. Visual Identity Components

The following components should be considered **CRUZE signature components**:

```text
CruzeLogo
CruzeMark

RouteLine
BorderLine
CountrySplit

CrossingMarker
OriginMarker
DestinationMarker
LiveSignal

JourneyMetric
WaitTime
DeltaTime

RecommendationCard
CrossingCard
LaneCard

StatusIndicator
FreshnessIndicator
```

These should not be reinvented on individual pages.

---

# 36. Page Composition

Every page should use the following hierarchy:

```text
GLOBAL NAVIGATION
        ↓
CONTEXT
        ↓
PRIMARY INFORMATION
        ↓
DECISION
        ↓
EVIDENCE
        ↓
ALTERNATIVES
        ↓
SECONDARY DETAILS
        ↓
ACTION
```

Not:

```text
Header
Card
Card
Card
Card
Button
```

---

# 37. Onboarding

Onboarding should feel like entering a geographic journey.

Example:

```text
¿A DÓNDE VAS?

Encuentra el mejor cruce
para tu viaje.


[ Buscar destino... ]


DESTINOS POPULARES

[ San Diego ]
[ Tijuana ]
[ Los Angeles ]

[ Phoenix ]
[ Monterrey ]
[ Tucson ]


                geographic route
                       ↓
```

Use whitespace aggressively.

---

# 38. Recommendation Onboarding

The recommendation page should feel like the culmination of the onboarding journey.

```text
TIJUANA → LOS ANGELES

MEJOR CRUCE PARA TU VIAJE


SAN LUIS

San Luis Río Colorado ↔ San Luis

● RECOMENDADO


23 min              8h 47m
BORDER WAIT         TOTAL JOURNEY


✓ Best overall for your route
  Estimated 8h 47m total journey


[ INICIAR VIAJE → ]


OTRAS OPCIONES

Calexico West                 +23 min
Calexico East                 +28 min
Tecate                        +79 min
```

The user should immediately understand:

> "CRUZE analyzed my journey and found this crossing."

---

# 39. Empty States

Empty states should be editorial rather than cartoonish.

Example:

```text
              ☆

       NO TIENES CRUCES
          GUARDADOS

Guarda tus cruces favoritos
para acceder a ellos rápidamente.


       [ EXPLORAR CRUCES ]
```

No illustrations are necessary.

---

# 40. Loading States

Use skeletons that match actual geometry.

Avoid generic full-screen spinners.

Example:

```text
████████████████
████████

██████     ██████
██████     ██████

████████████████
```

Skeleton colors:

```text
#E9EFF5
```

with subtle animation.

---

# 41. Offline State

Use an understated system banner.

```text
┌──────────────────────────────────┐
│ ⚠ Sin conexión                   │
│ Mostrando los últimos datos...   │
└──────────────────────────────────┘
```

Amber/neutral rather than bright red unless the situation is critical.

---

# 42. Modal

Light modal:

```text
background: #FFFFFF
border: #D9E2EC
radius: 20px
shadow: elevated
```

The modal should feel like a physical information sheet lifted from the page.

---

# 43. Full-Screen Crossing Details

The full-screen detail page should prioritize:

```text
1. Crossing
2. Status
3. Wait
4. Lanes
5. Hours
6. Access
7. Rules
8. Addresses
```

Do not put all details into dense tables.

Use sections and whitespace.

---

# 44. Data Density

CRUZE should be:

> **information-rich but visually calm.**

This is achieved through:

* typography
* whitespace
* grouping
* hierarchy
* restrained color

Not by hiding information.

---

# 45. Responsive Rule

### Mobile

Single-column.

Generous vertical rhythm.

### Tablet

Two-column where appropriate.

### Desktop

Potential:

```text
┌─────────────────────────────────────────┐
│                HEADER                   │
├──────────────────┬──────────────────────┤
│                  │                      │
│   INFORMATION    │       MAP            │
│                  │                      │
│                  │                      │
└──────────────────┴──────────────────────┘
```

The desktop layout should **not simply enlarge the mobile card stack**.

---

# 46. Animation

Motion should communicate state.

Allowed:

* live pulse
* route drawing
* subtle card entrance
* skeleton animation
* navigation transitions

Avoid:

* bouncing
* excessive spring animations
* glowing buttons
* animated gradients
* decorative particles
* constant map movement

---

# 47. Design Anti-Patterns

The coding agent must **not**:

```text
❌ use gradients as decoration
❌ use glassmorphism
❌ make every surface a card
❌ make every element rounded
❌ use black typography
❌ use generic green
❌ use excessive shadows
❌ use huge icons
❌ compress content to fit one viewport
❌ create dashboard-like grids everywhere
❌ overuse pills
❌ use flags as decoration
❌ turn the map into the primary UI
❌ use neon effects
❌ introduce arbitrary colors
❌ introduce new spacing values
❌ mix icon families
```

---

# 48. Design Principles

The agent should follow these seven principles.

### 01 — Geography first

CRUZE exists because of the border.

### 02 — Numbers are visual objects

Wait time and journey time deserve strong hierarchy.

### 03 — Recommendations require evidence

Never simply say "recommended."

Explain why.

### 04 — Mint means CRUZE

Use the brand color deliberately.

### 05 — Whitespace is information architecture

Do not eliminate empty space just to reduce scrolling.

### 06 — Maps provide context

The map supports the decision.

It does not become the decision.

### 07 — Calm beats flashy

The user may be making an important decision while driving, traveling, working, or coordinating a business trip.

The interface should reduce cognitive load.

---

# 49. The CRUZE Visual Formula

The light theme can be summarized as:

```text
             CRUZE

       DEEP NAVY TYPOGRAPHY
                 +
          WHITE SURFACES
                 +
         PALE BLUE-GRAY BASE
                 +
          CRUZE MINT SIGNAL
                 +
        GEOGRAPHIC ROUTES
                 +
       LARGE NUMERICAL DATA
                 +
          EDITORIAL SPACE
```

Result:

```text
             PRECISE
                +
            GEOGRAPHIC
                +
            OPERATIONAL
                +
             PREMIUM
                +
              CALM
```

---

# 50. Coding-Agent Master Instruction

I would give the implementation agent this block **verbatim**:

> **CRUZE LIGHT THEME IMPLEMENTATION RULE**
>
> Implement the CRUZE light theme as a geographic intelligence product, not as a generic dashboard.
>
> Use the defined design tokens as the single source of truth for color, typography, spacing, radius, borders, shadows, and semantic states.
>
> The interface must feel editorial, geographic, operational, premium, and calm.
>
> Do not introduce gradients, glassmorphism, neon effects, excessive shadows, excessive cards, arbitrary colors, arbitrary spacing, or mixed icon systems.
>
> Use Sora as the primary typeface.
>
> Use deep navy rather than black for primary typography.
>
> Use CRUZE Mint only for brand, active, live, recommended, and positive-action states.
>
> Use amber specifically to communicate time penalties, delays, and tradeoffs.
>
> Use red for genuinely critical/closed/error states.
>
> Maps must be subdued. Routes, border lines, crossing markers, and live signals are the visual focus.
>
> Crossing gates must use the CRUZE crossing-marker language rather than generic map pins.
>
> Important numerical information such as border wait and total journey time must receive strong typographic hierarchy.
>
> Recommendations must communicate both the recommendation and the reason for the recommendation.
>
> Alternative crossings should preferentially communicate their delta from the recommended crossing.
>
> **Most importantly: do not design pages to fit inside a single mobile viewport. CRUZE is a vertically breathing application. Pages are intentionally scrollable. Use generous vertical spacing to establish hierarchy and let information breathe. Optimize for comprehension, not minimum scroll length.**
>
> Do not change the global navigation, component hierarchy, or visual language on individual pages. All screens must consume the same design-system primitives.

---

# 51. Relationship to the Dark Theme

The two themes should share the **same CRUZE identity**, not look like two different applications.

```text
                  CRUZE IDENTITY
                       │
          ┌────────────┴────────────┐
          │                         │
       DARK THEME               LIGHT THEME
          │                         │
   Midnight surfaces         White surfaces
   High contrast             Editorial contrast
   Subdued map               Pale map
   Mint signal               Mint signal
          │                         │
          └────────────┬────────────┘
                       │
                SAME COMPONENTS
                SAME HIERARCHY
                SAME BRAND
```

The things that **must not change** between themes are:

* typography
* spacing
* component geometry
* route language
* crossing marker
* status semantics
* information hierarchy
* navigation architecture
* iconography
* recommendation logic

Only the **surface/color treatment** changes.

---

## The important distinction

I would actually keep **both design systems in the same codebase**, rather than creating a separate light-design implementation.

The architecture should be:

```text
CRUZE DESIGN SYSTEM
│
├── Brand tokens
├── Typography
├── Spacing
├── Geometry
├── Components
├── Icons
├── Motion
│
└── Themes
    ├── Dark
    └── Light
```

That gives us something much more valuable than two sets of screenshots: **one CRUZE visual language with two surface environments.**

And given where the product has evolved, I would now freeze this layer and move on to the next level: **the actual component catalog with states, variants, dimensions, interaction behavior, and Tailwind implementation for every component.** That is what will prevent the coding agent from slowly drifting away from this visual identity as it builds the remaining screens.

