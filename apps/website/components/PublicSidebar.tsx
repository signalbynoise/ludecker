"use client";

import {
  BRAND_NAME,
  BrandLogo,
  CONTACT_EMAIL,
  Footer,
  TEXT_BODY_CLASS,
} from "@ludecker/ui";
import { NAV_ITEMS } from "@ludecker/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import TextType from "@/components/react-bits/TextType/TextType";
import {
  INTRO_TEXT_TYPE_SPEED_MS,
  introSequenceEndMs,
  introTypingDelayMs,
} from "@/lib/intro-animation/constants";
import { useIntroAnimation } from "@/lib/intro-animation/IntroAnimationContext";
import { SiteNavActive } from "@/app/(public)/SiteNavActive";

function resolveActiveNavId(pathname: string): string | undefined {
  if (pathname === "/") return undefined;

  const match = NAV_ITEMS.find((item) => {
    if (pathname === item.href) return true;
    if (item.href !== "/" && pathname.startsWith(`${item.href}/`)) return true;
    if (pathname.startsWith(`/${item.articleType}/`)) return true;
    return false;
  });

  return match?.id;
}

function sidebarTypeSequence(): string[] {
  return [
    BRAND_NAME,
    ...NAV_ITEMS.map((item) => item.label),
    CONTACT_EMAIL,
  ];
}

function StaticSidebar() {
  return (
    <>
      <Link href="/">
        <BrandLogo />
      </Link>
      <SiteNavActive />
      <Footer />
    </>
  );
}

export function PublicSidebar() {
  const { phase, markSidebarComplete } = useIntroAnimation();
  const pathname = usePathname();
  const activeId = resolveActiveNavId(pathname);
  const sequence = useMemo(() => sidebarTypeSequence(), []);
  const emailDelayMs = introTypingDelayMs(sequence, sequence.length - 1);
  const playSidebarIntro = phase === "sidebar-typing";

  useEffect(() => {
    if (!playSidebarIntro) return;
    const timer = window.setTimeout(() => {
      markSidebarComplete();
    }, introSequenceEndMs(sequence));
    return () => window.clearTimeout(timer);
  }, [playSidebarIntro, markSidebarComplete, sequence]);

  if (!playSidebarIntro) {
    return <StaticSidebar />;
  }

  return (
    <div key="sidebar-intro">
      <Link href="/">
        <div className="brand-logo">
          <TextType
            as="span"
            text={BRAND_NAME}
            loop={false}
            showCursor={false}
            typingSpeed={INTRO_TEXT_TYPE_SPEED_MS}
            initialDelay={introTypingDelayMs(sequence, 0)}
            className={`${TEXT_BODY_CLASS} brand-logo__text`}
          />
        </div>
      </Link>
      <nav className="site-nav" aria-label="Site">
        <ul className="site-nav__list">
          {NAV_ITEMS.map((item, index) => {
            const isActive = item.id === activeId;
            const navIndex = index + 1;

            return (
              <li key={item.id} className="site-nav__item">
                <a
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? `${TEXT_BODY_CLASS} site-nav__link site-nav__link--active`
                      : `${TEXT_BODY_CLASS} site-nav__link`
                  }
                >
                  <TextType
                    as="span"
                    text={item.label}
                    loop={false}
                    showCursor={false}
                    typingSpeed={INTRO_TEXT_TYPE_SPEED_MS}
                    initialDelay={introTypingDelayMs(sequence, navIndex)}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <footer className="site-footer">
        <a
          className={`${TEXT_BODY_CLASS} site-footer__email`}
          href={`mailto:${CONTACT_EMAIL}`}
        >
          <TextType
            as="span"
            text={CONTACT_EMAIL}
            loop={false}
            showCursor={false}
            typingSpeed={INTRO_TEXT_TYPE_SPEED_MS}
            initialDelay={emailDelayMs}
          />
        </a>
      </footer>
    </div>
  );
}
