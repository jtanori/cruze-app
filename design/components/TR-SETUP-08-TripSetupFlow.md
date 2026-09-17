# TR-SETUP-08 — TripSetupFlow
**Version:** 1.0 — 2026-09-16 — initial spec for wizard orchestrator, step routing, handoff guard, hollow-disabled Continue, commitSetupToStore boundary. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`TR-SETUP-08`

## Name
TripSetupFlow

## Responsibility
Wizard orchestrator for trip setup: step routing, handoff guard, progress, and store commit.

## Details
No props: `export function TripSetupFlow()` (`TripSetupFlow.tsx:41`). Step titles map `STEP_TITLES: Record<TripSetupStep, ...>` for destination/origin/travelMode/direction/accessType/documentProfile/recommendation (`TripSetupFlow.tsx:31-39`); header `CruzeBackHeader title={t(`trip.setup.${STEP_TITLES[step]}`)} onBack={goBack}` (`TripSetupFlow.tsx:188`). Handoff resolved once via `parseSetupParams(searchParams?.toString() ?? "")` + `checkHandoffCompatibility(request, { destinationId: activeDestinationId })` (`TripSetupFlow.tsx:49-55`); initial `state` pre-fills destination/candidate only when `verdict.compatible` (`TripSetupFlow.tsx:57-69`); initial step is `origin` when handoff destination present else `destination` (`TripSetupFlow.tsx:70-72`); `entryStepRef` locks mount entry so back from entry exits via history (`TripSetupFlow.tsx:77-82`); `handoffCandidate` / `handoffRejection` derived from verdict (`TripSetupFlow.tsx:83-86`). Progress `getStepProgress(state, step)` + `getRequiredSteps(state)` (`TripSetupFlow.tsx:88-89`); sticky progress bar `sticky top-0 z-10 bg-background border-b border-border-subtle px-5 py-3` with `TripSetupProgress current/total` (`TripSetupFlow.tsx:190-192`). Handoff banners: candidate `bg-cruze-mint/10 border-cruze-mint/30 rounded-[var(--radius-md)]` with `t("trip.setup.handoffCandidate", { crossing })` (`TripSetupFlow.tsx:194-200`); rejection `bg-caution/10 border-caution/30` with `t("trip.setup.handoffConflict")` for `active-trip-conflict` else `t("trip.setup.handoffUnknownCrossing")` (`TripSetupFlow.tsx:201-209`). Step bodies conditionally rendered in `flex-1 px-4 sm:px-5 py-4 sm:py-6` (`TripSetupFlow.tsx:211`): destination auto-advances `setStep("origin")` + `trip_setup_destination_selected` (`TripSetupFlow.tsx:212-220`); origin controlled `value`/`onSelect` setState only (`TripSetupFlow.tsx:222-229`); travelMode auto-advances with `trip_setup_travel_mode_selected`, commit+push when next is recommendation (`TripSetupFlow.tsx:231-247`); direction auto-advances with `trip_setup_direction_selected`, commit+push when recommendation (`TripSetupFlow.tsx:249-265`); accessType advances one step `trip_setup_access_type_selected` (`TripSetupFlow.tsx:267-278`); documentProfile `onSelect` setState + `trip_setup_document_selected`, `onSkip` commits + pushes (`TripSetupFlow.tsx:280-293`). `commitSetupToStore` is the commitment boundary (`TripSetupFlow.tsx:92`): `setDestination` from `s.destination` (`TripSetupFlow.tsx:96-106`), `setStart` with `current_location` vs `search` by id (`TripSetupFlow.tsx:108-118`), `northbound→MX_TO_US` / `southbound→US_TO_MX` (`TripSetupFlow.tsx:120-124`), `cross_border` vs `same_country` by country compare (`TripSetupFlow.tsx:126-134`), plus `setTravelMode/setAccessType/setDocumentProfile` (`TripSetupFlow.tsx:137-139`). `goNext` commits + `trip_setup_completed` + push `/${locale}/trip/recommendation` at recommendation, else `trip_setup_step_completed` + `setStep` (`TripSetupFlow.tsx:142-154`); `goBack` uses `router.back()` at entry step else `getPreviousStep` (`TripSetupFlow.tsx:156-164`). `hasSelection` switch: destination/origin/travelMode/direction/accessType null-checks, documentProfile always true (`TripSetupFlow.tsx:167-184`). Continue rendered only for `origin` (`TripSetupFlow.tsx:297`): `disabled={!hasSelection}` (`TripSetupFlow.tsx:306`) with hollow-disabled `disabled:bg-surface-elevated disabled:text-faint disabled:border-border disabled:shadow-none disabled:cursor-not-allowed disabled:hover:opacity-100` on mint base (`TripSetupFlow.tsx:307`); label `t("trip.setup.continue")` (`TripSetupFlow.tsx:309`); click guards `if (state.origin)` + `trip_setup_origin_selected` + `goNext` (`TripSetupFlow.tsx:300-304`). `viewRecommendation` button only when `documentProfile && state.documentType` (`TripSetupFlow.tsx:314`), commits + pushes (`TripSetupFlow.tsx:317-320`), label `t("trip.setup.viewRecommendation")` (`TripSetupFlow.tsx:323`). Shell `min-h-dvh bg-background flex flex-col` (`TripSetupFlow.tsx:187`). i18n: chrome/banners/buttons via `t("trip.setup.*")`; analytics event names (`trip_setup_*`) and direction enum values are hardcoded code strings, not user copy.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §TR for canonical definition.

## Status
- Spec: defined (v1.0 initial)
- Implementation:
  - `src/components/trip/TripSetupFlow.tsx` — owns handoff guard, step state, goNext/goBack, hasSelection gate, commitSetupToStore boundary, Continue + viewRecommendation CTAs
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/... surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/TR-SETUP-08-TripSetupFlow.md` (this file)
- Implementation: `src/components/trip/TripSetupFlow.tsx`
- Catalog index: `design/components/README.md`
