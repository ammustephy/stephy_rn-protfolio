import * as THREE from 'three';
import { BACK, LEFT, RIGHT, ROOM, DESK } from '../layout.js';
import { mats, std, phys } from '../materials.js';
import { rbox, mesh, cached, rng, V } from '../geometry.js';
import { staticTex, textBox, SERIF, FONT } from '../canvasText.js';
import { makePlant } from './plants.js';

/*
 * Everything that makes the room feel lived in: rug, beanbag, sideboard with a
 * brass oil lamp (nilavilakku), floor plants, pendant lamp, wall sconces,
 * a real-time wall clock, the "</>" neon sign and fairy lights.
 */

function rug(parent) {
  const m = mesh(cached('rugGeo', () => new THREE.PlaneGeometry(4.2, 3.0)), mats().rug, parent, 0.6, 0.004, -1.35);
  m.rotation.x = -Math.PI / 2;
  m.receiveShadow = true;
}

function beanbag(parent, x, z) {
  const geo = cached('bean', () => {
    const g = new THREE.SphereGeometry(0.5, 40, 24);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let y = p.getY(i);
      const x0 = p.getX(i), z0 = p.getZ(i);
      // flatten the bottom, slump the top, add a seat dent
      if (y < -0.25) y = -0.25 - (y + 0.25) * 0.15;
      const r = Math.hypot(x0, z0);
      y -= Math.max(0, 0.18 - r * 0.4) * (y > 0 ? 1 : 0);
      p.setXYZ(i, x0 * (1 + (y < 0 ? 0.1 : 0)), y, z0);
    }
    g.computeVertexNormals();
    return g;
  });
  const m = mesh(geo, mats().fabricMustard, parent, x, 0.27, z, { cast: true });
  m.scale.set(1.15, 0.95, 1.05);
}

function sideboard(parent, x) {
  const M = mats(), R = rng(9);
  const g = new THREE.Group(); g.position.set(x, 0, BACK + 0.23); parent.add(g);
  mesh(rbox(1.5, 0.52, 0.42, 0.012), M.lightWood, g, 0, 0.36, 0, { cast: true });
  mesh(rbox(1.52, 0.03, 0.44, 0.008), M.deskWood, g, 0, 0.635, 0, { cast: true });
  for (let i = 0; i < 3; i++) {
    mesh(rbox(0.47, 0.46, 0.015, 0.004), M.lightWood, g, -0.49 + i * 0.49, 0.36, 0.212);
    mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.02, 10).rotateX(Math.PI / 2), M.brass, g, -0.49 + i * 0.49 + 0.17, 0.42, 0.225);
  }
  for (const sx of [-0.68, 0.68]) for (const sz of [-0.16, 0.16]) mesh(new THREE.CylinderGeometry(0.014, 0.01, 0.1, 8), M.blackMetal, g, sx, 0.05, sz);
  // stack of books
  const cols = ['#2f5f5a', '#c9932f', '#8a2f2a'];
  for (let i = 0; i < 3; i++) {
    const b = mesh(rbox(0.24 - i * 0.02, 0.17 - i * 0.015, 0.035, 0.004), std(cols[i], { roughness: 0.8 }), g, 0.42, 0.67 + i * 0.036, 0.02, { cast: true });
    b.rotation.set(-Math.PI / 2, 0, 0.1 * (i - 1));
  }
  // small plant
  const p = makePlant('bush', R, { potMat: M.ceramicWhite }); p.position.set(-0.55, 0.65, 0); g.add(p);
  // brass oil lamp (nilavilakku) with tiny flames
  const lampPts = [[0, 0], [0.07, 0], [0.072, 0.01], [0.03, 0.03], [0.012, 0.05], [0.01, 0.22], [0.02, 0.24], [0.055, 0.255], [0.058, 0.265], [0.02, 0.26], [0.008, 0.3], [0.014, 0.33], [0, 0.345]];
  const lamp = mesh(new THREE.LatheGeometry(lampPts.map(([a, b]) => new THREE.Vector2(a, b)), 32), M.brass, g, 0.05, 0.65, 0.02, { cast: true });
  const flameTex = staticTex(64, 128, (c, w, h) => {
    const gr = c.createRadialGradient(w / 2, h * 0.65, 2, w / 2, h * 0.6, h * 0.45);
    gr.addColorStop(0, 'rgba(255,250,220,1)'); gr.addColorStop(0.35, 'rgba(255,190,80,0.9)'); gr.addColorStop(1, 'rgba(255,120,30,0)');
    c.fillStyle = gr; c.beginPath(); c.ellipse(w / 2, h * 0.6, w * 0.35, h * 0.42, 0, 0, Math.PI * 2); c.fill();
  });
  const flames = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, color: '#ffffff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    f.position.set(Math.cos(a) * 0.05, 0.285, Math.sin(a) * 0.05); f.scale.set(0.02, 0.04, 1);
    lamp.add(f); flames.push(f);
  }
  return (time) => flames.forEach((f, i) => { const s = 1 + Math.sin(time * 13 + i * 1.7) * 0.12 + Math.sin(time * 7.3 + i) * 0.08; f.scale.set(0.02 * s, 0.042 * s, 1); });
}

function pendant(parent, x, z) {
  const M = mats();
  const g = new THREE.Group(); g.position.set(x, ROOM.h, z); parent.add(g);
  mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 20), M.blackMetal, g, 0, -0.01, 0);
  mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.6, 6), M.rubber, g, 0, -0.3, 0);
  const pts = [[0.02, 0], [0.05, -0.02], [0.12, -0.1], [0.2, -0.22], [0.215, -0.24], [0.21, -0.245], [0.195, -0.225], [0.115, -0.105], [0.045, -0.03], [0.018, -0.008]];
  mesh(new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a, b)), 40), std('#c9a25a', { roughness: 0.3, metalness: 1, side: THREE.DoubleSide, envMapIntensity: 1 }), g, 0, -0.6, 0, { cast: false });
  mesh(new THREE.SphereGeometry(0.045, 16, 10), new THREE.MeshStandardMaterial({ color: '#fff4dc', emissive: '#ffd59a', emissiveIntensity: 5 }), g, 0, -0.75, 0);
  const light = new THREE.PointLight('#ffcf94', 14, 0, 2);
  light.position.set(x, ROOM.h - 0.8, z);
  parent.add(light);
  return light;
}

function sconce(parent, x, y, z, rotY) {
  const M = mats();
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rotY; parent.add(g);
  mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.015, 20).rotateX(Math.PI / 2), M.brass, g, 0, 0, 0.008);
  const arm = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.14, 8).rotateX(Math.PI / 2), M.brass, g, 0, 0, 0.08);
  arm.castShadow = false;
  const pts = [[0.03, 0.06], [0.07, 0.04], [0.085, 0], [0.07, -0.04], [0.03, -0.06]];
  mesh(new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a, b)), 24), new THREE.MeshStandardMaterial({ color: '#fff3e0', emissive: '#ffcf8f', emissiveIntensity: 1.6, roughness: 0.6, side: THREE.DoubleSide }), g, 0, 0.03, 0.15);
  const l = new THREE.PointLight('#ffc888', 3.2, 0, 2);
  const wp = new THREE.Vector3(0, 0.03, 0.2).applyAxisAngle(V(0, 1, 0), rotY).add(V(x, y, z));
  l.position.copy(wp); parent.add(l);
  return l;
}

/** Clock face texture (numbers drawn once); hands are meshes updated every second. */
function clock(parent) {
  const M = mats();
  const g = new THREE.Group(); g.rotation.y = -Math.PI / 2; parent.add(g);
  const R = 0.18;
  const rim = mesh(new THREE.TorusGeometry(R, 0.016, 12, 48), std('#2a2a2e', { roughness: 0.35, metalness: 0.6 }), g, 0, 0, 0.02, { cast: true });
  rim.castShadow = true;
  mesh(new THREE.CylinderGeometry(R, R, 0.03, 48).rotateX(Math.PI / 2), std('#2a2a2e', { roughness: 0.4 }), g, 0, 0, 0.005);
  const face = staticTex(512, 512, (c, w, h) => {
    c.fillStyle = '#f6f1e7'; c.beginPath(); c.arc(256, 256, 256, 0, Math.PI * 2); c.fill();
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2, big = i % 5 === 0;
      c.strokeStyle = '#2a2a2e'; c.lineWidth = big ? 9 : 3;
      c.beginPath(); c.moveTo(256 + Math.sin(a) * 236, 256 - Math.cos(a) * 236); c.lineTo(256 + Math.sin(a) * (big ? 200 : 220), 256 - Math.cos(a) * (big ? 200 : 220)); c.stroke();
    }
    c.fillStyle = '#2a2a2e'; c.font = `600 56px ${SERIF}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) { const a = (i / 12) * Math.PI * 2; c.fillText(String(i), 256 + Math.sin(a) * 160, 260 - Math.cos(a) * 160); }
    c.font = `500 22px ${FONT}`; c.fillStyle = '#8a2f2a'; c.fillText('THIRUVANANTHAPURAM', 256, 340);
  });
  const faceMesh = mesh(new THREE.CircleGeometry(R - 0.004, 48), std('#ffffff', { map: face, roughness: 0.6, emissive: '#ffffff', emissiveMap: face, emissiveIntensity: 0.25 }), g, 0, 0, 0.0205);
  faceMesh.receiveShadow = true;
  const hand = (len, wid, col, z) => {
    const pivot = new THREE.Group(); pivot.position.z = z; g.add(pivot);
    mesh(new THREE.BoxGeometry(wid, len, 0.003).translate(0, len / 2 - 0.02, 0), std(col, { roughness: 0.4 }), pivot, 0, 0, 0, { cast: true });
    return pivot;
  };
  const hh = hand(0.1, 0.012, '#1d1d20', 0.024), mm = hand(0.145, 0.008, '#1d1d20', 0.027), ss = hand(0.155, 0.003, '#c0392b', 0.03);
  mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.014, 16).rotateX(Math.PI / 2), M.brass, g, 0, 0, 0.031);
  // glass dome
  const glass = mesh(new THREE.CircleGeometry(R, 48), M.glass, g, 0, 0, 0.036);
  glass.receiveShadow = false;
  return {
    g,
    update() {
      const d = new Date();
      const s = d.getSeconds() + d.getMilliseconds() / 1000, m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60;
      ss.rotation.z = -(s / 60) * Math.PI * 2;
      mm.rotation.z = -(m / 60) * Math.PI * 2;
      hh.rotation.z = -(h / 12) * Math.PI * 2;
    },
  };
}

/** "</>" neon: glass tubes along the glyph strokes, acrylic back plate and a soft halo on the wall. */
function neon(parent, x, y, z) {
  const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
  const strokes = [
    [[-0.13, 0.1], [-0.27, 0], [-0.13, -0.1]],
    [[0.05, 0.14], [-0.05, -0.14]],
    [[0.13, 0.1], [0.27, 0], [0.13, -0.1]],
  ];
  const tubeMat = new THREE.MeshStandardMaterial({ color: '#ff9ccc', emissive: '#ff3d9a', emissiveIntensity: 2.6, roughness: 0.3, toneMapped: false });
  for (const s of strokes) {
    const path = new THREE.CurvePath();
    for (let i = 0; i < s.length - 1; i++) path.add(new THREE.LineCurve3(V(s[i][0], s[i][1], 0.04), V(s[i + 1][0], s[i + 1][1], 0.04)));
    mesh(new THREE.TubeGeometry(path, 24 * (s.length - 1), 0.009, 8, false), tubeMat, g, 0, 0, 0);
    for (const p of [s[0], s[s.length - 1]]) mesh(new THREE.SphereGeometry(0.009, 10, 8), tubeMat, g, p[0], p[1], 0.04);
  }
  // acrylic plate on standoffs
  const plate = mesh(rbox(0.68, 0.38, 0.008, 0.003, 0.03), phys('#ffffff', { transparent: true, opacity: 0.06, roughness: 0.1, envMapIntensity: 0.5, depthWrite: false }), g, 0, 0, 0.022);
  plate.renderOrder = 3;
  for (const [sx, sy] of [[-0.3, 0.16], [0.3, 0.16], [-0.3, -0.16], [0.3, -0.16]]) mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.03, 10).rotateX(Math.PI / 2), mats().chrome, g, sx, sy, 0.012);
  // halo on the wall (fake light spill, works without bloom too)
  const halo = staticTex(512, 320, (c, w, h) => {
    c.filter = 'blur(26px)';
    c.strokeStyle = 'rgba(255,70,160,0.9)'; c.lineWidth = 40; c.lineCap = 'round'; c.lineJoin = 'round';
    const sx = w / 0.8, sy = h / 0.5;
    for (const s of strokes) { c.beginPath(); s.forEach(([px, py], i) => { const X = w / 2 + px * sx, Y = h / 2 - py * sy; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }); c.stroke(); }
  });
  const hm = mesh(new THREE.PlaneGeometry(0.8, 0.5), new THREE.MeshBasicMaterial({ map: halo, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }), g, 0, 0, 0.003);
  hm.receiveShadow = false;
  const light = new THREE.PointLight('#ff4fa8', 1.3, 0, 2);
  light.position.set(x, y, z + 0.3); parent.add(light);
  return { g, tubeMat };
}

/** Warm fairy lights hanging in loose loops along the top of the back and left walls. */
function fairyLights(parent) {
  const pts = [], bulbs = [];
  const strand = (a, b, loops, sag, n) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n, p = a.clone().lerp(b, t);
      p.y -= Math.abs(Math.sin(t * Math.PI * loops)) * sag;
      pts.push(p);
      if (i % 3 === 1) bulbs.push(p.clone().add(V(0, -0.025, 0)));
    }
  };
  strand(V(LEFT + 0.05, 3.08, BACK + 0.04), V(RIGHT - 0.05, 3.08, BACK + 0.04), 6, 0.16, 180);
  strand(V(LEFT + 0.04, 3.06, BACK + 0.05), V(LEFT + 0.04, 3.06, 3.6), 4, 0.1, 120);
  const curve = new THREE.CatmullRomCurve3(pts);
  const wire = new THREE.Mesh(new THREE.TubeGeometry(curve, 600, 0.0025, 4, false), std('#3a3026', { roughness: 0.6 }));
  parent.add(wire);
  const im = new THREE.InstancedMesh(cached('bulb', () => new THREE.SphereGeometry(0.016, 10, 8)), new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), bulbs.length);
  const m4 = new THREE.Matrix4(), base = new THREE.Color('#ffc46b'), c = new THREE.Color();
  bulbs.forEach((p, i) => { m4.makeTranslation(p.x, p.y, p.z); im.setMatrixAt(i, m4); im.setColorAt(i, base); });
  parent.add(im);
  return (time) => {
    for (let i = 0; i < bulbs.length; i++) {
      const k = 1.1 + 0.45 * Math.sin(time * 1.7 + i * 1.3) * Math.sin(time * 0.6 + i * 0.7);
      c.copy(base).multiplyScalar(k);
      im.setColorAt(i, c);
    }
    im.instanceColor.needsUpdate = true;
  };
}

export function buildDecor(parent, quality) {
  const M = mats(), R = rng(3);
  const g = new THREE.Group(); g.name = 'decor'; parent.add(g);

  rug(g);
  beanbag(g, -4.3, 0.9);
  const lampFlicker = sideboard(g, -2.15);

  const tallR = makePlant('tall', R); tallR.position.set(5.35, 0, -3.95); g.add(tallR);
  const snake = makePlant('snake', R, { potMat: M.ceramicWhite, scale: 1.5 }); snake.position.set(-0.75, 0, -4.12); g.add(snake);
  const tallL = makePlant('tall', R, { scale: 0.85 }); tallL.position.set(-5.4, 0, 3.75); g.add(tallL);
  const bushR = makePlant('bush', R, { scale: 2.2, potMat: M.ceramicTerracotta }); bushR.position.set(5.45, 0, 3.7); g.add(bushR);
  const sill = makePlant('bush', R, { scale: 0.8, potMat: M.ceramicWhite }); sill.position.set(-4.05, 0.98, BACK + 0.08); g.add(sill);

  const lights = [];
  lights.push(pendant(g, 0.6, -1.0));
  lights.push(sconce(g, LEFT, 2.2, 0.98, Math.PI / 2));
  lights.push(sconce(g, RIGHT, 2.2, 0.13, -Math.PI / 2));
  const nn = neon(g, 2.25, 2.5, BACK);
  const fairy = fairyLights(g);
  const clk = clock(g);

  return {
    lights,
    neon: nn,
    setLayout(L) { clk.g.position.set(RIGHT - 0.04, L.clock.y, L.clock.z); },
    update(time) {
      fairy(time);
      lampFlicker(time);
      clk.update();
    },
  };
}
