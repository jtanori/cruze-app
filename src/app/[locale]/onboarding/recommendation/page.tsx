"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { RecommendationView } from "@/components/onboarding/RecommendationView";

export default function RecommendationPage() {
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <RecommendationView
        onSeeAllCrossings={() => {
          router.push(`/${locale}/crossings`);
        }}
      />
    </div>
  );
}
