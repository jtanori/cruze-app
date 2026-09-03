import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Reusable empty state display with icon, title, and description.
 * Consolidates the empty state pattern from favorites and alerts pages.
 */
export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-8 py-32">
      <div className="w-16 h-16 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
        <Icon className="w-7 h-7 text-faint" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-ink text-sm font-medium">{title}</p>
        <p className="text-muted text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
