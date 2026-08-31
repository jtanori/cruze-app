# CRUZE DESIGN SYSTEM

### Border Crossing Intelligence
**Design System v1.0 — Dark Theme**

---

# 00 — PRODUCT DEFINITION

## What Cruze is

> **Cruze provides real-time border-crossing gate intelligence so people can make better decisions for their lives and businesses.**

Cruze transforms fragmented border information into a clear decision.

```text
RAW BORDER DATA
      ↓
PROCESSING
      ↓
INTELLIGENCE
      ↓
COMPARISON
      ↓
RECOMMENDATION
      ↓
DECISION
```

The product is therefore fundamentally about:

* border gates
* wait times
* lane types
* operating status
* restrictions
* traffic
* crossing direction
* historical patterns
* live changes
* route implications
* business implications
* personal travel implications
* confidence
* data provenance

It is **not primarily about maps**.  
It is **not primarily about navigation**.  
It is **not primarily about trip planning**.  

The map is a visualization of the intelligence.

---

# 01 — THE CRUZE DESIGN PRINCIPLE

## The product promise

Every major interface decision should answer:

> **Does this help the user make a better border-crossing decision?**

If not, it is probably secondary.

---

# 02 — DESIGN PRINCIPLES

## P01 — Intelligence over decoration

Data has visual priority.

Not:
```text
beautiful map → pretty card → interesting data
```
But:
```text
important data → clear interpretation → supporting visualization
```

---

## P02 — Decision before exploration

Cruze should reduce cognitive work. The interface should answer:
- **WHERE?**
- **WHEN?**
- **HOW LONG?**
- **WHICH LANE?**
- **WHY?**
- **WHAT ARE MY ALTERNATIVES?**

without requiring the user to become a border expert.

---

## P03 — Show the evidence behind the recommendation

Never make the system feel like a black box. Instead of generic phrases ("Best crossing"), state concrete evidence:
- *"Fastest overall right now"*
- *"4 min faster than Otay Mesa"*
- *"Ready Lane currently moving 8 min faster than Standard"*

The user should understand **why** Cruze thinks something is better.

---

## P04 — Time is a first-class data type

Time is not ordinary content. Values like `4 min`, `15 min`, `21 min`, `28 min`, `45 min` deserve exceptional visual treatment, tabular numeric alignment (`font-variant-numeric: tabular-nums`), and high optical contrast.

---

## P05 — Freshness is part of the data

A wait time without a timestamp is incomplete:
- *Bad:* `15 min`
- *Good:* `15 min · Updated 1 min ago`
- *Better:* `15 min · LIVE · Updated 1 min ago`

---

## P06 — Vertical space is a feature

Cruze is intentionally scrollable. Do not compress information into an arbitrary phone viewport.
```text
CHAPTER 01 · Context
CHAPTER 02 · Live conditions
CHAPTER 03 · Recommendation
CHAPTER 04 · Evidence
CHAPTER 05 · Alternatives
CHAPTER 06 · Operational details
CHAPTER 07 · Intelligence & Data Provenance
```
The user should feel that the product has **room to think**.

---

## P07 — Density should be intentional

> **Information density ≠ visual density.**

A page can present 30 structured pieces of information while maintaining generous whitespace and clear scanning lanes.

---

## P08 — Calm authority

The visual personality is:
**confident · precise · calm · operational · trustworthy**

Not:
**futuristic · flashy · gamified · cyberpunk · AI-generated**

---

# 03 — BRAND CHARACTER & WHAT TO AVOID

### Avoid
* Excessive gradients or glassmorphism
* Glowing cards or neon maps
* Giant decorative illustrations
* Excessive pills or extreme rounded corners
* Ornamental animations
* Artificial "AI" buzzwords (*"AI-powered"*, *"Smart AI"*, *"Magic"*)
* Dashboard clutter

---

# 04 — VISUAL LANGUAGE

**Dark editorial operational interface.** The intersection of:
- Editorial design
- Transportation intelligence
- Financial-information precision
- Modern mobile utility

---

# 05 — COLOR SYSTEM

```css
@theme {
  --color-cruze-bg: #07121F;

  --color-cruze-surface: #0B1A2A;
  --color-cruze-surface-raised: #102236;
  --color-cruze-surface-subtle: #0D1D2D;

  --color-cruze-border: #26394C;
  --color-cruze-border-subtle: #1A2C3E;

  --color-cruze-text-primary: #F4F6F8;
  --color-cruze-text-secondary: #A8B4C1;
  --color-cruze-text-tertiary: #748292;
  --color-cruze-text-disabled: #4E5C6B;

  --color-cruze-green: #43D69A;
  --color-cruze-green-bright: #55E6AA;
  --color-cruze-green-dark: #20B77B;
  --color-cruze-green-muted: #174C3A;

  --color-cruze-info: #5CA8FF;
  --color-cruze-warning: #F3B84B;
  --color-cruze-danger: #F06464;
}
```

---

# 06 — COLOR SEMANTICS & GREEN USAGE

| Color | Meaning |
| :--- | :--- |
| **Cruze Green** | Positive / Recommended / Active / Open / Selected Lane |
| **Blue (Info)** | Informational / Metadata / System state |
| **Amber (Warning)** | Caution / Changing / Moderate concern / Operational constraint |
| **Red (Danger)** | Closed / Severe delays / Unavailable |
| **White / Light** | Primary text / Key numeric values |
| **Slate / Muted** | Secondary labels / Structural framing |

**Rule:** Never use color as the sole indicator of state (always accompany with clear text like `● OPEN`).  
**Rule:** Cruze Green is reserved for recommendation, active navigation, live indicator, and positive deltas—never as a global background.

---

# 07 — TYPOGRAPHY & DATA SCALES

Primary Typeface: **Inter Variable** (with fallback system sans-serif).

### Text Scale
- **DISPLAY:** 32 / 38 / 700
- **H1:** 28 / 34 / 700
- **H2:** 22 / 28 / 700
- **H3:** 18 / 24 / 650
- **BODY LARGE:** 17 / 25 / 400
- **BODY:** 15 / 22 / 400
- **BODY STRONG:** 15 / 22 / 600
- **SMALL:** 13 / 18 / 500
- **MICRO:** 11 / 15 / 500

### Numeric Scale (`tabular-nums` mandatory)
- **METRIC XL:** 32 / 36 / 650
- **METRIC LG:** 28 / 32 / 650
- **METRIC:** 24 / 28 / 650
- **METRIC SM:** 18 / 22 / 650

---

# 08 — SPACING & LAYOUT

- Foundational 4px grid (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `28px`, `32px`, `40px`, `48px`, `56px`, `64px`, `80px`, `96px`).
- Page container max width: `720px` centered.
- Radii: Cards `16px`, Buttons `10–12px`, Status pills `999px`.
- Elevation: Level 0 (bg), Level 1 (`0 8px 30px rgba(0,0,0,.18)`), Level 2 (`0 16px 40px rgba(0,0,0,.24)`).

---

# 09 — CORE DATA DOMAIN MODEL

```ts
type BorderDirection = "MX_TO_US" | "US_TO_MX";

type CrossingStatus = "OPEN" | "LIMITED" | "CLOSED" | "UNKNOWN";

type LaneType = "STANDARD" | "READY" | "SENTRI" | "PEDESTRIAN" | "COMMERCIAL" | "MEDICAL";

type Lane = {
  type: LaneType;
  waitTime: number | null;
  status: CrossingStatus;
};

type Recommendation = {
  score: number;
  reason: string;
  deltaMinutes: number;
  comparedTo?: string;
  confidence?: "HIGH" | "MEDIUM" | "LOW";
};

type Crossing = {
  id: string;
  name: string;
  portOfEntry: string;
  direction: BorderDirection;
  status: CrossingStatus;
  lanes: Lane[];
  waitTime: number | null;
  totalJourneyTime: number | null;
  updatedAt: Date;
  operatingHours: string;
  restrictions: string[];
  location: { lat: number; lng: number };
  recommendation?: Recommendation;
};
```

---

# 10 — SUMMARY IN ONE SENTENCE

> **Cruze turns live border-gate conditions into clear, trustworthy decisions—using generous space, precise data hierarchy, restrained visual design, and transparent reasoning.**
