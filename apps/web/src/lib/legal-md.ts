/**
 * Minimal Markdown subset renderer for legal documents.
 * Supports: #/## headings, paragraphs, - bullets, **bold**, [links](url).
 * Everything else renders as escaped paragraphs. No dependencies, and by
 * construction it cannot emit scripts, iframes, or event handlers.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text: string): string {
  // Links first (href restricted to http(s)/mailto), then bold.
  const withLinks = escapeHtml(text).replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/g,
    '<a href="$2" class="text-cruze-green hover:underline">$1</a>'
  );
  return withLinks.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

export function renderLegalMarkdown(markdown: string): string {
  const blocks: string[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length > 0) {
      blocks.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`);
      list = [];
    }
  };

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      flushList();
      blocks.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      flushList();
      blocks.push(`<h1>${inline(line.slice(2))}</h1>`);
    } else if (/^[-*] /.test(line)) {
      list.push(line.slice(2));
    } else if (line === "" || line.startsWith(">")) {
      flushList();
      if (line.startsWith(">")) {
        blocks.push(`<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`);
      }
    } else {
      flushList();
      blocks.push(`<p>${inline(line)}</p>`);
    }
  }
  flushList();
  return blocks.join("\n");
}
