"use client";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { SettingsAbout } from "@/components/settings/SettingsAbout";

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title="ACERCA DE" />
      <div className="px-4 sm:px-5 py-4 sm:py-6">
        <SettingsAbout />
      </div>
    </div>
  );
}
