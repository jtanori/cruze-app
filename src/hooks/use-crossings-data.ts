import { useState, useEffect } from "react";
import { getMergedCrossingsData, type MergedCrossingData } from "@/lib/border-data-service";

/**
 * Hook to load merged crossing data (static + live CBP).
 * Handles loading state and error handling.
 *
 * Replaces the duplicated fetch pattern in crossings, favorites, and alerts pages.
 */
export function useCrossingsData() {
  const [crossings, setCrossings] = useState<MergedCrossingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await getMergedCrossingsData();
        if (!cancelled) {
          setCrossings(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load crossings");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { crossings, loading, error };
}
