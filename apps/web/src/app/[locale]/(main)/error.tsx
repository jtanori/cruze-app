"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/primitives/ErrorState";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";

/**
 * Segment error boundary for (main) routes.
 * Renders INSIDE (main)/layout, so AppShell chrome (header + bottom nav)
 * stays visible — the user never loses navigation and can recover via
 * retry or home. Segment errors never bubble to the locale root.
 */
export default function MainSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    // Surface to console for diagnostics; real reporting hooks in later.
    console.error("[main-segment-error]", error);
  }, [error]);

  return (
    <div className="px-4 sm:px-5 py-8 space-y-4">
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
  );
}
