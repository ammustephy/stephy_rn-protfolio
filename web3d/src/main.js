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

  // "Text version" toggle: shows the plain HTML page instead of the room
  const toggle = document.getElementById('text-toggle');
  toggle.addEventListener('click', () => {
    const on = document.documentElement.classList.toggle('show-text');
    toggle.setAttribute('aria-pressed', String(on));
    toggle.textContent = on ? '3D room' : 'Text version';
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

  let scene;
  try {
    const { SceneView } = await import('./views/scene/sceneView.js');
    const canvas = document.getElementById('gl');
    scene = new SceneView(canvas, quality);
    await scene.build(content, (p, t) => loader.progress(p, t));
  } catch (err) {
    console.warn('3D room could not be built:', err);
    showPlainVersion('The 3D room could not load (no connection to the 3D library?), so here is the plain version.');
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
  });

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
  let last = performance.now(), time = 0;
  const frame = (now) => {
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
  window.__room = { tour, detail, scene }; // handy for debugging in the console

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
