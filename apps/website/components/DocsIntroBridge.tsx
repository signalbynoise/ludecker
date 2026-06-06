'use client';

import { useEffect } from 'react';
import { useIntroAnimation } from '@/lib/intro-animation/IntroAnimationContext';

/** Completes the sidebar intro phase — nav no longer uses typing animation. */
export function DocsIntroBridge() {
  const { phase, markSidebarComplete } = useIntroAnimation();

  useEffect(() => {
    if (phase === 'sidebar-typing') {
      markSidebarComplete();
    }
  }, [phase, markSidebarComplete]);

  return null;
}
