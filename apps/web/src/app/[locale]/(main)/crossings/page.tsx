"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { CrossingsDirectoryList } from "@/components/crossing/CrossingsDirectoryList";
import { useEffect, useState } from "react";
import { getMergedCrossingsData } from "@/lib/border-data-service";

export default function CrossingsPage() {
  const router = useRouter();
  const locale = useLocale();
  const [crossings, setCrossings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMergedCrossingsData().then((data) => {
      setCrossings(
        data.map((c) => ({
          id: c.id,
          crossingName: c.name,
          status: c.statusNorthbound === "OPEN" ? "operational" : c.statusNorthbound === "LIMITED" ? "limited" : c.statusNorthbound === "CLOSED" ? "closed" : "unknown",
          northboundWait: c.waitTimeNorthbound,
          southboundWait: c.waitTimeSouthbound,
          country: c.country,
          mode: ["vehicle", "pedestrian"],
          lanes: [...c.lanesNorthbound.map((l) => ({ type: l.name, waitTime: l.waitTime })), ...c.lanesSouthbound.map((l) => ({ type: l.name, waitTime: l.waitTime }))],
          accessTypes: ["Auto", "A pie"],
          hours: c.hours,
          services: [],
        }))
      );
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center py-8 sm:py-12"><div className="w-6 h-6 border-2 border-cruze-mint border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="px-4 sm:px-5 py-4 sm:py-6">
      <h1 className="text-xl font-bold text-ink mb-3 sm:mb-4">CRUCES</h1>
      <CrossingsDirectoryList crossings={crossings} onViewDetail={(id) => router.push(`/${locale}/crossing/${id}`)} />
    </div>
  );
}
