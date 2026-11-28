/*
 * Bootstrap only: wires models → viewmodels → views. No scene code here.
 */
import * as content from './data/content.js';
import { TourViewModel } from './viewmodels/TourViewModel.js';
import { DetailViewModel } from './viewmodels/DetailViewModel.js';
import { renderFullText } from './views/ui/fulltext.js';
import { buildNav } from './views/ui/nav.js';
import { buildModal } from './views/ui/modal.js';
import { buildLoader } from './views/ui/loader.js';
import { buildActions } from './views/ui/actions.js';
import { bindInput } from './core/input.js';
import { themeFromUrl, loadTheme } from './views/scene/themes/index.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** "#projects&open=wallflow&img=2" → {stop, open, img} */
function parseHash() {
  const [stop, ...rest] = location.hash.replace(/^#/, '').split('&');
  const params = new URLSearchParams(rest.join('&'));
  return { stop: stop || null, open: params.get('open'), img: params.has('img') ? Number(params.get('img')) : null };
}

function showPlainVersion(reason) {
  document.documentElement.classList.add('no-webgl');
  const note = document.getElementById('fallback-note');
  if (note && reason) note.textContent = reason;
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

/** Space the overlay takes on each side, so the camera frames content in the free area. */
function insets() {
  const W = window.innerWidth, H = window.innerHeight;
  const top = document.getElementById('topbar').getBoundingClientRect();
  const nav = document.getElementById('tour-nav').getBoundingClientRect();
  const bottom = document.getElementById('bottombar').getBoundingClientRect();
  const vertical = nav.height > nav.width; // desktop: column on the right
  return {
    top: top.bottom + 4,
    right: vertical ? W - nav.left + 8 : 10,
    bottom: H - Math.min(bottom.top, vertical ? H : nav.top) + 4,
    left: vertical ? 20 : 10,
  };
}

function openLink(region) {
  if (!region || !region.href) return;
  if (region.download) {
    const a = document.createElement('a');
    a.href = region.href; a.download = ''; document.body.appendChild(a); a.click(); a.remove();
  } else if (/^(mailto|tel):/.test(region.href)) {
    window.location.href = region.href;
  } else {
    window.open(region.href, '_blank', 'noopener');
  }
}

async function main() {
  document.getElementById('fulltext').innerHTML = renderFullText(content);

  // 3D world: "phone" by default, the original room only with ?theme=room (see views/scene/themes/index.js)
  const themeName = themeFromUrl();
  document.documentElement.dataset.theme = themeName;
  const themePromise = loadTheme(themeName).catch((err) => ({ error: err }));
  const meta = themeName === 'room'
    ? { kicker: 'Developer room', loading: 'Loading the 3D room', viewLabel: '3D room' }
    : { kicker: 'Inside a phone', loading: 'Loading the 3D portfolio', viewLabel: '3D view' };
  const kicker = document.querySelector('.loader-kicker');
  if (kicker) kicker.textContent = meta.kicker;
  const bar = document.querySelector('#loader [role="progressbar"]');
  if (bar) bar.setAttribute('aria-label', meta.loading);

  // "Text version" toggle: shows the plain HTML page instead of the 3D view
  const toggle = document.getElementById('text-toggle');
  toggle.addEventListener('click', () => {
    const on = document.documentElement.classList.toggle('show-text');
    toggle.setAttribute('aria-pressed', String(on));
    toggle.textContent = on ? meta.viewLabel : 'Text version';
    window.scrollTo(0, 0);
  });

  if (!hasWebGL()) { showPlainVersion('Your browser cannot show 3D graphics, so here is the plain version.'); return; }

  const tour = new TourViewModel(content.stops);
  const detail = new DetailViewModel(content.projects, content.jobs);
  const loader = buildLoader(tour);
  buildNav(tour);
  buildActions(tour, detail, content);
  buildModal(detail);
  bindInput({ tour, detail });

  const phone = window.matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820;
  const params = new URLSearchParams(location.search);
  // Bloom costs ~3x the frame time on integrated GPUs (measured on Intel UHD), so it is opt-in: ?bloom=1
  const quality = { phone, bloom: !phone && params.get('bloom') === '1' };

  let scene, themeMeta;
  try {
    const mod = await themePromise;
    if (mod.error) throw mod.error;
    themeMeta = mod.meta;
    const canvas = document.getElementById('gl');
    scene = new mod.Theme(canvas, quality);
    await scene.build(content, (p, t) => loader.progress(p, t));
  } catch (err) {
    console.warn('3D view could not be built:', err);
    showPlainVersion((themeMeta && themeMeta.failNote) || 'The 3D view could not load (no connection to the 3D library?), so here is the plain version.');
    return;
  }

  const { CameraRig } = await import('./core/cameraRig.js');
  const { Picking } = await import('./core/picking.js');

  const rig = new CameraRig(scene.camera, tour, {
    shotFor: (id) => scene.shotFor(id),
    introShot: () => scene.introShot(),
    insets,
    reducedMotion,
    bounds: scene.cameraBounds,
    pathControl: scene.pathControl ? (a, b, fromId, toId) => scene.pathControl(a, b, fromId, toId) : null,
  });
  if (scene.attach) scene.attach({ tour, rig, reducedMotion });

  const picking = new Picking(document.getElementById('gl'), scene.camera, {
    getTargets: () => scene.clickables,
    enabled: () => tour.started && !detail.isOpen,
    onHover: (info, region) => scene.setContactHover(info && info.type === 'regions' && region ? region.id : null),
    onClick: (info, region) => {
      if (info.type === 'job') detail.openJob(info.id);
      else if (info.type === 'project') detail.openProject(info.id);
      else if (info.type === 'regions') openLink(region);
    },
  });

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    rig.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      scene.resize();
      if (scene.setLayout(scene.modeForViewport())) picking.reset();
      rig.refresh();
    }, 120);
  });

  // render loop
  let last = performance.now(), time = 0, running = true;
  const frame = (now) => {
    if (!running) return;
    const raw = (now - last) / 1000; last = now;
    const dt = Math.min(0.05, raw);
    time += dt;
    rig.update(Math.min(0.25, raw)); // moves keep their real duration even when frames drop
    picking.update(dt);
    scene.update(time);
    scene.render();
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  window.__room = { tour, detail, scene, theme: themeName }; // handy for debugging in the console
  // teardown: stop the loop and free GPU memory when the page is really unloaded (not when it goes into the back/forward cache)
  window.addEventListener('pagehide', (e) => { if (e.persisted || !scene.dispose) return; running = false; scene.dispose(); });

  loader.ready();

  // deep link: #skills jumps straight there; #projects&open=wallflow&img=0 also opens the modal
  const h = parseHash();
  if (h.stop && tour.indexOf(h.stop) >= 0) {
    tour.start(h.stop);
    if (h.open) {
      const ok = detail.openProject(h.open) || detail.openJob(h.open);
      if (ok && h.img !== null) detail.showImage(h.img);
    }
  }
}

main();
