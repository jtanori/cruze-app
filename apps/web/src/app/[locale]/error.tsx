"use client";

import { ErrorState } from "@/components/primitives/ErrorState";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-5">
      <ErrorState
        title={t("common.errorTitle")}
        message={t("common.errorMessage")}
        action={{ label: t("common.retry"), onClick: reset }}
        error={error}
      />
    </div>
  );
}
