# CR-STATUS-02 — 02
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 19. `CR-STATUS-02` --- CrossingDirectionTimes

### ASCII

``` text
Norte
11 min
```

or

``` text
MX → US   11 min
US → MX   4 min
```
Locale-invariant ISO pairs MX → US / US → MX (CrossingDirectionTimes.tsx:11-14); unit via t("common.min") (CrossingDirectionTimes.tsx:8). Aligned — no bare Norte/Sur remains.

### Tokens

``` text
Direction: Text Secondary
Metric:    Sora
```

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`