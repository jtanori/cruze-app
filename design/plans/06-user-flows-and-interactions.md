# CRUZE — USER FLOWS & INTERACTION CONTRACTS
## Section 12: Primary End-to-End User Journeys & Interaction State Machines
**Document ID:** `CRUZE-PLAN-06`  
**Status:** Approved Specification

---

# 01 — PRIMARY USER JOURNEYS

CRUZE is architected around 4 core user flows that map directly to real-world cross-border transit scenarios:

```text
FLOW 1: THE COMMUTER FAST SCAN (Sub-5 Second Decision)
P01 (Cruces Feed) ──[Scans dominant metric & rows]──> P02 (Detail) OR Direct Drive

FLOW 2: THE DESTINATION ROUTER (Comparative Decision)
P01 (Feed) ──[Tap "Find Best Crossing"]──> P03 (Recommendation with Evidence) ──[Tap "Start Route"]──> External Nav (Google/Apple Maps)

FLOW 3: THE PORT INVESTIGATOR (Deep Operational Inspection)
P01 (Feed) ──[Selects Port]──> P02 (Detail) ──[Inspects Lane Times & History]──> [Toggles Favorite ☆]

FLOW 4: THE ANOMALY TRIAGE (Alert Response)
Push Alert / P06 (Alerts Tab) ──[Taps "San Ysidro wait surged +15m"]──> P02 (San Ysidro Detail) ──[Taps "Compare"]──> P04 (Compare with Otay Mesa)
```

---

# 02 — DETAILED INTERACTION STATE CONTRACTS (TRIGGER → RESPONSE → RESULT)

### Interaction 1: Direction Switching
- **Trigger:** User taps the direction selector (`TIJUANA → SAN DIEGO ⇄`) on P01 or P05.
- **Response:** Direction flips with a 150ms cross-fade transition; feed data refreshes for the reciprocal corridor.
- **Result:** Ports, wait times, and lane rules update to reflect the reverse crossing direction (`US → Mexico`).

### Interaction 2: Recommendation Generation
- **Trigger:** User taps `[ FIND BEST CROSSING ]` on P01 or submits origin/destination inputs.
- **Response:** Recommendation engine computes total trip delta (drive time + live wait) and navigates to P03.
- **Result:** P03 displays the winning port with explicit bulleted justification and alternative deltas.

### Interaction 3: Multi-Port Comparison
- **Trigger:** User taps `[ Compare ]` on P01 or selects multiple ports.
- **Response:** P04 Comparison opens as a focused modal view; bottom navigation is hidden; attributes stack vertically.
- **Result:** User reviews side-by-side metric differences without horizontal card compression and taps `Start Route`.

### Interaction 4: External Navigation Handoff
- **Trigger:** User taps `[ START ROUTE ]` on P02, P03, or P04.
- **Response:** System opens native external navigation (Google Maps, Apple Maps, or Waze) pre-routed to the specific port approach coordinates.
- **Result:** User transitions smoothly into active vehicular GPS guidance.

### Interaction 5: Favorite Port Toggle
- **Trigger:** User taps the star icon (`☆`) in the header of P02 Crossing Detail.
- **Response:** Star fills with gold/brand highlight (`★`); local storage updates.
- **Result:** Port is added to P05 Favoritos for one-tap personalized monitoring.

### Interaction 6: Live Pull-To-Refresh
- **Trigger:** User pulls down on P01, P02, or P05.
- **Response:** Refresh indicator spins smoothly; API polls latest CBP and live telemetry feeds.
- **Result:** Wait numbers update; timestamp resets to `Updated just now`.
