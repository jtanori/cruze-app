import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DataDeltaProps {
  value: number;
  label?: string;
  variant?: "positive" | "negative" | "neutral";
  showIcon?: boolean;
  className?: string;
}

export function DataDelta({
  value,
  label,
  variant,
  showIcon = true,
  className = "",
}: DataDeltaProps) {
  const autoVariant = variant || (value > 0 ? "positive" : value < 0 ? "negative" : "neutral");

  const styles = {
    positive: "text-success",
    negative: "text-danger",
    neutral: "text-muted",
  };

  const icons = {
    positive: <TrendingUp className="w-3.5 h-3.5" />,
    negative: <TrendingDown className="w-3.5 h-3.5" />,
    neutral: <Minus className="w-3.5 h-3.5" />,
  };

  const prefix = value > 0 ? "+" : "";

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${styles[autoVariant]} ${className}`}>
      {showIcon && icons[autoVariant]}
      <span>{prefix}{value}{label ? ` ${label}` : ""}</span>
    </span>
  );
}
