"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";
import { DestinationSearch } from "@/components/onboarding/DestinationSearch";

export default function DestinationPage() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <DestinationSearch
        onComplete={() => {
          router.push(`/${locale}/onboarding/starting-point`);
        }}
      />
      <button
        onClick={() => router.push(`/${locale}/crossings`)}
        className="w-full text-center text-muted text-sm font-medium hover:text-ink transition-colors"
      >
        {t("onboarding.viewAllCrossings")}
      </button>
    </div>
  );
}
