# AG-RICH-01 — RichResponse
**Version:** 1.0 — 2026-09-16 — new. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`AG-RICH-01`

## Name
RichResponse

## Responsibility
Renders structured assistant content: text, cards, data rows, checklist, action link, suggestion chips.

## Details
Sections render conditionally in order: `text` (`RichResponse.tsx:19-26`) with `SectionActions` copy/share/save (`RichResponse.tsx:24`); `cards` list (`RichResponse.tsx:28-34`); `dataRows` panel + formatted-rows `SectionActions` (`RichResponse.tsx:36-43`, formatter `RichResponse.tsx:82-84`); `checklist` panel + formatted `SectionActions` (`RichResponse.tsx:45-52`, formatter `RichResponse.tsx:86-88`); `action` link with `→` affordance (`RichResponse.tsx:54-62`); `suggestions` chips calling `onSuggestion?.(suggestion)` (`RichResponse.tsx:64-77`, handler at `RichResponse.tsx:69`). `SectionActions` (`RichResponse.tsx:90-140`): copy via clipboard + `Copied!` feedback (`RichResponse.tsx:93-97,137`); share via `navigator.share` with clipboard fallback and AbortError swallow (`RichResponse.tsx:99-111`); save downloads `cruze-response.txt` blob (`RichResponse.tsx:113-121`); static Bookmark affordance (`RichResponse.tsx:134-136`); aria-labels `Copy/Share/Save/Bookmark` are hardcoded English (`RichResponse.tsx:125-134`) — deviation, no `t()` (component does call `useTranslations` at `RichResponse.tsx:15` but these strings bypass it). `Card` (`RichResponse.tsx:142-189`): status tint map open/limited/closed/neutral (`RichResponse.tsx:143-148`), title/subtitle/value+unit/detail layout (`RichResponse.tsx:150-172`); tappable `Link` to `/crossing/${card.id}` with hover/active states only when `card.id` set, else static div (`RichResponse.tsx:176-189`). `DataRow` label/value with `highlight → text-cruze-green` (`RichResponse.tsx:191-200`). `ChecklistItem` checked/warning/unchecked icons, `required → text-critical *` (`RichResponse.tsx:202-223`).

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §AG for canonical definition.

## Status
- Spec: defined (v1.0 new)
- Implementation:
  - `src/components/agent/RichResponse.tsx` — structured renderer; key props: `content: ResponseContent`, `onSuggestion?: (suggestion: string) => void`
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via Agent surfaces per PAGES_WORKFLOWS_REPORT.md matrix.

## File Reference
- Spec doc: `design/components/AG-RICH-01-RichResponse.md` (this file)
- Implementation: `src/components/agent/RichResponse.tsx`
- Catalog index: `design/components/README.md`
