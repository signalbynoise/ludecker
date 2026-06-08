'use client';

import { ButtonLink } from './ButtonLink';
import { NpmLogoMark } from './NpmLogoMark';

export interface NpmDownloadsBannerProps {
  href: string;
  packageLabel: string;
  weeklyDownloads: number | null;
  isLoading?: boolean;
}

function formatWeeklyDownloads(count: number): string {
  return new Intl.NumberFormat('en-US').format(count);
}

export function NpmDownloadsBanner({
  href,
  packageLabel,
  weeklyDownloads,
  isLoading = false,
}: NpmDownloadsBannerProps) {
  if (!isLoading && weeklyDownloads === null) {
    return null;
  }

  const displayCount =
    weeklyDownloads === null ? '—' : formatWeeklyDownloads(weeklyDownloads);

  return (
    <ButtonLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variant="ghost"
      size="sm"
      className="npm-downloads-banner"
      aria-label={`${packageLabel} weekly npm downloads: ${displayCount}`}
    >
      <NpmLogoMark />
      <span className="npm-downloads-banner__count">{displayCount}</span>
      <span className="npm-downloads-banner__suffix">/ wk</span>
    </ButtonLink>
  );
}
