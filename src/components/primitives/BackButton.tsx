"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

export function BackButton({
  onClick,
  label = "Back",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 px-3 py-2
        text-sm font-medium text-muted hover:text-ink
        rounded-[var(--radius-md)] hover:bg-surface-elevated
        transition-colors min-h-[44px]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint/50
        ${className}
      `}
      aria-label={label}
    >
      <ArrowLeft className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
