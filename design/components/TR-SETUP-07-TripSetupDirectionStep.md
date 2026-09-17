# TR-SETUP-07 — TripSetupDirectionStep
**Version:** 1.0 — 2026-09-16 — initial spec for northbound/southbound radio-cards. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`TR-SETUP-07`

## Name
TripSetupDirectionStep

## Responsibility
Direction selection (northbound / southbound) via two radio-cards.

## Details
Props `value: TripDirection | null` + `onSelect: (dir: TripDirection) => void` (`TripSetupDirectionStep.tsx:6-9`). Layout: outer `space-y-4 sm:space-y-5` (`TripSetupDirectionStep.tsx:13`); header block with title + subtitle (`TripSetupDirectionStep.tsx:14-17`); options `space-y-3` (`TripSetupDirectionStep.tsx:19`). Two options only (`TripSetupDirectionStep.tsx:20-22`): `northbound` → label "Estados Unidos" / sub "Hacia el norte" / `ArrowUp`, `southbound` → label "México" / sub "Hacia el sur" / `ArrowDown`. Card: `w-full flex items-center gap-4 sm:gap-6 px-4 py-4 rounded-[var(--radius-lg)] border text-left min-h-[64px]` (`TripSetupDirectionStep.tsx:30`); selected `bg-cruze-mint/10 border-cruze-mint/50`, unselected `bg-surface border-border hover:border-cruze-mint/30` (`TripSetupDirectionStep.tsx:31`). Icon circle `w-10 h-10 rounded-full` — selected `bg-cruze-mint`, unselected `bg-surface-elevated` (`TripSetupDirectionStep.tsx:34`); icon `w-5 h-5` selected `text-midnight` else `text-muted` (`TripSetupDirectionStep.tsx:35`). Label `text-sm font-semibold text-ink`, sub `text-xs text-muted` (`TripSetupDirectionStep.tsx:38-39`). Radio `ml-auto w-5 h-5 rounded-full border-2` — selected `border-cruze-mint bg-cruze-mint` with `w-2 h-2 rounded-full bg-midnight` dot, else `border-border` (`TripSetupDirectionStep.tsx:41-42`). Click calls `onSelect(o.dir)` (`TripSetupDirectionStep.tsx:29`); this step has no CTA — advance is auto via parent `TripSetupFlow` (`TripSetupFlow.tsx:249-265`: `trip_setup_direction_selected` + `getNextStep` + commit/push or `setStep`). i18n reality: no `useTranslations()` import; title `{"¿Hacia dónde vas?"}` (`TripSetupDirectionStep.tsx:15`), subtitle `Selecciona la dirección de tu cruce` (`TripSetupDirectionStep.tsx:16`), and all option labels/subs hardcoded (`TripSetupDirectionStep.tsx:21-22`) — known deviation for the later alignment pass, do not bless.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §TR for canonical definition.

## Status
- Spec: defined (v1.0 initial)
- Implementation:
  - `src/components/trip/TripSetupDirectionStep.tsx` — presentational radio-card selector; props `value`/`onSelect`; hardcoded ES copy; selection styling only, routing owned by Flow
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/... surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/TR-SETUP-07-TripSetupDirectionStep.md` (this file)
- Implementation: `src/components/trip/TripSetupDirectionStep.tsx`
- Catalog index: `design/components/README.md`
