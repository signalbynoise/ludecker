import { cn } from './lib/utils';

export interface NpmLogoMarkProps {
  className?: string;
}

/** npm logomark — n shape only, no background; inherits theme via currentColor. */
export function NpmLogoMark({ className }: NpmLogoMarkProps) {
  return (
    <svg
      className={cn('npm-downloads-banner__logo', className)}
      viewBox="0 0 80 80"
      aria-hidden="true"
    >
      <path
        d="M15 15H65V65H55V25H40V65H15V15Z"
        fill="currentColor"
      />
    </svg>
  );
}
