# CR-DIR-02 — CrossingsDirectoryRow
**Version:** 1.2 — 2026-09-16 — implementation sync; supersedes 1.1 stub-era tokens. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`CR-DIR-02`

## Name
CrossingsDirectoryRow

## Responsibility
Compact directory row

## Details
Name + Status + North Wait + South Wait decision-critical only.
Layout: name left, MX → US / US → MX waits right (impl CrossingsDirectoryRow.tsx:44,48 — locale-invariant ISO code pairs, intentionally literal not t(); bare Norte/Sur *words* remain a violation), chevron; whole-row tappable button onClick={onToggle ?? onSelect} (CrossingsDirectoryRow.tsx:33) with aria-expanded when toggleable (CrossingsDirectoryRow.tsx:36); button row `px-4 py-2.5`
(~8px tighter than v1.1). Status via DataStatus (es labels:
Operativo/Limitado/Cerrado/Desconocido). No invented freshness on rows —
freshness lives in detail/compare surfaces.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §CR for canonical definition.

## Status
- Spec: defined
- Implementation: `src/components/crossing/CrossingsDirectoryRow.tsx` — props crossingName/status/northboundWait/southboundWait/expanded/onToggle/onSelect (CrossingsDirectoryRow.tsx:9-18), DataStatus + formatDuration, null → "—" (CrossingsDirectoryRow.tsx:38,43,47)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Trip/Crossings/Agent/Avisos/Settings surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/CR-DIR-02-CrossingsDirectoryRow.md` (this file)
- Implementation: `src/components/cr/` or domain folder
- Catalog index: `design/components/README.md`