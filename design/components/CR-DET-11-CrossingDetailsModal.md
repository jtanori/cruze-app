# CR-DET-11 — CrossingDetailsModal (RETIRED)
**Version:** retired — 2026-09-16 — superseded by CR-DET-01..10 page sections; zero live importers. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

> RETIRED — do not implement. `CrossingDetailsModal.tsx:13` (props `recommendation: CrossingRecommendation, onClose`) has no importers in `apps/web` (grep 2026-09-16: only self-hit). Canonical detail surface is CR-DET-01..10 sections. Known deviations frozen for record: hardcoded EN share text (`CrossingDetailsModal.tsx:19`), `navigator.share/clipboard/alert("Copied to clipboard!")` (`CrossingDetailsModal.tsx:23-27`), `toLocaleTimeString()` (`CrossingDetailsModal.tsx:115`), hardcoded `aria-label="Share"/"Close"` (`CrossingDetailsModal.tsx:43,50`). RECOMMENDATION: delete `apps/web/src/components/crossing/CrossingDetailsModal.tsx` in alignment pass (confirm no dynamic import first).

## ID
`CR-DET-11`

## Name
CrossingDetailsModal

## Responsibility
Legacy full-screen detail sheet (retired).

## Details
Takes legacy `CrossingRecommendation` + `CBPLane` types (`CrossingDetailsModal.tsx:13`). The live detail route is the CR-DET-01..10 page-section family, not a full-screen modal.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §CR for canonical definition.

## Status
- Spec: retired (do not implement)
- Implementation: none (legacy file unreferenced)
- Workflow usage: none

## Tokens (when defined in W5 spec)
N/A — retired.

## Integration
None — retired.

## File Reference
- Spec doc: `design/components/CR-DET-11-CrossingDetailsModal.md` (this file)
- Implementation: none (legacy `src/components/crossing/CrossingDetailsModal.tsx` unreferenced)
- Catalog index: `design/components/README.md`
