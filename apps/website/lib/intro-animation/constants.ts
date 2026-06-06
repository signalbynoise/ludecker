/** Tab-scoped SSOT: intro has finished (survives layout remounts and HMR module resets). */
export const INTRO_SESSION_STORAGE_KEY = "ludecker:intro-played";

/** Set while the sidebar typewriter runs; prevents duplicate claims on layout remount. */
export const INTRO_IN_PROGRESS_STORAGE_KEY = "ludecker:intro-in-progress";
