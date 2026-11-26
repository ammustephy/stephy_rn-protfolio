/**
 * Detail modal for a project or a job, with a screenshot gallery.
 * Real DOM dialog: focus moves in and is trapped, Esc closes, focus returns
 * to where it was. Screenshots load only when the modal opens.
 * Listens to the DetailViewModel.
 */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function buildModal(detail) {
  const root = document.getElementById('modal');
  const panel = root.querySelector('.modal-panel');
  const body = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCount = document.getElementById('lb-count');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  const lbClose = document.getElementById('lb-close');
  let returnFocus = null, shownItem = null, thumbButtons = [], lastImage = 0;

  closeBtn.addEventListener('click', () => detail.close());
  root.addEventListener('mousedown', (e) => { if (e.target === root) detail.close(); });
  lbPrev.addEventListener('click', () => detail.prevImage());
  lbNext.addEventListener('click', () => detail.nextImage());
  lbClose.addEventListener('click', () => detail.closeImage());
  lb.addEventListener('mousedown', (e) => { if (e.target === lb) detail.closeImage(); });

  // swipe left/right in the lightbox
  let sx = null;
  lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) { if (dx < 0) detail.nextImage(); else detail.prevImage(); }
  }, { passive: true });

  const focusables = () => {
    const scope = lb.hidden ? panel : lb;
    return [...scope.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled && el.offsetParent !== null);
  };

  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      if (detail.imageIndex >= 0) detail.closeImage(); else detail.close();
      return;
    }
    if (detail.imageIndex >= 0 && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault();
      if (e.key === 'ArrowRight') detail.nextImage(); else detail.prevImage();
      return;
    }
    if (e.key === 'Tab') {
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function renderProject(p) {
    const shots = p.screenshots.map((s, i) => `
      <li><button type="button" class="thumb" data-i="${i}" aria-label="View screenshot ${i + 1} of ${p.screenshots.length}: ${esc(s.alt)}">
        <img data-src="${esc(s.thumb)}" alt="" width="120" height="${p.coverKind === 'wide' ? 64 : 244}" decoding="async">
      </button></li>`).join('');
    return `
      <p class="eyebrow" style="--c:${p.color}">Project</p>
      <h2 id="modal-title">${esc(p.title)}</h2>
      <p class="sub">${esc(p.tagline)}</p>
      <p>${esc(p.description)}</p>
      <h3>Key features</h3>
      <ul class="features">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      <h3>Tech stack</h3>
      <ul class="stack">${p.techStack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      ${p.conclusion ? `<p class="conclusion">${esc(p.conclusion)}</p>` : ''}
      <h3>Screenshots <span class="count">(${p.screenshots.length})</span></h3>
      <ul class="gallery ${p.coverKind === 'wide' ? 'wide' : ''}">${shots}</ul>`;
  }

  function renderJob(j) {
    return `
      <p class="eyebrow" style="--c:${j.color}">Experience</p>
      <h2 id="modal-title">${esc(j.role)}</h2>
      <dl class="facts">
        <div><dt>Company</dt><dd>${esc(j.company)}</dd></div>
        <div><dt>Location</dt><dd>${esc(j.location)}</dd></div>
        <div><dt>Dates</dt><dd>${esc(j.dates)}</dd></div>
      </dl>
      <h3>What I did</h3>
      <ul class="features">${j.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  }

  function showLightbox(p, i) {
    const s = p.screenshots[i];
    lb.hidden = false;
    lbImg.classList.add('loading');
    lbImg.onload = () => lbImg.classList.remove('loading');
    lbImg.src = s.src;
    lbImg.alt = `${p.title} — ${s.alt}`;
    lbCount.textContent = `${i + 1} / ${p.screenshots.length}`;
    // preload neighbours
    for (const k of [i + 1, i - 1]) { const n = p.screenshots[(k + p.screenshots.length) % p.screenshots.length]; const im = new Image(); im.src = n.src; }
    if (!lb.contains(document.activeElement)) lbClose.focus();
  }

  detail.on('change', ({ kind, item, imageIndex }) => {
    if (!kind) {
      root.hidden = true; lb.hidden = true; lbImg.removeAttribute('src');
      document.body.classList.remove('modal-open');
      shownItem = null;
      if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
      returnFocus = null;
      return;
    }
    if (item !== shownItem) {
      if (!shownItem) returnFocus = document.activeElement;
      shownItem = item;
      body.innerHTML = kind === 'project' ? renderProject(item) : renderJob(item);
      root.setAttribute('aria-label', kind === 'project' ? `Project: ${item.title}` : `${item.role} at ${item.company}`);
      thumbButtons = [...body.querySelectorAll('.thumb')];
      // lazy: images get their src only now that the modal is open
      for (const img of body.querySelectorAll('img[data-src]')) { img.loading = 'lazy'; img.src = img.dataset.src; }
      thumbButtons.forEach((b) => b.addEventListener('click', () => detail.showImage(+b.dataset.i)));
      root.hidden = false;
      document.body.classList.add('modal-open');
      panel.scrollTop = 0;
      closeBtn.focus();
    }
    if (imageIndex >= 0) showLightbox(item, imageIndex);
    else if (!lb.hidden) {
      lb.hidden = true;
      const t = thumbButtons[lastImage];
      if (t) t.focus(); else closeBtn.focus();
    }
    if (imageIndex >= 0) lastImage = imageIndex;
  });
}
