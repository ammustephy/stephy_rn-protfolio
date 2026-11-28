import * as THREE from 'three';
import { RendererView } from '../../renderer.js';
import { rrPlane, mesh, shapeRR } from '../../geometry.js';
import { mkCanvas, canvasTex } from '../../canvasText.js';
import { clickable } from '../../boards/common.js';
import { buildPhone, PHONE } from './device.js';
import { buildWorld, skyDome, FLOOR } from './world.js';
import { APPS, DRAW } from './apps.js';

/*
 * "Inside a phone" theme (the default).
 *
 * Home: a giant floating smartphone in a pastel sky. Moving on flies the camera
 * through its screen (brief fade) into a world of rounded app icons. Every
 * later stop is a big app on a pedestal that opens into an app window when
 * the camera arrives.
 *
 * Same interface as the room (see ../index.js).
 */
export const meta = {
  id: 'phone',
  kicker: 'Inside a phone',
  loading: 'Loading the 3D portfolio',
  viewLabel: '3D view',
  failNote: 'The 3D view could not load (no connection to the 3D library?), so here is the plain version.',
};

const nextFrame = () => new Promise((r) => setTimeout(r, 16));
const smooth = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Texture pixels per world unit for the app windows (crisp at the framing size). */
const PPU = 120;
const SECTION_IDS = ['about', 'skills', 'experience', 'projects', 'education', 'contact'];
const SPACING = 36;
const X = { about: 0, skills: -7, experience: 7, projects: -7, education: 7, contact: -7 };
/** Window sizes (w, h in world units): landscape for wide screens, portrait for phones. */
const SIZE = {
  wide: { about: [17, 10.4], skills: [17.6, 10.8], experience: [17, 10.4], projects: [18, 10.8], education: [16.4, 9.8], contact: [17, 10.2] },
  narrow: { about: [9.6, 16.6], skills: [9.6, 17.4], experience: [9.6, 16.8], projects: [9.6, 17.2], education: [9.6, 15.4], contact: [9.6, 16.8] },
};
const ICON_Y = FLOOR + 4.4;

function own(m) { m.userData.own = true; return m; }

export class Theme {
  constructor(canvas, quality) {
    this.quality = quality;
    this.rv = new RendererView(canvas, quality);
    this.rv.renderer.shadowMap.enabled = false; // contact shadows are baked textures, no shadow maps
    this.rv.renderer.toneMappingExposure = 1.05;
    this.scene = this.rv.scene;
    this.scene.background = new THREE.Color('#efe6f6');
    this.camera = this.rv.camera;
    this.camera.near = 0.4; this.camera.far = 1400;
    this.camera.updateProjectionMatrix();
    this.scene.add(this.camera); // for the fade plane
    this.mode = null;
    this.windows = {};
    this.lastTime = 0;
    this.tour = null; this.rig = null; this.reduced = false;
  }

  async build(content, onProgress = () => {}) {
    this.content = content;
    onProgress(0.03, 'Loading fonts');
    if (document.fonts && document.fonts.load) {
      const faces = ['800 40px Inter', '700 40px Inter', '600 40px Inter', '500 40px Inter'];
      await Promise.race([Promise.all(faces.map((f) => document.fonts.load(f).catch(() => null))), new Promise((r) => setTimeout(r, 3500))]);
    }
    onProgress(0.12, 'Loading project covers');
    const imgs = await Promise.all(content.projects.map((p) => loadImage(p.cover)));
    this.images = Object.fromEntries(content.projects.map((p, i) => [p.id, imgs[i]]));

    onProgress(0.3, 'Polishing the phone'); await nextFrame();
    const sc = this.scene;
    sc.add(skyDome());
    sc.fog = new THREE.Fog('#eee3f5', 80, 300);
    sc.add(new THREE.HemisphereLight('#ffffff', '#cdbfe8', 1.0));
    const sun = new THREE.DirectionalLight('#fff3e8', 1.7); sun.position.set(18, 40, 30); sc.add(sun);
    const rim = new THREE.DirectionalLight('#dcd2ff', 0.7); rim.position.set(-30, 10, -20); sc.add(rim);
    this.phone = buildPhone(sc, content);

    onProgress(0.5, 'Placing the apps'); await nextFrame();
    this.sections = SECTION_IDS.map((id, i) => {
      const at = new THREE.Vector3(X[id], ICON_Y, -42 - i * SPACING);
      // keep the icon field away from the window and the camera's corridor (largest window of both layouts)
      const hw = Math.max(SIZE.wide[id][0], SIZE.narrow[id][0]) / 2 + 4.5;
      return { id, app: APPS[id], at, clear: [at.x - hw, at.x + hw, at.z - 5, at.z + SPACING + 2] };
    });
    this.world = buildWorld(sc, this.sections);

    // fade plane in front of the camera for the moment it passes through the glass
    this.fadeMat = own(new THREE.MeshBasicMaterial({ color: '#f8f2ff', transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false, toneMapped: false }));
    this.fade = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), this.fadeMat);
    this.fade.position.z = -0.6; this.fade.renderOrder = 999; this.fade.visible = false;
    this.camera.add(this.fade);

    onProgress(0.7, 'Opening the apps'); await nextFrame();
    this.setLayout(this.modeForViewport());
    onProgress(0.88, 'Warming up the GPU'); await nextFrame();
    this.resize();
    this.update(0);
    this.rv.renderer.compile(this.scene, this.camera);
    onProgress(1, 'Ready');
  }

  /** Called by main.js once the camera rig exists. */
  attach({ tour, rig, reducedMotion }) {
    this.tour = tour; this.rig = rig; this.reduced = !!reducedMotion;
    // deep links and jumps without a flight: show the app already open
    tour.on('change', (e) => { if (e.instant) this._snap = true; });
  }

  modeForViewport() {
    const w = window.innerWidth, h = window.innerHeight;
    return w / h < 0.85 || w < 600 ? 'narrow' : 'wide';
  }

  /** (Re)builds the app windows for 'wide' or 'narrow'. Returns true if it changed. */
  setLayout(mode) {
    if (mode === this.mode) return false;
    this.mode = mode;
    for (const id in this.windows) this._disposeWindow(this.windows[id]);
    this.windows = {};
    for (const s of this.sections) this.windows[s.id] = this._buildWindow(s, mode);
    this.camera.fov = mode === 'narrow' ? 50 : 40;
    this.camera.updateProjectionMatrix();
    return true;
  }

  _buildWindow(s, mode) {
    const narrow = mode === 'narrow';
    const [w, h] = SIZE[mode][s.id];
    const group = new THREE.Group(); group.name = `app-${s.id}`; group.visible = false;
    this.world.world.add(group);
    const shellMat = own(new THREE.MeshPhysicalMaterial({ color: '#fdfcff', roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 0.8 }));
    const shellGeo = new THREE.ExtrudeGeometry(shapeRR(w - 0.3, h - 0.3, 0.8, 8), { depth: 0.12, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.15, bevelSegments: 4, curveSegments: 8 });
    shellGeo.translate(0, 0, -0.06);
    const shell = mesh(shellGeo, shellMat, group); shell.userData.ownGeometry = true;
    const sw = w - 0.34, sh = h - 0.34;
    const cw = Math.round(sw * PPU), ch = Math.round(sh * PPU);
    const [c, g] = mkCanvas(cw, ch);
    const tex = canvasTex(c);
    const screenMat = own(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    const screen = mesh(rrPlane(sw, sh, 0.78, 8), screenMat, group, 0, 0, 0.25);
    const ctx = { narrow, content: this.content, images: this.images, hover: null };
    const draw = () => { g.clearRect(0, 0, cw, ch); const r = DRAW[s.id](g, cw, ch, ctx) || {}; tex.needsUpdate = true; return r; };
    const out = draw();
    const clickables = [];
    // cards: their own meshes so they lift on hover
    for (const card of out.cards || []) {
      const scale = 1.25; // a little extra resolution for the card text
      const [cc, cg] = mkCanvas(Math.round(card.w * scale), Math.round(card.h * scale));
      cg.scale(scale, scale);
      card.draw(cg, card.w, card.h);
      const ctex = canvasTex(cc);
      const cm = mesh(rrPlane(card.w / PPU, card.h / PPU, (narrow ? 40 : 34) / PPU, 8), own(new THREE.MeshBasicMaterial({ map: ctex, toneMapped: false, transparent: true })), group,
        (card.x + card.w / 2) / PPU - sw / 2, sh / 2 - (card.y + card.h / 2) / PPU, 0.29);
      clickable(cm, { type: card.type, id: card.id, label: card.label, lift: 0.14 });
      clickables.push(cm);
    }
    // contact links: hit regions on the window screen (UV space), redrawn on hover
    let regions = out.regions || null;
    if (regions) {
      clickable(screen, {
        type: 'regions', label: 'Contact links', lift: 0,
        hit: (uv) => { const x = uv.x * cw, y = (1 - uv.y) * ch; return regions.find((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) || null; },
      });
      clickables.push(screen);
    }
    const winPos = new THREE.Vector3(s.at.x, FLOOR + 1.7 + h / 2, s.at.z + 3.2);
    return {
      id: s.id, group, w, h, winPos, clickables, open: 0, hover: null,
      setHover(id) {
        if (!regions || id === this.hover) return;
        this.hover = id; ctx.hover = id;
        regions = draw().regions;
      },
    };
  }

  _disposeWindow(win) {
    win.group.parent.remove(win.group);
    win.group.traverse((o) => {
      if (!o.isMesh) return;
      const m = o.material;
      if (m && m.userData.own) { if (m.map) m.map.dispose(); m.dispose(); }
      if (o.userData.ownGeometry) o.geometry.dispose();
    });
  }

  get clickables() {
    const out = [];
    for (const id in this.windows) { const w = this.windows[id]; if (w.open > 0.97) out.push(...w.clickables); }
    return out;
  }

  /** Camera shot for a stop. */
  shotFor(id) {
    if (id === 'home') {
      const look = this.phone.screenPoint.clone();
      return { look, dir: new THREE.Vector3(-0.05, 0.03, 1), size: [PHONE.w * 1.16, PHONE.h * 1.04], margin: 1.04 };
    }
    const win = this.windows[id], s = this.sections.find((x) => x.id === id);
    const sx = s.at.x < 0 ? 1 : s.at.x > 0 ? -1 : 0.5;
    return { look: win.winPos.clone(), dir: new THREE.Vector3(sx * 0.08, 0.06, 1), size: [win.w + 0.6, win.h + 0.6], margin: 1.04 };
  }

  /** Behind the loader: the phone from far away. */
  introShot() {
    return this.mode === 'narrow'
      ? { pos: new THREE.Vector3(10, 6, 95), look: new THREE.Vector3(0, 0, 0) }
      : { pos: new THREE.Vector3(14, 6, 70), look: new THREE.Vector3(0, 0, 0) };
  }

  /** No walls here: the camera may go anywhere. */
  get cameraBounds() { return null; }

  /**
   * How the camera travels. Between the outside (Home) and the app world the
   * path goes straight through the screen; inside it arcs gently upwards.
   */
  pathControl(a, b, fromId, toId) {
    const outsideA = !fromId || fromId === 'home', outsideB = toId === 'home';
    if (outsideA !== outsideB) {
      const P = this.phone.screenPoint, n = this.phone.screenNormal;
      const front = P.clone().addScaledVector(n, 9), behind = P.clone().addScaledVector(n, -7);
      const pts = outsideA ? [a, front, P.clone(), behind, b] : [a, behind, P.clone(), front, b];
      return { curve: new THREE.CatmullRomCurve3(pts.map((p) => p.clone()), false, 'centripetal') };
    }
    const mid = a.clone().lerp(b, 0.5);
    if (outsideA) return mid; // intro → home
    mid.y += 3 + a.distanceTo(b) * 0.02;
    return mid;
  }

  setContactHover(id) { const w = this.windows.contact; if (w) w.setHover(id); }

  resize() { this.rv.resize(window.innerWidth, window.innerHeight); }

  update(time) {
    const dt = Math.min(0.1, Math.max(0, time - this.lastTime)); this.lastTime = time;
    const k = this.reduced ? 0 : 1; // no idle motion with reduced motion
    const cam = this.camera.position;
    this.phone.update(time, k);
    this.world.update(time, k);

    // which side of the glass is the camera on?
    const d = this.phone.depthOf(cam);
    const inside = d < 0;
    this.world.world.visible = d < 3.5;
    this.phone.body.visible = !inside;
    this.phone.outside.visible = d > 2.5;
    const op = smooth(0.3, 3.6, d);
    this.phone.screenMat.opacity = op;
    this.phone.screen.visible = op > 0.01;
    this.phone.glass.visible = this.phone.sheen.visible = !inside && d > 0.2;
    const f = (1 - smooth(0, 3.2, Math.abs(d))) * 0.92;
    this.fadeMat.opacity = f; this.fade.visible = f > 0.01;

    // open the app of the current stop as the camera arrives; close the others
    const cur = this.tour && this.tour.current ? this.tour.current.id : null;
    const tw = this.rig && this.rig.tween;
    for (const s of this.sections) {
      const win = this.windows[s.id];
      let target = 0;
      if (s.id === cur) {
        if (!tw) target = 1;
        else {
          const dist = tw.target.pos.distanceTo(cam);
          target = 1 - smooth(2, 18, dist);
        }
      }
      if (this.reduced || !this.tour || this._snap) win.open = target;
      else if (target > win.open) win.open += (target - win.open) * Math.min(1, dt * 9);
      else win.open = Math.max(target, win.open - dt * 2.6);
      if (target === 1 && win.open > 0.995) win.open = 1;
      const e = win.open, ee = e * e * (3 - 2 * e);
      const b = this.world.big[s.id];
      b.icon.position.y = Math.sin(time * 0.9 + s.at.z) * 0.22 * k - 1.9 * ee;
      b.icon.rotation.x = -0.35 * ee;
      b.label.visible = ee < 0.6;
      b.lblMat.opacity = 1 - smooth(0, 0.6, ee);
      win.group.visible = e > 0.004;
      if (win.group.visible) {
        win.group.position.set(s.at.x, ICON_Y + 0.6, s.at.z + 0.8).lerp(win.winPos, ee);
        win.group.scale.setScalar(0.1 + 0.9 * ee);
        win.group.rotation.x = (1 - ee) * -0.45;
      }
      if (e < 0.97) for (const c of win.clickables) if (c.userData.basePos) { c.userData.liftNow = 0; c.position.copy(c.userData.basePos); c.scale.setScalar(1); }
    }
    this._snap = false;
  }

  render() { this.rv.render(); }

  dispose() {
    const seen = new Set();
    this.scene.traverse((o) => {
      if (o.geometry && !seen.has(o.geometry)) { seen.add(o.geometry); o.geometry.dispose(); }
      const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of ms) {
        if (seen.has(m)) continue;
        seen.add(m);
        for (const v of Object.values(m)) if (v && v.isTexture && !seen.has(v)) { seen.add(v); v.dispose(); }
        m.dispose();
      }
    });
    if (this.scene.environment) this.scene.environment.dispose();
    this.rv.renderer.dispose();
  }
}
