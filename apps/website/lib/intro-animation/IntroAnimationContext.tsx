"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { claimIntroSlot, markIntroPlayed } from "./intro-session";

/** Sidebar + home intro orchestration (client-only). */
type IntroPhase = "static" | "sidebar-typing" | "sidebar-done";

interface IntroAnimationContextValue {
  phase: IntroPhase;
  markSidebarComplete: () => void;
}

const IntroAnimationContext = createContext<IntroAnimationContextValue | null>(
  null,
);

export function IntroAnimationProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("static");

  useEffect(() => {
    const shouldPlay = claimIntroSlot();
    if (shouldPlay) {
      setPhase("sidebar-typing");
    }
  }, []);

  const markSidebarComplete = useCallback(() => {
    markIntroPlayed();
    setPhase("sidebar-done");
  }, []);

  const value = useMemo(
    () => ({
      phase,
      markSidebarComplete,
    }),
    [phase, markSidebarComplete],
  );

  return (
    <IntroAnimationContext.Provider value={value}>
      {children}
    </IntroAnimationContext.Provider>
  );
}

export function useIntroAnimation(): IntroAnimationContextValue {
  const context = useContext(IntroAnimationContext);
  if (!context) {
    throw new Error(
      "useIntroAnimation must be used within IntroAnimationProvider",
    );
  }
  return context;
}
