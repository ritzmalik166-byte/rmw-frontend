const EVENTS = ["scroll", "wheel", "touchstart", "pointerdown", "mousemove", "keydown"];

let interacted = false;
const listeners = new Set();

function fire() {
  if (interacted) return;
  interacted = true;
  EVENTS.forEach((type) => window.removeEventListener(type, fire, true));
  const pending = [...listeners];
  listeners.clear();
  pending.forEach((cb) => cb());
}

export function hasInteracted() {
  return interacted;
}

/**
 * Run `cb` once the visitor first scrolls, touches, clicks, types or moves the
 * mouse. Runs immediately if that already happened. Returns a cleanup function.
 */
export function onFirstInteraction(cb) {
  if (typeof window === "undefined") return () => {};
  if (interacted) {
    cb();
    return () => {};
  }
  if (listeners.size === 0) {
    EVENTS.forEach((type) =>
      window.addEventListener(type, fire, { capture: true, passive: true })
    );
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}
