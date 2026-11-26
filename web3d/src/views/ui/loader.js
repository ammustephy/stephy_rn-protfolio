/**
 * Loading screen: progress while the room is built, then an "Enter" button.
 * Pressing Enter starts the tour (the camera flies to the first stop).
 */
export function buildLoader(tour) {
  const root = document.getElementById('loader');
  const bar = document.getElementById('loader-bar');
  const status = document.getElementById('loader-status');
  const enter = document.getElementById('loader-enter');
  const progress = root.querySelector('[role="progressbar"]');

  enter.addEventListener('click', () => tour.start());
  tour.on('started', ({ deepLink }) => {
    if (deepLink) { root.hidden = true; return; } // deep links skip the fade
    root.classList.add('is-leaving');
    setTimeout(() => { root.hidden = true; }, 700);
  });

  return {
    progress(p, text) {
      const v = Math.round(p * 100);
      bar.style.transform = `scaleX(${p})`;
      progress.setAttribute('aria-valuenow', String(v));
      if (text) status.textContent = text;
    },
    ready() {
      root.classList.add('is-ready');
      enter.disabled = false;
      status.textContent = 'Ready';
      enter.focus({ preventScroll: true });
    },
    fail(msg) {
      status.textContent = msg;
      root.classList.add('is-error');
    },
  };
}
