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
import { CrossingFavoriteButton } from "@/components/crossing/CrossingFavoriteButton";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { Spinner } from "@/components/primitives/Spinner";
import { BORDER_CROSSINGS } from "@/lib/border-data";
import { getCrossingWithLiveData } from "@/lib/border-data-service";

interface CrossingPageProps {
  params: Promise<{ id: string; locale: string }>;
}

interface LiveCrossingData {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  status: "operational" | "limited" | "closed" | "unknown";
  waitTime: number;
  isLive: boolean;
  lastUpdated?: string;
  hours: string;
  lanes: { name: string; waitTime: number; isOpen: boolean }[];
}

export default function CrossingPage({ params }: CrossingPageProps) {
  const { id, locale } = use(params);
  const router = useRouter();
  const [crossing, setCrossing] = useState<LiveCrossingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCrossing() {
      try {
        setLoading(true);
        const staticCrossing = BORDER_CROSSINGS.find((c) => c.id === id);
        if (!staticCrossing) {
          setError("Cruce no encontrado");
          setLoading(false);
          return;
        }

        const liveData = await getCrossingWithLiveData(id, "MX_TO_US");

        if (liveData && liveData.isLive) {
          setCrossing({
            id: staticCrossing.id,
            name: staticCrossing.name,
            coordinates: staticCrossing.coordinates,
            status: liveData.status.toLowerCase() as "operational" | "limited" | "closed" | "unknown",
            waitTime: liveData.waitTime,
            isLive: true,
            lastUpdated: liveData.lastUpdated,
            hours: liveData.hours,
            lanes: liveData.lanes.map((l) => ({
              name: l.name,
              waitTime: l.waitTime,
              isOpen: l.isOpen,
            })),
          });
        } else {
          setCrossing({
            id: staticCrossing.id,
            name: staticCrossing.name,
            coordinates: staticCrossing.coordinates,
            status: "operational",
            waitTime: 0,
            isLive: false,
            lastUpdated: new Date().toISOString(),
            hours: "Abierto 24 horas",
            lanes: [],
          });
        }
      } catch (err) {
        console.error("Error loading crossing:", err);
        const staticCrossing = BORDER_CROSSINGS.find((c) => c.id === id);
        if (staticCrossing) {
          setCrossing({
            id: staticCrossing.id,
            name: staticCrossing.name,
            coordinates: staticCrossing.coordinates,
            status: "operational",
            waitTime: 0,
            isLive: false,
            lastUpdated: new Date().toISOString(),
            hours: "Abierto 24 horas",
            lanes: [],
          });
        }
      } finally {
        setLoading(false);
      }
    }

    loadCrossing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !crossing) {
    return (
      <div className="min-h-dvh bg-background">
        <CruzeBackHeader title="Cruces" onBack={() => router.push(`/${locale}/crossings`)} />
        <div className="px-5 py-8 sm:py-12 text-center text-muted">{error || "Cruce no encontrado"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title={crossing.name} onBack={() => router.push(`/${locale}/crossings`)} />
      <div className="px-4 sm:px-5 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24">
        {/* CR-DET-01: Hero with name + status + wait + direction + freshness + favorite */}
        <CrossingDetailHero
          crossingName={crossing.name}
          status={crossing.status}
          waitTime={crossing.waitTime}
          direction="northbound"
          updatedAt={crossing.lastUpdated || new Date().toISOString()}
        >
          <CrossingFavoriteButton crossingId={crossing.id} />
        </CrossingDetailHero>

        {/* CR-DET-02: Map */}
        <CrossingDetailMap
          lat={crossing.coordinates.lat}
          lng={crossing.coordinates.lng}
          crossingName={crossing.name}
        />

        {/* CR-DET-03: Lane times */}
        <CrossingDetailLaneSection
          lanes={crossing.lanes.map((l) => ({ type: l.name, waitTime: l.waitTime }))}
        />

        {/* CR-DET-04: Access */}
        <CrossingDetailAccessSection accessTypes={["Auto", "A pie", "Comercial"]} />

        {/* CR-DET-05: Hours */}
        <CrossingDetailHoursSection
          hours={crossing.hours}
          note="Horarios pueden variar en días festivos"
        />

        {/* CR-DET-06: Requirements (progressive disclosure per category) */}
        <CrossingDetailRequirementsSection
          requirements={[
            { label: "Documentación", items: ["Pasaporte válido", "Visa (si aplica)"] },
            { label: "Acceso", items: ["Auto", "A pie"] },
            { label: "Vehículos", items: [] },
            { label: "Restricciones", items: [] },
          ]}
        />

        {/* CR-DET-07: Restrictions */}
        <CrossingDetailRestrictionsSection restrictions={[]} />

        {/* CR-DET-08: Services */}
        <CrossingDetailServicesSection services={["Cambio de divisas", "Estacionamiento"]} />
      </div>

      {/* CR-DET-10: Action Bar */}
      <CrossingDetailActionBar onUseCrossing={() => router.push(`/${locale}/trip/setup`)} />
    </div>
  );
}
