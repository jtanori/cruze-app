"use client";

import { ReactNode } from "react";

interface SafeAreaWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * SafeAreaWrapper - Provides safe area insets for notched devices
 * Uses CSS env() variables for iOS safe area insets
 * Applies padding to prevent content from being obscured by notches, Dynamic Island, or home indicator
 */
export function SafeAreaWrapper({ children, className = "" }: SafeAreaWrapperProps) {
  return (
    <div className={`pt-safe pb-safe px-safe ${className}`}>
      {children}
    </div>
  );
}