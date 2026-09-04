"use client";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { SettingsProfile } from "@/components/settings/SettingsProfile";

export default function ProfilePage() {
  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title="PERFIL" />
      <div className="px-4 sm:px-5 py-4 sm:py-6">
        <SettingsProfile />
      </div>
    </div>
  );
}
