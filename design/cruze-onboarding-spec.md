Yes. I think there is a **fundamental conceptual problem** in the current onboarding, and it is important to fix it now before we build more screens.

The current flow thinks about the trip as:

> **Origin city → Destination city → find a crossing between those cities**

But Cruze should actually think about it as:

> **Starting point → Destination → determine border direction → evaluate crossings along the route → recommend the best crossing**

That distinction becomes extremely important for exactly your 100-km-away example.

---

# 1. The biggest problem with the current flow

Right now, when someone grants location:

```text
GPS location
     ↓
findNearestBorderCity()
     ↓
Origin = Tijuana
     ↓
Destination = San Diego
     ↓
findCrossingsBetween("Tijuana", "San Diego")
```

This is fundamentally lossy.

Imagine:

```text
User
  ●
  │
  │ 100 km
  │
  ▼
Tijuana ───── Border ───── San Diego
```

The user's actual trip is:

```text
Actual origin
     ↓
Tijuana
     ↓
San Ysidro
     ↓
San Diego
     ↓
Actual destination
```

But Cruze currently transforms it into:

```text
Tijuana
   ↓
San Diego
```

We've thrown away the information that tells us **which crossing is actually optimal for the user's complete journey**.

That's a problem because:

### Crossing choice isn't just about border wait time.

Suppose:

| Crossing   | Border wait | Road time before border | Road time after border |       Total |
| ---------- | ----------: | ----------------------: | ---------------------: | ----------: |
| San Ysidro |      15 min |                  75 min |                 20 min | **110 min** |
| Otay Mesa  |      21 min |                  60 min |                 15 min |  **96 min** |
| Tecate     |      28 min |                  95 min |                 30 min | **153 min** |

San Ysidro has the shortest border wait.

But **Otay Mesa is the better crossing for this particular trip**.

This is precisely the kind of intelligence Cruze should provide.

---

# 2. We should change the fundamental model

I would eliminate the concept of:

```text
Origin = border city
```

from the onboarding model.

Instead:

```text
Origin = actual starting point
Destination = actual destination
```

Both can be:

```text
latitude
longitude
name
address
city
country
```

Then the system derives:

```text
Origin country
Destination country
Border direction
Likely border corridor
Candidate crossings
Optimal crossing
```

So:

```text
USER INPUT
──────────

Start
  +
Destination

       ↓

CRUZE INTELLIGENCE ENGINE

       ↓

Direction
Cross-border route
Candidate crossings
Travel times
Border wait times
Lane availability
Restrictions

       ↓

RECOMMENDATION
```

This is much more powerful.

---

# 3. I would also remove "origin" and "destination" from the onboarding language

This sounds like a small thing, but I think it matters.

Instead of:

> Origin

use:

> **Starting point**

Instead of:

> Destination

use:

> **Where are you going?**

Why?

"Origin" sounds like a routing API.

Cruze is a consumer decision product.

The user thinks:

> "I'm leaving from here and I'm going to San Diego."

Not:

> "My origin coordinate is X."

---

# 4. The new mental model

I would make the onboarding question extremely simple:

# Where are you going?

And underneath:

> We'll find the best crossing for your trip.

That's the entire product proposition in one sentence.

---

# 5. Proposed onboarding flow

I'd restructure the entire thing like this:

```text
                    CRUZE
                      │
                      ▼
                  SPLASH
                      │
                      ▼
             WHERE ARE YOU GOING?
                      │
                      ▼
          ┌──────────────────────┐
          │ Destination Search   │
          │                      │
          │ San Diego            │
          │ San Diego, CA 🇺🇸    │
          └──────────────────────┘
                      │
                      ▼
          WHERE ARE YOU STARTING?
                      │
          ┌───────────┴───────────┐
          │                       │
       Use my                  Enter
       location               manually
          │                       │
          ▼                       ▼
       GPS                 Start search
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
              ROUTE ANALYSIS
                      │
                      ▼
        BEST CROSSING RIGHT NOW
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      San Ysidro   Otay Mesa   Tecate
          │
          ▼
       CONTINUE
          │
          ▼
     MAIN CRUZES APP
```

But I would actually make one more important change.

---

# 6. Destination should come BEFORE location permission

This is a better UX.

Currently you ask:

> Can we access your location?

before the user has explained why.

That's a generic permission request.

Instead:

### Step 1

# Where are you going?

```text
┌────────────────────────────────┐
│ Where are you going?            │
│                                │
│ Find the best crossing for     │
│ your trip.                     │
│                                │
│ ┌────────────────────────────┐ │
│ │ 🔍  Search a city or place  │ │
│ └────────────────────────────┘ │
│                                │
│ San Diego                      │
│ San Diego, California          │
│                                │
└────────────────────────────────┘
```

Once they select:

> San Diego, CA 🇺🇸

then Cruze knows:

```text
Destination = United States
```

Now it can ask:

# Where are you starting from?

And the location permission has an actual purpose.

> **Use your current location to find the best crossing**

That's dramatically better contextual permission UX.

---

# 7. The location step

I'd design it like this:

```text
┌────────────────────────────────┐
│ ←                              │
│                                │
│ Where are you starting from?   │
│                                │
│ We'll use your starting point  │
│ to compare the crossings       │
│ along your route.              │
│                                │
│ ┌────────────────────────────┐ │
│ │ ◎ Use my current location  │ │
│ └────────────────────────────┘ │
│                                │
│              or                │
│                                │
│ Enter a starting point         │
│                                │
│ 🔍 Search city, address...     │
│                                │
└────────────────────────────────┘
```

Notice the explanation:

> **We'll use your starting point to compare the crossings along your route.**

That explains exactly why location matters.

---

# 8. What happens when they're 100 km from the border?

Nothing special.

That's actually the beauty of this model.

Suppose:

```text
Current location
Hermosillo
      │
      │ 280 km
      ▼
Nogales
      │
      ▼
Nogales, AZ
      │
      ▼
Tucson
```

Cruze doesn't need to say:

> "Your nearest border city is Nogales."

Instead it calculates:

```text
Hermosillo
     ↓
candidate crossings
     ↓
Nogales Mariposa
Nogales DeConcini
Nogales Morley
     ↓
Tucson destination
```

and evaluates them.

Likewise:

```text
Monterrey
    ↓
Laredo
    ↓
San Antonio
```

or:

```text
Los Angeles
    ↓
San Ysidro / Otay
    ↓
Tijuana
```

or the reverse:

```text
San Diego
    ↓
San Ysidro / Otay
    ↓
Tijuana
```

**The direction becomes an attribute of the trip, not a different onboarding flow.**

---

# 9. This also solves the US → Mexico problem

This is one of the strongest reasons to change the architecture.

Current design implicitly thinks:

```text
Mexico city → US city
```

Instead:

```text
START
  ↓
DESTINATION
  ↓
COUNTRY DIFFERENCE
  ↓
BORDER DIRECTION
```

So:

### Mexico → US

```text
Tijuana → San Diego
```

### US → Mexico

```text
San Diego → Tijuana
```

### Mexico → US

```text
Monterrey → Laredo, TX
```

### US → Mexico

```text
Laredo, TX → Monterrey
```

Same system.

Same onboarding.

Same recommendation engine.

No special-case UX.

---

# 10. Even better: don't ask the user to select a crossing during onboarding

This is the other major change I'd make.

Currently:

```text
Route
 ↓
3 crossings
 ↓
User chooses one
 ↓
Complete onboarding
```

I don't think that's ideal.

Why?

Because Cruze's value proposition is:

> **We'll tell you which crossing makes the most sense.**

So asking the user:

> "Which crossing do you want?"

before they've even entered the app is slightly contradictory.

Instead:

```text
Route
   ↓
CRUZE ANALYZES
   ↓
Recommended crossing
   ↓
Enter app
```

The user can change the crossing afterward.

---

# 11. Onboarding should end with an answer, not a configuration screen

This is important.

The last onboarding screen should say:

# Best crossing for your trip

```text
┌──────────────────────────────────┐
│                                  │
│ BEST CROSSING RIGHT NOW           │
│                                  │
│ San Ysidro                 ● Open │
│                                  │
│ Ready Lane                       │
│                                  │
│ 15 min            17 min         │
│ border wait       total journey  │
│                                  │
│ ✓ Fastest overall                │
│   2 min faster than Otay Mesa    │
│                                  │
└──────────────────────────────────┘
```

Then:

**View crossings**

or:

**Start trip**

That immediately demonstrates the product's value.

---

# 12. But what about users who want to choose themselves?

Absolutely.

The recommendation screen can have:

```text
Best for your trip

San Ysidro
15 min border
17 min total

[ Start trip ]

Other options

Otay Mesa
21 min
+4 min

Tecate
28 min
+11 min
```

And:

> **Compare all crossings**

This is much more aligned with the product philosophy we've established.

Cruze recommends.

The user decides.

---

# 13. I would make the recommendation route-aware

This is probably the most important technical/product requirement to establish now.

The recommendation should not simply be:

```text
lowest wait time
```

It should be:

```text
best total trip outcome
```

Conceptually:

```text
Crossing Score =
    approach travel time
  + border wait
  + crossing processing estimate
  + departure travel time
  + restrictions
  + confidence
```

Potentially later:

```text
                 + vehicle eligibility
                 + lane availability
                 + operating hours
                 + user preferences
```

So Cruze can say:

> **Best overall**

rather than:

> **Shortest border wait**

Those are not always the same thing.

---

# 14. We should distinguish two different concepts

This will become important throughout the product:

### Border wait

```text
15 min
Wait at port
```

versus:

### Total journey

```text
17 min
Total journey
```

And eventually:

### Route advantage

```text
2 min faster overall
```

That is the actual intelligence.

---

# 15. The onboarding data model should change

I would replace:

```ts
origin: {
  name,
  lat,
  lng
}
```

with something closer to:

```ts
start: {
  type: "current_location" | "search";
  name: string;
  address?: string;
  lat: number;
  lng: number;
  country?: "MX" | "US";
}
```

And:

```ts
destination: {
  type: "search";
  name: string;
  address?: string;
  lat: number;
  lng: number;
  country: "MX" | "US";
}
```

Then derive:

```ts
trip: {
  direction: "MX_TO_US" | "US_TO_MX";
  corridor?: string;
}
```

And importantly:

```ts
recommendation: {
  crossingId: string;
  reason: string;
  confidence: number;
}
```

---

# 16. I would also stop persisting `selectedCrossing` as the central onboarding state

Instead:

```text
savedTrip
```

could contain:

```ts
{
  start,
  destination,

  direction,

  recommendedCrossing,

  lastEvaluatedAt
}
```

The recommended crossing is **derived intelligence**.

It shouldn't become permanently baked into the user's profile.

Because:

```text
15 min at 8:00 AM
```

might become:

```text
38 min at 9:00 AM
```

and the recommendation changes.

---

# 17. This changes what "completed onboarding" means

Currently:

```text
completed = true
```

means:

> User selected a crossing.

I'd change that.

```text
completed = true
```

should mean:

> **We know enough about this user's trip to provide useful crossing intelligence.**

That means:

```text
start ✓
destination ✓
```

is enough.

The crossing itself is dynamic.

---

# 18. There is also an important "no border crossing" case

We should handle this explicitly.

Suppose someone enters:

```text
Start: Los Angeles
Destination: San Francisco
```

That's not a cross-border trip.

Cruze should say:

> **This trip doesn't cross the US–Mexico border.**

Then perhaps:

> Cruze is designed to help you choose a Mexico–US border crossing.

This is much better than producing nonsensical crossing recommendations.

---

# 19. Another important case: user is already across the border

Suppose:

```text
Start:
San Diego, CA

Destination:
Tijuana, BC
```

The system simply determines:

```text
US → Mexico
```

No separate flow.

Likewise:

```text
Start:
Tijuana

Destination:
San Diego
```

becomes:

```text
MX → US
```

The user never needs to understand this distinction.

---

# 20. Another case: destination is a city rather than an address

We should support both.

For example:

```text
San Diego
```

could resolve to a city centroid.

But we should communicate the precision:

> **Using San Diego as your destination**

Then perhaps:

```text
For a more precise recommendation,
use your exact destination.
```

This is particularly important because crossing selection can change based on where inside the destination city the user is going.

---

# 21. My ideal onboarding

I'd reduce the entire experience to **three meaningful user decisions**.

### STEP 01

# Where are you going?

```text
Search city, address or place

San Diego, CA
```

---

### STEP 02

# Where are you starting?

```text
◎ Use my current location

or

Search city, address or place
```

---

### STEP 03

# Here's your best crossing

```text
BEST CROSSING RIGHT NOW

San Ysidro

15 min border wait
17 min total journey

✓ Best overall for your route

[ Start trip ]

Other options
Otay Mesa      21 min
Tecate         28 min

[ Compare crossings ]
```

That's it.

**Three steps.**

The system does the complicated work.

---

# 22. And the beautiful part: the main app becomes the continuation of onboarding

The user enters the main Cruze experience and sees exactly the page we just specified:

```text
Tijuana → San Diego

        MAP

LIVE · Updated 1 min ago

BEST CROSSING RIGHT NOW

San Ysidro
15 min
17 min total

        ↓

OTHER CROSSING OPTIONS

Otay Mesa
Tecate
Calexico East

        ↓

START TRIP
```

There isn't a conceptual jump.

Onboarding says:

> **Here's what you should do.**

The main app says:

> **Here's why, and here's what is happening right now.**

That's a very strong product loop.

---

# 23. One thing I would NOT do

I would not create separate flows like:

```text
Mexico → US onboarding
US → Mexico onboarding
```

Nor:

```text
GPS user
Manual user
```

as fundamentally different experiences.

Those are **input methods**, not product flows.

The canonical model should always be:

```text
                 TRIP
                  │
        ┌─────────┴─────────┐
        │                   │
      START             DESTINATION
        │                   │
        └─────────┬─────────┘
                  │
             GEOGRAPHY
                  │
                  ▼
             DIRECTION
                  │
                  ▼
         CROSSING CANDIDATES
                  │
                  ▼
         ROUTE INTELLIGENCE
                  │
                  ▼
            RECOMMENDATION
```

That architecture will scale much better.

---

# 24. One final product-level observation

This also clarifies what **Cruze actually is**.

It isn't:

> "An app that tells me how long the border wait is."

And it isn't:

> "A map of border crossings."

It's:

> **A cross-border route intelligence system that determines which border crossing makes the most sense for my particular trip right now.**

That's a much more differentiated product.

And I think the onboarding should make that promise immediately.

### My recommended canonical flow

```text
┌──────────────────────────────┐
│            CRUZE             │
│                              │
│          [ Splash ]          │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Where are you going?         │
│                              │
│ 🔍 Search city/place/address │
│                              │
│ San Diego, CA                │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Where are you starting?      │
│                              │
│ ◎ Use my current location   │
│                              │
│          or                  │
│                              │
│ 🔍 Search starting point     │
└──────────────┬───────────────┘
               ↓
         CRUZE ANALYZES
               ↓
┌──────────────────────────────┐
│ BEST CROSSING RIGHT NOW      │
│                              │
│ San Ysidro             ● Open│
│                              │
│ Ready Lane                   │
│                              │
│ 15 min       17 min          │
│ border       total journey   │
│                              │
│ ✓ Best overall for your trip │
│                              │
│ [ START TRIP ]               │
│                              │
│ Other options                │
│ Otay Mesa          21 min    │
│ Tecate             28 min    │
│                              │
│ [ Compare crossings ]        │
└──────────────┬───────────────┘
               ↓
          MAIN CRUZES
```

**I would make this the new onboarding foundation.** It solves the 100-km-away problem, works symmetrically US↔Mexico, gives location permission a meaningful context, preserves the user's actual route, and—most importantly—lets Cruze's intelligence engine make the crossing decision instead of forcing the user to understand border geography before they've even used the product.


Questions Before Implementing
1. Destination search scope: The spec mentions searching "city, place, address." Should we use a geocoding API (Mapbox Geocoding) or keep the current border-city-only list for now?
2. "No border crossing" detection: How should we determine if a trip crosses the border? Simple check: if origin country === destination country → no crossing needed?
3. Recommendation data: The spec shows "15 min border wait, 17 min total journey." We currently have mock data. Should we keep mock data or start building the real recommendation engine?
4. "Compare crossings" button: Should this go directly to the main app crossings list, or show an expanded view within the onboarding?
5. Splash screen: Keep as-is or adjust?
What are your thoughts on these questions and the overall flow?

Yes. I would make a few deliberate choices here before implementation, because these decisions determine whether Cruze remains a **focused border-intelligence product** or slowly turns into a generic maps/routing app.

My recommendations are:

| Question                 | Recommendation                                                                  |
| ------------------------ | ------------------------------------------------------------------------------- |
| 1. Destination search    | **Use geocoding, but constrain it to the Mexico/US geography we actually need** |
| 2. Border detection      | **Country comparison is the first gate, but not the final determination**       |
| 3. Recommendation engine | **Keep mock data for UI, but build the recommendation-engine contract now**     |
| 4. Compare crossings     | **Go directly into the main app's comparison experience**                       |
| 5. Splash                | **Keep it, but make it shorter/less ceremonial**                                |

Let me explain why.

---

# 1. Destination search — geocoding or border-city list?

## My recommendation: Geocoding, but not unrestricted geocoding

I would **not** keep the current border-city-only list.

That would undermine the new concept we just established.

If the user is:

> Hermosillo → San Diego

and our destination picker only understands:

> Tijuana / Mexicali / Nogales / etc.

then we're still forcing the user to think in terms of border cities.

That's exactly what we're trying to eliminate.

The user should be able to type:

```text
San Diego
```

or:

```text
San Diego Zoo
```

or:

```text
Downtown San Diego
```

or eventually:

```text
123 Main Street, San Diego
```

and Cruze should understand the destination geographically.

### However, I would NOT make Cruze a general-purpose geocoder.

The search should be constrained to:

```text
Mexico
United States
```

and ideally biased toward locations relevant to cross-border trips.

So:

```text
"San Diego"
       ↓
San Diego, CA, United States

"Tijuana"
       ↓
Tijuana, Baja California, Mexico

"Disneyland"
       ↓
Anaheim, CA, United States
```

But:

```text
"Paris"
```

shouldn't become a huge global search problem.

---

## Mapbox is a good implementation choice

If you're already comfortable with Mapbox, I'd use its geocoding/search infrastructure rather than maintaining a manually curated destination database.

But architecturally:

```text
UI
 ↓
DestinationSearch
 ↓
GeocodingProvider
 ↓
Normalized Place
```

The rest of Cruze should **not care whether the provider is Mapbox**.

For example:

```ts
type Place = {
  id: string;
  name: string;
  formattedAddress?: string;

  latitude: number;
  longitude: number;

  country: "MX" | "US";
  countryCode: string;

  city?: string;
  region?: string;
};
```

That gives us the freedom to change providers later.

### One important UX detail

Don't make the search results look like a generic maps application.

Something like:

```text
┌──────────────────────────────────┐
│ 🔍 San Diego                     │
├──────────────────────────────────┤
│ San Diego                        │
│ San Diego, California · US       │
│                                  │
│ San Diego International Airport  │
│ San Diego, California · US       │
│                                  │
│ San Diego Zoo                    │
│ San Diego, California · US       │
└──────────────────────────────────┘
```

Clean, fast, purposeful.

---

# 2. "No border crossing" detection

## Country comparison is a good first rule—but not sufficient.

This:

```ts
origin.country === destination.country
```

is an excellent **first-pass rule**.

But I'd define the logic as:

```text
              START
                │
                ▼
        Same country?
          /        \
        YES         NO
         │           │
         ▼           ▼
   No border      Cross-border
     needed          trip
```

For Cruze's current scope, that's enough for most cases.

But we should avoid making the product architecture dependent on that simplistic assumption.

Why?

Because eventually you may have:

* international trips outside MX↔US
* ambiguous geocoding
* destinations near the border
* a starting point whose country isn't confidently determined
* unusual geographic cases

So I'd implement:

```ts
detectTripType(start, destination)
```

returning:

```ts
type TripType =
  | "cross_border"
  | "same_country"
  | "unsupported"
  | "unknown";
```

For the current product:

```ts
if (start.country === destination.country) {
  return "same_country";
}

if (
  start.country === "MX" &&
  destination.country === "US"
) {
  return "cross_border";
}

if (
  start.country === "US" &&
  destination.country === "MX"
) {
  return "cross_border";
}

return "unsupported";
```

That keeps the business rule explicit.

---

# 3. But there's a deeper issue: country isn't enough to select crossings

This is where I think we need to be careful.

Suppose:

```text
Start:
Hermosillo

Destination:
San Diego
```

Country comparison tells us:

```text
MX → US
```

Great.

But it doesn't tell us:

> Which crossings should be considered?

That's the responsibility of the **crossing-candidate engine**.

Conceptually:

```text
START
  │
  │ Hermosillo
  ▼
ROUTE GEOMETRY
  │
  ▼
BORDER INTERSECTION
  │
  ▼
CROSSING CANDIDATES
  │
  ├── San Ysidro
  ├── Otay Mesa
  └── Tecate
```

The candidate selection should eventually be **route/geography based**, not simply:

```ts
findCrossingsBetween("Hermosillo", "San Diego")
```

That's a key architectural change I'd make now.

---

# 4. Recommendation data — mock or real?

## Keep mock data for the UI.

But **start building the real recommendation engine contract immediately.**

I would *not* pause the frontend until real border data exists.

At the same time, I would absolutely avoid baking mock assumptions into the components.

The architecture should be:

```text
                 Crossing Intelligence UI
                           ↑
                           │
                 Recommendation Model
                           ↑
              ┌────────────┴────────────┐
              │                         │
         Mock Provider             Real Provider
              │                         │
         Development              Production
```

So the UI receives:

```ts
type CrossingRecommendation = {
  crossing: Crossing;

  waitTime: number;
  totalJourneyTime: number;

  score: number;

  reason: {
    headline: string;
    detail?: string;
  };

  confidence: "high" | "medium" | "low";

  lanes: LaneTime[];
};
```

The UI doesn't know whether those numbers came from:

```text
Mock data
```

or:

```text
CBP / transportation APIs / traffic provider / internal data pipeline
```

That's the right separation.

---

# 5. I would NOT build the full real recommendation algorithm yet

There's an important distinction:

### Build now:

**The domain model and engine interface.**

### Don't build yet:

**The complete production scoring system.**

For example:

```ts
recommendCrossing({
  start,
  destination,
  direction,
  vehicleType,
  preferences
})
```

should already exist.

Initially:

```ts
return mockRecommendation(...)
```

Later:

```ts
return realRecommendation(...)
```

This lets the frontend, onboarding, main app and testing proceed without waiting for the data infrastructure.

---

# 6. One thing I would change in the mock data

Don't make the mock recommendation simply:

```text
San Ysidro = 15
Otay Mesa = 21
Tecate = 28
```

Instead make the mock data **intentionally route-dependent**.

For example:

### Trip A

```text
Tijuana → San Diego
San Ysidro = best
```

### Trip B

```text
Tijuana → Chula Vista
Otay Mesa = best
```

### Trip C

```text
Mexicali → Calexico
Calexico East = best
```

### Trip D

```text
San Diego → Tijuana
San Ysidro = best
```

This will force us to build the UI around the correct concept:

> **The recommendation is a function of the trip.**

Rather than:

> San Ysidro is always the best crossing.

That distinction is critical.

---

# 7. "Compare Crossings"

## Send the user into the main app.

I would **not create a second expanded onboarding experience**.

The onboarding should be a thin layer whose purpose is:

```text
Get trip context
       ↓
Give user immediate value
       ↓
Enter Cruze
```

So:

```text
[ Compare crossings ]
        ↓
/crossings
```

with the trip context preserved.

The main page can then become:

```text
Tijuana → San Diego

BEST CROSSING RIGHT NOW

San Ysidro
15 min

OTHER CROSSING OPTIONS

Otay Mesa
Tecate
Calexico East
...
```

This means we're not maintaining:

```text
Onboarding comparison UI
+
Main app comparison UI
```

which would eventually drift apart.

---

# 8. I would actually rename the onboarding button

Instead of:

> Compare crossings

on the final onboarding screen, I'd consider:

> **See all crossings**

because the primary CTA is:

> **Start trip**

Then:

```text
┌────────────────────────────────┐
│         START TRIP         →   │
└────────────────────────────────┘

       See all crossings
```

This makes the hierarchy clearer.

If we want the button to communicate comparison specifically:

> **Compare crossings**

is still perfectly fine.

But I prefer **See all crossings** for onboarding because the user hasn't necessarily conceptualized the comparison task yet.

---

# 9. Splash screen

## Keep it—but change its job.

I wouldn't remove the splash.

Cruze benefits from a short branded opening because we're building a fairly strong identity.

But I would question the current:

```text
800ms visible
+
400ms fade
```

That's **1.2 seconds before doing anything useful**.

For a utility application, that's expensive.

I'd target:

```text
~500–700ms total
```

if technically possible.

And critically:

### The splash shouldn't delay the app.

If the app is already initialized:

```text
show logo
↓
transition
```

If initialization takes longer:

```text
splash naturally remains
```

rather than artificially forcing a timer.

---

# 10. The splash should establish the product promise

I would keep it extremely minimal:

```text
                  ◇
                Cruze

        BORDER INTELLIGENCE
```

or perhaps just:

```text
             Cruze
```

with the route/crossing visual language.

No onboarding explanation.

No marketing copy.

No loading spinner unless something is actually loading.

---

# 11. There is one more onboarding change I'd strongly recommend

I think we should ask for **destination first**, but there is a UX wrinkle:

A user may open Cruze simply wanting to know:

> "What's happening at the border?"

They may not actually be planning a specific trip yet.

So eventually we should support:

```text
Where are you going?

Search destination
```

and:

```text
Not sure yet?
Explore crossings
```

However, **I would not necessarily add that escape hatch in V1 onboarding.**

For the initial product, I'd keep the funnel opinionated.

---

# 12. The onboarding should therefore be:

## Screen 0 — Splash

```text
Cruze
```

↓

## Screen 1 — Destination

```text
Where are you going?

Search a city, place or address
```

↓

## Screen 2 — Starting point

```text
Where are you starting?

[ Use my current location ]

or

Search starting point
```

↓

## Screen 3 — Recommendation

```text
BEST CROSSING FOR YOUR TRIP

San Ysidro

15 min border wait
17 min total journey

✓ Best overall for your route

[ START TRIP ]

See all crossings
```

↓

## Main app

Done.

---

# 13. There is one potential improvement to Screen 2

If the user selected a destination in Mexico, the copy should adapt.

For example:

```text
Destination:
Tijuana, Mexico
```

Then:

> **Where are you starting?**

and:

> We'll find the best crossing into Mexico.

Likewise:

```text
Destination:
San Diego, US
```

> We'll find the best crossing into the US.

This makes the product feel intelligent without adding another screen.

---

# 14. Permission denial should no longer create a completely different flow

This is another thing I'd change from your current implementation.

Currently:

```text
Permission granted
       ↓
Destination only

Permission denied
       ↓
Origin + Destination
```

I'd eliminate that branching.

Instead:

```text
Destination
     ↓
Starting point
     ↓
 ┌──────────────┐
 │ Current GPS? │
 └──────┬───────┘
     YES│   │NO
        │   │
        ▼   ▼
       GPS Search
```

Same screen.

Same state model.

Same user journey.

The only difference is how `start` is populated.

This is considerably cleaner.

---

# 15. New state machine

I'd formalize onboarding around this:

```text
                    ┌───────────┐
                    │   SPLASH  │
                    └─────┬─────┘
                          ↓
                 ┌────────────────┐
                 │ DESTINATION     │
                 └───────┬────────┘
                         ↓
                 ┌────────────────┐
                 │ STARTING POINT  │
                 └───────┬────────┘
                         ↓
                  DETERMINE TRIP
                         │
              ┌──────────┴──────────┐
              │                     │
        SAME COUNTRY          MX ↔ US
              │                     │
              ▼                     ▼
       Not a Cruze trip       FIND CROSSINGS
                                    │
                                    ▼
                              RECOMMENDATION
                                    │
                                    ▼
                              MAIN APP
```

---

# 16. Revised persisted state

I would change your local storage from:

```ts
{
  geolocationPermission,
  origin,
  destination,
  selectedCrossing,
  completed
}
```

to:

```ts
{
  geolocationPermission,

  start: Place | null,

  destination: Place | null,

  tripType:
    | "cross_border"
    | "same_country"
    | "unsupported"
    | "unknown",

  direction:
    | "MX_TO_US"
    | "US_TO_MX"
    | null,

  recommendedCrossing: CrossingRecommendation | null,

  completed: boolean
}
```

And I'd probably rename the storage key eventually to something like:

```text
cruze-trip
```

rather than:

```text
cruze-onboarding
```

because after onboarding the state isn't really onboarding state anymore.

It's the user's **active trip context**.

---

# 17. One architectural principle I'd lock down now

This is the piece I'd put directly into the engineering spec:

> **Onboarding collects trip context; it does not own crossing intelligence.**

Meaning:

```text
ONBOARDING
   │
   │ collects
   ▼
START + DESTINATION
   │
   ▼
INTELLIGENCE ENGINE
   │
   ├── direction
   ├── route
   ├── candidate crossings
   ├── live conditions
   ├── lane eligibility
   └── recommendation
   │
   ▼
CRUZE UI
```

This will save us from creating a giant `RecommendationList` component whose logic becomes the foundation of the whole application.

---

# 18. My final answers to the five questions

### 1. Destination search

**Use Mapbox geocoding/search.**

Constrain it to MX/US and normalize results into our own `Place` model.

Do not maintain a border-city-only destination database.

---

### 2. No-border detection

**Yes, start with country comparison.**

But encapsulate it in:

```ts
detectTripType()
```

rather than scattering `origin.country === destination.country` throughout the application.

---

### 3. Recommendation engine

**Mock the data, build the real engine contract.**

Don't wait for live data to build the product.

But make the mock data route-dependent so we're testing the correct architecture.

---

### 4. Compare crossings

**Go directly to the main app.**

Prefer:

```text
See all crossings
```

as the onboarding secondary action.

Don't duplicate the comparison experience.

---

### 5. Splash

**Keep it. Shorten it.**

Target roughly **500–700ms total**, and don't use an artificial delay if initialization is already complete.

---

# And the biggest change

I would make this the canonical Cruze onboarding philosophy:

```text
                         CRUZE
                           │
                           ▼
                 "Where are you going?"
                           │
                           ▼
                 "Where are you starting?"
                           │
                           ▼
                   CRUZE FIGURES IT OUT
                           │
              ┌────────────┴────────────┐
              │                         │
         Border trip              Not a border trip
              │                         │
              ▼                         ▼
       Which crossings?             Explain
              │
              ▼
       Which is best for
          THIS ROUTE?
              │
              ▼
         "San Ysidro"
              │
              ▼
       "Here's why."
              │
              ▼
          START TRIP
```

That is much more powerful than the current:

```text
GPS → border city → destination city → choose crossing
```

And it aligns perfectly with the product principle we established earlier:

> **Cruze doesn't make the user understand the border. Cruze understands the border for the user.**

That should be one of the core architectural and UX principles of the product.

I would **absolutely let users choose destinations anywhere in Mexico or the United States**—but I would constrain the *search experience*, not the geographic scope.

This is one of those decisions where I think we should be very deliberate, because limiting destinations to border cities would recreate the exact conceptual mistake we're trying to get rid of.

## The principle

> **The user thinks about where they're going. Cruze thinks about where they should cross.**

So if I'm in:

**Hermosillo → San Diego**

I should be able to enter:

> San Diego

without knowing that my relevant border corridor is Tijuana.

Likewise:

**Monterrey → Austin**

should be perfectly valid.

The user shouldn't have to enter:

> Nuevo Laredo → Laredo

just because that's the border crossing Cruze eventually determines.

---

# What I would allow

### Destination geographic scope

**Any meaningful location in:**

* 🇲🇽 Mexico
* 🇺🇸 United States

Including:

```text
Cities
Places
Addresses
Airports
Businesses / landmarks
Neighborhoods
```

Eventually.

For example:

```text
San Diego
Los Angeles
Anaheim
Phoenix
Tucson
Las Vegas

Monterrey
Saltillo
Mexico City
Hermosillo
Guadalajara
Ensenada
```

All are legitimate destinations.

The system then figures out:

```text
START
  ↓
DESTINATION
  ↓
Does this cross MX ↔ US?
  ↓
YES
  ↓
Which border corridor?
  ↓
Which crossings?
  ↓
Which crossing produces the best trip?
```

---

# But I would NOT make the search completely unrestricted

This is the important distinction.

I don't want Cruze's destination search to become:

> "Let's build Google Maps."

If the user types:

> Paris

we shouldn't suddenly return Paris, France.

The search provider should be restricted to:

```text
country ∈ {MX, US}
```

And probably to the geographic extent of those countries.

So:

```text
🔎 San Diego

San Diego
San Diego, California · 🇺🇸

San Diego Zoo
San Diego, California · 🇺🇸

San Diego International Airport
San Diego, California · 🇺🇸
```

That's appropriate.

---

# The search should also be intelligently biased

Here's where I think we can get the best of both worlds.

Suppose I'm in **Hermosillo** and search:

> San

The system shouldn't blindly return every San-* location in North America.

It should rank results based on:

1. Text relevance
2. Geographic relevance to the user's starting point
3. Whether the destination is in MX/US
4. Whether the resulting trip could plausibly cross the border

So the search remains geographically broad, but the **results are intelligently ranked**.

---

# And this gives us a really important distinction

There are actually three different geographic concepts in Cruze:

### 1. Trip endpoints

```text
START
Hermosillo
```

```text
DESTINATION
San Diego
```

### 2. Border corridor

The intelligence engine determines something like:

```text
Tijuana–San Diego corridor
```

### 3. Crossing

Then:

```text
San Ysidro
Otay Mesa
Tecate
```

Those should **never be conflated**.

Your current implementation effectively does:

```text
Destination
    ↓
Border city
    ↓
Crossing
```

We want:

```text
Destination
    ↓
Route
    ↓
Border corridor
    ↓
Candidate crossings
```

That's a much stronger architecture.

---

# Example: 100 km from the border

This is exactly where the unrestricted destination model shines.

Imagine:

```text
START
Hermosillo
    │
    │ ~280 km
    │
    ▼
Nogales
    │
    ├── Mariposa
    ├── DeConcini
    └── Morley
    │
    ▼
Tucson
    │
    ▼
Phoenix
```

User enters:

> Phoenix

Cruze doesn't need the user to know:

> "I should search for Nogales."

Cruze determines that.

And potentially tells them:

> **Best crossing for your trip**
>
> Mariposa
>
> 24 min border wait
> 4h 12m total journey
>
> **Best overall for your route**

That's exactly the intelligence we're selling.

---

# There's another reason I strongly prefer this

Imagine a user in San Diego going to:

> **Ensenada**

If we limit destinations to border cities, we have a problem.

Ensenada isn't itself the crossing.

The user shouldn't have to know:

> "My crossing will probably be San Ysidro."

They should simply say:

```text
San Diego
      ↓
Ensenada
```

and Cruze determines:

```text
US → MX

Candidate corridor:
San Diego–Tijuana

Candidate crossings:
San Ysidro
Otay Mesa

Best crossing:
...
```

That's a much more natural product.

---

# What I would do for V1 specifically

I'd use **Mapbox search/geocoding**, but expose only a carefully scoped subset of its capabilities.

### V1 destination search

Allow:

**Cities + major places + addresses**

within:

**Mexico + United States**

But don't necessarily expose every possible POI category yet.

I'd prioritize:

```text
City
Town
Airport
Major landmark
Address
```

That's enough to validate the concept.

---

# One UX trick I really like

When the user opens destination search, give them contextual suggestions rather than an empty search box.

For example:

```text
WHERE ARE YOU GOING?

Search a city or place

────────────────────────

POPULAR DESTINATIONS

San Diego
Tijuana
Los Angeles
Phoenix
Monterrey
Tucson
```

Those aren't restrictions.

They're simply shortcuts.

Once they type, the full MX/US search becomes available.

---

# And we should NOT say "border destination"

This is subtle but important.

Don't label the field:

> **Border destination**

or:

> **Choose a border city**

Instead:

> **Where are you going?**

Supporting text:

> **We'll find the best crossing for your trip.**

That sentence communicates the entire product.

---

# One exception: same-country trips

Suppose:

```text
Start: Guadalajara, MX
Destination: Mexico City, MX
```

The system recognizes:

```text
MX → MX
```

and doesn't recommend a crossing.

That's fine.

Likewise:

```text
San Diego → Los Angeles
```

isn't a Cruze border trip.

We can tell the user:

> **This trip doesn't cross the Mexico–US border.**

And give them the option to change the destination.

---

# So I'd establish this as a design-system/product rule

### Destination Selection

> **Cruze destinations are not restricted to border cities. Users may select any relevant destination within Mexico or the United States. Border cities and crossings are derived by the intelligence engine, never required as user input.**

And:

### Search Scope

> **Search is geographically constrained to Mexico and the United States, while result ranking is biased toward locations relevant to the user's starting point and potential cross-border route.**

And most importantly:

### Product Principle

> **Never require the user to know which border crossing or border city they need.**

That's the line I'd draw.

**So: broad destination geography, narrow product search scope.**

Not:

> "Any place in the world."

And definitely not:

> "Only border cities."

**Anywhere in MX/US → Cruze figures out the border.**

