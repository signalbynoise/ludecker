/** Normalize logo.svg for inline header use (theme via currentColor). */
export function normalizeLogoSvg(raw: string, className?: string): string {
  const classes = ['brand-logo__mark', className].filter(Boolean).join(' ');

  return raw
    .replace(/\s*width="[^"]*"/g, '')
    .replace(/\s*height="[^"]*"/g, '')
    .replace(/\sfill="(?:white|black)"/gi, ' fill="currentColor"')
    .replace(
      '<svg ',
      `<svg class="${classes}" aria-hidden="true" `,
    );
}
