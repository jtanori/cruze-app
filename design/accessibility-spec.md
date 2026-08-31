# CRUCE — Accessibility Spec (G3)
**Status:** Baseline standard (planning). Target: **WCAG 2.1 AA**.
**Approach:** Use platform/standard semantics; no custom a11y invention.

---

## 1. Structure & landmarks
- Single `<main>` per route; `<nav>` for bottom + header; `<header>` for top bar.
- Heading order: one `<h1>` per screen (crossing/persona name), `<h2>` for sections.

## 2. Live waits (core)
- Each wait value lives in `aria-live="polite"` with `aria-label` e.g.
  `"San Ysidro SENTRI, 22 minutes wait, trend worsening"`.
- Updates announced politely; throttle to avoid spam (coalesce within 1s).

## 3. Targets & focus
- All controls ≥ `44×44px` hit target.
- Visible focus ring in brand green `#43D69A`; never remove outline without replacement.
- Focus order: header → primary content → bottom nav; logical tab sequence.

## 4. Contrast
- Ink `#F5F7FA` on background `#081830` ≈ 15.8:1 (AAA). Muted `#A8B3C2` on `#081830` ≈ 6.5:1 (AA). Faint `#68788B` used for decorative only (not body text).
- Chart line `#43D69A` on dark passes AA for non-text.

## 5. Motion
- Honor `prefers-reduced-motion`: disable splash fade, chart draw, and map pan; show end-state immediately.

## 6. Forms (Filters / Settings)
- Every input has a `<label>`; segmented controls use `role="radiogroup"` + `role="radio"`.
- Language toggle is a real toggle with state announced.

## 7. Screen-reader names
- Crossing rows: `"{name}, {mode}, {wait} min, {trend}"`.
- Bottom nav: `"Cruces, tab 1 of 3"` etc.
- Alertas badge: `"3 unread border changes"`.

## 8. Audit gate (build)
- Automated: `@axe-core` in smoke; manual: keyboard-only pass + VoiceOver/Narrator on the 3 core screens.
