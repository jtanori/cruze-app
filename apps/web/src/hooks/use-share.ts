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
    const shareUrl = url || window.location.href;
    const shareData = { title, text, url: shareUrl };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Avoid duplicating the link when the text already carries it
        // (e.g. crossing payloads end with the URL line).
        const body = text.includes(shareUrl)
          ? `${title}\n${text}`
          : `${title}\n${text}\n${shareUrl}`;
        await navigator.clipboard.writeText(body);
      }
    } catch {
      // User cancelled or clipboard failed — silently ignore
    }
  }, []);

  return { share };
}
