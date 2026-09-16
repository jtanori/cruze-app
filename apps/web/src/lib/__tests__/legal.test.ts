import { describe, it, expect } from "vitest";
import {
  getLegalDoc,
  loadIdentity,
  legalLocaleFor,
} from "../legal";
import { renderLegalMarkdown } from "../legal-md";

describe("getLegalDoc", () => {
  it("loads and interpolates the privacy notice (es-MX)", () => {
    const doc = getLegalDoc("privacy", "es-MX");
    expect(doc.meta.version).toBeTruthy();
    expect(doc.meta.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(doc.body).not.toContain("{{");
    expect(doc.body).toContain("privacidad@cruze.com.mx");
  });

  it("loads every doc in both locales", () => {
    for (const key of ["privacy", "terms", "cookies", "about", "contact"] as const) {
      for (const locale of ["es-MX", "en-US"] as const) {
        const doc = getLegalDoc(key, locale);
        expect(doc.meta.documentKey).toBe(key);
        expect(doc.meta.locale).toBe(locale);
        expect(doc.body.length).toBeGreaterThan(50);
      }
    }
  });

  it("throws on unknown document key", () => {
    expect(() => getLegalDoc("manifesto" as never, "es-MX")).toThrow(
      /not found/
    );
  });

  it("loads identity with contact channels", () => {
    const identity = loadIdentity();
    expect(identity.contact.privacyEmail).toContain("@");
    expect(identity.company.country).toBe("MX");
  });

  it("maps app locales to document locales", () => {
    expect(legalLocaleFor("en")).toBe("en-US");
    expect(legalLocaleFor("es")).toBe("es-MX");
    expect(legalLocaleFor("fr")).toBe("es-MX");
  });
});

describe("renderLegalMarkdown", () => {
  it("renders headings, lists, bold, and links", () => {
    const html = renderLegalMarkdown(
      "# Title\n\nSome **bold** text.\n\n- one\n- two\n\n[Docs](https://example.com)"
    );
    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<li>one</li>");
    expect(html).toContain('<a href="https://example.com"');
  });

  it("escapes hostile markup — no scripts, no javascript: links", () => {
    const html = renderLegalMarkdown(
      '<script>alert(1)</script>\n\n[evil](javascript:alert(2))\n\n<img src=x onerror=alert(3)>'
    );
    expect(html).not.toContain("<script>");
    // No clickable javascript: link may be produced (inert text is fine).
    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
  });
});
