"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { TripCompletionPrompt } from "@/components/trip/TripCompletionPrompt";

export default function TripCompletionPage() {
  const router = useRouter();
  const locale = useLocale();
  return (
    <div className="min-h-dvh bg-background px-4 sm:px-5 py-8 sm:py-12">
      <TripCompletionPrompt
        originLabel="Tijuana"
        destinationLabel="San Diego"
        crossingName="San Ysidro"
        onSave={() => router.push(`/${locale}/viaje`)}
        onDone={() => router.push(`/${locale}/viaje`)}
      />
    </div>
  );
}
