Absolutely. I’d treat this as the **implementation contract** for CRUCE: the design system defines the visual language, while this document defines how every screen uses that language, what is fixed, what is dynamic, and how the states behave.

# CRUCE — Screen-by-Screen Implementation Specification

**Target:** React + TanStack Start + Tailwind CSS v4
**Product:** CRUCE — Mexico ↔ US border-crossing intelligence
**Design direction:** premium editorial / information-dense / calm / highly legible / vertically breathing
**Primary mode:** dark
**Responsive target:** mobile-first, with desktop/web adaptation
**Core principle:** CRUCE is not a generic travel app. It is a **border intelligence interface**.

---

# 00 — Global Implementation Principles

Before the individual screens, these rules apply everywhere.

### 00.1 The hierarchy

Every screen should answer, in order:

1. **Where am I?**
2. **What is happening now?**
3. **What should I do?**
4. **Why should I trust this information?**
5. **What can I explore next?**

The interface should never make the user hunt for the current operational status.

### 00.2 Information hierarchy

Use four levels consistently:

```text
LEVEL 01 — DECISION
What should I do?

LEVEL 02 — CURRENT STATE
What's happening now?

LEVEL 03 — SUPPORTING DATA
Why?

LEVEL 04 — CONTEXT
Additional information / rules / details
```

### 00.3 Vertical breathing

Do **not** design screens as fixed 812px/844px compositions.

Screens are vertically scrollable documents.

Use:

```text
Header
↓
Page intro / decision
↓
Primary information
↓
Supporting modules
↓
Context
↓
Related actions
↓
Bottom breathing room
```

The bottom navigation remains fixed independently.

### 00.4 Cards

Avoid excessive cardization.

Not every piece of information belongs inside a rounded rectangle.

Prefer:

* editorial sections
* horizontal rules
* tonal surfaces
* inset data groups
* occasional elevated cards

Cards are reserved for **distinct objects or decisions**.

### 00.5 Status colors

Status color should communicate operational state, not decoration.

```text
OPEN / GOOD       → positive
MODERATE          → attention
BUSY              → warning
SEVERE            → critical
CLOSED            → neutral/critical
UNKNOWN           → muted
```

The CRUCE accent system should remain recognizable even when status colors are present.

---

# 01 — GLOBAL HEADER

## Purpose

Persistent orientation and access to global actions.

The header is **not a page hero**. It is infrastructure.

---

## Desktop

```text
┌──────────────────────────────────────────────────────────────┐
│ CRUCE        [Current context / location]       ◌  ◉        │
└──────────────────────────────────────────────────────────────┘
```

## Mobile

```text
┌──────────────────────────────────────┐
│ CRUCE                         ◌      │
└──────────────────────────────────────┘
```

---

## Anatomy

```text
Header
├── Brand
├── Context
├── Optional contextual action
└── Account / utility action
```

### Brand

CRUCE wordmark.

Never replace the wordmark with a generic hamburger/menu icon.

### Context

Context is optional and page-dependent.

Examples:

```text
San Diego ↔ Tijuana
Mexicali ↔ Calexico
Nogales ↔ Nogales
```

### Utility

Potential actions:

* notifications
* profile
* settings
* back

Do not place every action here.

---

## Behavior

### Root-level pages

Show:

```text
CRUCE
```

### Contextual pages

Show:

```text
←   Crossing
```

or

```text
←   San Ysidro
```

### Scroll

On mobile:

* header initially normal
* becomes compact/sticky while scrolling
* background gains subtle surface separation
* never becomes a giant floating pill

---

## Implementation

Component:

```tsx
<GlobalHeader
  context="San Ysidro"
  back={true}
  action="notifications"
/>
```

Height:

```text
mobile: ~56–64px
desktop: ~72px
```

Use safe-area inset on mobile.

---

# 02 — BOTTOM NAVIGATION

The bottom navigation should remain deliberately small.

CRUCE has **one job**, so navigation should reinforce that.

## Final architecture

```text
┌───────────────────────────────────────────┐
│                                           │
│                  CONTENT                  │
│                                           │
├───────────────────────────────────────────┤
│   VIAJE      CRUCES      FAVORITOS   ⚙    │
└───────────────────────────────────────────┘
```

Recommended:

```text
Viaje
Cruces
Favoritos
Más / Account
```

Alerts should **not necessarily become a permanent primary tab**. An alert is contextual intelligence and can surface through the header, trip, crossing and relevant content.

Agent similarly should not compete with the core navigation.

---

## Navigation states

### Active

* accent indicator
* stronger label
* icon filled/weighted

### Inactive

* muted
* lower contrast
* same geometry

### Badge

Alerts may use a small badge:

```text
◉ 3
```

Do not use giant red notification bubbles.

---

## Behavior

Fixed:

```css
position: fixed;
bottom: 0;
```

Respect:

```text
env(safe-area-inset-bottom)
```

Content receives bottom padding equivalent to navigation height + safe area.

---

# 03 — ONBOARDING / DESTINATION

## Purpose

Establish **where the user is going**.

This is the first meaningful product interaction.

---

## Composition

```text
                 CRUCE

        Where are you going?

   Tell us your destination and we'll
   recommend the best crossing.

 ┌───────────────────────────────────┐
 │ 🔎  Search city / destination     │
 └───────────────────────────────────┘

 Recent
 ┌───────────────────────────────────┐
 │ San Diego                         │
 │ Tijuana                           │
 └───────────────────────────────────┘

                       Continue →
```

---

## Behavior

Search should support:

* cities
* neighborhoods
* addresses
* POIs
* known destinations

Destination is **not necessarily a crossing**.

The user says:

> "I'm going to San Diego."

CRUCE determines appropriate crossings.

---

## Selection

Selected destination gets:

* accent border
* subtle filled surface
* check indicator

Continue remains disabled until selection.

---

## Empty search

```text
No destinations found

Try a city, address or landmark.
```

---

## Implementation

State:

```ts
destination: Destination | null
query: string
```

Persist temporarily through onboarding flow.

---

# 04 — ONBOARDING / STARTING POINT

## Purpose

Determine where the journey begins.

---

## Composition

```text
               Where are you
                 starting?

        This helps us determine
        your direction of travel.

 ┌───────────────────────────────────┐
 │ ◎ Use my current location        │
 └───────────────────────────────────┘

 ─────────────── OR ────────────────

 ┌───────────────────────────────────┐
 │ 🔎 Search starting point          │
 └───────────────────────────────────┘

 Recent locations
 ...
```

---

## Primary action

Current location should be visually dominant.

```text
◎ Use current location
```

Permission request occurs only after explicit interaction.

---

## Manual location

Support:

* city
* address
* known region

The user should never need to understand border geography.

---

## Direction detection

After both points exist:

```text
Starting point → Destination
```

CRUCE derives:

```text
Mexico → US
```

or

```text
US → Mexico
```

---

# 05 — ONBOARDING / RECOMMENDATION

This is one of the most important screens.

CRUCE should demonstrate its value immediately.

## Purpose

Convert destination + origin into a clear recommendation.

---

## Composition

```text
YOUR BEST OPTION

        San Ysidro

        24 min
        estimated crossing

        ● OPEN

 ┌───────────────────────────────────┐
 │                                   │
 │      CROSSING INTELLIGENCE        │
 │                                   │
 │  Vehicle       Normal             │
 │  Current wait  24 min             │
 │  Traffic       Moderate           │
 │                                   │
 └───────────────────────────────────┘

 Why we're recommending it

 ✓ Fastest overall
 ✓ Open for your vehicle
 ✓ Best route from your location

 ┌───────────────────────────────────┐
 │        Start my trip →            │
 └───────────────────────────────────┘

 Compare alternatives
```

---

## Recommendation logic

Recommendation should not simply equal:

```text
minimum crossing time
```

It should consider:

```text
ETA =
route time
+
border wait
+
lane availability
+
vehicle eligibility
+
operational constraints
```

Display the **reason**, not the algorithm.

---

## Alternative crossings

Show compact alternatives:

```text
Otay Mesa       31 min
Tecate          47 min
```

Tap → Compare.

---

# 06 — VIAJE / NO TRIP

This is the default home state after onboarding.

## Purpose

Give the user an immediate starting point.

---

## Composition

```text
Good morning

Where are you going?

 ┌───────────────────────────────────┐
 │ ◎ Destination                     │
 │   Add a destination               │
 └───────────────────────────────────┘

 ───────────

 YOUR CROSSING

 No active trip

Plan your next border crossing
when you're ready.

 ┌───────────────────────────────────┐
 │       Plan a crossing →           │
 └───────────────────────────────────┘

 Recent
 ────────────────────────────────────
 San Diego                         →
 Mexicali                          →
```

---

## If destination is already known

Replace the generic CTA with:

```text
San Diego

Find the best crossing →
```

---

## Empty-state philosophy

Never say:

> "You don't have any trips."

Instead:

> "No active trip"

Then immediately explain the value.

---

# 07 — VIAJE / ACTIVE TRIP

This is the **operational command center**.

## Purpose

Tell the user:

> "This is the crossing you should take right now."

---

## Composition

```text
YOUR TRIP

Tijuana → San Diego

────────────────────────────────

RECOMMENDED

SAN YSIDRO

        24 min
     border wait

       ● OPEN

   ↓  18 min to crossing

────────────────────────────────

WHY THIS ONE

Fastest overall
Normal traffic
All vehicle lanes available

────────────────────────────────

LIVE CONDITIONS

Border wait          24 min
Approach traffic      8 min
Total estimated      32 min

────────────────────────────────

ALTERNATIVES

Otay Mesa             38 min
Tecate                51 min

────────────────────────────────

Trip actions

   Navigate
   Change crossing
   End trip
```

---

## Primary CTA

**Navigate**

This should hand off to the user's preferred mapping application rather than attempting to replace Google Maps/Apple Maps.

CRUCE provides intelligence.

The mapping app provides navigation.

---

## Live updating

The trip screen should refresh operational data without resetting scroll position.

Use:

```text
Last updated 2 min ago
```

rather than constantly flashing loading indicators.

---

# 08 — CROSSINGS

## Purpose

Explore the complete crossing network.

This is the main intelligence index.

---

## Header

```text
Crossings

Mexico ↔ United States
```

---

## Filters

Horizontal scroll:

```text
All
Mexico → US
US → Mexico
Open now
My area
```

Secondary filter:

```text
Vehicle
```

---

## Crossing list

Each item should be compact but information-rich.

```text
SAN YSIDRO
Tijuana → San Diego

● 24 min
Normal

Open · 24h
All vehicles

────────────────────────
```

Alternative:

```text
OTAY MESA
Tijuana → San Diego

● 31 min
Moderate

Open · 24h
Cars · Cargo
```

---

## Sorting

Default:

```text
Recommended
```

Options:

```text
Fastest
Closest
Least busy
Open now
```

---

## Interaction

Tap crossing → Crossing Detail.

Long press / overflow:

```text
Add to favorites
Set alert
```

---

# 09 — CROSSING DETAIL

This is the **summary intelligence page** for one crossing.

---

## Hero

```text
SAN YSIDRO

Tijuana → San Diego

● OPEN

24 min
Current wait
```

Secondary:

```text
Updated 2 min ago
```

---

## Main information

```text
CURRENT CONDITIONS

Border wait             24 min
Approach traffic        Moderate
Lanes operating         12
```

---

## Trend

A compact chart:

```text
WAIT TIME

40 ┤
30 ┤        ╭─╮
20 ┤    ╭───╯ ╰──╮
10 ┤────╯         ╰──
   └──────────────────
      12  14  16  18
```

Avoid overly decorative charts.

The chart exists to answer:

> Is this getting better or worse?

---

## CTA

```text
Compare crossings
```

Secondary:

```text
View full details
```

---

# 10 — CROSSING FULL DETAILS

This is the reference/document view.

Unlike Crossing Detail, it prioritizes completeness over speed.

---

## Sections

```text
SAN YSIDRO

Overview
────────────

Hours
24 hours

Direction
Mexico → United States

────────────────

LANES

General
Open

Ready Lane
Open

SENTRI
Open

Pedestrian
Open

Cargo
Not available

────────────────

VEHICLES

Private vehicle      ✓
Commercial cargo     ✕
Motorcycle           ✓

────────────────

REQUIREMENTS

...
```

---

## Information architecture

Recommended order:

1. Status
2. Hours
3. Lane types
4. Vehicle eligibility
5. Requirements
6. Facilities
7. Restrictions
8. Contact / official information
9. Last updated

---

## Important distinction

Never present:

```text
"Probably allowed"
```

Operational rules should have explicit confidence/source status.

For uncertain data:

```text
Information unavailable
```

rather than inventing certainty.

---

# 11 — COMPARE CROSSINGS

## Purpose

Decision support.

This is where CRUCE earns its intelligence positioning.

---

## Desktop

Use columns.

```text
                 SAN YSIDRO     OTAY MESA     TECATE

Wait               24 min        31 min        47 min
Approach             8 min         6 min        12 min
Total                32 min        37 min        59 min

Open                  ●             ●             ●

Ready Lane            ✓             ✓             ✕

SENTRI                ✓             ✓             ✓

Cargo                 ✕             ✓             ✕

Distance              14 km         21 km        58 km
```

---

## Mobile

Comparison becomes horizontally scrollable.

```text
             ← swipe →

SAN YSIDRO
24 min

Wait
24 min

Traffic
Moderate

SENTRI
✓

Ready Lane
✓
```

Sticky crossing names at top of horizontal comparison.

---

## Highlight

CRUCE should automatically highlight the best option:

```text
BEST OVERALL
```

Not every category needs a winner.

---

# 12 — FAVORITES

## Purpose

Fast access to crossings the user cares about.

---

## Composition

```text
Favorites

YOUR CROSSINGS

SAN YSIDRO
● 24 min
Tijuana → San Diego

OTAY MESA
● 31 min
Tijuana → San Diego

────────────────

Saved alerts
...
```

---

## Empty

```text
No favorites yet

Save crossings you use often
to see their status instantly.

Browse crossings →
```

---

## Reordering

Optional drag-to-reorder.

Default order can be:

```text
Most recently used
```

or explicit user ordering.

---

# 13 — ALERTS

## Purpose

Surface operational changes that matter.

Not a generic notification center.

---

## Alert categories

```text
WAIT TIME
STATUS
LANE
CLOSURE
RESTRICTION
TRIP
```

---

## List

```text
ALERTS

● SAN YSIDRO
Wait time increased

24 → 41 min
12 min ago

────────────────

● OTAY MESA
SENTRI lane reopened

28 min ago
```

---

## Severity

Use hierarchy:

```text
INFO
ATTENTION
IMPORTANT
CRITICAL
```

Don't make every alert red.

---

## Alert filtering

Optional:

```text
All
My crossings
My trip
```

---

# 14 — ALERT DETAIL

## Purpose

Explain exactly what changed and what the user should do.

---

## Composition

```text
SAN YSIDRO

WAIT TIME INCREASED

41 min

Previously
24 min

Change
+17 min

────────────────

WHAT THIS MEANS

Current conditions indicate
significantly increased demand.

────────────────

RECOMMENDATION

OTAY MESA is currently
estimated at 31 min.

Compare crossings →
```

---

## Timestamp

Always display:

```text
Detected 14 min ago
```

and:

```text
Last data update 2 min ago
```

These are different concepts.

---

## Alert lifecycle

States:

```text
ACTIVE
ACKNOWLEDGED
RESOLVED
EXPIRED
```

Resolved alerts become historical rather than disappearing silently.

---

# 15 — AGENT

The Agent should feel like a **CRUCE intelligence layer**, not a generic chatbot.

## Purpose

Allow natural-language queries against CRUCE data.

Examples:

> "Which crossing is fastest right now?"

> "I'm going to San Diego with a normal car."

> "Is Otay better than San Ysidro?"

---

## Entry

Do not make the Agent dominate the navigation.

Expose it through:

* contextual CTA
* crossing pages
* trip page
* optional global action

---

## Interface

```text
CRUCE AGENT

What do you need to know?

 ┌───────────────────────────────────┐
 │ Ask about your crossing...        │
 └───────────────────────────────────┘

Suggested

Which crossing is fastest?

Is SENTRI open?

What's the best option for me?
```

---

## Conversation

```text
YOU

Which crossing should I use?

CRUCE

Based on your destination in
San Diego, San Ysidro is currently
the fastest overall.

24 min border wait
+ 8 min approach

Otay Mesa is currently 37 min total.

[Use San Ysidro]
[Compare]
```

---

## Agent constraints

The Agent must never fabricate operational information.

Every operational answer should be grounded in current CRUCE data.

If information is unavailable:

```text
I don't have reliable current data
for that crossing.
```

---

# 16 — LOADING / OFFLINE / EMPTY / ERROR

This needs to be designed as a **system-wide state language**, not individual ad-hoc screens.

---

# 16.1 Loading

Avoid full-screen spinners whenever possible.

Use skeletons that preserve layout.

```text
SAN YSIDRO

████████████
████

CURRENT CONDITIONS

██████      ██████
██████      ██████
```

For immediate actions:

```text
Updating crossing data…
```

---

# 16.2 Refreshing

Don't replace content.

Show:

```text
↻ Updating…
```

then:

```text
Updated just now
```

This is especially important for live crossing information.

---

# 16.3 Offline

CRUCE should degrade gracefully.

```text
You're offline

Showing the latest available
crossing information.

Last updated
8:42 AM

Some live data may be unavailable.
```

Keep cached information visible.

Never show:

```text
0 min
```

because data failed to load.

---

# 16.4 Empty

Every empty state answers:

1. What is empty?
2. Why?
3. What can I do?

Example:

```text
NO FAVORITES

Save crossings you use often
to access them quickly.

Browse crossings →
```

---

# 16.5 Error

Errors should be operationally useful.

```text
Couldn't update crossing data

Your previous information is still
available below.

Last updated 4 min ago.

Try again
```

If there is no cached data:

```text
Crossing data unavailable

We couldn't retrieve current
information right now.

Try again
```

---

# 17 — RESPONSIVE BEHAVIOR

The same information architecture should scale rather than creating separate products.

## Mobile

```text
Single column
Horizontal scrolling where comparison requires it
Bottom navigation
Large touch targets
Sticky contextual actions
```

## Tablet

```text
Two-column opportunities
Larger data groups
Bottom nav may become side navigation
```

## Desktop

```text
┌──────────────┬─────────────────────────────┐
│              │                             │
│  NAVIGATION  │          CONTENT            │
│              │                             │
│              │                             │
└──────────────┴─────────────────────────────┘
```

Crossing detail can become:

```text
┌─────────────────────────────────────────────┐
│ Header                                      │
├───────────────────────────┬─────────────────┤
│ Main intelligence         │ Quick facts     │
│                           │                 │
│ Wait chart                │ Hours           │
│ Conditions                │ Lanes           │
│                           │ Vehicles         │
└───────────────────────────┴─────────────────┘
```

---

# 18 — ROUTING MODEL

The page structure should map cleanly onto application routes.

```text
/
├── onboarding/
│   ├── destination
│   ├── starting-point
│   └── recommendation
│
├── viaje/
│   ├── index
│   └── active
│
├── cruces/
│   ├── index
│   ├── [crossing]
│   ├── [crossing]/details
│   └── compare
│
├── favoritos
│
├── alertas/
│   ├── index
│   └── [alert]
│
└── agent
```

---

# 19 — COMPONENT ARCHITECTURE

The screen specifications should **not** become 16 independent implementations.

Build a small vocabulary of reusable primitives.

```text
CRUCE UI
│
├── GlobalHeader
├── BottomNav
│
├── Page
├── PageHeader
├── Section
│
├── StatusIndicator
├── StatusBadge
├── Metric
├── MetricGroup
│
├── CrossingCard
├── CrossingStatus
├── CrossingRow
├── CrossingHero
│
├── WaitTime
├── WaitTrend
├── LaneStatus
├── VehicleEligibility
│
├── Recommendation
├── RecommendationReason
├── ComparisonTable
│
├── AlertCard
├── AlertDetail
│
├── SearchField
├── FilterBar
├── EmptyState
├── ErrorState
├── OfflineBanner
├── Skeleton
│
└── Agent
```

---

# 20 — DATA MODEL → UI MODEL

The UI should consume domain objects rather than hardcoded presentation data.

For example:

```ts
Crossing {
  id
  name
  city
  direction
  status
  hours
  waitTimes
  traffic
  lanes
  vehicleTypes
  restrictions
  facilities
  lastUpdated
}
```

Then derive:

```ts
CrossingSummary
CrossingRecommendation
CrossingComparison
CrossingAlert
```

This is important because **the same crossing information appears on multiple screens**.

---

# 21 — SCREEN RELATIONSHIP MAP

The entire product should behave roughly like this:

```text
                     ONBOARDING
                         │
              ┌──────────┴──────────┐
              │                     │
        DESTINATION          STARTING POINT
              │                     │
              └──────────┬──────────┘
                         ↓
                  RECOMMENDATION
                         │
                         ↓
                       VIAJE
                    ┌────┴────┐
                    │         │
                 NO TRIP   ACTIVE TRIP
                              │
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
                CROSSING   ALERTS    AGENT
                    │
             ┌──────┴───────┐
             ↓              ↓
          DETAIL       FULL DETAILS
             │
             ↓
          COMPARE
             │
             ↓
         FAVORITES
```

The key idea is that **everything revolves around the crossing decision**.

---

# 22 — THE CRUCE PRODUCT LOOP

The implementation should ultimately reinforce one simple loop:

```text
WHERE AM I?
     ↓
WHERE AM I GOING?
     ↓
WHICH CROSSING SHOULD I USE?
     ↓
WHAT IS HAPPENING THERE NOW?
     ↓
HAS THAT CHANGED?
     ↓
SHOULD I CHANGE MY DECISION?
```

That is the product.

The screens are different expressions of that same intelligence model—not 16 unrelated pages.

### Most important implementation distinction

I would divide the entire application into **three layers**:

```text
GLOBAL SYSTEM
Header
Bottom navigation
State handling
Typography
Surfaces
Status language

          ↓

INTELLIGENCE LAYER
Crossing
Wait time
Traffic
Lanes
Rules
Recommendations
Alerts

          ↓

EXPERIENCE LAYER
Onboarding
Trip
Crossings
Favorites
Agent
Comparison
```

That separation will make the implementation much more robust than building each screen independently.

