import { useCallback } from "react";

interface ShareOptions {
  title: string;
  text: string;
  url?: string;
}

/**
 * Share content via Web Share API or clipboard fallback.
 * Consolidates the share handler pattern from 3 files.
 */
export function useShare() {
  const share = useCallback(async ({ title, text, url }: ShareOptions) => {
    const shareData = { title, text, url: url || window.location.href };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${title}\n${text}\n${shareData.url}`);
      }
    } catch {
      // User cancelled or clipboard failed — silently ignore
    }
  }, []);

  return { share };
}
