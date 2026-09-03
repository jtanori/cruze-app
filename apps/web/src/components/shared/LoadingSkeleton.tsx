interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-elevated rounded-[var(--radius-md)] ${className}`}
      aria-hidden="true"
    />
  );
}

export function CrossingRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-28" />
        <LoadingSkeleton className="h-3 w-20" />
      </div>
      <LoadingSkeleton className="h-8 w-14" />
    </div>
  );
}

export function RecommendationCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-5 space-y-4">
      <div className="space-y-2">
        <LoadingSkeleton className="h-3 w-24" />
        <LoadingSkeleton className="h-5 w-32" />
      </div>
      <div className="flex gap-6">
        <div className="space-y-1">
          <LoadingSkeleton className="h-7 w-12" />
          <LoadingSkeleton className="h-3 w-16" />
        </div>
        <div className="space-y-1">
          <LoadingSkeleton className="h-7 w-12" />
          <LoadingSkeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="h-3 w-full" />
        <LoadingSkeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}
