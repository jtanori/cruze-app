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

