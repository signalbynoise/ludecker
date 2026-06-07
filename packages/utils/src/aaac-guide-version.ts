/** Matches pinned semver installs; never matches `@latest`. */
const AAAC_VERSION_PIN_PATTERN =
  /@ludecker\/aaac@(?!latest)(\d+\.\d+\.\d+)/g;

export function replaceAaacPackageVersionPins(
  content: string,
  version: string,
): string {
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Invalid AAAC semver: ${version}`);
  }

  return content.replace(AAAC_VERSION_PIN_PATTERN, `@ludecker/aaac@${version}`);
}

export function quickStartGuideNeedsAaacVersionSync(
  content: string,
  version: string,
): boolean {
  return replaceAaacPackageVersionPins(content, version) !== content;
}
