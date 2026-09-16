import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * LEGAL-01 runtime — versioned legal content from source Markdown.
 *
 * Sources live in apps/web/legal/source/{es-MX,en-US}/*.md with YAML-ish
 * front matter; identity/placeholders come from legal/config. Invalid
 * metadata throws at request time (and should fail CI via the legal tests).
 * No signing pipeline yet (deferred per Plan B phasing).
 */

export type LegalLocale = "es-MX" | "en-US";
export type LegalDocKey = "privacy" | "terms" | "cookies" | "about" | "contact";

export interface LegalDocMeta {
  documentKey: string;
  version: string;
  effectiveDate: string;
  locale: string;
  jurisdiction: string;
  reviewedAt: string;
  status: string;
}

export interface LegalDoc {
  meta: LegalDocMeta;
  /** Interpolated Markdown body (front matter stripped). */
  body: string;
}

export interface CruzeIdentity {
  app: { name: string; website: string; version: string };
  company: { legalName: string; country: string };
  contact: { supportEmail: string; legalEmail: string; privacyEmail: string };
  legal: Record<string, { version: string; effectiveDate: string; locale: string }>;
}

function legalRoot(): string {
  return join(process.cwd(), "legal");
}

const REQUIRED_META = [
  "documentKey",
  "version",
  "effectiveDate",
  "locale",
  "jurisdiction",
  "reviewedAt",
  "status",
] as const;

function parseFrontMatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Legal document missing front-matter block");
  }
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    meta[line.slice(0, sep).trim()] = line.slice(sep + 1).trim();
  }
  return { meta, body: match[2].trim() };
}

function validateMeta(meta: Record<string, string>, file: string): void {
  for (const key of REQUIRED_META) {
    if (!meta[key]) {
      throw new Error(`Legal document ${file} missing front-matter: ${key}`);
    }
  }
  if (Number.isNaN(Date.parse(meta.effectiveDate))) {
    throw new Error(`Legal document ${file} has invalid effectiveDate`);
  }
}

function lookup(obj: unknown, path: string): string | null {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    if (!cur || typeof cur !== "object" || !(part in (cur as Record<string, unknown>))) {
      return null;
    }
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : null;
}

export function loadIdentity(): CruzeIdentity {
  const raw = readFileSync(join(legalRoot(), "config", "cruze.identity.json"), "utf-8");
  return JSON.parse(raw) as CruzeIdentity;
}

/**
 * Load + validate + interpolate a legal document.
 * Throws on missing/invalid metadata or unresolvable placeholders
 * (build/test must fail loudly, never render half-baked legal copy).
 */
export function getLegalDoc(key: LegalDocKey, locale: LegalLocale): LegalDoc {
  const file = join(legalRoot(), "source", locale, `${key}.md`);
  if (!existsSync(file)) {
    throw new Error(`Legal document not found: ${locale}/${key}`);
  }
  const raw = readFileSync(file, "utf-8");
  const { meta, body } = parseFrontMatter(raw);
  validateMeta(meta, `${locale}/${key}.md`);
  const validated = meta as unknown as LegalDocMeta;

  const identity = loadIdentity();
  const context = {
    company: identity.company,
    contact: identity.contact,
    app: identity.app,
    legal: identity.legal,
  };
  const text = body.replace(/\{\{([^{}]+)\}\}/g, (full, path: string) => {
    const value = lookup(context, path.trim());
    if (value === null) {
      throw new Error(`Legal document ${locale}/${key}.md has unresolvable placeholder: ${full}`);
    }
    return value;
  });

  return { meta: validated, body: text };
}

/** Locales map to folders 1:1; anything else falls back to es-MX. */
export function legalLocaleFor(locale: string): LegalLocale {
  return locale === "en" ? "en-US" : "es-MX";
}
