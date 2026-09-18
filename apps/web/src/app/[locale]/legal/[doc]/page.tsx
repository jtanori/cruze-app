import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { LegalDocView } from "@/components/legal/LegalDocView";
import { getLegalDoc, legalLocaleFor, type LegalDocKey } from "@/lib/legal";

const VALID_DOCS: LegalDocKey[] = ["privacy", "terms", "cookies"];

export default async function LegalDocPage({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { locale, doc } = await params;
  const key: "privacy" | "terms" | "cookies" | null =
    doc === "privacy" || doc === "terms" || doc === "cookies" ? doc : null;
  if (!key) {
    notFound();
  }
  const document = getLegalDoc(key, legalLocaleFor(locale));
  const t = await getTranslations("legal");
  const titles: Record<"privacy" | "terms" | "cookies", string> = {
    privacy: t("headers.privacy"),
    terms: t("headers.terms"),
    cookies: t("headers.cookies"),
  };

  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title={titles[key]} />
      <div className="px-4 sm:px-5 py-4 sm:py-6 max-w-2xl">
        <LegalDocView doc={document} />
      </div>
    </div>
  );
}
