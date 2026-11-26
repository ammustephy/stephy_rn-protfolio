import * as THREE from 'three';
import { RIGHT } from '../layout.js';
import { printed, mats } from '../materials.js';
import { mesh } from '../geometry.js';
import { staticTex, textBox, paperGrain, FONT, SERIF } from '../canvasText.js';
import { frame, anchor } from './common.js';

function drawCertificate(g, w, h, e, i) {
  g.fillStyle = '#fbf7ee'; g.fillRect(0, 0, w, h);
  paperGrain(g, w, h, 0.03, 40 + i);
  // double border
  g.strokeStyle = '#b08a3e'; g.lineWidth = 10; g.strokeRect(26, 26, w - 52, h - 52);
  g.strokeStyle = 'rgba(176,138,62,0.6)'; g.lineWidth = 3; g.strokeRect(46, 46, w - 92, h - 92);
  // corner ornaments
  g.fillStyle = '#b08a3e';
  for (const [x, y] of [[46, 46], [w - 46, 46], [46, h - 46], [w - 46, h - 46]]) { g.beginPath(); g.arc(x, y, 12, 0, Math.PI * 2); g.fill(); }
  const pad = 100, tw = w - pad * 2;
  g.font = `600 34px ${FONT}`; g.fillStyle = '#8a6a2a'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.letterSpacing = '10px';
  g.fillText(i === 0 ? 'DEGREE' : 'CERTIFICATE', w / 2, h * 0.16);
  g.letterSpacing = '0px';
  textBox(g, e.title, pad, h * 0.22, tw, h * 0.3, { size: 76, weight: 700, color: '#1d2a3a', font: SERIF, lh: 1.15 });
  g.fillStyle = '#b08a3e'; g.fillRect(w / 2 - 80, h * 0.555, 160, 4);
  textBox(g, e.institution, pad, h * 0.6, tw, h * 0.11, { size: 58, weight: 600, color: '#2a3442', nowrap: true });
  textBox(g, e.detail ? `${e.year}  ·  ${e.detail}` : e.year, pad, h * 0.72, tw * 0.72, h * 0.09, { size: 46, weight: 500, color: '#55606e', nowrap: true });
  // gold seal
  const sx = w - 170, sy = h - 175;
  const gr = g.createRadialGradient(sx - 15, sy - 15, 5, sx, sy, 70);
  gr.addColorStop(0, '#f3d27a'); gr.addColorStop(1, '#a87a22');
  g.fillStyle = gr;
  g.beginPath();
  for (let k = 0; k < 32; k++) { const a = (k / 32) * Math.PI * 2, r = k % 2 ? 62 : 72; g.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); }
  g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 3; g.beginPath(); g.arc(sx, sy, 44, 0, Math.PI * 2); g.stroke();
  textBox(g, e.year, sx - 40, sy - 20, 80, 40, { size: 30, weight: 800, color: '#5a3d0c', nowrap: true });
}

/** Two framed certificates on the right wall (side by side, or stacked on phones). */
export function buildCertificates(parent, L, education) {
  const g = new THREE.Group(); g.name = 'education'; parent.add(g);
  const { w, h } = L.certSize, M = mats();
  education.forEach((e, i) => {
    const pos = L.certs[i];
    const holder = new THREE.Group(); holder.position.set(RIGHT - 0.005, pos.y, pos.z); holder.rotation.y = -Math.PI / 2; g.add(holder);
    frame(holder, w, h, { border: 0.04, depth: 0.035, mat: M.frameWood });
    // mat board
    mesh(new THREE.PlaneGeometry(w, h), M.paperWhite, holder, 0, 0, 0.006);
    const tex = staticTex(1080, Math.round(1080 * (h - 0.1) / (w - 0.1)), (c, cw, ch) => drawCertificate(c, cw, ch, e, i));
    mesh(new THREE.PlaneGeometry(w - 0.1, h - 0.1), printed(tex, { glow: 0.36 }), holder, 0, 0, 0.009);
    const glass = mesh(new THREE.PlaneGeometry(w, h), M.glass, holder, 0, 0, 0.028);
    glass.renderOrder = 2;
  });
  // frame both certificates and the clock above them
  const zs = L.certs.map((c) => c.z), ys = L.certs.map((c) => c.y);
  const z0 = Math.min(...zs) - w / 2 - 0.05, z1 = Math.max(...zs) + w / 2 + 0.05;
  const y0 = Math.min(...ys) - h / 2 - 0.05, y1 = L.clock.y + 0.22;
  return {
    group: g,
    anchor: anchor(new THREE.Vector3(RIGHT, (y0 + y1) / 2, (z0 + z1) / 2), new THREE.Vector3(-1, 0, 0), [z1 - z0 + 0.1, y1 - y0]),
  };
}
