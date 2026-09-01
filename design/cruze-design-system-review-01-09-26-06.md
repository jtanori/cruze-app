Absolutely. The board is strong enough now that I would treat it as the **visual source of truth for CRUZE**, but with one important distinction:

> The image is the *art direction*. The specification below turns that art direction into deterministic rules a coding agent can implement.

The board establishes the visual language around **Border Intelligence**, the CRUZE route line, crossing-gate marker, live signal, country split, large numerical data, and an editorial/operational interface. 

Below is the specification I would give directly to the coding agent.

---

# CRUZE — Visual Identity & Design System Specification

## 0. Design intent

**Product:** CRUZE
**Category:** Real-time Mexico ↔ US border-crossing intelligence
**Platform:** Mobile-first PWA
**Primary languages:** English / Spanish
**Theme:** Dark only for current release

### Brand positioning

CRUZE is not a generic travel app, navigation app, map app, or logistics dashboard.

It is:

> **A border-intelligence instrument that helps people make better crossing decisions.**

The interface should therefore feel:

* precise
* geographic
* operational
* editorial
* calm
* premium
* information-dense without being crowded
* confident rather than flashy

Avoid:

* generic SaaS aesthetics
* excessive cards
* excessive gradients
* glassmorphism
* neon/cyberpunk styling
* excessive animation
* decorative illustrations
* excessive flags
* excessive rounded pills
* "AI dashboard" visual language

The visual identity should emerge from **geography, borders, routes, crossings, signals, and data**.

---

# 1. Core visual concept

The entire CRUZE visual system is built around five graphic primitives.

## 1.1 Border Line

The border is represented by a thin geographic line.

Concept:

```text
MÉXICO ─────────────│──────────── UNITED STATES
                    │
                  BORDER
```

It is not a decorative divider.

It represents the actual geographic relationship between the two countries.

Use it selectively in:

* route headers
* country split labels
* maps
* crossing cards
* onboarding
* recommendation screens
* detail pages

Never use it as a generic separator simply because a separator is needed.

---

# 2. Route Line

The CRUZE route line represents:

> origin → crossing → destination

Visual concept:

```text
●───────────────╮
                ╰────────────●
                             
                        destination
```

The route line uses the CRUZE mint.

It should have:

* thin core line
* subtle outer glow
* rounded geometry
* smooth curves rather than sharp corners
* crossing marker at the border
* origin and destination markers with different visual treatments

### Route hierarchy

```text
Origin
  ↓
Route
  ↓
Crossing
  ↓
Route
  ↓
Destination
```

The crossing is the **important decision point**.

Therefore the crossing marker should visually dominate the origin/destination markers.

---

# 3. Crossing Gate

The crossing gate is the primary CRUZE geographic symbol.

It represents:

> **the place where the user crosses the international border.**

It should be visually derived from the CRUZE logo and resemble a stylized border gate/checkpoint.

Use it for:

* Map crossing markers
* Recommendation cards
* crossing headers
* selected crossing state
* route visualization

The marker should not look like a generic Google Maps pin.

### Marker hierarchy

```text
Origin
  small / neutral

Destination
  small / neutral

Crossing
  larger
  CRUZE mint
  gate symbol
  optional live pulse
```

---

# 4. Live Signal

Live data is represented by a small signal system.

Primary representation:

```text
● LIVE
```

with a small mint circular indicator.

For live map markers, the signal may expand into a very subtle radial pulse:

```text
      · · ·
    ·   ●   ·
      · · ·
```

Do not make the glow large or decorative.

It represents:

> data freshness.

### Semantic meaning

Mint live signal:

* current
* connected
* fresh
* operational

The live indicator should always be accompanied by textual context when the meaning isn't obvious.

Examples:

```text
● LIVE
Updated 1 min ago
```

or:

```text
● Open
Updated 2 min ago
```

---

# 5. Country Split

When showing a crossing between Mexico and the United States, use a subtle country split.

Example:

```text
TIJUANA                 SAN DIEGO
MÉXICO          │       UNITED STATES
                │
             SAN YSIDRO
```

The split should be subtle.

Do not use giant flags.

Country identity comes from:

* typography
* geographic labels
* border line
* geographic placement

not decorative flag graphics.

---

# 6. Color System

The board establishes the following core palette. 

## Core colors

```css
@theme {
  --color-midnight: #071A31;
  --color-surface: #0E223F;
  --color-surface-elevated: #132B4A;
  --color-border: #1F3A5A;

  --color-text-primary: #F5F7FA;
  --color-text-secondary: #A7B3CC;

  --color-cruze-mint: #00E0A0;
  --color-amber: #FFB020;
  --color-alert-red: #FF4D4F;
  --color-info-blue: #3BA7FF;
}
```

---

## 6.1 Midnight

`#071A31`

Primary application background.

Use for:

* page background
* header background
* navigation background
* large map-adjacent surfaces

It should be the dominant color.

---

## 6.2 Surface

`#0E223F`

Primary card/surface color.

Use for:

* crossing cards
* input surfaces
* list containers
* secondary panels

---

## 6.3 Surface Elevated

`#132B4A`

Higher elevation.

Use for:

* modal surfaces
* selected surfaces
* elevated cards
* dropdowns
* menus
* prominent data panels

---

## 6.4 Border

`#1F3A5A`

Use for:

* 1px dividers
* card outlines
* input outlines
* navigation boundaries
* subtle separators

Borders should generally be **1px**.

Do not create heavy framed UI.

---

# 7. Semantic colors

## CRUZE Mint

`#00E0A0`

Meaning:

* CRUZE brand
* selected
* available
* active
* live
* recommended
* positive action

Important:

**Do not use mint for every positive piece of information.**

It should remain meaningful.

---

## Amber

`#FFB020`

Meaning:

* slower alternative
* time penalty
* warning
* tradeoff
* limited status

Example:

```text
Calexico West                 +23 min
```

The `+23 min` should be amber.

Amber communicates:

> This option costs you time.

---

## Alert Red

`#FF4D4F`

Meaning:

* closed
* critical
* error
* unavailable

---

## Info Blue

`#3BA7FF`

Meaning:

* informational
* neutral system information
* contextual guidance

---

# 8. Typography

The board establishes **Sora** as the primary typeface, or a visually equivalent modern grotesk if Sora cannot be loaded. 

Use Sora consistently.

```css
font-family: "Sora", sans-serif;
```

Fallback:

```css
font-family: "Sora", ui-sans-serif, system-ui, sans-serif;
```

---

# 9. Type scale

## Display / Hero

```text
56 / 64
weight: 600
```

Used for major hero information.

Example:

```text
San Ysidro
```

---

## Heading 1

```text
32 / 40
weight: 600
```

Used for:

* major page headings
* primary crossing names
* major recommendation headings

---

## Heading 2

```text
24 / 32
weight: 600
```

Used for:

* section headings
* secondary crossing names
* card titles

---

## Body

```text
16 / 24
weight: 400
```

Used for:

* descriptions
* explanations
* normal UI text

---

## Utility

```text
14 / 20
weight: 400–500
```

Used for:

* metadata
* timestamps
* labels
* secondary information

---

## Data / Numeric

```text
48 / 56
weight: 600
```

This is one of CRUZE's most important typographic treatments.

Example:

```text
23
MIN
```

Numbers should feel **editorial and authoritative**.

The board explicitly treats numerical data as its own visual language. 

---

# 10. Numerical hierarchy

Never render important wait times as ordinary body text.

Bad:

```text
Border wait: 23 min
```

Preferred:

```text
23
MIN

BORDER WAIT
```

or compact:

```text
23 min
BORDER WAIT
```

The number must be immediately scannable.

---

# 11. Data labels

Data labels should use:

* uppercase when they represent categories
* increased letter spacing
* secondary text color
* compact typography

Example:

```text
BORDER WAIT
```

rather than:

```text
Border Wait
```

Typical tracking:

```text
0.08em–0.12em
```

Don't overdo tracking.

---

# 12. Spacing system

Use an 8px base grid.

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

However, **vertical breathing room is a deliberate design principle.**

Do not compress pages simply to fit one viewport.

---

# 13. The vertical breathing rule

This is critical for the coding agent.

> **CRUZE pages are scrollable information surfaces, not fixed phone compositions.**

Do NOT optimize every page to fit entirely inside:

```text
390 × 844
```

Instead design for:

```text
viewport
    ↓
content
    ↓
content
    ↓
content
    ↓
content
    ↓
scroll
```

Large vertical gaps are acceptable when they establish hierarchy.

Prefer:

```text
SECTION
        ↓
32px
        ↓
CONTENT
        ↓
48px
        ↓
SECTION
```

over:

```text
SECTION
CONTENT
SECTION
CONTENT
SECTION
CONTENT
```

The interface should feel like a **premium information publication**, not a compressed dashboard.

---

# 14. Layout principles

## Mobile horizontal padding

Target:

```text
16–20px
```

Recommended:

```css
padding-inline: 20px;
```

For particularly important surfaces, 24px is acceptable.

---

## Content width

Desktop/tablet:

```text
max-width: 1200–1280px
```

Mobile:

```text
100%
```

---

# 15. Corner radius

Use a restrained radius system.

```text
4px   micro
8px   controls
12px  cards
16px  major surfaces
20px  large hero surfaces
```

Do not make every component 16px rounded.

### Recommended defaults

Inputs:

```text
8px
```

Buttons:

```text
8–10px
```

Cards:

```text
12–16px
```

Modals:

```text
16–20px
```

---

# 16. Shadows

CRUZE should not rely heavily on shadows.

Use:

* contrast
* borders
* surface elevation

instead.

If a shadow is needed:

```text
0 8px 32px rgba(0,0,0,0.24)
```

Use sparingly.

---

# 17. Buttons

The primary CTA is CRUZE Mint.

Example:

```text
┌──────────────────────────────────┐
│          INICIAR VIAJE       →   │
└──────────────────────────────────┘
```

Characteristics:

* mint background
* dark text
* medium/semibold typography
* 48–56px height
* 8–10px radius
* arrow icon on right
* generous horizontal padding

The board establishes this treatment for primary actions. 

### Primary

```text
background: CRUZE Mint
color: Midnight
```

### Secondary

Transparent:

```text
background: transparent
border: Border
color: Text Primary
```

### Destructive

Use red only when genuinely destructive.

---

# 18. Inputs

Input style:

```text
┌────────────────────────────────────┐
│  ◯  Buscar destino...              │
└────────────────────────────────────┘
```

Properties:

```text
background: Surface
border: Border
radius: 8px
height: 48–52px
```

Focus:

```text
border: CRUZE Mint
box-shadow: subtle mint focus ring
```

Do not use a huge glowing focus state.

---

# 19. Pills / badges

Pills are semantic, not decorative.

Examples:

```text
● OPEN
```

```text
READY LANE
```

```text
SENTRI
```

```text
RECOMMENDED
```

Keep them compact.

Avoid putting every piece of information inside a pill.

---

# 20. Status indicators

The board defines four major status states. 

```text
● Open
● Limited
● Closed
● Live data
```

Mapping:

```text
Open        → Mint
Limited     → Amber
Closed      → Red
Live        → Mint + subtle pulse
```

The status dot should be small:

```text
6–8px
```

---

# 21. Crossing Card

This should become one of the signature CRUZE components.

Structure:

```text
┌──────────────────────────────────────┐
│ SAN YSIDRO                     ● OPEN │
│                                      │
│ TIJUANA, MX ↔ SAN DIEGO, CA          │
│                                      │
│  15 MIN             2h 17m            │
│  BORDER WAIT        TOTAL JOURNEY     │
│                                      │
│ ──────────────────────────────────── │
│                                      │
│ ✦ Fastest overall                    │
│   23 min faster than Otay Mesa       │
│                                      │
│ READY LANE   SENTRI   STANDARD       │
└──────────────────────────────────────┘
```

A crossing card should communicate:

1. What crossing?
2. Where?
3. Is it open?
4. How long?
5. Why is it recommended?
6. What lanes exist?

---

# 22. Lane Row

Lane rows should be compact but information-rich.

```text
┌──────────────────────────────────────┐
│ ♙ Ready Lane       SENTRI   Standard │
│                                      │
│ ◷ 15 min                         →   │
│   Wait time                           │
└──────────────────────────────────────┘
```

Eligibility states:

### Preferred

Mint emphasis.

### Eligible

Neutral with positive indicator.

### Not eligible

Muted/dimmed.

Example:

```text
SENTRI
Requires SENTRI
```

Do not hide ineligible lanes; show them but explain why they cannot be used.

---

# 23. Recommendation component

This is the **hero component of the product**.

The recommendation is not just another card.

It should visually communicate:

> CRUZE has analyzed the route and recommends this crossing.

Structure:

```text
BEST CROSSING RIGHT NOW

SAN YSIDRO
Tijuana ↔ San Diego

● OPEN


15
MIN
BORDER WAIT

17
MIN
TOTAL JOURNEY


✦ FASTEST OVERALL

2 min faster than Otay Mesa


[ START TRIP → ]
```

Recommendation confidence may appear as:

```text
HIGH CONFIDENCE
```

but don't over-badge the component.

---

# 24. Recommendation alternatives

Alternatives use delta-based comparison.

Preferred:

```text
Otay Mesa                         +4 min
Tecate                           +13 min
Calexico East                    +28 min
```

rather than:

```text
Otay Mesa                        21 min
Tecate                           28 min
Calexico East                    45 min
```

The delta directly answers:

> "What do I lose if I don't follow CRUZE's recommendation?"

Amber is appropriate here.

---

# 25. Map treatment

The map is a **functional geographic surface**, not a decorative hero.

Base map:

* extremely dark
* low saturation
* low visual noise
* roads subdued
* labels restrained

The map should emphasize only:

* relevant cities
* route
* border
* crossing
* origin
* destination

Everything else should recede.

---

# 26. Map hierarchy

### Level 1 — Crossing

Brightest map object.

```text
●
```

or the gate marker.

### Level 2 — Route

Mint line.

### Level 3 — Origin/Destination

Neutral markers.

### Level 4 — Geography

Very subdued.

---

# 27. Route map treatment

Conceptually:

```text
            SAN DIEGO
                ●
                │
                │
        ╭───────┘
       /
      /
     ●
  CROSSING
     │
     │
     ╰──────────────●
                  TIJUANA
```

The route should never overpower the crossing itself.

---

# 28. Onboarding visual language

The onboarding flow should use the same visual system rather than looking like a separate product.

### Destination

```text
¿A DÓNDE VAS?

Encuentra el mejor cruce para tu viaje.


[ Buscar destino... ]


DESTINOS POPULARES

San Diego
Tijuana
Los Angeles
Phoenix
Monterrey
Tucson


        geographic route motif
```

The bottom area can contain a subtle geographic/route illustration.

This uses empty space intentionally.

---

# 29. Onboarding progress

Do not use a generic progress bar.

Use the CRUZE route language:

```text
●────────────●────────────○

DESTINO     ORIGEN      CRUCE
```

Or:

```text
DESTINO ───────── ORIGEN ───────── CRUCE
```

The progression itself becomes a journey.

---

# 30. Header

The global header is its own component.

It should generally contain:

```text
[CRUZE]       contextual title        [actions]
```

Example:

```text
[C] Cruze      Tijuana → San Diego      ⚙
```

Header variants:

### Global

```text
CRUZE
```

### Trip context

```text
CRUZE       Tijuana → San Diego
```

### Detail

```text
←       San Ysidro                 ☆  ⋯
```

### Search

```text
←       [ Buscar cruces... ]
```

The header should never become a huge hero.

---

# 31. Bottom navigation

The bottom navigation is global.

Current five destinations:

```text
Viaje
Cruces
Agente
Favoritos
Alertas
```

Each tab contains:

```text
icon
label
active state
```

Active state uses CRUZE Mint.

The navigation should feel quiet and structural.

Do not make it a large floating dock.

---

# 32. Navigation visual identity

The active state should not merely be:

```text
icon turns green
```

Use a small CRUZE-style indicator.

Concept:

```text
     ◉
   CRUCES
   ─────
```

Inactive:

```text
     ○
   CRUCES
```

The active indicator should remain subtle.

---

# 33. Iconography

The board uses a thin, modern line-icon system. 

Preferred characteristics:

* outline icons
* consistent stroke width
* rounded terminals
* minimal geometry
* no filled cartoon icons
* no mixed icon styles

Icon categories represented in the board include:

```text
Navigation
Compass
MessageCircle
Star
Bell
Clock
Car
Walking
Truck
Search
Share
Filter
Info
Bookmark
Chevron
```

Use one icon library consistently.

Lucide is appropriate if already used by the implementation.

---

# 34. Icon sizes

```text
12px — tiny metadata
16px — inline
20px — standard UI
24px — navigation/action
28–32px — hero/data icon
```

Don't use oversized icons merely to fill space.

---

# 35. Data visualization language

CRUZE doesn't need elaborate charts everywhere.

Use **simple operational data visualization**.

Examples:

```text
23 MIN
──────────────
WAIT
```

or lane comparisons:

```text
SENTRI       5 min
READY       15 min
STANDARD    22 min
```

Historical information can later use restrained line graphs.

Charts should remain subordinate to the actual numbers.

---

# 36. Brand logo usage

Primary logo:

```text
[CRUZE mark] CRUZE
```

The board includes:

* primary horizontal logo
* compact logo
* icon-only mark
* app icon
* crossing/gate graphic
* map markers



The mark should use CRUZE Mint.

Do not recolor it arbitrarily.

---

# 37. App icon

The app icon should use:

```text
Midnight background
+
CRUZE mark
```

with a restrained border/glow.

No text required.

---

# 38. Motion

Motion is functional.

Use animation for:

### Live signal

Very subtle pulse.

### Route

Optional drawing/reveal animation.

### Recommendation

Small entrance transition.

### Loading

Skeleton shimmer or restrained pulse.

Avoid:

* bouncing cards
* excessive parallax
* glowing buttons
* constant animated maps
* decorative transitions

---

# 39. Surface hierarchy

There should be four levels.

```text
LEVEL 0
Midnight
```

Page background.

```text
LEVEL 1
Surface
```

Normal cards.

```text
LEVEL 2
Surface Elevated
```

Important cards / modal / selected states.

```text
LEVEL 3
Temporary overlay
```

Dropdowns, dialogs, menus.

Do not introduce ten different shades of navy.

---

# 40. Dividers

Dividers should be:

```text
1px
Border color
```

and often span only the relevant content width.

Avoid giant boxed layouts where every subsection is surrounded by borders.

Use whitespace before borders.

---

# 41. The "editorial" rule

CRUZE should occasionally allow a component to exist **without a card**.

For example:

```text
BEST CROSSING RIGHT NOW

SAN YSIDRO

15
MIN

BORDER WAIT
```

can exist directly on the page.

Not everything requires:

```text
╭────────────────╮
│                │
│ content        │
│                │
╰────────────────╯
```

This is one of the primary ways we escape generic SaaS aesthetics.

---

# 42. Component catalog

The coding system should eventually have these reusable components.

## Brand

```text
CruzeLogo
CruzeMark
CruzeWordmark
```

## Navigation

```text
TopAppBar
BottomNavigation
NavigationTab
BackButton
ContextHeader
```

## Geography

```text
RouteLine
BorderLine
CountrySplit
OriginMarker
DestinationMarker
CrossingMarker
LiveSignal
MapSurface
```

## Data

```text
JourneyMetric
WaitTime
StatusIndicator
DataFreshness
DeltaTime
ConfidenceIndicator
```

## Crossing

```text
CrossingCard
CrossingHeader
LaneRow
LaneBadge
CrossingFacts
CrossingStatus
CrossingComparison
```

## Recommendation

```text
RecommendationCard
RecommendationReason
RecommendationBadge
AlternativeCrossing
```

## Forms

```text
SearchField
DestinationSearch
OriginSearch
SegmentedControl
Toggle
Select
```

## Feedback

```text
LoadingSkeleton
EmptyState
ConnectivityBanner
ErrorState
```

---

# 43. Page archetypes

Every page should derive from one of these archetypes.

### A. Decision page

Used by:

* recommendation
* Viaje

Structure:

```text
Context
↓
Primary decision
↓
Supporting evidence
↓
Alternatives
↓
CTA
```

---

### B. Intelligence list

Used by:

* Crossings
* Favorites
* Alerts

Structure:

```text
Header
↓
Filters
↓
Section
↓
Items
↓
Secondary sections
```

---

### C. Detail page

Used by:

* Crossing Detail
* Alert Detail

Structure:

```text
Navigation
↓
Geographic context
↓
Primary status
↓
Core metrics
↓
Detailed intelligence
↓
Related information
↓
Actions
```

---

### D. Configuration page

Used by:

* onboarding
* trip configuration
* traveler profile

Structure:

```text
Context
↓
Question
↓
Input
↓
Supporting explanation
↓
Next
```

---

# 44. The most important component hierarchy

When designing any screen, use this order:

```text
1. CONTEXT
2. DECISION
3. EVIDENCE
4. ALTERNATIVES
5. ACTION
6. DETAILS
```

Not:

```text
header
card
card
card
button
card
```

This is fundamental to the product.

---

# 45. CRUZE's information hierarchy

Every screen should answer:

### First

> **What is happening?**

### Second

> **What does it mean for my trip?**

### Third

> **What should I do?**

### Fourth

> **Why does CRUZE recommend this?**

### Fifth

> **What else should I know?**

This should drive both visual hierarchy and content hierarchy.

---

# 46. Design rules for recommendations

Never recommend something simply by making it green.

The recommendation needs evidence.

Example:

```text
✦ BEST OVERALL

San Ysidro

15 min border wait
17 min total journey

Fastest overall
2 min faster than Otay Mesa
```

The visual system communicates:

```text
recommendation
+
reason
+
measurement
```

not merely:

```text
green = good
```

---

# 47. Design rules for alternatives

Alternatives should answer:

> "How much worse is this option?"

Therefore:

```text
Otay Mesa                +4 min
Tecate                  +13 min
Calexico East           +28 min
```

is preferred over simply displaying absolute times.

The absolute time can remain secondary.

---

# 48. Design rules for live data

Always show freshness when appropriate.

Examples:

```text
● LIVE
Updated 1 min ago
```

or:

```text
OPEN
Updated 2 min ago
```

If data becomes stale, visually downgrade the live indicator rather than pretending the data is current.

---

# 49. Design rules for maps

Maps should never become the entire interface.

The map answers:

> Where?

The rest of CRUZE answers:

> What does that mean?

and:

> What should I do?

The map therefore supports the decision instead of replacing it.

---

# 50. Responsive behavior

Mobile is primary.

### Mobile

Use:

```text
single column
full-width surfaces
large touch targets
vertical scrolling
bottom navigation
```

### Tablet/Desktop

Allow:

```text
two-column layouts
map + intelligence panel
expanded recommendation surfaces
larger geographic visualization
```

But preserve the same hierarchy.

Do not simply stretch the mobile card layout across desktop.

---

# 51. Touch targets

Minimum:

```text
44 × 44px
```

Recommended:

```text
48 × 48px
```

Buttons may be taller:

```text
48–56px
```

---

# 52. Accessibility

Maintain:

* WCAG AA contrast minimum
* visible focus states
* semantic HTML
* keyboard navigation on desktop
* accessible labels for icons
* don't communicate state using color alone

For example:

```text
● Open
```

not simply:

```text
●
```

---

# 53. Do not over-card the application

This deserves an explicit coding-agent instruction:

> **A card is not the default container for every piece of information.**

Use cards for:

* decisions
* grouped information
* crossing entities
* interactive surfaces

Use plain page sections for:

* headings
* explanatory text
* simple metrics
* metadata
* supporting information

---

# 54. Don't optimize for screenshot composition

This should be included verbatim in the agent prompt:

> **Do not attempt to fit an entire page into one mobile viewport. CRUZE is intentionally vertically breathing. Pages should scroll naturally. Prioritize hierarchy, readability, and generous vertical spacing over minimizing scroll length.**

This is one of the most important design constraints we've established.

---

# 55. Visual density target

The interface should feel:

```text
INFORMATION-RICH
       +
VISUALLY CALM
```

not:

```text
INFORMATION-RICH
       +
VISUALLY DENSE
```

The difference is achieved through:

* whitespace
* typography
* hierarchy
* grouping
* restrained borders
* fewer cards

not by removing useful information.

---

# 56. The CRUZE signature

Every major screen should contain at least **two or three** of the following visual signatures:

```text
✓ route geometry
✓ border line
✓ crossing gate
✓ live signal
✓ country split
✓ large numerical metric
✓ editorial section heading
```

But **never force all seven onto one screen.**

This prevents the identity from becoming repetitive or gimmicky.

---

# 57. Example: CRUZE recommendation screen

The intended composition is approximately:

```text
┌────────────────────────────────────┐
│ CRUZE           Tijuana → LA       │
├────────────────────────────────────┤
│                                    │
│ Tijuana → Los Angeles              │
│                                    │
│ BEST CROSSING RIGHT NOW            │
│                                    │
│ SAN YSIDRO                    ●OPEN │
│ Tijuana, MX ↔ San Diego, CA        │
│                                    │
│ ────────●──────────────────────    │
│       crossing                     │
│                                    │
│        15              8h 47m      │
│       MIN              TOTAL       │
│     BORDER WAIT       JOURNEY      │
│                                    │
│ ✦ FASTEST OVERALL                  │
│   23 min faster than Calexico West │
│                                    │
│ ───────────────────────────────    │
│                                    │
│ OTHER OPTIONS                      │
│                                    │
│ Otay Mesa                   +4 min │
│ Tecate                     +13 min │
│                                    │
│ [        INICIAR VIAJE →        ]  │
│                                    │
│              ↓ scroll              │
└────────────────────────────────────┘
```

Notice that the page **doesn't try to end at the bottom of the phone**.

---

# 58. Example: Crossing Detail

```text
←       SAN YSIDRO              ☆  ⋯


          MAP
  ┌────────────────────────────┐
  │                            │
  │     Tijuana                │
  │          ╲                 │
  │           ╲                │
  │            ● SAN YSIDRO    │
  │             ╲              │
  │              ╲ San Diego   │
  │                            │
  └────────────────────────────┘


SAN YSIDRO
TIJUANA ↔ SAN DIEGO

● OPEN · Updated 1 min ago


15
MIN
BORDER WAIT


LANES

READY LANE              15 min
SENTRI                   5 min
STANDARD                22 min


ABOUT THIS CROSSING

Open 24 hours
Passenger vehicles
Pedestrian access


OTHER CROSSINGS

Otay Mesa                  +4 min
Tecate                    +13 min


COMPARE CROSSINGS
```

Long, intentional, scrollable.

---

# 59. Example: Crossings list

```text
CRUCES FRONTERIZOS

[ Buscar cruces... ]

TODOS     MÉXICO     US


LIVE NETWORK

6 OPEN · 2 LIMITED · 1 CLOSED


SAN YSIDRO
Tijuana, MX ↔ San Diego, CA

● OPEN

15 min
+ 2 more lanes


OTAY MESA
Tijuana, MX ↔ San Diego, CA

● OPEN

21 min


TECATE
Tecate, MX ↔ Tecate, CA

● OPEN

28 min


...

```

Again, don't make six cards compete equally for attention.

Use section rhythm.

---

# 60. Implementation philosophy

The coding agent should understand that the design system is **not a collection of decorative styles**.

The system exists to reinforce the product's central proposition:

```text
WHERE AM I?
     ↓
WHERE AM I GOING?
     ↓
WHERE CAN I CROSS?
     ↓
WHAT IS HAPPENING NOW?
     ↓
WHICH CROSSING IS BEST?
     ↓
WHY?
     ↓
GO
```

That is the CRUZE experience.

---

# 61. Recommended Tailwind token foundation

The starting `@theme` block should look approximately like:

```css
@theme {
  /* Brand */
  --color-cruze-mint: #00E0A0;

  /* Backgrounds */
  --color-midnight: #071A31;
  --color-surface: #0E223F;
  --color-surface-elevated: #132B4A;

  /* Structure */
  --color-border: #1F3A5A;

  /* Typography */
  --color-text-primary: #F5F7FA;
  --color-text-secondary: #A7B3CC;

  /* Semantic */
  --color-amber: #FFB020;
  --color-alert-red: #FF4D4F;
  --color-info-blue: #3BA7FF;

  /* Typography */
  --font-sans: "Sora", ui-sans-serif, system-ui, sans-serif;

  /* Radius */
  --radius-control: 8px;
  --radius-card: 12px;
  --radius-surface: 16px;
  --radius-modal: 20px;

  /* Layout */
  --spacing-page: 20px;
  --spacing-section: 48px;
}
```

Then build component-specific spacing and typography using Tailwind utilities rather than creating hundreds of tokens.

---

# 62. What the agent should NOT do

Include this as an explicit guardrail:

```text
DO NOT:

- introduce gradients without design approval
- introduce glassmorphism
- introduce generic dashboard cards everywhere
- fit screens into one viewport
- use huge decorative illustrations
- use flags as decoration
- use green for every positive state
- use arbitrary colors
- use multiple icon libraries
- invent new border radii per component
- make every element rounded
- add excessive shadows
- make maps visually dominant
- turn CRUZE into a cyberpunk aesthetic
- add visual decoration that doesn't communicate information
```

---

# 63. What the agent SHOULD do

```text
DO:

- use the token system
- use Sora consistently
- preserve generous vertical spacing
- treat pages as scrollable information surfaces
- prioritize numerical information
- use the border as a meaningful geographic element
- use route geometry consistently
- make crossing gates visually distinctive
- make live state immediately recognizable
- use amber for meaningful time tradeoffs
- use mint deliberately
- preserve strong contrast
- use editorial typography
- reduce unnecessary containers
- let whitespace establish hierarchy
- keep maps subdued
- keep interactions obvious
- make recommendations evidence-based
```

---

# 64. The design philosophy in one sentence

I'd put this at the very top of the coding-agent brief:

> **CRUZE is a premium border-intelligence instrument: geographic like a map, precise like an operations system, readable like an editorial publication, and calm enough to help users make consequential travel decisions.**

And one more sentence specifically for implementation:

> **Do not design for the screenshot; design for the scroll.**

That last rule is particularly important given what we've learned from the previous iterations.

---

## One final recommendation

I would now consider this board the **CRUZE Visual Identity v2 baseline**, rather than continuing to redesign individual screens in isolation. The board already establishes the brand mark, color system, typography, iconography, route/border language, live signal, crossing marker, numerical treatment, core controls, and representative screens. 

The next logical artifact is therefore not another visual board.

It is a **screen-by-screen implementation specification against this system**:

```text
01  Global Header
02  Bottom Navigation
03  Onboarding / Destination
04  Onboarding / Starting Point
05  Onboarding / Recommendation
06  Viaje / No Trip
07  Viaje / Active Trip
08  Crossings
09  Crossing Detail
10  Crossing Full Details
11  Compare Crossings
12  Favorites
13  Alerts
14  Alert Detail
15  Agent
16  Loading / Offline / Empty / Error states
```

That would give the coding agent a clean hierarchy:

**Visual Identity → Tokens → Components → Global Navigation → Page Archetypes → Page Specs → States.**

That is the point where the design stops being a mood board and becomes a genuinely implementable CRUZE design system.

