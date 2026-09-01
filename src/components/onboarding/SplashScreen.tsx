"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 200);
    }, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Cruze Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-brand flex items-center justify-center">
          <svg
            viewBox="0 0 40 40"
            className="w-10 h-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 28 L20 12 L32 28"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 28 L20 16 L28 28"
              stroke="#43D69A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-ink text-xl font-bold tracking-tight">
          Cruze
        </span>
      </div>

      <span className="text-muted text-xs font-medium uppercase tracking-wider">
        Border Intelligence
      </span>
    </div>
  );
}
