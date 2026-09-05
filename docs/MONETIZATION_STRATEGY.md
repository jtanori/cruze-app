# CRUCE — Monetization Strategy
> **Companion:** Implementation source of truth: `design/components/README.md` (84) + `design/workflows/W*.md` + `design/INTEGRATION_PLAN.md` Addendum. Testing: `docs/TESTING_TOOLS.md` → `design/TESTING_INTEGRATION_PLAN.md`. This doc is **strategy/brief only** — not an implementation spec.


**Positioning:** Border intelligence and decision system (not a wait-time dashboard). Monetize outcomes: faster total trips, fewer bad departures, local trip-services when intent fits — without selling the ranking.

**Last aligned:** Ad-first free tier · intent-aware Assistant · trip “break” · data contribution · Pro. (Product discussion lock — implementation of UI deferred.)

---

## 1. Principles (non-negotiable)

1. **Decision integrity** — Ads, partners, and promotions never change gate ranking, confidence, forecast, or reasoning. Provenance stays visible.
2. **Clarity** — Users always understand: what is an ad, what is a curated partner, what data is shared, and how to stop.
3. **Intent over interruption** — Commercial surfaces appear when the user is looking for help (Assistant), not as noise on every screen.
4. **Dignity on the free tier** — Mild default ads; easy trip-scoped break; optional contribution for ad-light; Pro for zero ads without data trade.
5. **Day-0 instrumentation** — Policy, consent, and event shapes exist in the product foundation even before rich UI ships.

---

## 2. Free-tier philosophy (ad-first)

| Layer | Role |
|-------|------|
| **Decide / Compare / engine** | Core product stays free and complete (CBP + Caltrans + ranking). No paywall on decision quality. |
| **Subtle ads** | Secondary surfaces and, when appropriate, Assistant — never inside the decision card’s reasoning/evidence. |
| **Assistant** | Primary **guidance** surface (checklists, rules, “do I need insurance?”) with **curated commercial options** only when intent fits. |
| **Break** | Trip-scoped ad suppression until cross (or timeout). |
| **Contribute** | Optional data share → ad-light while active; improves forecasts / first-party signal. |
| **Pro** | Paid: no ads, no data requirement, power tools (alerts, optimizer, history). |

Default should feel usable **without** paying or sharing data. Break and contribute are privileges, not hostages.

---

## 3. Assistant: guidance first, commerce second

### Purpose
- Answer serious, practical questions: insurance needs, pre-cross checklist (California), documents, safety, “what do I do if…”.
- Offer **curated partner solutions** when the user is shopping for a concrete service (insurance quote, tires, FX, parking, clinic).

### Ad / partner rules (locked direction)

| Rule | Detail |
|------|--------|
| Intent-driven | Commerce only when user intent is commercial or clearly service-seeking. |
| Sensitive = clean | Topics like emergency help, crime, medical crisis, immigration distress, “help in Mexico” in a vulnerable sense → **no ads, no partner upsell**. |
| No spam cadence | Not one ad after every reply. Balance “ad pollution”: prefer at most one commercial block per meaningful turn when intent allows; often zero. |
| Partners ≠ ranking | Partner cards are services for the trip, not “recommended gate because sponsor.” |
| Labeling | Clear `Partner` / sponsored labeling when a commercial unit is shown. |

**Intent bands (product logic):**

- `guidance_only` — checklist, legal/process explainers, safety → no commerce  
- `service_seek` — insurance, mechanic, FX, parking, clinic appointment → curated partners OK  
- `mixed` — e.g. “checklist + where to buy insurance” → guidance first, one partner block after  
- `crisis` — emergency / harm / exploitation signals → no commerce; point to official/help resources only  

Assistant quality is measured first on **answer usefulness**, second on partner CTR.

---

## 4. “Give me a break” (trip-scoped ad suppression)

- **What:** User opts in → hide **display/interruptive ads** until we believe they’ve crossed (north or south) or a max window elapses.  
- **Assistant:** Partners may still appear **only under intent rules** (guidance-first). Break is not a blank check to spam services; it mainly removes non-intent ads.  
- **Detection (planned):** Prefer confirm “I’ve crossed” + optional coarse geofence/heuristic; always a **timeout** (e.g. few hours) so abandoners don’t stay ad-free forever.  
- **Commuters:** Soft caps (e.g. N breaks per week on free tier) so daily crossers don’t zero out all inventory; Pro remains the unlimited calm path.  
- **Clarity:** One-sentence rule in product copy: how long, what comes back, how to end early.

---

## 5. “Share your data” → ad-light (contribution)

### Bargain (must be explicit)
- **User gives:** specific, purpose-limited trip/queue signals that improve CRUCE decisions for everyone.  
- **User gets:** ad-light while contribution remains active (revocable anytime → ads resume).  
- **CRUCE does not:** require data to use Decide; resell personal trails as a silent second business without disclosure.

### Minimum useful data (preferred bargain)
Start with **outcome-oriented**, low-creep signals:

| Signal | Why |
|--------|-----|
| Declared mode / program used | Calibrates ranking vs reality |
| Approximate join-line / at-booth times (user-reported) | Queue samples; Mexican-side / gap-fill |
| Which crossing they used | Outcome vs recommendation |
| Optional: coarse “I’ve crossed” / POE geofence | Break + sample validation |

Precise continuous GPS is **not** required for the default bargain. Location-assisted features stay separate toggles.

### Clarity requirements
- Granular toggles (not one omnibus “share everything”).  
- Purpose: improve wait estimates, forecasts, recommendations.  
- What is *not* included (e.g. selling personal data to third parties — state the real policy).  
- Revocation and retention in plain language (ES + EN).

Contribution also seeds the long-term **own southbound / first-party** path described in `OWN_API_GAP_BRIEF.md`.

---

## 6. Pro (paid)

- No ads; no obligation to contribute data.  
- Power features: smart alerts, departure optimizer, longer history, export, multi-leg, etc.  
- Price band (directional): ~$4–8/mo or annual equivalent; MXN-native pricing later.

Pro must not be the only way to get an honest decision — only the way to get **calm + tools**.

---

## 7. Revenue stack (priority)

1. **Partner leads / placement in Assistant** when intent is `service_seek` (CPA or monthly placement per corridor/category).  
2. **Subtle native ads** on non-decision surfaces (Activity, Map chrome) — secondary.  
3. **Pro subscriptions.**  
4. **B2B API / logistics** (normalized waits + decision API) as scale allows.  
5. **Never:** pay-to-rank a gate; crisis-context ads; undisclosed native that looks like evidence.

---

## 8. Sequencing

| Phase | Focus |
|-------|--------|
| **Day 0** | Policy types, consent event shapes, intent bands, feature flags — no need for full ad UI yet |
| **P0** | Reliable Decide + live data; instrument decision→navigate |
| **P1** | Assistant guidance + curated partners (intent filters); subtle ads elsewhere |
| **P2** | Break + contribute flows; soft caps; clear copy |
| **P3** | Pro; expand partner categories; B2B pilots |

---

## 9. Metrics

- Decision quality: predicted vs user-reported outcome; regret  
- Trust: % sessions with crisis/guidance intents that showed **zero** commerce  
- Assistant: helpfulness rating; partner CTR **only** on `service_seek` turns  
- Break: opt-in rate; abuse rate; post-break ad recovery  
- Contribute: active sharers; sample quality vs CBP; ad-light retention  
- Revenue: partner CPA, Pro MRR, ad RPM on non-decision inventory  

---

## 10. Day-0 product foundation

Even before UI, the codebase should encode:

- Monetization **policy config** (what break suppresses, intent bands, caps)  
- **Consent** records for contribution toggles  
- **Analytics event** names for ad impression, partner impression, break start/end, contribute opt-in/out, assistant intent classification  
- Hard rule: decision engine inputs ignore commercial signals  

See `src/domain/monetization-policy.ts` for the initial policy module.

---

## 11. Open implementation notes (later)

- Intent classifier: start rule/keyword + category chips; evolve with models.  
- Partner taxonomy: insurance, checklist-related services, tires, FX, parking, clinic — corridor-tagged.  
- ES-first copy for Assistant and consent.  
- Legal review before contribution or insurance partner claims go live.

---

*This document is the locked product direction from strategy discussion. Numbers remain directional. UI not implied until explicitly scheduled.*
