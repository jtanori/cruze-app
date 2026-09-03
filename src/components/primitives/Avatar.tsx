"use client";

import type { HTMLAttributes, ForwardedRef } from "react";
import { forwardRef } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
  status?: "online" | "offline" | "busy" | "away";
  fallback?: React.ReactNode;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = "md",
      shape = "circle",
      status,
      fallback,
      className = "",
      ...props
    },
    ref
  ) => {
    const sizes = {
      xs: "w-6 h-6 text-xs",
      sm: "w-8 h-8 text-sm",
      md: "w-10 h-10 text-base",
      lg: "w-12 h-12 text-lg",
      xl: "w-16 h-16 text-xl",
    };

    const statusSizes = {
      xs: "w-2 h-2",
      sm: "w-2.5 h-2.5",
      md: "w-3 h-3",
      lg: "w-3.5 h-3.5",
      xl: "w-4 h-4",
    };

    const statusColors = {
      online: "bg-improving",
      offline: "bg-muted",
      busy: "bg-critical",
      away: "bg-caution",
    };

    const shapeClasses = {
      circle: "rounded-full",
      square: "rounded-[var(--radius-md)]",
    };

    return (
      <div
        ref={ref}
        className={`relative inline-flex ${sizes[size]} ${shapeClasses[shape]} ${className}`}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className="w-full h-full object-cover"
            {...props}
          />
        ) : (
          <div className="w-full h-full bg-surface-elevated flex items-center justify-center">
            {fallback || (
              <span className="text-faint font-medium">
                {name?.charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>
        )}
        {status && (
          <span
            className={`absolute bottom-0 right-0 ${statusSizes[size]} rounded-full border-2 border-midnight ${statusColors[status]}`}
            aria-label={status}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
