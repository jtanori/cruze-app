# W0 — Application Entry & Initialization
**Version:** 1.0 — 2026-09-15 — S00 splash adopted (full-bleed, no chrome, quiet progress). Source: locked S00 design brief (v1.2).

## Overview
| Field | Value |
|-------|-------|
| **Workflow ID** | W0 |
| **Name** | Application Entry & Initialization |
| **Spec Sections** | Entry resolution, consent routing, degraded startup |
| **Pages** | S00 → S01 / Application |
| **Branching** | INITIALIZING → CONSENT_REQUIRED / READY / DEGRADED |
| **Canonical types** | `EntryState` (§28) |

## Flow Diagram
```text
Application launch
       │
       ▼
   S00 visible (SPLASH-01)
       │
       │ initialization
       ▼
 Entry Resolution
   /        \
  /          \
S01         READY → Application
Consent       │
  │           ▼
  ▼      Context Setup
Context Setup
```

## Entry States (§28)

```text
type EntryState =
  | INITIALIZING
  | CONSENT_REQUIRED
  | READY
  | DEGRADED
```

## Initialization Contract (§25)

```text
W0
│
└── S00 (visual state only)
    │
    ▼
Entry Controller
    │
    ├── resolve locale
    ├── load public configuration
    ├── restore eligible local state
    ├── resolve consent state
    └── resolve initial entry
```

S00 performs none of these operations; it is visual state only.

## Timing (§26)

| State | Target |
|-------|--------|
| Minimum visual presentation | ~700 ms |
| Normal | ~700–1,500 ms |
| Maximum | ~3 s |
| Timeout | Continue using safe/degraded state |

## Failure Behavior (§29)

success → READY · recoverable failure → fallback · timeout → fallback.
S00 never becomes an error page; DEGRADED exits into the application
with safe defaults.

## Component Catalog
| Component ID | Name | Responsibility |
|--------------|------|----------------|
| SPLASH-01 | Splash | Complete S00 composition |
| SPLASH-SCENE-01 | SplashScene | Full-bleed composition root |
| SPLASH-BG-01 | SplashBackground | Geographic artwork |
| SPLASH-BRAND-01 | SplashBrandLockup | CRUZE logo/descriptor |
| SPLASH-ROUTE-01 | BorderIntelligenceOverlay | Decorative route artwork (brand, not live data) |
| SPLASH-TAGLINE-01 | SplashPositioning | Brand positioning statement |
| SPLASH-PROGRESS-01 | SplashProgress | Discrete startup indicator |

Full screen specification (37 sections: composition, assets, motion, accessibility,
acceptance, test matrix): see `S00-SPEC` below — the S00 screen spec is the
normative companion of this workflow.

## Files Reference
| File | Purpose |
|------|---------|
| `design/workflows/W0-application-entry.md` | This workflow |
| `design/components/SPLASH-*.md` | Component specs (7) |
| `docs/SPLASH_ASSETS.md` | Graphic asset inventory (sizes, locations) |
| `apps/web/public/brand/` | Runtime artwork (to be added) |

---

# S00 — CRUZE Splash (normative screen spec)

**Component:** `SPLASH-01` · **Version:** `1.2` · **Status:** Design specification — implementation ready.

## 1. Purpose
S00 is the visual entry state of CRUZE: establish identity, present the visual
proposition, give subtle feedback during initialization, transition onward.
S00 is **not** an application page — no navigation, decisions, data, or controls.

## 2. Visual Source of Truth
Full-bleed composition: CRUZE lockup (upper-left), geographic scene with route
visualization (middle), tagline lower-left, thin progress indicator lower-center.
**The viewport rectangle is the viewport, not a card.** No border, radius, frame,
shadow, or inset. Device status bar / home indicator in reference mockups are
system-owned areas, explicitly outside S00 responsibility.

## 3. Core Principle
One continuous scene: geographic environment → CRUZE identity → border/
intelligence visualization → brand proposition → initialization feedback.
The progress indicator is the least visually important element.

## 4. Screen Anatomy
```text
S00 — SPLASH
│
└── SplashScene
    ├── SplashBackground
    ├── BorderIntelligenceOverlay
    ├── SplashBrandLockup
    ├── SplashPositioning
    └── SplashProgress
```

## 5. SPLASH-01 (composite)
Owns the complete visual composition. Does NOT own: initialization, config,
locale, consent, location, auth, trip state, APIs, recommendation, permissions.

## 6. SPLASH-SCENE-01 — composition root
Full-viewport layout, visual anchors, responsive positioning, stacking context.
Structurally simple.

## 7. SPLASH-BG-01 — geographic artwork
Dominant layer, full bleed, `object-fit: cover` protecting the focal point.
No border/radius/shadow/scroll/interaction. Renderable offline once cached.
Brand artwork character per supplied reference.

## 8. SPLASH-BRAND-01 — identity lockup
Upper-left region (never vertically centered). `CruzeMark + CruzeWordmark +
Descriptor` ("◀ CRUZE / BORDER INTELLIGENCE"). Prefer supplied vector asset;
never re-typeset the logo if production artwork exists.

## 9. SPLASH-ROUTE-01 — intelligence overlay
Brand artwork — **not live data**. No network, no waits, no status, no location
dependency. Route line + crossing nodes + subtle illumination, geographically
aligned. If the glow is baked into scene art, do not re-implement it in CSS/SVG.

## 10. SPLASH-TAGLINE-01 — positioning
Text exactly `Smarter crossings.` / `Better journeys.` Lower-left, Inter,
readable against the scene without competing with the lockup.

## 11. SPLASH-PROGRESS-01 — quiet indicator
Thin (~72–120px × 1–2px, tokens), centered lower region, low contrast.
Determinate ONLY with real measurable progress (never show %); otherwise
indeterminate. Never fake percentages. `prefers-reduced-motion` disables
animation; single `aria-hidden` decorative treatment with optional one-shot
"Loading CRUZE" status.

## 12. Motion
Allowed: subtle scene/logo entrance, restrained progress, short exit transition.
Forbidden: map camera, route drawing, pulsing markers, parallax, zoom, particles,
cinematic logo work.

## 13. Responsive
Anchors: brand left/upper, scene full/full, route focal/middle, tagline
left/lower, progress center/lower. Mobile 390×844 is the reference of record;
also 393×873, 768×1024, 1440×900.

## 14. Safe area
App content keeps breathing room; platform safe-area values are layout inputs,
not S00 elements.

## 15. Accessibility
Artwork `aria-hidden`; brand exposed as "CRUZE — Border Intelligence"; tagline
readable text; progress non-interactive, no repeated announcements.

## 16. Asset composition (exclusive)
- **A — Separate:** `SplashBackground + SplashRoute + CruzeBrand`
- **B — Precomposed:** `SplashScene + CruzeBrand`
Never duplicate artwork between layers. Use supplied art as visual truth;
components position and present, never recreate.

## 17. Acceptance criteria
Composition: full-bleed, no frame/radius/card, scene-dominant, lockup upper,
route middle, tagline lower-left, progress lower-center. Brand: faithful mark,
descriptor present, exact tagline copy. Behavior: no nav/CTA/data/location/
permission/API/engine dependency, auto-exit. Progress: discrete, honest
(determinate-only-if-real), no %, reduced-motion safe.

## 18. Test specification
Unit (entry resolution: fresh/consent states/persisted/unavailable/timeout/
degraded/locale). Component (viewport, no radius/border, artwork, lockup,
tagline, progress visible, no controls, reduced motion, brand a11y).
Progress (determinate/indeterminate/reduced-motion/completion).
E2E (launch → S00 → progress → init → exit → correct workflow).
Visual regression at 390×844 (+393×873, 768×1024, 1440×900), app surface only.
