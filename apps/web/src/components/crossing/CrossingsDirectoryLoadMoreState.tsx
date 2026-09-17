"use client";

import { useTranslations } from "next-intl";
import { Spinner } from "@/components/primitives/Spinner";

interface CrossingsDirectoryLoadMoreStateProps {
  loadingMore: boolean;
  onLoadMore: () => void;
  className?: string;
}

/**
 * CR-DIR-09 — progressive loading control. Rendered only when hasMore.
 */
export function CrossingsDirectoryLoadMoreState({
  loadingMore,
  onLoadMore,
  className = "",
}: CrossingsDirectoryLoadMoreStateProps) {
  const t = useTranslations();
  return (
    <div className={`flex justify-center py-2 ${className}`} role="status">
      {loadingMore ? (
        <Spinner size="md" />
      ) : (
        <button
          onClick={onLoadMore}
          className="text-cruze-mint text-sm font-medium hover:underline min-h-[44px] px-4"
        >
          {t("crossings.directory.loadMore")}
        </button>
      )}
    </div>
  );
}
