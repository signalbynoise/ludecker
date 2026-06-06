import { TEXT_BODY_CLASS } from "@ludecker/ui";

export function PagePending() {
  return (
    <div className={TEXT_BODY_CLASS} aria-busy="true" aria-live="polite">
      Loading…
    </div>
  );
}
