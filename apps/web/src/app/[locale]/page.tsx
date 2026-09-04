"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useTripStore } from "@/stores/trip";
import { MOCK_CROSSINGS, getMockRecommendation } from "@/lib/mock-data";
import { getDisplayName } from "@/lib/display";
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();
  const completed = useTripStore((s) => s.completed);
  const start = useTripStore((s) => s.start);
  const destination = useTripStore((s) => s.destination);
  const recommendedCrossing = useTripStore((s) => s.recommendedCrossing);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!completed) {
      router.replace(`/${locale}/onboarding`);
    }
  }, [completed, router, locale]);

  if (!completed) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cruze-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const originName = getDisplayName(start) || "Tijuana";
  const destName = getDisplayName(destination) || "San Diego";
  const mockRec = getMockRecommendation(originName, destName);

  const crossingName = recommendedCrossing?.crossingName ?? mockRec.fastestCrossingName;
  const waitTime = recommendedCrossing?.waitTime ?? mockRec.borderWaitMinutes;
  const totalTime = recommendedCrossing?.totalJourneyTime ?? mockRec.totalEstimatedMinutes;
  const evidence = recommendedCrossing?.reason.detail
    ? [recommendedCrossing.reason.headline, recommendedCrossing.reason.detail]
    : mockRec.evidence;
  const alternatives = recommendedCrossing?.alternatives ?? mockRec.alternatives;

  return (
    <div className="min-h-dvh bg-background">
      <TopAppBar variant="root" />
      <main
        className="pt-[var(--nav-header-height)]"
        style={{
          paddingBottom: "calc(var(--nav-bottom-height) + env(safe-area-inset-bottom))",
        }}
      >
        <div className="space-y-8 px-5 py-6">
          {/* Direction Context */}
          <div>
            <p className="text-ink text-base sm:text-lg font-semibold">
              {originName} → {destName} ⇄
            </p>
            <p className="text-faint text-xs mt-1 tabular">
              {t("shared.updatedMinAgo", { minutes: 1 })}
            </p>
          </div>

          {/* Primary Intelligence Hero */}
          <div>
            <span className="text-cruze-green text-xs sm:text-sm font-semibold uppercase tracking-wider">
              ● {t("home.borderMovingNormally")}
            </span>
            <p className="text-muted text-sm mt-1">{t("home.averageBorderWait")}</p>
            <p className="text-ink text-4xl sm:text-5xl md:text-6xl font-bold leading-none tabular mt-1">
              {waitTime}
              <span className="text-lg text-muted font-medium ml-1">{t("common.min")}</span>
            </p>
          </div>

          {/* Recommendation Card */}
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-faint text-xs uppercase tracking-wider mb-1">
                  {t("home.recommendedCrossing")}
                </p>
                <h2 className="text-ink text-lg font-bold">
                  {crossingName}
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-improving-soft text-improving text-xs font-semibold">
                {t("home.fastest")}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-ink text-2xl font-bold tabular">
                  {waitTime}
                </span>
                <span className="text-muted text-sm ml-1">{t("common.min")}</span>
                <p className="text-faint text-xs mt-0.5">{t("home.borderWait")}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <span className="text-ink text-2xl font-bold tabular">
                  {totalTime}
                </span>
                <span className="text-muted text-sm ml-1">{t("common.min")}</span>
                <p className="text-faint text-xs mt-0.5">{t("home.totalJourney")}</p>
              </div>
            </div>

            <div className="space-y-2">
              {evidence.map((e, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cruze-green mt-0.5 shrink-0" />
                  <span className="text-sm text-muted">{e}</span>
                </div>
              ))}
            </div>

            <button className="w-full h-[44px] flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark active:bg-brand-dark rounded-[var(--radius-md)] text-white text-sm font-semibold transition-colors">
              {t("home.startRoute")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Alternatives */}
          <div className="space-y-3">
            <h3 className="text-muted text-xs font-medium uppercase tracking-wider">
              {t("home.otherCrossings")}
            </h3>
            {alternatives.map((alt) => (
              <button
                key={alt.crossingId}
                className="w-full flex items-center justify-between bg-surface border border-border rounded-[var(--radius-md)] px-4 py-3 active:bg-surface-elevated transition-colors"
              >
                <div className="flex flex-col items-start">
                  <span className="text-ink text-sm font-medium">
                    {alt.crossingName}
                  </span>
                  <span className="text-faint text-xs tabular">
                    {"totalEstimatedMinutes" in alt
                      ? alt.totalEstimatedMinutes
                      : alt.totalJourneyTime}{" "}
                    {t("common.min")} {t("home.totalJourney").toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-caution text-xs font-medium tabular">
                    +{alt.deltaMinutes} {t("common.min")}
                  </span>
                  <ChevronRight className="w-4 h-4 text-faint" />
                </div>
              </button>
            ))}
          </div>

          {/* All Crossings */}
          <div className="space-y-3">
            <h3 className="text-muted text-xs font-medium uppercase tracking-wider">
              {t("home.allCrossings")}
            </h3>
            {MOCK_CROSSINGS.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between bg-surface border border-border rounded-[var(--radius-md)] px-4 py-3"
              >
                <div className="flex flex-col items-start">
                  <span className="text-ink text-sm font-medium">{c.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        c.status === "OPEN"
                          ? "bg-improving"
                          : c.status === "LIMITED"
                          ? "bg-caution"
                          : "bg-critical"
                      }`}
                    />
                    <span className="text-faint text-xs">{c.status}</span>
                  </div>
                </div>
                <span className="text-ink text-lg font-bold tabular">
                  {c.dominantWaitMinutes}
                  <span className="text-muted text-xs font-normal ml-0.5">{t("common.min")}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNavigation active="crossings" onSelect={(d) => {
        router.push(`/${locale}/${d}`);
      }} />
    </div>
  );
}
