"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CrossingDetailHero } from "@/components/crossing/CrossingDetailHero";
import { CrossingDetailMap } from "@/components/crossing/CrossingDetailMap";
import { CrossingDetailLaneSection } from "@/components/crossing/CrossingDetailLaneSection";
import { CrossingDetailAccessSection } from "@/components/crossing/CrossingDetailAccessSection";
import { CrossingDetailHoursSection } from "@/components/crossing/CrossingDetailHoursSection";
import { CrossingDetailRequirementsSection } from "@/components/crossing/CrossingDetailRequirementsSection";
import { CrossingDetailRestrictionsSection } from "@/components/crossing/CrossingDetailRestrictionsSection";
import { CrossingDetailServicesSection } from "@/components/crossing/CrossingDetailServicesSection";
import { CrossingDetailActionBar } from "@/components/crossing/CrossingDetailActionBar";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { BORDER_CROSSINGS } from "@/lib/border-data";

interface CrossingPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function CrossingPage({ params }: CrossingPageProps) {
  const { id, locale } = use(params);
  const router = useRouter();
  const crossing = BORDER_CROSSINGS.find((c) => c.id === id);

  if (!crossing) {
    return <div className="px-5 py-12 text-center text-muted">Cruce no encontrado</div>;
  }

  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title="Cruces" onBack={() => router.push(`/${locale}/crossings`)} />
      <div className="px-5 py-6 space-y-6 max-w-lg mx-auto pb-24">
        <CrossingDetailHero
          crossingName={crossing.name}
          status="operational"
          waitTime={15}
          direction="northbound"
          updatedAt={new Date().toISOString()}
        />
        <CrossingDetailMap lat={crossing.coordinates.lat} lng={crossing.coordinates.lng} crossingName={crossing.name} />
        <CrossingDetailLaneSection lanes={[{ type: "Standard", waitTime: 15 }, { type: "Ready Lane", waitTime: 7 }, { type: "SENTRI", waitTime: 3 }]} />
        <CrossingDetailAccessSection accessTypes={["Auto", "A pie", "Comercial"]} />
        <CrossingDetailHoursSection hours="Abierto 24 horas" note="Horarios pueden variar en días festivos" />
        <CrossingDetailRequirementsSection requirements={["Pasaporte válido", "Visa (si aplica)"]} />
        <CrossingDetailRestrictionsSection restrictions={[]} />
        <CrossingDetailServicesSection services={["Cambio de divisas", "Estacionamiento"]} />
      </div>
      <CrossingDetailActionBar onUseCrossing={() => router.push(`/${locale}/trip/setup`)} />
    </div>
  );
}
