import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Exposes current legal document versions to the client (privacy sheet
 * acknowledgement checks, settings version lines). Versions only — never
 * prose (prose renders server-side via LegalDocView).
 *
 * GET /api/legal/versions → { privacy: { version, effectiveDate }, ... }
 */
const DOCS = ["privacy", "terms", "cookies", "about", "contact"] as const;

function readVersion(doc: string, localeDir: "es-MX" | "en-US"): { version: string; effectiveDate: string } | null {
  try {
    const raw = readFileSync(
      join(process.cwd(), "legal", "source", localeDir, `${doc}.md`),
      "utf-8"
    );
    const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
    if (!match) return null;
    const meta: Record<string, string> = {};
    for (const line of match[1].split("\n")) {
      const sep = line.indexOf(":");
      if (sep === -1) continue;
      meta[line.slice(0, sep).trim()] = line.slice(sep + 1).trim();
    }
    if (!meta.version || !meta.effectiveDate) return null;
    return { version: meta.version, effectiveDate: meta.effectiveDate };
  } catch {
    return null;
  }
}

export async function GET() {
  const versions: Record<string, unknown> = {};
  for (const doc of DOCS) {
    versions[doc] = readVersion(doc, "es-MX");
  }
  return NextResponse.json(
    { versions },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}
