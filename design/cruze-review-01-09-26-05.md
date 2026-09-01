This complete description changes the picture quite a bit—in a good way. **Cruze is no longer just a crossing-time app; it is a trip-contextual border intelligence system.** That means I would make a few architectural decisions now, before implementing more screens.

The biggest one is this:

> **A trip should be the context that powers Cruze, not a feature that competes with the Crossings tab.**

And that gives us a much cleaner product model.

---

# 1. The product model I would lock in

I would think of Cruze as having three layers:

```text
┌──────────────────────────────────────────┐
│              USER CONTEXT                │
│                                          │
│  Origin + Destination + Traveler Profile │
└───────────────────┬──────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│         BORDER INTELLIGENCE ENGINE       │
│                                          │
│  Route → Corridor → Crossings → Lanes   │
│  → Waits → Restrictions → Recommendation│
└───────────────────┬──────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│                 CRUZE UI                 │
│                                          │
│  Viaje | Crossings | Agent | Favorites  │
│                                      Alerts
└──────────────────────────────────────────┘
```

That is the conceptual architecture I'd use for the entire product.

The important part is that **the recommendation engine sits between the user's trip and the crossing data**.

---

# 2. Your five tabs now make much more sense

I actually like this IA more than the earlier five-tab proposal.

### Viaje

> **What should I do for my trip?**

### Crossings

> **What is happening at the border?**

### Agent

> **Ask Cruze.**

### Favorites

> **What crossings do I care about?**

### Alerts

> **What changed that I need to know?**

That's a coherent product.

The five tabs aren't five unrelated features.

They're five ways of interacting with the same border intelligence layer.

---

# 3. One thing I'd change immediately: Viaje should be the default/home state

Your description says:

> `/crossings` = main app after onboarding.

I don't think that's quite right anymore.

Given everything you've described, **Viaje should effectively be Home** when a trip exists.

The user has just told Cruze:

> "I'm here, I'm going there, and this is how I'm crossing."

So the first thing Cruze should show is:

> **Here's your best option right now.**

Therefore:

```text
First launch
    ↓
Onboarding
    ↓
Trip configured
    ↓
VIAJE
```

rather than:

```text
Onboarding
    ↓
Crossings
```

This also makes the five-tab architecture much clearer.

---

# 4. I would distinguish "Viaje" from "Crossings" very strongly

This is the most important IA distinction.

## Viaje

Personalized.

```text
Calle Francisco González Bocanegra
        ↓
Los Angeles

BEST CROSSING

San Luis
23 min border wait
8h 47m total

[ Iniciar viaje ]
```

It answers:

> **What should I do?**

---

## Crossings

Exploratory.

```text
ALL CROSSINGS

San Ysidro       15 min
Otay Mesa        21 min
Tecate           28 min
Calexico West    12 min
Calexico East    18 min
...
```

It answers:

> **What's happening?**

Don't let these two screens converge into the same UI.

---

# 5. This also resolves your onboarding question

I would now make onboarding:

```text
DESTINATION
     ↓
STARTING POINT
     ↓
TRIP CONTEXT
     ↓
RECOMMENDATION
     ↓
VIAJE
```

And the bypass:

> **Ver todos los cruces**

takes the user to:

```text
CROSSINGS
```

without requiring a trip.

That's excellent.

It means we don't force users into trip configuration just to browse border conditions.

---

# 6. I would NOT ask for Traveler Profile during first onboarding

This is the biggest change I'd make to your current specification.

You currently have Traveler Profile as part of the Viaje configuration wizard:

```text
Destination
Starting Point
Traveler Profile
```

That's okay for **trip configuration**, but I wouldn't make it mandatory for the first-time user.

Imagine someone opens Cruze for the first time because they're simply curious:

> "How bad is San Ysidro right now?"

Asking:

* crossing mode
* SENTRI
* visa
* passport country

before showing value is too much friction.

Instead:

### First onboarding

```text
Where are you going?
        ↓
Where are you starting?
        ↓
Here's your best crossing
        ↓
Start trip
```

Then:

> **Personalize your recommendation**

could appear when relevant.

---

# 7. Traveler profile should be progressive

This is particularly important because some information has very high value while some is more sensitive/complex.

I'd structure it:

### Level 1 — Trip

```text
Origin
Destination
```

### Level 2 — Mode

```text
Walking
Personal vehicle
Commercial vehicle
Public transport
```

### Level 3 — Lane eligibility

```text
SENTRI
```

### Level 4 — Border documentation

```text
Passport country
Visa / immigration status
```

This means we can provide useful recommendations **before we know everything about the traveler**.

---

# 8. There is a subtle issue with Visa Type

I would be careful about this model:

> US visas: B1/B2, H1B, F1, Global Entry, None
> MX visas: FMM, Resident, None

These aren't necessarily equivalent concepts.

For the recommendation engine, I would separate:

```text
immigration_documentation
```

from:

```text
trusted_traveler_program
```

and from:

```text
passport_country
```

For example:

```ts
TravelerProfile {
  passportCountry

  travelMode

  trustedTraveler: {
    sentri
    globalEntry
  }

  mexicoStatus
  usStatus
}
```

Then your eligibility engine can reason about actual crossing requirements rather than trying to infer everything from a single `visaType`.

This will become increasingly important when you support pedestrians, commercial vehicles and different crossing types.

---

# 9. Your recommendation engine needs three separate concepts

I would explicitly model:

### Candidate

> Can this crossing reasonably serve this trip?

### Eligibility

> Can this traveler use it?

### Ranking

> Which eligible crossing is best right now?

So:

```text
Trip
 ↓
Candidate crossings
 ↓
Eligibility filtering
 ↓
Travel-time calculation
 ↓
Live wait-time integration
 ↓
Recommendation score
 ↓
Ranked crossings
```

This is much better than:

```ts
findCrossingsBetween(origin, destination)
```

as the primary abstraction.

---

# 10. The recommendation should be explainable

Your current:

> Fastest overall
> X min faster than Y

is exactly the right direction.

I'd formalize reasons:

```ts
RecommendationReason =
  | "fastest_overall"
  | "shortest_wait"
  | "best_for_sentry"
  | "best_for_pedestrians"
  | "best_for_commercial"
  | "best_alternative"
  | "only_open_option"
  | "lowest_total_time"
```

And possibly:

```ts
comparison {
  deltaMinutes
  comparedToCrossingId
}
```

That gives us a system capable of saying:

> **Best overall**

> 23 min faster than Calexico West.

rather than generating generic copy.

---

# 11. Your crossing detail page is becoming the core data product

Looking at the complete specification, I think the **Crossing Detail View is actually the deepest product screen**.

That's good.

Its hierarchy should be:

```text
CROSSING
   ↓
LIVE STATUS
   ↓
WAIT TIMES
   ↓
LANES
   ↓
YOUR ELIGIBILITY
   ↓
ACCESS / HOURS
   ↓
OTHER CROSSINGS
   ↓
FULL DETAILS
```

The map should remain contextual rather than becoming the primary information surface.

I would resist turning this into a giant map application.

---

# 12. One thing I'd change on Crossing Detail

You currently say:

> Map → Crossing Card overlays map by -50px.

I like the visual concept.

But on mobile, the **map should probably have a controlled height**, not be the entire hero.

Something like:

```text
┌─────────────────────────┐
│ Header                  │
├─────────────────────────┤
│                         │
│          MAP            │
│                         │
│                         │
└─────────────────────────┘
          ╭──────────────╮
          │ San Ysidro   │
          │ LIVE         │
          │ 15 min       │
          ╰──────────────╯
          ↓
       LANES
          ↓
       DETAILS
```

The map establishes geographic context.

The data tells the user what to do.

---

# 13. "Iniciar viaje" on a Crossing card needs clarification

You currently have:

> Crossing list → crossing card → "Iniciar viaje" → sets crossing as destination context.

This wording is potentially problematic.

A **crossing isn't the user's trip destination**.

The destination is Los Angeles.

The crossing is the **recommended decision point along the route**.

So I would not mutate:

```text
destination = crossing
```

Instead:

```ts
trip.recommendedCrossing = crossing
```

or:

```ts
trip.selectedCrossing = crossing
```

Then:

> **Iniciar viaje**

means:

> Start navigating/monitoring this trip using this crossing.

That distinction matters enormously.

---

# 14. "Compare Crossings" deserves to become a real first-class experience

Given how important comparison is to Cruze, I wouldn't bury it.

The comparison screen could eventually be:

```text
COMPARE CROSSINGS

              Wait   Total
San Ysidro     15m    2h17
Otay Mesa      21m    2h21
Tecate         28m    2h38
```

Then:

```text
WHY?

San Ysidro
✓ Fastest overall
✓ 6 min faster than Otay Mesa
✓ Open 24 hours
```

This is a perfect expression of Cruze's core value.

And crucially, it should be **route-aware** when a trip exists.

---

# 15. Favorites should remain deliberately dumb

Favorites shouldn't become another recommendation system.

Just:

> Crossings I care about.

That's it.

```text
★ San Ysidro
★ Otay Mesa
★ Calexico East
```

Live data appears there, but the screen doesn't need to explain everything.

---

# 16. Alerts are potentially extremely valuable

But I'd make them **crossing-aware and route-aware**.

Suppose the user has:

```text
Tijuana → Los Angeles
Recommended: San Ysidro
```

and San Ysidro suddenly closes.

That's not merely:

> Alert #17

That's:

> **Your recommended crossing changed.**

That should be a much higher-priority experience.

Eventually:

```text
⚠ SAN YSIDRO
Your recommended crossing has changed.

Wait time increased from 15 → 41 min.

Otay Mesa is now 18 min faster.

[ View alternatives ]
```

**That's Cruze.**

---

# 17. This suggests a powerful future relationship between tabs

The tabs shouldn't be isolated.

For example:

```text
VIAJE
   │
   ├── Recommendation changes
   │             ↓
   │           ALERTS
   │
   ├── Need more options
   │             ↓
   │         CROSSINGS
   │
   ├── Save another crossing
   │             ↓
   │         FAVORITES
   │
   └── Ask why
                 ↓
              AGENT
```

That's a coherent ecosystem.

---

# 18. Agent should eventually be contextual, not generic

Your shell is fine for now.

But when you eventually implement the AI backend, don't make it a generic chatbot.

If I'm on:

```text
San Ysidro
```

and ask:

> "Should I take Otay instead?"

Agent should know:

```text
current crossing
current trip
destination
traveler profile
current waits
lane eligibility
```

Then it can answer meaningfully.

That's when the Agent tab becomes genuinely differentiated.

---

# 19. I would rename "Home Dashboard"

You currently have:

> Home Dashboard — partially built.

I would actually retire the concept of a separate Home Dashboard.

Make:

```text
Viaje = Home
```

when an active trip exists.

And:

```text
Crossings = Home
```

when no trip exists / the user bypasses onboarding.

That gives us a simple mental model:

```text
NO TRIP
   ↓
Crossings

TRIP EXISTS
   ↓
Viaje
```

Much cleaner.

---

# 20. This also solves the first-launch experience

The first-launch sequence becomes:

```text
                         CRUZE
                           │
                           ▼
                 ¿Dónde vas?
                           │
                           ▼
                 ¿Desde dónde?
                           │
                           ▼
              ┌─────────────────────┐
              │ CROSSING INTELLIGENCE│
              │                     │
              │ San Luis            │
              │ 23 min border wait  │
              │ 8h 47m total        │
              │                     │
              │ ✓ Fastest overall   │
              └──────────┬──────────┘
                         │
                         ▼
                    Iniciar viaje
                         │
                         ▼
                       VIAJE
```

And if they don't want a trip:

```text
Ver todos los cruces
        ↓
    CROSSINGS
```

That's excellent.

---

# 21. I would revise the app's canonical information architecture to this

```text
CRUZE
│
├── VIAJE
│   ├── Configure
│   │   ├── Destination
│   │   ├── Starting Point
│   │   └── Traveler Profile
│   │
│   ├── Active Trip
│   ├── Recommendation
│   └── Trip / Crossing monitoring
│
├── CROSSINGS
│   ├── All
│   ├── MX → US
│   ├── US → MX
│   └── Crossing Detail
│
├── AGENT
│
├── FAVORITES
│
└── ALERTS
    └── Alert Detail
```

And globally:

```text
                 ┌─────────────┐
                 │    CRUZE    │
                 └──────┬──────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
       TRIP                         DATA
          │                           │
          ▼                           ▼
       Viaje                      Crossings
          │                           │
          ├──────────────┐            │
          │              │            │
          ▼              ▼            ▼
     Recommendation    Alerts      Details
          │
          ▼
       Agent
```

---

# 22. What I would implement next

I would **not** jump into building all the missing screens yet.

I'd lock down these five things first:

### 01 — Trip domain model

```ts
Trip
Place
Direction
TravelerProfile
```

### 02 — Crossing domain model

```ts
Crossing
Lane
CrossingStatus
CrossingAccess
```

### 03 — Recommendation engine contract

```ts
getCrossingCandidates()
filterEligibleCrossings()
rankCrossings()
explainRecommendation()
```

### 04 — Global navigation

Precisely define:

* TopAppBar states
* Bottom navigation
* tab badges
* active/inactive states
* scrolling behavior
* modal behavior
* deep-link behavior

### 05 — Page archetypes

Then derive:

```text
Trip pages
List pages
Detail pages
Comparison pages
Utility/form pages
Agent pages
Alert pages
```

Only after those are stable should we do the individual page specifications.

---

# And one final observation

Your product is starting to reveal a much stronger positioning than:

> **"Border crossing wait times."**

It's becoming:

> **"Cruze helps you decide how, when, and where to cross the Mexico–US border."**

The distinction is important.

Wait time is **data**.

Crossing recommendation is **intelligence**.

Traveler eligibility is **personalization**.

Alerts are **continuous intelligence**.

Trip context is **the organizing layer**.

That gives us a product architecture that can grow substantially without turning Cruze into a generic maps app.

And it reinforces the principle we've been converging on throughout the design work:

> **The user provides the trip. Cruze figures out the border.**

