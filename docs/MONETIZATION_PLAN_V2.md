# CRUCE — Monetization Plan v2 (updated 2026-09-13)

> Companion strategy brief: `docs/MONETIZATION_STRATEGY.md` (product direction, locked).
> This doc is the **implementation plan**: alignment fixes + 2026 state-of-the-art updates.
> Status: **proposed — awaiting review. Do not implement until approved.**

## 1. Alignment review (strategy ↔ code ↔ 2026 market)

### What stays
- Intent-driven commerce, decision integrity (no pay-to-rank), dignity on free tier.
- Freemium ad-first with Decide always free — defensible despite hard paywalls converting
  5x better (10.7% vs 2.1% D35, RevenueCat SOSA 2026): border crossing is word-of-mouth
  driven and "honest decision free" is the brand. No hard paywall on Decide.
- Partner-first revenue order (leads → native ads → Pro → B2B).
- No precise GPS in the default contribution bargain.

### Code misalignments to fix
1. **Intent taxonomy mismatch** — strategy: `guidance_only/service_seek/mixed/crisis`;
   code (`types/monetization.ts`): `navigation/information/comparison/transaction/crisis`;
   agent classifier: neither (no commercial/crisis detection). The crisis-clean rule is unenforceable.
2. **Contribution bug** — `addContributionSignal` never appends to `signals[]`;
   `minSamplesForAdLight` unreachable; ad-light can never activate.
3. **Break is dead code** — no UI, `tripCompleted` end-condition not wired to `complete()`, no commuter caps.
4. **Pro is a stub** — no purchase flow, no expiry, no `hasProFeature` gating anywhere.
5. **Consent** — version hardcoded `"1.0"`, no consent UI.
6. **Wrong path** — strategy cites `src/domain/monetization-policy.ts`; actual: `src/lib/monetization-policy.ts`.

### 2026 market deltas (RevenueCat SOSA 2026, 115k apps / $16B revenue)
- **Android billing failures cause 31% of Play cancellations** (28% in 2025). User base is
  Android-heavy MX crossers → dunning + grace periods are the highest-ROI billing work.
  → **RevenueCat** as billing abstraction (dunning, grace, experiments, paywalls).
- **Trial length**: 17–32d trials convert ~70% better (42.5% vs 25.5%). Strategy has no trial
  design → **14-day Pro trial** matched to weekly crossing habit.
- **LatAm geo framing**: anchoring yearly to monthly equivalent lifted trial starts 30%.
  Strategy says "MXN later" → **MXN pricing day-1**.
- **Annual-default + monthly anchor** (~50% discount framing); yearly RPI ~2x monthly.
- **No Play trial-end reminder** (iOS has one) → own reminder required; reuse P4 notification infra.
- **AI cost caution**: agent is rule-based (cheap) today; gate any future LLM features behind Pro.

## 2. Phased implementation plan

| Phase | Scope | Entrance criteria |
|-------|-------|-------------------|
| **M0 — Align & fix** (no UI) | Unify intent taxonomy to strategy's 4 bands; add crisis/commercial detection to classifier; fix `addContributionSignal`; wire break-end on `complete()`; fix doc path | Plan approved |
| **M1 — Partners** | Partner taxonomy (insurance, FX, parking, tires, clinic; corridor-tagged); `service_seek` routing in agent; `PartnerCard` with `Partner` labeling; CTR instrumentation | M0 merged |
| **M2 — Break & Contribute UI** | Trip-scoped break toggle + timeout + commuter caps; granular contribution toggles + revocation copy (ES/EN); consent UI with real versioning | M1 merged |
| **M3 — Pro via RevenueCat** | Value-moment → paywall (post-first-recommendation, Day 0); annual-default + monthly anchor; 14-day trial; MXN pricing; trial-end reminders on P4 infra; grace-period dunning | M2 merged, RevenueCat project created |
| **M4 — Scale** | Paywall experiments, B2B API pilots | M3 metrics stable |

Non-goals (carried over): no pay-to-rank, no crisis-context ads, no undisclosed native.
