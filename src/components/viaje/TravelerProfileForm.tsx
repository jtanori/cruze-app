"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Navigation, Car, Truck, Bus, Shield, CreditCard, ChevronRight, Check } from "lucide-react";
import {
  type TravelerProfile,
  type CrossingMode,
  type VisaType,
  CROSSING_MODES,
  US_VISA_TYPES,
  MX_VISA_TYPES,
  COMMON_PASSPORT_COUNTRIES,
} from "@/types";
import type { TripDirection } from "@/types";

interface TravelerProfileFormProps {
  direction: TripDirection;
  onComplete: (profile: TravelerProfile) => void;
  onBack: () => void;
}

type ProfileStep = "mode" | "sentri" | "visa" | "passport";

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
  const [hasSentri, setHasSentri] = useState(false);
  const [usVisaType, setUsVisaType] = useState<VisaType | null>(null);
  const [mxVisaType, setMxVisaType] = useState<VisaType | null>(null);
  const [passportCountry, setPassportCountry] = useState<string | null>(null);
  const [passportSearch, setPassportSearch] = useState("");
  const [showPassportInput, setShowPassportInput] = useState(false);

  const handleModeSelect = (selectedMode: CrossingMode) => {
    setMode(selectedMode);
    setStep("sentri");
  };

  const handleSentriComplete = () => {
    setStep("visa");
  };

  const handleVisaComplete = () => {
    // If non-MX/US passport, show passport step
    // For now, we'll ask for passport country if user indicates they have one
    setStep("passport");
  };

  const handlePassportComplete = () => {
    onComplete({
      crossingMode: mode,
      hasSentri,
      usVisaType: direction === "MX_TO_US" ? usVisaType : null,
      mxVisaType: direction === "US_TO_MX" ? mxVisaType : null,
      passportCountry,
    });
  };

  const filteredCountries = COMMON_PASSPORT_COUNTRIES.filter((c) =>
    c.toLowerCase().includes(passportSearch.toLowerCase())
  );

  // Step 1: Crossing Mode
  if (step === "mode") {
    return (
      <div className="space-y-6">
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

  // Step 2: SENTRI
  if (step === "sentri") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-ink text-xl font-semibold">{t("viaje.sentri")}</h2>
          <p className="text-faint text-sm">{t("viaje.sentriDescription")}</p>
        </div>

        <button
          onClick={() => setHasSentri(!hasSentri)}
          className={`w-full flex items-center justify-between p-4 rounded-[var(--radius-lg)] border transition-colors ${
            hasSentri
              ? "bg-cruze-green/10 border-cruze-green/30"
              : "bg-surface border-border"
          }`}
        >
          <div className="flex items-center gap-3">
            <Shield className={`w-5 h-5 ${hasSentri ? "text-cruze-green" : "text-faint"}`} />
            <span className="text-ink text-sm font-medium">SENTRI</span>
          </div>
          {hasSentri && <Check className="w-5 h-5 text-cruze-green" />}
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setStep("mode")}
            className="flex-1 h-12 flex items-center justify-center bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)] active:bg-surface-subtle transition-colors"
          >
            {t("common.back")}
          </button>
          <button
            onClick={handleSentriComplete}
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-cruze-green text-dark text-sm font-semibold rounded-[var(--radius-md)] active:bg-cruze-green/90 transition-colors"
          >
            {t("common.next")}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Visa Type
  if (step === "visa") {
    const visaTypes = direction === "MX_TO_US" ? US_VISA_TYPES : MX_VISA_TYPES;
    const selectedVisa = direction === "MX_TO_US" ? usVisaType : mxVisaType;
    const setSelectedVisa = direction === "MX_TO_US" ? setUsVisaType : setMxVisaType;
    const visaTitle = direction === "MX_TO_US" ? t("viaje.usVisa") : t("viaje.mxVisa");

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-ink text-xl font-semibold">{visaTitle}</h2>
          <p className="text-faint text-sm">{t("viaje.visaDescription")}</p>
        </div>

        <div className="space-y-2">
          {visaTypes.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVisa(v.id)}
              className={`w-full flex items-center justify-between p-4 rounded-[var(--radius-md)] border transition-colors ${
                selectedVisa === v.id
                  ? "bg-cruze-green/10 border-cruze-green/30"
                  : "bg-surface border-border"
              }`}
            >
              <span className="text-ink text-sm font-medium">{t(v.labelKey)}</span>
              {selectedVisa === v.id && <Check className="w-4 h-4 text-cruze-green" />}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep("sentri")}
            className="flex-1 h-12 flex items-center justify-center bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)] active:bg-surface-subtle transition-colors"
          >
            {t("common.back")}
          </button>
          <button
            onClick={handleVisaComplete}
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-cruze-green text-dark text-sm font-semibold rounded-[var(--radius-md)] active:bg-cruze-green/90 transition-colors"
          >
            {t("common.next")}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Passport Country
  if (step === "passport") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-ink text-xl font-semibold">{t("viaje.passportCountry")}</h2>
          <p className="text-faint text-sm">{t("viaje.passportDescription")}</p>
        </div>

        {!showPassportInput ? (
          <div className="space-y-2">
            <button
              onClick={() => {
                setPassportCountry("Mexico");
                handlePassportComplete();
              }}
              className="w-full flex items-center justify-between p-4 rounded-[var(--radius-md)] border border-border bg-surface"
            >
              <span className="text-ink text-sm font-medium">Mexico</span>
              {passportCountry === "Mexico" && <Check className="w-4 h-4 text-cruze-green" />}
            </button>
            <button
              onClick={() => {
                setPassportCountry("United States");
                handlePassportComplete();
              }}
              className="w-full flex items-center justify-between p-4 rounded-[var(--radius-md)] border border-border bg-surface"
            >
              <span className="text-ink text-sm font-medium">United States</span>
              {passportCountry === "United States" && <Check className="w-4 h-4 text-cruze-green" />}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-faint">{t("common.or")}</span>
              </div>
            </div>

            <button
              onClick={() => setShowPassportInput(true)}
              className="w-full flex items-center justify-between p-4 rounded-[var(--radius-md)] border border-border bg-surface"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-faint" />
                <span className="text-ink text-sm font-medium">{t("viaje.otherPassport")}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-faint" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={passportSearch}
              onChange={(e) => setPassportSearch(e.target.value)}
              placeholder={t("viaje.searchCountry")}
              className="w-full h-12 px-4 bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm placeholder:text-faint focus:outline-none focus:border-cruze-green"
            />
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredCountries.map((country) => (
                <button
                  key={country}
                  onClick={() => {
                    setPassportCountry(country);
                    handlePassportComplete();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-surface-subtle transition-colors"
                >
                  <span className="text-ink text-sm">{country}</span>
                  {passportCountry === country && <Check className="w-4 h-4 text-cruze-green" />}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setStep("visa")}
            className="flex-1 h-12 flex items-center justify-center bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)] active:bg-surface-subtle transition-colors"
          >
            {t("common.back")}
          </button>
          <button
            onClick={() => {
              setPassportCountry(null);
              handlePassportComplete();
            }}
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)] active:bg-surface-subtle transition-colors"
          >
            {t("viaje.skip")}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
