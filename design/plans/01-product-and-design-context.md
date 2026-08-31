# CRUZE — PRODUCT & DESIGN CONTEXT
## Section 01 & 02: Product Definition, Persona Jobs, Decisions Audit & System Foundations
**Document ID:** `CRUZE-PLAN-01`  
**Status:** Approved Specification

---

# 01 — PRODUCT DEFINITION & USER INTENT

### 1.1 Core Mission
CRUZE is a specialized real-time cross-border intelligence product for the US-Mexico corridor (Baja California / Southern California initially, extensible to the full southern border). It eliminates border friction by providing high-conviction decision support, live operational statuses, multi-lane wait times, anomaly detection, and turn-by-turn navigation handoffs.

### 1.2 Target Personas & Primary Jobs-To-Be-Done (JTBD)

| Persona | Description | Core JTBD | Critical Need |
| :--- | :--- | :--- | :--- |
| **The Daily Cross-Border Commuter** | Works in San Diego / lives in Tijuana; holds SENTRI or Ready Lane credentials. | *"Tell me right now if San Ysidro is backed up so I can divert to Otay Mesa before leaving home."* | Sub-3-second scan, instant SENTRI vs Ready delta, push alerts on sudden queue surges. |
| **The Weekend Traveler / Shopper** | Crosses periodically for leisure, dining, or shopping; standard lane user. | *"Which border crossing will get me to my destination with the least stress and wait time?"* | Comparative total travel time (transit + border wait), lane eligibility rules, navigation handoff. |
| **The Commercial / Logistics Operator** | Drives cargo or company transport. | *"Are commercial lanes open at Otay Mesa or should I stage at Tecate?"* | Dedicated cargo hours, lane restrictions, port operational notices. |
| **The Pedestrian Crosser** | Uses CBX (Cross Border Xpress) or pedestrian port gates. | *"What is the walking queue time at San Ysidro PedWest vs PedEast?"* | Dedicated pedestrian lane status and wait time breakdown. |

### 1.3 The Core Decision Model
CRUZE replaces guesswork with a clear decision formula:
$$\text{Optimal Crossing} = \min \left( \text{Drive Time}(\text{Origin} \to \text{Port}) + \text{Live Wait Time}(\text{Port, Lane Program}) + \text{Drive Time}(\text{Port} \to \text{Destination}) \right)$$
accompanied by **operational viability filters** (active open hours, vehicle class eligibility, pass type availability).

---

# 02 — EXISTING DECISIONS AUDIT

A thorough synthesis of existing CRUZE architectural assets reveals key locked decisions:

### 2.1 Product & Functional Audit
- **Directionality:** Bidirectional support (`Mexico → United States` and `United States → Mexico`), with distinct port names, inspection workflows, and lane behaviors per direction.
- **Lane Programs:** 4 discrete programs:
  1. `Standard` (General vehicular traffic)
  2. `Ready Lane` (RFID-enabled travel documents)
  3. `SENTRI / Global Entry / NEXUS` (Trusted traveler pre-vetted lanes)
  4. `Pedestrian` (PedEast, PedWest, Otay Walkway)
- **Monetization & Privacy:** No intrusive pop-up ads; clean editorial presentation; privacy-first client location handling.

### 2.2 Navigation System Audit
- **Bottom Navigation is exactly 3 items:** `Cruces` (`/crossings`), `Favoritos` (`/favorites`), `Alertas` (`/alerts`).
- **Eliminated Tabs:** `Mapa` (now an embedded contextual component), `Más` (moved to root header account/utility menu), and `Actividad` (streamlined into `Alertas`).
- **Header Structure:** 68px standard height (compacts to 56px on deep scroll). Centered context grid (`minmax(44px, 1fr) auto minmax(44px, 1fr)`).

### 2.3 Visual & Design Token Audit
- **Canvas Atmosphere:** Deep navy palette (`background: #081830`, `surface: #0C1C34`, `surface-elevated: #14243A`).
- **Typography:** Inter with strict `font-variant-numeric: tabular-nums` across all numeric metrics.
- **Brand Authority:** Primary teal `brand: #148F79`, positive green `improving: #22924A`, caution orange `caution: #F4A01B`, congestion orange-red `congested: #F47722`, and critical red `critical: #E33332`.
- **Soft Background Semantics:** Translucent tinted fills for all status badges (`success-soft: #143E32`, `caution-soft: #44351A`, `congested-soft: #482A1A`, `critical-soft: #421D26`).
- **Anti-Slop Mandate:** Low shadow elevation, 1px structural borders (`border: #26374B`), no arbitrary floating gradients or glows, and mathematically nested corner radii ($R_{\text{inner}} = R_{\text{outer}} - P$).

---

# 03 — SYSTEM FOUNDATIONS

### 3.1 Macro Layout Boundaries
- **Container Max-Widths:**
  - Mobile: `100%` width with `20px` gutter (or `16px` on small screens `<375px`).
  - Tablet: `760px` max-width, centered.
  - Desktop: `1120px` max-width, centered.
- **Vertical Rhythm Scale:**
  - `space-xs: 8px` (micro tags, icon labels)
  - `space-sm: 12px` (header element gaps)
  - `space-md: 16px` (card content separation)
  - `space-lg: 24px` (inter-component spacing)
  - `space-xl: 32px` (sub-section gaps)
  - `space-2xl: 48px` (major section breathing)
  - `space-3xl: 64px` (macro section dividers)
  - `space-4xl: 80px` (pre-footer/pre-bottom-nav clearance)

### 3.2 Temporal Provenance & Freshness Standard
Every volatile metric must show an active temporal tag:
- `< 2 min`: `Updated just now` / `Updated 1 min ago` (`text-faint`)
- `2–15 min`: `Updated X min ago` (`text-faint`)
- `> 15 min`: `● DATA DELAYED · Last updated X min ago` (`text-caution`)
- `Stale / Offline`: `● OFFLINE · Cached data from [Time]` (`text-muted`)
