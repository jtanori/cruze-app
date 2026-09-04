"use client";

import { useTranslations } from "next-intl";
import { Select } from "@/components/primitives/Select";
import { useTravelerStore } from "@/stores/traveler";
import type { CrossingMode } from "@/types";

interface SettingsProfileProps {
  className?: string;
}

const modeOptions: { value: CrossingMode; label: string }[] = [
  { value: "walking", label: "A pie" },
  { value: "personal_vehicle", label: "Veh\u00EDculo privado" },
  { value: "commercial_vehicle", label: "Comercial" },
  { value: "public_transport", label: "Transporte p\u00FAblico" },
];

const accessOptions = [
  { value: "standard", label: "Est\u00E1ndar" },
  { value: "readyLane", label: "Ready Lane" },
  { value: "sentri", label: "SENTRI" },
];

export function SettingsProfile({ className = "" }: SettingsProfileProps) {
  const t = useTranslations();
  const { profile, setProfile } = useTravelerStore();

  const handleTravelModeChange = (mode: CrossingMode) => {
    setProfile({ ...profile, crossingMode: mode } as any);
  };

  const handleSentriToggle = (hasSentri: boolean) => {
    setProfile({ ...profile, hasSentri } as any);
  };

  const handleAccessTypeChange = (accessType: string) => {
    const hasSentri = accessType === "sentri";
    setProfile({ ...profile, hasSentri } as any);
  };

  const currentMode = profile?.crossingMode || "personal_vehicle";
  const currentHasSentri = profile?.hasSentri || false;
  const currentAccess = currentHasSentri ? "sentri" : "standard";

  return (
    <div className={`space-y-4 sm:space-y-5 ${className}`}>
      <h2 className="text-lg font-bold text-ink">{t("viaje.travelerProfile")}</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted">{t("viaje.crossingMode")}</label>
          <Select
            value={currentMode}
            onChange={(e) => handleTravelModeChange(e.target.value as CrossingMode)}
            options={modeOptions}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">{t("viaje.sentri")}</label>
          <Select
            value={currentHasSentri ? "sentri" : "standard"}
            onChange={(e) => handleAccessTypeChange(e.target.value)}
            options={accessOptions}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">{t("viaje.usVisa")}</label>
          <Select
            value={profile?.usVisaType || "none"}
            onChange={(e) => setProfile({ ...profile, usVisaType: e.target.value as any } as any)}
            options={[
              { value: "none", label: t("viaje.visa.none") },
              { value: "b1_b2", label: t("viaje.visa.b1b2") },
              { value: "h1b", label: t("viaje.visa.h1b") },
              { value: "f1", label: t("viaje.visa.f1") },
              { value: "global_entry", label: t("viaje.visa.globalEntry") },
            ]}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">{t("viaje.mxVisa")}</label>
          <Select
            value={profile?.mxVisaType || "none"}
            onChange={(e) => setProfile({ ...profile, mxVisaType: e.target.value as any } as any)}
            options={[
              { value: "none", label: t("viaje.visa.none") },
              { value: "fmm", label: t("viaje.visa.fmm") },
              { value: "resident", label: t("viaje.visa.resident") },
            ]}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">{t("viaje.passportCountry")}</label>
          <Select
            value={profile?.passportCountry || "Mexico"}
            onChange={(e) => setProfile({ ...profile, passportCountry: e.target.value } as any)}
            options={[
              { value: "Mexico", label: "M\u00E9xico" },
              { value: "United States", label: "Estados Unidos" },
              { value: "Spain", label: "Espa\u00F1a" },
              { value: "Colombia", label: "Colombia" },
              { value: "China", label: "China" },
              { value: "India", label: "India" },
              { value: "Japan", label: "Jap\u00F3n" },
              { value: "Germany", label: "Alemania" },
              { value: "United Kingdom", label: "Reino Unido" },
              { value: "Brazil", label: "Brasil" },
              { value: "Canada", label: "Canad\u00E1" },
              { value: "South Korea", label: "Corea del Sur" },
              { value: "France", label: "Francia" },
              { value: "Argentina", label: "Argentina" },
              { value: "Cuba", label: "Cuba" },
              { value: "Guatemala", label: "Guatemala" },
              { value: "Honduras", label: "Honduras" },
              { value: "El Salvador", label: "El Salvador" },
              { value: "Nicaragua", label: "Nicaragua" },
              { value: "Costa Rica", label: "Costa Rica" },
            ]}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}