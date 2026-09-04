"use client";

import type { HTMLAttributes, ForwardedRef } from "react";
import { forwardRef } from "react";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: "open" | "limited" | "closed" | "unknown" | "live" | "recent" | "stale" | "unavailable";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  (
    {
      status,
      size = "md",
      showLabel: showLabelProp = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const statusConfig = {
      open: {
        bg: "bg-improving",
        text: "text-improving",
        soft: "bg-improving-soft text-improving",
        label: "Open",
        dotColor: "bg-cruze-green",
      },
      limited: {
        bg: "bg-caution",
        text: "text-caution",
        soft: "bg-caution-soft text-caution",
        label: "Limited",
        dotColor: "bg-cruze-amber",
      },
      closed: {
        bg: "bg-critical",
        text: "text-critical",
        soft: "bg-critical-soft text-critical",
        label: "Closed",
        dotColor: "bg-alert-red",
      },
      unknown: {
        bg: "bg-faint",
        text: "text-faint",
        soft: "bg-faint text-faint",
        label: "Unknown",
        dotColor: "bg-muted",
      },
      live: {
        bg: "bg-cruze-green/10",
        text: "text-cruze-green",
        soft: "bg-cruze-green/10 text-cruze-green",
        label: "LIVE",
        dotColor: "bg-cruze-green",
      },
      recent: {
        bg: "bg-improving-soft",
        text: "text-improving",
        soft: "bg-improving-soft text-improving",
        label: "Recent",
        dotColor: "bg-improving",
      },
      stale: {
        bg: "bg-caution-soft",
        text: "text-caution",
        soft: "bg-caution-soft text-caution",
        label: "Stale",
        dotColor: "bg-caution",
      },
      unavailable: {
        bg: "bg-muted",
        text: "text-muted",
        soft: "bg-muted text-muted",
        label: "Unavailable",
        dotColor: "bg-muted",
      },
    };

    const config = statusConfig[status] || statusConfig.unknown;
    const showLabelValue = showLabelProp !== false;

    const sizes = {
      sm: "px-2 py-1 min-h-[20px] text-xs",
      md: "px-2 py-0.5 text-xs",
      lg: "px-3 py-1 text-sm",
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.soft} ${sizes[size]} ${className}`}
        {...props}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} aria-hidden="true" />
        {showLabelValue && <span className="font-medium">{config.label}</span>}
      </span>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;
