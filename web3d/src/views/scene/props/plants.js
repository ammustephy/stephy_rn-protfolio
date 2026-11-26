import * as THREE from 'three';
import { mats, std } from '../materials.js';
import { cached, mesh } from '../geometry.js';

/*
 * House plants built from one bent leaf geometry, instanced per plant
 * (one draw call for all leaves of a plant, colour varies per leaf).
 */

const leafMat = std('#ffffff', { roughness: 0.5, side: THREE.DoubleSide, envMapIntensity: 0.5 });
const stemMat = std('#4d6b33', { roughness: 0.7 });

/** Leaf: base at origin, tip at +y (length 1, width ~0.45), curled and folded on the midrib. */
function leafGeometry(kind) {
  return cached('leaf' + kind, () => {
    const g = new THREE.PlaneGeometry(1, 1, 6, 10);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i) * 2, t = p.getY(i) + 0.5; // u -1..1 across, t 0..1 along
      let width;
      if (kind === 'blade') width = 0.09 * (1 - t * 0.85);
      else if (kind === 'heart') width = 0.36 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), 0.7) * (1 - t * 0.25);
      else width = 0.24 * Math.pow(Math.sin(Math.PI * t), 0.85);
      const x = u * width;
      const bend = kind === 'blade' ? 0.06 * t * t : 0.28 * t * t;
      const fold = Math.abs(u) * width * 0.35;
      p.setXYZ(i, x, t, fold - bend);
    }
    g.computeVertexNormals();
    return g;
  });
}

const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpS = new THREE.Vector3(), tmpP = new THREE.Vector3(), tmpE = new THREE.Euler();
const greens = ['#3c7a35', '#2e6a2d', '#4f8c3e', '#356f37', '#5c9a48', '#2a5e2c'].map((c) => new THREE.Color(c));

function pot(group, r, h, mat) {
  const pts = [[0, 0], [r * 0.78, 0], [r * 0.8, 0.01], [r, h * 0.94], [r * 1.06, h * 0.96], [r * 1.06, h], [r * 0.95, h], [r * 0.93, h * 0.97], [0, h * 0.97]];
  const geo = cached('pot' + r + h, () => new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a, b)), 28));
  const m = mesh(geo, mat, group, 0, 0, 0, { cast: true });
  const soil = mesh(cached('soil' + r, () => new THREE.CircleGeometry(r * 0.92, 24).rotateX(-Math.PI / 2)), mats().soil, group, 0, h * 0.93, 0);
  soil.receiveShadow = true;
  return m;
}

/**
 * @param {'tall'|'bush'|'snake'|'trailing'} type
 * @param {() => number} R random generator
 */
export function makePlant(type, R, opts = {}) {
  const M = mats();
  const g = new THREE.Group(); g.name = 'plant-' + type;
  const potMat = opts.potMat || M.ceramicTerracotta;
  const leaves = [];
  let potH = 0.3;

  if (type === 'tall') {
    potH = 0.42; pot(g, 0.2, potH, potMat);
    // three thin trunks with big leaves along them (fiddle-leaf fig style)
    for (let s = 0; s < 3; s++) {
      const a = s * 2.1 + R(), lean = 0.08 + R() * 0.1, top = 1.1 + R() * 0.5;
      const dx = Math.cos(a) * lean, dz = Math.sin(a) * lean;
      const stem = mesh(cached('trunk', () => new THREE.CylinderGeometry(0.012, 0.018, 1, 6).translate(0, 0.5, 0)), stemMat, g, 0, potH, 0, { cast: true });
      const dir = new THREE.Vector3(dx, 1, dz);
      stem.scale.set(1, top * dir.length(), 1);
      stem.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      const n = 9;
      for (let i = 0; i < n; i++) {
        const t = 0.35 + (i / n) * 0.65;
        leaves.push({ p: [dx * t * top, potH + t * top, dz * t * top], yaw: i * 2.4 + a, pitch: 0.5 + R() * 0.5, s: 0.26 + R() * 0.08, kind: 'oval' });
      }
    }
  } else if (type === 'bush') {
    potH = 0.2; pot(g, 0.13, potH, potMat);
    for (let i = 0; i < 18; i++) leaves.push({ p: [0, potH, 0], yaw: i * 2.4, pitch: 0.25 + R() * 0.9, s: 0.18 + R() * 0.1, kind: 'heart' });
  } else if (type === 'snake') {
    potH = 0.22; pot(g, 0.12, potH, potMat);
    for (let i = 0; i < 11; i++) leaves.push({ p: [(R() - 0.5) * 0.08, potH, (R() - 0.5) * 0.08], yaw: R() * 6.28, pitch: 0.05 + R() * 0.22, s: 0.45 + R() * 0.3, kind: 'blade', wide: 1.8 });
  } else {
    potH = 0.13; pot(g, 0.09, potH, potMat);
    for (let i = 0; i < 10; i++) leaves.push({ p: [0, potH, 0], yaw: i * 2.3, pitch: 0.6 + R() * 0.5, s: 0.1 + R() * 0.04, kind: 'heart' });
    // vines hanging over the front edge
    for (let v = 0; v < 3; v++) {
      const vx = (v - 1) * 0.07, len = 0.25 + R() * 0.35;
      for (let k = 0; k < 7; k++) {
        const t = k / 6;
        leaves.push({ p: [vx + Math.sin(t * 4 + v) * 0.02, potH - t * len, 0.1 + t * 0.03], yaw: Math.PI + (k % 2 ? 0.7 : -0.7), pitch: 2.4, s: 0.07 + R() * 0.02, kind: 'heart' });
      }
    }
  }

  // one instanced mesh per leaf kind
  const byKind = new Map();
  for (const l of leaves) { if (!byKind.has(l.kind)) byKind.set(l.kind, []); byKind.get(l.kind).push(l); }
  for (const [kind, list] of byKind) {
    const im = new THREE.InstancedMesh(leafGeometry(kind), leafMat, list.length);
    list.forEach((l, i) => {
      tmpE.set(-l.pitch, l.yaw, 0, 'YXZ');
      // leaves should tilt away from the stem: rotate around local x after yaw
      tmpQ.setFromEuler(tmpE);
      tmpS.set(l.s * (l.wide || 1), l.s, l.s);
      tmpM.compose(tmpP.set(...l.p), tmpQ, tmpS);
      im.setMatrixAt(i, tmpM);
      im.setColorAt(i, greens[Math.floor(R() * greens.length)]);
    });
    im.castShadow = true; im.receiveShadow = true;
    g.add(im);
  }
  if (opts.scale) g.scale.setScalar(opts.scale);
  return g;
}
