import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { LegalDocView } from "@/components/legal/LegalDocView";
import { getLegalDoc, legalLocaleFor } from "@/lib/legal";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const document = getLegalDoc("contact", legalLocaleFor(locale));

  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title={locale === "en" ? "CONTACT" : "CONTACTO"} />
      <div className="px-4 sm:px-5 py-4 sm:py-6 max-w-2xl">
        <LegalDocView doc={document} />
      </div>
    </div>
  );
}
