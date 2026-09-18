# LEGAL-01 — LegalDocView
**Version:** 1.0 — 2026-09-16 — new spec backfilling shipped versioned-md renderer. If mismatch with `apps/web/src/app/globals.css:94`, revisit.

## ID
`LEGAL-01`

## Name
LegalDocView

## Responsibility
Renders one versioned legal document from sanitized Markdown inside a card.

## Details
Props `{ doc: LegalDoc }` (`LegalDocView.tsx:4-6`). Card container `bg-surface border border-border rounded-[var(--radius-lg)] p-5 space-y-4` (`LegalDocView.tsx:15`). Version line `v{doc.meta.version} · {doc.meta.effectiveDate}`, `text-faint text-xs tabular` (`LegalDocView.tsx:17-19`). Body via `dangerouslySetInnerHTML={{ __html: renderLegalMarkdown(doc.body) }}` (`LegalDocView.tsx:21-24`) with typographic treatments `space-y-4 text-sm text-ink leading-relaxed` plus `[&_h1]/[&_h2]/[&_ul]/[&_blockquote]` rules (`LegalDocView.tsx:22`). NO raw HTML rule: renderer escapes all input first (`legal-md.ts:8-14`), restricts links to `http(s)/mailto` (`legal-md.ts:18-21`), supports only `#`/`##`/paragraphs/`-` bullets/`**bold**`/links (`legal-md.ts:1-6`); anything else renders as escaped paragraphs (`legal-md.ts:51-54`) and "by construction it cannot emit scripts, iframes, or event handlers" (`legal-md.ts:5`), so "no sanitizer dependency is needed" (`LegalDocView.tsx:8-12`). Source docs live in `legal/source/{es-MX,en-US}/*.md` with front matter (`legal.ts:8-10`); 7 required meta keys (`legal.ts:43-51`); missing front matter throws (`legal.ts:53-65`); invalid meta throws (`legal.ts:67-76`); unresolvable `{{placeholders}}` throw (`legal.ts:117-123`); non-`en` locales fall back to `es-MX` (`legal.ts:129-131`). Front-matter `version` → re-consent: `PrivacySheet` fetches `/api/legal/versions`, reads `versions.privacy.version` (`PrivacySheet.tsx:33-37`), shows iff `!isAcknowledged(version)` (`PrivacySheet.tsx:40-42`); store is append-only and version-bound, bump requires re-review (`privacy.ts:5-10,39-42`). i18n: component itself has no hardcoded user strings (version line is data). Hosting page headers via server-side getTranslations t("legal.headers.privacy/terms/cookies/about/contact") (`legal/[doc]/page.tsx:20-30`, `about/page.tsx:15-18`, `contact/page.tsx:15-18`); header eyebrow uppercases via CSS. Fully i18n.

## Source
Architecture spec §5-10. See `design/workflows/W5_component_level_design_spec.md` for tokens where applicable, and `docs/CRUZE — UI Architecture & Implementation Reference.v1.md` catalog §LEGAL for canonical definition (new section; no prior canonical definition — code preceded spec).

## Status
- Spec: defined (v1.0 2026-09-16)
- Implementation:
  - `src/components/legal/LegalDocView.tsx` — versioned md renderer in card; version line; sanitized body
  - `src/lib/legal.ts` — front-matter parse/validate/interpolate; locale fallback
  - `src/lib/legal-md.ts` — locked-down md subset renderer (no raw HTML)
- Workflow usage: see `design/workflows/W*.md`

## Tokens (when defined in W5 spec)
Refer to W5_component_level_design_spec.md section for this ID. If not in W5, tokens follow global foundations: Midnight #071A31 / Surface #0E223F / Elevated #132B4A / Border #1F3A54 / Text Primary #F5F7FA / Text Secondary #A7B3CC / Mint #00E0A0.

## Integration
Used via legal/about/contact surfaces: `src/app/[locale]/legal/[doc]/page.tsx:30` (keys `privacy|terms|cookies` per `VALID_DOCS`, `:6`), `src/app/[locale]/about/page.tsx:17` (`about`), `src/app/[locale]/contact/page.tsx:17` (`contact`). Card sits in `px-4 sm:px-5 py-4 sm:py-6 max-w-2xl` page gutter under `CruzeBackHeader`.

## File Reference
- Spec doc: `design/components/LEGAL-01-LegalDocView.md` (this file)
- Implementation: `src/components/legal/LegalDocView.tsx`, `src/lib/legal.ts`, `src/lib/legal-md.ts`
- Catalog index: `design/components/README.md`
