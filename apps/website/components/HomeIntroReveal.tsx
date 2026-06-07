"use client";

import type { ReactNode } from "react";
import { useIntroAnimation } from "@/lib/intro-animation/IntroAnimationContext";

interface HomeIntroRevealProps {
  children: ReactNode;
}

export function HomeIntroReveal({ children }: HomeIntroRevealProps) {
  const { phase } = useIntroAnimation();

  const hostClass = [
    "home-intro-reveal-host",
    phase === "sidebar-typing" && "intro-reveal--pending",
    phase === "sidebar-done" && "home-intro-reveal-host--animate",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={hostClass}>{children}</div>;
}
