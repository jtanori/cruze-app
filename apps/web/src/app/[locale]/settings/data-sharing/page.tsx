"use client";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { SettingsDataSharing } from "@/components/settings/SettingsDataSharing";

export default function DataSharingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title="COMPARTIR DATOS" />
      <div className="px-4 sm:px-5 py-4 sm:py-6">
        <SettingsDataSharing />
      </div>
    </div>
  );
}
