import * as THREE from 'three';
import { RendererView } from './renderer.js';
import { buildLighting } from './lighting.js';
import { buildRoomShell } from './room.js';
import { buildDesk } from './props/desk.js';
import { buildDecor } from './props/decor.js';
import { buildShelf } from './props/shelf.js';
import { buildBoards } from './boards/index.js';
import { layoutFor } from './layout.js';

// Yield to the browser between build steps so the progress bar can paint.
// (setTimeout, not requestAnimationFrame: rAF is paused in background tabs.)
const nextFrame = () => new Promise((r) => setTimeout(r, 16));

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // a missing cover must not break the room
    img.src = src;
  });
}

/** Per stop: how the camera looks at the anchor (tilt from above, a little from the side). */
const VIEW = {
  home: { dir: [0.08, 0.12, 1], narrowDir: [-0.12, 0.06, 1] },
  about: { dir: [0.1, 0.06, 1] },
  skills: { dir: [1, 0.07, 0.1] },
  experience: { dir: [-1, 0.07, 0.1] },
  projects: { dir: [0, 0.16, 1] },
  education: { dir: [-1, 0.06, -0.14] },
  contact: { dir: [0, 0.28, 1], local: true, margin: 1.04 },
};

/**
 * The whole 3D room. Builds the static room once, and the content boards per
 * layout (landscape / portrait). Exposes camera shots for each stop.
 */
export class SceneView {
  constructor(canvas, quality) {
    this.quality = quality;
    this.rv = new RendererView(canvas, quality);
    this.scene = this.rv.scene;
    this.camera = this.rv.camera;
    this.boards = null;
    this.mode = null;
    this.updaters = [];
  }

  /** Builds everything, reporting progress 0..1. */
  async build(content, onProgress = () => {}) {
    this.content = content;
    onProgress(0.03, 'Loading fonts');
    // text is drawn into textures, so the web fonts must be ready first (with a time limit)
    if (document.fonts && document.fonts.load) {
      const faces = ['800 40px Inter', '700 40px Inter', '600 40px Inter', '500 40px Inter', '700 40px Fraunces', '700 40px Caveat', '500 20px "JetBrains Mono"'];
      await Promise.race([Promise.all(faces.map((f) => document.fonts.load(f).catch(() => null))), new Promise((r) => setTimeout(r, 3500))]);
    }
    onProgress(0.1, 'Loading project covers');
    const imgs = await Promise.all(content.projects.map((p) => loadImage(p.cover)));
    this.images = Object.fromEntries(content.projects.map((p, i) => [p.id, imgs[i]]));
    onProgress(0.25, 'Building the room'); await nextFrame();
    buildRoomShell(this.scene);
    this.lights = buildLighting(this.scene, this.quality);
    onProgress(0.4, 'Setting up the desk'); await nextFrame();
    this.desk = buildDesk(this.scene, this.quality);
    this.updaters.push((t) => this.desk.update(t));
    onProgress(0.55, 'Adding plants and lights'); await nextFrame();
    this.decor = buildDecor(this.scene, this.quality);
    this.updaters.push((t) => this.decor.update(t));
    buildShelf(this.scene);
    onProgress(0.72, 'Writing on the boards'); await nextFrame();
    this.setLayout(this.modeForViewport());
    onProgress(0.88, 'Warming up the GPU'); await nextFrame();
    this.resize();
    // compile shaders up front so the first move does not stutter
    this.rv.renderer.compile(this.scene, this.camera);
    onProgress(1, 'Ready');
  }

  modeForViewport() {
    const w = window.innerWidth, h = window.innerHeight;
    return w / h < 0.85 || w < 600 ? 'narrow' : 'wide';
  }

  /** (Re)builds the content boards for 'wide' or 'narrow'. Returns true if it changed. */
  setLayout(mode) {
    if (mode === this.mode) return false;
    this.mode = mode;
    if (this.boards) this.boards.dispose();
    this.L = layoutFor(mode);
    this.decor.setLayout(this.L);
    this.boards = buildBoards(this.scene, this.L, this.content, { images: this.images, desk: this.desk });
    this.camera.fov = mode === 'narrow' ? 50 : 40;
    this.camera.updateProjectionMatrix();
    // nothing that casts a visible shadow moves, so shadow maps are rendered only after (re)building
    this.rv.renderer.shadowMap.autoUpdate = false;
    this.rv.renderer.shadowMap.needsUpdate = true;
    return true;
  }

  get clickables() { return this.boards ? this.boards.clickables : []; }

  /** Camera shot for a stop, from the board's anchor. */
  shotFor(id) {
    const a = this.boards.anchors[id], v = VIEW[id];
    const narrow = this.mode === 'narrow';
    let dir;
    if (v.local) {
      // screens: look straight at the panel, a little from above
      dir = a.normal.clone().add(new THREE.Vector3(0, 0.12, 0)).normalize();
    } else {
      dir = new THREE.Vector3(...(narrow && v.narrowDir ? v.narrowDir : v.dir));
      if (narrow) dir.y *= 0.6;
    }
    const shot = { look: a.center.clone(), dir, size: a.size, margin: v.margin || 1.09 };
    // the wide overview needs a lot of room; on squarer windows fall back to the poster
    if (id === 'home' && !narrow) {
      const p = this.boards.anchors.poster;
      shot.alt = { look: p.center.clone(), dir: new THREE.Vector3(-0.15, 0.08, 1), size: p.size, margin: 1.06 };
    }
    return shot;
  }

  /** Where the camera may stand: inside the room, off the walls. */
  get cameraBounds() {
    return new THREE.Box3(new THREE.Vector3(-5.7, 0.4, -4.2), new THREE.Vector3(5.7, 3.0, 4.3));
  }

  /** The establishing shot behind the loader: the room seen from outside, like a dollhouse. */
  introShot() {
    const narrow = this.mode === 'narrow';
    return narrow
      ? { pos: new THREE.Vector3(0.6, 2.3, 11.5), look: new THREE.Vector3(0.4, 1.4, -2) }
      : { pos: new THREE.Vector3(0.8, 2.6, 9.2), look: new THREE.Vector3(0.3, 1.35, -1.5) };
  }

  setContactHover(id) { if (this.boards) this.boards.screens.setHover(id); }

  resize() {
    this.rv.resize(window.innerWidth, window.innerHeight);
  }

  update(time) {
    for (const u of this.updaters) u(time);
    if (this.boards) this.boards.screens.update();
  }

  render() { this.rv.render(); }
}
