import {
  INTRO_IN_PROGRESS_STORAGE_KEY,
  INTRO_SESSION_STORAGE_KEY,
} from "./constants";

/**
 * Intro animation session state machine (client-only).
 *
 * | Phase     | Meaning                                      |
 * |-----------|----------------------------------------------|
 * | eligible  | Tab has not played intro yet (may animate)   |
 * | claimed   | Slot claimed; sidebar typewriter may run       |
 * | played    | Intro finished; static chrome for this tab    |
 *
 * Transitions:
 * - Full load (navigate): eligible → claimed on claimIntroSlot()
 * - Reload / hard refresh: reset storage → eligible → claimed
 * - Client navigation (layout remount): storage=played → stay played
 * - markIntroPlayed(): claimed → played
 */

const PLAYED_VALUE = "1";

function hasSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

function clearIntroSessionFlags(): void {
  if (!hasSessionStorage()) return;
  sessionStorage.removeItem(INTRO_SESSION_STORAGE_KEY);
  sessionStorage.removeItem(INTRO_IN_PROGRESS_STORAGE_KEY);
}

function isIntroPlayedInTab(): boolean {
  if (!hasSessionStorage()) return false;
  return sessionStorage.getItem(INTRO_SESSION_STORAGE_KEY) === PLAYED_VALUE;
}

function setIntroPlayedInTab(): void {
  if (!hasSessionStorage()) return;
  sessionStorage.setItem(INTRO_SESSION_STORAGE_KEY, PLAYED_VALUE);
  sessionStorage.removeItem(INTRO_IN_PROGRESS_STORAGE_KEY);
}

function setIntroInProgressInTab(): void {
  if (!hasSessionStorage()) return;
  sessionStorage.setItem(INTRO_IN_PROGRESS_STORAGE_KEY, PLAYED_VALUE);
}

function isIntroInProgressInTab(): boolean {
  if (!hasSessionStorage()) return false;
  return (
    sessionStorage.getItem(INTRO_IN_PROGRESS_STORAGE_KEY) === PLAYED_VALUE
  );
}

/** Clear played flag on reload so hard refresh can replay the intro. */
function resetIntroSessionOnReload(): void {
  if (!hasSessionStorage()) return;

  const entry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  if (entry?.type === "reload") {
    clearIntroSessionFlags();
  }
}

/**
 * Returns true only the first time per tab session (until reload).
 * Claims immediately so remounted layouts cannot replay.
 */
export function claimIntroSlot(): boolean {
  if (!hasSessionStorage()) return false;

  resetIntroSessionOnReload();

  if (isIntroPlayedInTab() || isIntroInProgressInTab()) {
    return false;
  }

  setIntroInProgressInTab();
  return true;
}

/** Idempotent; call when sidebar sequence finishes (or is skipped). */
export function markIntroPlayed(): void {
  setIntroPlayedInTab();
}

