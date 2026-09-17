"use client";

import { useTranslations } from "next-intl";
import { Footprints, Car, Truck } from "lucide-react";
import type { TravelMode } from "@/lib/trip-setup-flow";

interface TripSetupTravelModeStepProps {
  value: TravelMode | null;
  onSelect: (mode: TravelMode) => void;
}

export function TripSetupTravelModeStep({ value, onSelect }: TripSetupTravelModeStepProps) {
  const t = useTranslations();
  const modes: { mode: TravelMode; labelKey: string; icon: typeof Footprints; descKey: string }[] = [
    { mode: "walking", labelKey: "trip.setup.travelModeStep.walking", icon: Footprints, descKey: "trip.setup.travelModeStep.walkingDesc" },
    { mode: "privateVehicle", labelKey: "trip.setup.travelModeStep.privateVehicle", icon: Car, descKey: "trip.setup.travelModeStep.privateVehicleDesc" },
    { mode: "commercial", labelKey: "trip.setup.travelModeStep.commercial", icon: Truck, descKey: "trip.setup.travelModeStep.commercialDesc" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">{t("trip.setup.travelModeStep.title")}</h2>
        <p className="text-sm text-muted mt-1">{t("trip.setup.travelModeStep.subtitle")}</p>
      </div>

      <div className="space-y-3">
        {modes.map((m) => {
          const Icon = m.icon;
          const selected = value === m.mode;
          return (
            <button
              key={m.mode}
              onClick={() => onSelect(m.mode)}
              className={`w-full flex items-center gap-4 sm:gap-6 px-4 py-4 rounded-[var(--radius-lg)] border text-left transition-colors min-h-[64px] ${
                selected
                  ? "bg-cruze-mint/10 border-cruze-mint/50"
                  : "bg-surface border-border hover:border-cruze-mint/30"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selected ? "bg-cruze-mint" : "bg-surface-elevated"}`}>
                <Icon className={`w-5 h-5 ${selected ? "text-midnight" : "text-muted"}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{t(m.labelKey)}</p>
                <p className="text-xs text-muted">{t(m.descKey)}</p>
              </div>
              <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? "border-cruze-mint bg-cruze-mint" : "border-border"}`}>
                {selected && <span className="w-2 h-2 rounded-full bg-midnight" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
