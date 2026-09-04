"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Navigation, Car, Truck, Bus, Shield, ChevronRight, Check } from "lucide-react";
import {
  type TravelerProfile,
  type CrossingMode,
  type AccessType,
  type DocumentCategory,
  type TrustedTraveler,
  CROSSING_MODES,
  ACCESS_TYPES,
  DOCUMENT_CATEGORIES,
  TRUSTED_TRAVELER,
} from "@/types";
import type { TripDirection } from "@/types";

interface TravelerProfileFormProps {
  direction: TripDirection;
  onComplete: (profile: TravelerProfile) => void;
  onBack: () => void;
}

type ProfileStep = "mode" | "access" | "document" | "trusted";

const CROSSING_MODE_ICONS: Record<CrossingMode, typeof Navigation> = {
  walking: Navigation,
  personal_vehicle: Car,
  commercial_vehicle: Truck,
  public_transport: Bus,
};

export function TravelerProfileForm({ direction, onComplete, onBack }: TravelerProfileFormProps) {
  const t = useTranslations();
  const [step, setStep] = useState<ProfileStep>("mode");
  const [mode, setMode] = useState<CrossingMode>("personal_vehicle");
  const [accessType, setAccessType] = useState<AccessType>("standard");
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory>("unknown");
  const [trustedTraveler, setTrustedTraveler] = useState<TrustedTraveler>("none");

  const handleModeSelect = (selectedMode: CrossingMode) => {
    setMode(selectedMode);
    setStep("access");
  };

  const handleAccessComplete = () => {
    setStep("document");
  };

  const handleDocumentComplete = () => {
    setStep("trusted");
  };

  const handleTrustedComplete = () => {
    onComplete({
      crossingMode: mode,
      accessType,
      documentCategory,
      trustedTraveler,
    });
  };

  // Step 1: Crossing Mode
  if (step === "mode") {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <h2 className="text-ink text-xl font-semibold">{t("viaje.crossingMode")}</h2>
          <p className="text-faint text-sm">{t("viaje.crossingModeDescription")}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {CROSSING_MODES.map((m) => {
            const Icon = CROSSING_MODE_ICONS[m.id];
            return (
              <button
                key={m.id}
                onClick={() => handleModeSelect(m.id)}
                className="flex flex-col items-center gap-3 p-4 bg-surface border border-border rounded-[var(--radius-lg)] active:bg-surface-subtle transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-raised">
                  <Icon className="w-6 h-6 text-ink" />
                </div>
                <span className="text-ink text-sm font-medium text-center">{t(m.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Step 2: Access Type
  if (step === "access") {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <h2 className="text-ink text-xl font-semibold">{t("viaje.accessType")}</h2>
          <p className="text-faint text-sm">{t("viaje.accessTypeDescription")}</p>
        </div>

        <div className="space-y-2">
          {ACCESS_TYPES.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccessType(a.id)}
              className={`w-full flex items-center justify-between p-4 rounded-[var(--radius-md)] border transition-colors ${
                accessType === a.id
                  ? "bg-cruze-green/10 border-cruze-green/30"
                  : "bg-surface border-border"
              }`}
            >
              <span className="text-ink text-sm font-medium">{t(a.labelKey)}</span>
              {accessType === a.id && <Check className="w-4 h-4 text-cruze-green" />}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep("mode")}
            className="flex-1 h-12 flex items-center justify-center bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)] active:bg-surface-subtle transition-colors"
          >
            {t("common.back")}
          </button>
          <button
            onClick={handleAccessComplete}
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-cruze-green text-dark text-sm font-semibold rounded-[var(--radius-md)] active:bg-cruze-green/90 transition-colors"
          >
            {t("common.next")}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Document Category
  if (step === "document") {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <h2 className="text-ink text-xl font-semibold">{t("viaje.documentCategory")}</h2>
          <p className="text-faint text-sm">{t("viaje.documentCategoryDescription")}</p>
        </div>

        <div className="space-y-2">
          {DOCUMENT_CATEGORIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDocumentCategory(d.id)}
              className={`w-full flex items-center justify-between p-4 rounded-[var(--radius-md)] border transition-colors ${
                documentCategory === d.id
                  ? "bg-cruze-green/10 border-cruze-green/30"
                  : "bg-surface border-border"
              }`}
            >
              <span className="text-ink text-sm font-medium">{t(d.labelKey)}</span>
              {documentCategory === d.id && <Check className="w-4 h-4 text-cruze-green" />}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep("access")}
            className="flex-1 h-12 flex items-center justify-center bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)] active:bg-surface-subtle transition-colors"
          >
            {t("common.back")}
          </button>
          <button
            onClick={handleDocumentComplete}
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-cruze-green text-dark text-sm font-semibold rounded-[var(--radius-md)] active:bg-cruze-green/90 transition-colors"
          >
            {t("common.next")}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Trusted Traveler Program
  if (step === "trusted") {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <h2 className="text-ink text-xl font-semibold">{t("viaje.trustedTraveler")}</h2>
          <p className="text-faint text-sm">{t("viaje.trustedTravelerDescription")}</p>
        </div>

        <div className="space-y-2">
          {TRUSTED_TRAVELER.map((tt) => (
            <button
              key={tt.id}
              onClick={() => setTrustedTraveler(tt.id)}
              className={`w-full flex items-center justify-between p-4 rounded-[var(--radius-md)] border transition-colors ${
                trustedTraveler === tt.id
                  ? "bg-cruze-green/10 border-cruze-green/30"
                  : "bg-surface border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                {tt.id !== "none" && <Shield className="w-5 h-5 text-cruze-green" />}
                <span className="text-ink text-sm font-medium">{t(tt.labelKey)}</span>
              </div>
              {trustedTraveler === tt.id && <Check className="w-4 h-4 text-cruze-green" />}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep("document")}
            className="flex-1 h-12 flex items-center justify-center bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)] active:bg-surface-subtle transition-colors"
          >
            {t("common.back")}
          </button>
          <button
            onClick={handleTrustedComplete}
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-cruze-green text-dark text-sm font-semibold rounded-[var(--radius-md)] active:bg-cruze-green/90 transition-colors"
          >
            {t("common.next")}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
