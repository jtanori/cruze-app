"use client";

interface LocationAcquisitionDotsProps {
  color?: "cruze-mint" | "cruze-green" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "w-1.5 h-1.5 gap-0.5",
  md: "w-2 h-2 gap-1",
  lg: "w-3 h-3 gap-1.5",
};

const COLOR_CLASSES = {
  "cruze-mint": "bg-cruze-mint",
  "cruze-green": "bg-cruze-green",
  white: "bg-white",
};

/**
 * LOC-ACQ-DOTS-01 — Inline three-dots loading animation
 * Used during location acquisition (L02) and in permission prompt after click (L01→L02)
 */
export function LocationAcquisitionDots({
  color = "cruze-mint",
  size = "md",
  className = "",
}: LocationAcquisitionDotsProps) {
  return (
    <div className={`flex ${SIZE_CLASSES[size]} ${className}`}>
      <span className={`${COLOR_CLASSES[color]} rounded-full animate-bounce`} style={{ animationDelay: "0ms" }} />
      <span className={`${COLOR_CLASSES[color]} rounded-full animate-bounce`} style={{ animationDelay: "150ms" }} />
      <span className={`${COLOR_CLASSES[color]} rounded-full animate-bounce`} style={{ animationDelay: "300ms" }} />
    </div>
  );
}