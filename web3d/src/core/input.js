/**
 * Turns wheel, touch swipes and keys into "next stop" / "previous stop".
 *
 * One wheel notch or one swipe = one move. Wheel bursts (trackpad inertia)
 * are swallowed: after a wheel move, wheel input stays locked until the
 * camera has arrived AND the wheel has been quiet for a moment.
 */
export function bindInput({ tour, detail, target = window }) {
  let wheelLocked = false, quietTimer = 0;
  const QUIET_MS = 220;

  const unlockWhenQuiet = () => {
    clearTimeout(quietTimer);
    quietTimer = setTimeout(function check() {
      if (tour.busy) { quietTimer = setTimeout(check, 80); return; }
      wheelLocked = false;
    }, QUIET_MS);
  };

  const textMode = () => document.documentElement.classList.contains('show-text');
  const blocked = () => detail.isOpen || !tour.started || textMode();

  target.addEventListener('wheel', (e) => {
    if (detail.isOpen || textMode()) return; // let the modal / text version scroll
    e.preventDefault();
    if (!tour.started) return;
    if (wheelLocked) { unlockWhenQuiet(); return; }
    const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(d) < 2) return;
    if (tour.busy) return;
    const moved = d > 0 ? tour.next() : tour.prev();
    if (moved) { wheelLocked = true; unlockWhenQuiet(); }
  }, { passive: false });

  // touch: one swipe = one move (finger up = next, like scrolling a page)
  let t0 = null;
  target.addEventListener('touchstart', (e) => {
    if (blocked() || e.touches.length !== 1) { t0 = null; return; }
    t0 = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: performance.now() };
  }, { passive: true });
  target.addEventListener('touchmove', (e) => {
    if (!blocked() && t0 && e.cancelable) e.preventDefault(); // no pull-to-refresh / page bounce
  }, { passive: false });
  target.addEventListener('touchend', (e) => {
    if (!t0 || blocked()) return;
    const tt = e.changedTouches[0];
    const dx = tt.clientX - t0.x, dy = tt.clientY - t0.y, dt = performance.now() - t0.t;
    t0 = null;
    if (dt > 900) return;
    const vertical = Math.abs(dy) >= Math.abs(dx);
    const d = vertical ? dy : dx;
    if (Math.abs(d) < 40) return;
    if (tour.busy) return;
    if (d < 0) tour.next(); else tour.prev();
  }, { passive: true });

  target.addEventListener('keydown', (e) => {
    if (detail.isOpen || textMode() || e.altKey || e.ctrlKey || e.metaKey) return;
    const el = document.activeElement;
    const onControl = el && el !== document.body && /^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
    const k = e.key;
    if (!tour.started) return;
    if ((k === 'Enter' || k === ' ') && onControl) return; // let the focused control handle it
    let handled = true;
    if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') tour.next();
    else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp') tour.prev();
    else if (k === 'Home') tour.goTo(0);
    else if (k === 'End') tour.goTo(tour.stops.length - 1);
    else handled = false;
    if (handled) e.preventDefault();
  });
}
