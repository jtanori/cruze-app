# TR-SETUP-01 — 01
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> **Canonical:** `design/workflows/W5_component_level_design_spec.md` — auto-enriched. Source of truth for tokens/ASCII. See `design/components/README.md`.

# 9. `TR-SETUP-01` --- TripSetupProgress

### ASCII

``` text
PASO 1 DE 5

━━━━━━━━━━━━━━━━━━━━
```

or compact:

``` text
1 / 5
━━━━━━━━━━━━━━━━━━━━
```

### Tokens

``` text
Track:       bg-surface-elevated rounded-full overflow-hidden (TripSetupProgress.tsx:12)
Progress:    Cruze Mint
Height:      h-1.5 (6px) (TripSetupProgress.tsx:12)
Spacing:     8–12px
Label:       text-xs font-medium tabular text-muted side-by-side `{current}/{total}` (TripSetupProgress.tsx:18-20)
```

### Rule

The flow is dynamic. `TripSetupFlow` determines the actual number of
required steps.

------------------------------------------------------------------------

---

## File Reference
- Spec doc: `design/components/{f.name}` (this file) — canonical
- Workflow: `design/workflows/W5-trip-private-northbound.md` + `design/workflows/W*.md`
- Catalog index: `design/components/README.md`