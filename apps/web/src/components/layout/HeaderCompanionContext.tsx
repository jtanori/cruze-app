"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface HeaderCompanionContextValue {
  headerCompanion: ReactNode | null;
  setHeaderCompanion: (node: ReactNode | null) => void;
  headerTitle: string | null;
  setHeaderTitle: (title: string | null) => void;
}

const HeaderCompanionContext = createContext<HeaderCompanionContextValue | null>(null);

export function HeaderCompanionProvider({ children }: { children: ReactNode }) {
  const [headerCompanion, setHeaderCompanion] = useState<ReactNode | null>(null);
  const [headerTitle, setHeaderTitle] = useState<string | null>(null);
  return (
    <HeaderCompanionContext.Provider value={{ headerCompanion, setHeaderCompanion, headerTitle, setHeaderTitle }}>
      {children}
    </HeaderCompanionContext.Provider>
  );
}

export function useHeaderCompanion() {
  const ctx = useContext(HeaderCompanionContext);
  if (!ctx) throw new Error("useHeaderCompanion must be used under HeaderCompanionProvider");
  return ctx;
}
