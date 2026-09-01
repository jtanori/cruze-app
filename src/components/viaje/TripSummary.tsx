"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { MapPin, ArrowRight, Edit3, Plus, Navigation, Shield, CreditCard, Car } from "lucide-react";
import { useTripStore } from "@/stores/trip";
import { useTravelerStore } from "@/stores/traveler";
import { getDisplayName } from "@/lib/display";

interface TripSummaryProps {
  onStartNew: () => void;
  onEdit: () => void;
}

export function TripSummary({ onStartNew, onEdit }: TripSummaryProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";

  const { start, destination, direction, recommendedCrossing } = useTripStore();
  const { profile } = useTravelerStore();

  const handleViewCrossing = () => {
    if (recommendedCrossing) {
      router.push(`/${locale}/crossing/${recommendedCrossing.crossingId}`);
    }
  };

  const crossingModeLabel = profile
    ? profile.crossingMode === "walking"
      ? t("viaje.walking")
      : profile.crossingMode === "personal_vehicle"
      ? t("viaje.personalVehicle")
      : profile.crossingMode === "commercial_vehicle"
      ? t("viaje.commercialVehicle")
      : t("viaje.publicTransport")
    : null;

  return (
    <div className="space-y-4">
      {/* Route Card */}
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted text-xs font-medium uppercase tracking-wider">
            {t("viaje.currentTrip")}
          </p>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-cruze-green text-xs font-medium"
          >
            <Edit3 className="w-3 h-3" />
            {t("common.edit")}
          </button>
        </div>

        {/* Origin → Destination */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cruze-green" />
              <p className="text-ink text-sm font-medium truncate">
                {start ? getDisplayName(start) : t("viaje.currentLocation")}
              </p>
            </div>
            <p className="text-faint text-xs ml-4 mt-0.5">
              {direction === "MX_TO_US" ? "México" : "United States"}
            </p>
          </div>

          <ArrowRight className="w-4 h-4 text-faint shrink-0" />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cruze-green" />
              <p className="text-ink text-sm font-medium truncate">
                {destination ? getDisplayName(destination) : "—"}
              </p>
            </div>
            <p className="text-faint text-xs ml-6 mt-0.5">
              {direction === "MX_TO_US" ? "United States" : "México"}
            </p>
          </div>
        </div>

        {/* Crossing info */}
        {recommendedCrossing && (
          <div className="bg-surface-raised rounded-[var(--radius-md)] p-3">
            <p className="text-faint text-xs">{t("viaje.recommendedCrossing")}</p>
            <p className="text-ink text-sm font-medium mt-0.5">
              {recommendedCrossing.crossingName}
            </p>
          </div>
        )}
      </div>

      {/* Traveler Profile Card */}
      {profile && (
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-3">
          <p className="text-muted text-xs font-medium uppercase tracking-wider">
            {t("viaje.travelerProfile")}
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {profile.crossingMode === "walking" ? (
                <Navigation className="w-4 h-4 text-faint" />
              ) : (
                <Car className="w-4 h-4 text-faint" />
              )}
              <span className="text-ink text-sm">{crossingModeLabel}</span>
            </div>
            {profile.hasSentri && (
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-cruze-green" />
                <span className="text-ink text-sm">SENTRI</span>
              </div>
            )}
            {profile.passportCountry && (
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-faint" />
                <span className="text-ink text-sm">{profile.passportCountry}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {recommendedCrossing && (
          <button
            onClick={handleViewCrossing}
            className="w-full h-[48px] flex items-center justify-center gap-2 bg-cruze-green text-dark font-semibold rounded-[var(--radius-md)] active:bg-cruze-green/90 transition-colors"
          >
            {t("viaje.viewCrossing")}
          </button>
        )}
        <button
          onClick={onStartNew}
          className="w-full h-[48px] flex items-center justify-center gap-2 bg-surface border border-border text-ink font-medium rounded-[var(--radius-md)] active:bg-surface-subtle transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("viaje.newTrip")}
        </button>
      </div>
    </div>
  );
}
