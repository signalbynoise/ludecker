"use client";

import type { ReactNode } from "react";
import AnimatedContent from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { useIntroAnimation } from "@/lib/intro-animation/IntroAnimationContext";

interface HomeIntroRevealProps {
  children: ReactNode;
}

export function HomeIntroReveal({ children }: HomeIntroRevealProps) {
  const { phase } = useIntroAnimation();

  if (phase === "static") {
    return children;
  }

  if (phase === "sidebar-typing") {
    return <div className="intro-reveal--pending">{children}</div>;
  }

  return (
    <AnimatedContent
      distance={48}
      duration={0.9}
      threshold={0}
      delay={0}
      className="home-intro-reveal"
    >
      {children}
    </AnimatedContent>
  );
}
