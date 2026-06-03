/** React Bits TextType cadence for sidebar intro sequence. */
export const INTRO_TEXT_TYPE_SPEED_MS = 50;

/** Pause after each typed string before the next sidebar item starts. */
export const INTRO_TEXT_TYPE_GAP_MS = 120;

/** Tab-scoped SSOT: intro has finished (survives layout remounts and HMR module resets). */
export const INTRO_SESSION_STORAGE_KEY = "ludecker:intro-played";

/** Set while the sidebar typewriter runs; prevents duplicate claims on layout remount. */
export const INTRO_IN_PROGRESS_STORAGE_KEY = "ludecker:intro-in-progress";

export function introTypingDurationMs(
  text: string,
  speedMs = INTRO_TEXT_TYPE_SPEED_MS,
): number {
  return text.length * speedMs + INTRO_TEXT_TYPE_GAP_MS;
}

export function introTypingDelayMs(
  texts: readonly string[],
  index: number,
  speedMs = INTRO_TEXT_TYPE_SPEED_MS,
): number {
  return texts
    .slice(0, index)
    .reduce((total, value) => total + introTypingDurationMs(value, speedMs), 0);
}

/** When the last string in a TextType sequence finishes typing. */
export function introSequenceEndMs(
  texts: readonly string[],
  speedMs = INTRO_TEXT_TYPE_SPEED_MS,
): number {
  const lastIndex = Math.max(0, texts.length - 1);
  const lastText = texts[lastIndex] ?? "";
  return (
    introTypingDelayMs(texts, lastIndex, speedMs) + lastText.length * speedMs
  );
}
