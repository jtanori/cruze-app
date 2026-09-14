"use client";

import { ErrorState } from "@/components/primitives/ErrorState";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-5">
      <div className="space-y-4 w-full max-w-md">
        <ErrorState
          title={t("common.errorTitle")}
          message={t("common.errorMessage")}
          action={{ label: t("common.retry"), onClick: reset }}
          error={error}
        />
        <p className="text-center">
          <a
            href={`/${locale}/trip`}
            className="text-cruze-green text-sm font-medium hover:underline"
          >
            {t("common.backToHome")}
          </a>
        </p>
      </div>
    </div>
  );
}
