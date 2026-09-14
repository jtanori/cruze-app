"use client";

import { Suspense } from "react";
import { TripSetupFlow } from "@/components/trip/TripSetupFlow";

export default function TripSetupPage() {
  return (
    <Suspense>
      <TripSetupFlow />
    </Suspense>
  );
}
