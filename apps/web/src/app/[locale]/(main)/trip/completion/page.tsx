"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useTranslations } from "next-intl";
import { useTripStore } from "@/stores/trip";
import { TripCompletionPrompt } from "@/components/trip/TripCompletionPrompt";

export default function TripCompletionPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const origin = useTripStore((s) => s.start);
  const destination = useTripStore((s) => s.destination);
  const recommendedCrossing = useTripStore((s) => s.recommendedCrossing);
  const complete = useTripStore((s) => s.complete);

  const handleComplete = () => {
    complete();
    router.push(`/${locale}/trip`);
  };

  return (
    <div className="min-h-dvh bg-background px-4 sm:px-5 py-8 sm:py-12">
      <TripCompletionPrompt
        originLabel={origin?.name ?? t("common.origin")}
        destinationLabel={destination?.name ?? t("common.destination")}
        crossingName={recommendedCrossing?.crossingName ?? t("common.crossing")}
        onSave={handleComplete}
        onDone={handleComplete}
      />
    </div>
  );
}
