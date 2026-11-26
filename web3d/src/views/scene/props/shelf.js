import * as THREE from 'three';
import { LEFT } from '../layout.js';
import { mats, std } from '../materials.js';
import { rbox, mesh, rng, V } from '../geometry.js';
import { staticTex, textBox, FONT } from '../canvasText.js';
import { makePlant } from './plants.js';

/*
 * Bookshelf on the left wall: five boards of books with varied heights,
 * widths and colours (one instanced mesh), a few books lying in stacks with
 * readable spines, a trailing plant on top and small objects.
 */
export function buildShelf(parent, z = 2.3) {
  const M = mats(), R = rng(12);
  const g = new THREE.Group(); g.name = 'bookshelf';
  g.position.set(LEFT + 0.18, 0, z); g.rotation.y = Math.PI / 2; parent.add(g);
  const W = 1.8, H = 2.05, D = 0.34;
  mesh(rbox(0.035, H, D, 0.008), M.lightWood, g, -W / 2, H / 2, 0, { cast: true });
  mesh(rbox(0.035, H, D, 0.008), M.lightWood, g, W / 2, H / 2, 0, { cast: true });
  mesh(new THREE.BoxGeometry(W, H, 0.012), std('#6b4a33', { roughness: 0.8 }), g, 0, H / 2, -D / 2 + 0.006);
  const boards = [0.06, 0.48, 0.9, 1.32, 1.74, H];
  boards.forEach((y) => mesh(rbox(W, 0.03, D, 0.006), M.lightWood, g, 0, y, 0, { cast: true }));

  const palette = ['#8a2f2a', '#c9932f', '#2f5f5a', '#e6d6bb', '#3d4a6b', '#6b8f5e', '#b5523b', '#24323a', '#d9a7a0', '#7a5c8f'].map((c) => new THREE.Color(c));
  const books = [], stacks = [];
  const spineWords = [['DART', 'FLUTTER IN ACTION'], ['CLEAN CODE', 'REST APIs'], ['FIREBASE', 'UI DESIGN'], ['GIT', 'ALGORITHMS'], ['MALAYALAM', 'POEMS']];
  for (let k = 0; k < 4; k++) {
    const y0 = boards[k] + 0.015, gap = boards[k + 1] - boards[k] - 0.03;
    let x = -W / 2 + 0.03;
    const stackAt = [-0.45, 0.35, -0.1, 0.5][k];
    while (x < W / 2 - 0.05) {
      if (Math.abs(x - stackAt) < 0.17) { x = stackAt + 0.18; continue; }
      const w = 0.022 + R() * 0.03, h = Math.min(gap - 0.03, 0.2 + R() * 0.14), d = 0.17 + R() * 0.08;
      if (x + w > W / 2 - 0.03) break;
      const lean = R() < 0.07 ? -0.18 : 0;
      books.push({ x: x + w / 2 + (lean ? 0.03 : 0), y: y0 + h / 2, z: -D / 2 + d / 2 + 0.02, w, h, d, lean, c: palette[Math.floor(R() * palette.length)] });
      x += w + 0.002 + (R() < 0.08 ? 0.08 : 0);
    }
    spineWords[k].forEach((word, j) => stacks.push({ x: stackAt, y: y0 + 0.022 + j * 0.044, word, col: ['#2f5f5a', '#8a2f2a', '#c9932f', '#3d4a6b'][(k + j) % 4] }));
  }
  const im = new THREE.InstancedMesh(rbox(1, 1, 1, 0.08), std('#ffffff', { roughness: 0.75 }), books.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  books.forEach((b, i) => {
    q.setFromAxisAngle(V(0, 0, 1), b.lean);
    m4.compose(p.set(b.x, b.y, b.z), q, s.set(b.w, b.h, b.d));
    im.setMatrixAt(i, m4); im.setColorAt(i, b.c);
  });
  im.castShadow = true; im.receiveShadow = true; g.add(im);

  for (const b of stacks) {
    const book = mesh(rbox(0.3, 0.042, 0.22, 0.005), std(b.col, { roughness: 0.8 }), g, b.x, b.y, -0.02, { cast: true });
    const tex = staticTex(512, 72, (c, w, h) => {
      c.fillStyle = b.col; c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(0, 6, w, 3); c.fillRect(0, h - 9, w, 3);
      textBox(c, b.word, 20, 10, w - 40, h - 20, { size: 40, weight: 700, color: '#f6efe2', nowrap: true, font: FONT });
    });
    mesh(new THREE.PlaneGeometry(0.29, 0.038), std('#ffffff', { map: tex, roughness: 0.7 }), book, 0, 0, 0.1105);
  }

  // top: trailing plant, a small speaker and a jar
  const plant = makePlant('trailing', R, { potMat: M.ceramicWhite, scale: 1.3 }); plant.position.set(-0.55, H + 0.015, 0); g.add(plant);
  mesh(rbox(0.12, 0.18, 0.12, 0.012), std('#2a2b30', { roughness: 0.6 }), g, 0.45, H + 0.105, 0, { cast: true });
  mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.005, 20).rotateX(Math.PI / 2), M.aluminium, g, 0.45, H + 0.12, 0.061);
  const jar = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 24), M.glass, g, 0.12, H + 0.085, 0);
  jar.renderOrder = 2;
  // a small framed photo on a middle shelf
  const photo = mesh(rbox(0.14, 0.18, 0.015, 0.005), M.frameWood, g, 0.74, H + 0.105, -0.03, { cast: true });
  photo.rotation.x = -0.12;
  const pTex = staticTex(128, 160, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f0a06a'); gr.addColorStop(1, '#3a2a4a');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.fillStyle = '#1a1420'; c.fillRect(0, h * 0.72, w, h);
    c.fillRect(30, 60, 4, 60); c.beginPath(); c.arc(32, 60, 20, Math.PI, 0); c.fill();
  });
  mesh(new THREE.PlaneGeometry(0.11, 0.15), std('#ffffff', { map: pTex, roughness: 0.4 }), photo, 0, 0, 0.0076);
  return g;
}
