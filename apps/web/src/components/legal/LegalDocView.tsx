import { renderLegalMarkdown } from "@/lib/legal-md";
import type { LegalDoc } from "@/lib/legal";

interface LegalDocViewProps {
  doc: LegalDoc;
}

/**
 * Renders a versioned legal document. HTML comes exclusively from the
 * locked-down renderer (all input escaped; links restricted to http(s)/
 * mailto), so no sanitizer dependency is needed.
 */
export function LegalDocView({ doc }: LegalDocViewProps) {
  return (
    <article className="space-y-4">
      <div className="space-y-1">
        <p className="text-faint text-xs tabular">
          v{doc.meta.version} · {doc.meta.effectiveDate}
        </p>
      </div>
      <div
        className="space-y-4 text-sm text-ink leading-relaxed [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-faint [&_blockquote]:text-xs"
        dangerouslySetInnerHTML={{ __html: renderLegalMarkdown(doc.body) }}
      />
    </article>
  );
}
