# Cruce — Border Crossing Intelligence

Monorepo: Next.js web (`apps/web`) + Flutter mobile (`apps/mobile`) + shared contracts (`packages/*`).

## Quick Start

```bash
pnpm install
pnpm dev                    # turbo: web on http://localhost:3000
pnpm --filter cruce-web build
pnpm --filter cruce-web typecheck
```

## Structure

```
apps/web      # Next.js 16 App Router, 23 pages, 33 primitives, 10 workflows
apps/mobile   # Flutter (Riverpod + go_router) — scaffolded, build_runner ready
packages/contracts # shared CrossingWait/Recommendation/Aviso types
packages/types     # re-export
```

## Docs

- `design/INTEGRATION_PLAN.md` — v3.3 Phases 0-11 (Band 4 + workflows)
- `docs/CHECKLISTS.md` — comprobation checklists §§18-34 + Spec §27
- `docs/PAGES_WORKFLOWS_REPORT.md` — 28 pages × 10 workflows matrix
- `docs/PHASE-7-QA.md` + `docs/CRUZE — Product, UX & Design System Specification.v1.md` + `docs/CRUZE — UI Architecture & Implementation Reference.v1.md`
- `apps/mobile/README.md` — Flutter theming/routing/network plan

## Workflows (10)

Location → Walking/Commercial/Priv SB/NB → Active Trip → Crossings→Detail→Compare → Agent → Avisos → Settings

See `docs/PAGES_WORKFLOWS_REPORT.md:3` for full matrix.

## Testing

- `pnpm --filter cruce-web typecheck` — 0 errors
- `npx playwright test` — `screens-evidence` skipped until v3 wired (`playwright/tests/screens-evidence.test.ts:132`)
- `docs/CHECKLISTS.md:18` Page Level, `33` Component QA, `34` Page QA

## Flutter

```bash
cd apps/mobile
flutter pub get
dart run build_runner build
flutter build apk --debug
```
