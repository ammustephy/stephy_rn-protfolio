/**
 * Overlay navigation: Back / Next buttons, one dot per stop (with labels),
 * the first-screen hint and a live region announcing the current section.
 * Listens to the TourViewModel; never touches three.js.
 */
export function buildNav(tour, { onHash = true } = {}) {
  const nav = document.getElementById('tour-nav');
  const list = document.getElementById('dots');
  const prev = document.getElementById('btn-prev');
  const next = document.getElementById('btn-next');
  const hint = document.getElementById('hint');
  const label = document.getElementById('stop-label');
  const live = document.getElementById('announcer');

  const dots = tour.stops.map((s, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot-btn';
    b.dataset.i = String(i);
    b.setAttribute('aria-label', `Go to ${s.label}`);
    b.innerHTML = `<span class="dot" aria-hidden="true"></span><span class="lbl">${s.label}</span>`;
    b.addEventListener('click', () => tour.goTo(i));
    li.appendChild(b); list.appendChild(li);
    return b;
  });

  prev.addEventListener('click', () => tour.prev());
  next.addEventListener('click', () => tour.next());

  let moved = false;
  const render = () => {
    const i = tour.index;
    dots.forEach((b, k) => {
      if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    prev.disabled = !tour.canPrev;
    next.disabled = !tour.canNext;
    nav.classList.toggle('is-busy', tour.busy);
    const s = tour.current;
    if (label) label.textContent = s ? `${i + 1} / ${tour.stops.length} · ${s.label}` : '';
  };

  tour.on('started', () => document.body.classList.add('is-started'));
  tour.on('change', ({ stop, index, from }) => {
    if (from >= 0) moved = true; // the hint only shows until the first move
    hint.hidden = moved || index !== 0;
    if (live) live.textContent = `${stop.title}. Section ${index + 1} of ${tour.stops.length}.`;
    if (onHash) {
      const h = '#' + stop.id;
      if (location.hash !== h) history.replaceState(null, '', h);
    }
    render();
  });
  tour.on('busy', render);
  render();

  window.addEventListener('hashchange', () => {
    const id = location.hash.replace(/^#/, '').split('&')[0];
    if (id && tour.started) tour.goTo(id, { force: true });
  });
}
