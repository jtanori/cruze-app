"use client";

import { ErrorState } from "@/components/primitives/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-5">
      <ErrorState
        title="Algo salió mal"
        message="No pudimos cargar esta página. Intenta de nuevo."
        action={{ label: "Reintentar", onClick: reset }}
      />
    </div>
  );
}
