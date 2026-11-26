import * as THREE from 'three';
import { RIGHT } from '../layout.js';
import { printed, mats, std } from '../materials.js';
import { rbox, mesh, cached } from '../geometry.js';
import { staticTex, textBox, rr, paperGrain, FONT, HAND } from '../canvasText.js';
import { frame, anchor, clickable } from './common.js';

function drawCard(g, w, h, job, i, narrow) {
  g.fillStyle = '#fffdf7'; g.fillRect(0, 0, w, h);
  paperGrain(g, w, h, 0.03, 20 + i);
  const pad = w * (narrow ? 0.05 : 0.08);
  if (!narrow) {
    g.fillStyle = job.color; g.fillRect(0, 0, w, h * 0.13);
    textBox(g, job.dates, pad, 0, w - pad * 2, h * 0.13, { size: 44, weight: 700, color: '#ffffff', nowrap: true });
    let y = h * 0.17;
    textBox(g, job.shortName, pad, y, w - pad * 2, h * 0.13, { size: 92, weight: 800, color: '#1f2430', align: 'left', nowrap: true });
    y += h * 0.14;
    textBox(g, job.company, pad, y, w - pad * 2, h * 0.08, { size: 36, weight: 500, color: '#5a5f6a', align: 'left', nowrap: true });
    y += h * 0.1;
    g.fillStyle = job.color; rr(g, pad, y, w * 0.18, 7, 3); g.fill();
    y += h * 0.04;
    textBox(g, job.role, pad, y, w - pad * 2, h * 0.24, { size: 58, weight: 700, color: '#2a2e38', align: 'left', valign: 'top', lh: 1.2 });
    textBox(g, job.location, pad, h * 0.7, w - pad * 2, h * 0.07, { size: 36, weight: 500, color: '#5a5f6a', align: 'left', nowrap: true });
    // "details" button
    const by = h * 0.82, bh = h * 0.11;
    g.fillStyle = '#1f2430'; rr(g, pad, by, w - pad * 2, bh, bh / 2); g.fill();
    textBox(g, 'View details  →', pad, by, w - pad * 2, bh, { size: 42, weight: 700, color: '#ffffff', nowrap: true });
  } else {
    g.fillStyle = job.color; g.fillRect(0, 0, w * 0.025, h);
    const x = w * 0.06, tw = w - x - pad;
    textBox(g, job.shortName, x, h * 0.07, tw * 0.55, h * 0.24, { size: 96, weight: 800, color: '#1f2430', align: 'left', nowrap: true });
    textBox(g, job.dates, x + tw * 0.55, h * 0.07, tw * 0.45, h * 0.24, { size: 44, weight: 700, color: job.color, align: 'right', nowrap: true });
    textBox(g, job.role, x, h * 0.34, tw, h * 0.3, { size: 54, weight: 600, color: '#2a2e38', align: 'left', valign: 'top', lh: 1.18 });
    textBox(g, `${job.company} · ${job.location}`, x, h * 0.66, tw * 0.62, h * 0.24, { size: 36, weight: 500, color: '#5a5f6a', align: 'left', lh: 1.15 });
    const bw = tw * 0.34, bh = h * 0.2;
    g.fillStyle = '#1f2430'; rr(g, x + tw - bw, h * 0.7, bw, bh, bh / 2); g.fill();
    textBox(g, 'Details →', x + tw - bw, h * 0.7, bw, bh, { size: 40, weight: 700, color: '#ffffff', nowrap: true });
  }
}

/** Push pin: plastic head + steel needle. */
function pushPin(parent, x, y, color) {
  const g = new THREE.Group(); g.position.set(x, y, 0.05); parent.add(g);
  mesh(cached('pinHead', () => new THREE.CylinderGeometry(0.014, 0.018, 0.016, 16).rotateX(Math.PI / 2)), std(color, { roughness: 0.25 }), g, 0, 0, 0.012, { cast: true });
  mesh(cached('pinTop', () => new THREE.SphereGeometry(0.016, 16, 10)), std(color, { roughness: 0.25 }), g, 0, 0, 0.024, { cast: true });
  mesh(cached('pinNeedle', () => new THREE.CylinderGeometry(0.0015, 0.0015, 0.02, 6).rotateX(Math.PI / 2)), mats().chrome, g, 0, 0, 0.0);
  return g;
}

/** Cork board on the right wall with one clickable card per job. */
export function buildCorkBoard(parent, L, jobs) {
  const C = L.cork, narrow = L.mode === 'narrow', M = mats();
  const g = new THREE.Group(); g.name = 'experience';
  g.position.set(RIGHT - 0.005, C.y, C.z); g.rotation.y = -Math.PI / 2; parent.add(g);
  frame(g, C.w, C.h, { border: 0.05, depth: 0.05, mat: M.frameWood });
  mesh(new THREE.PlaneGeometry(C.w, C.h), M.cork, g, 0, 0, 0.02);

  // header note
  const hw = narrow ? 0.9 : 1.0, hh = narrow ? 0.2 : 0.2;
  const hTex = staticTex(Math.round(hw * 700), Math.round(hh * 700), (c, w, h) => {
    c.fillStyle = '#ffe9a8'; c.fillRect(0, 0, w, h);
    textBox(c, 'Experience', 10, 0, w - 20, h, { size: 120, weight: 700, color: '#1d3b4a', font: HAND, nowrap: true });
  });
  const hy = narrow ? C.h / 2 - 0.2 : C.h / 2 - 0.19;
  const hdr = mesh(new THREE.PlaneGeometry(hw, hh), printed(hTex, { glow: 0.3 }), g, narrow ? 0 : -C.w / 2 + 0.7, hy, 0.03);
  hdr.rotation.z = 0.015;
  pushPin(g, hdr.position.x, hy + hh / 2 - 0.035, '#c23b6b');

  const cards = [];
  const tilt = [0.012, -0.01, 0.014];
  jobs.forEach((job, i) => {
    const cw = narrow ? 1.46 : 0.98, ch = narrow ? 0.62 : 1.28;
    const x = narrow ? 0 : (i - 1) * 1.08, y = narrow ? 0.62 - i * 0.7 : -0.17;
    const ppm = narrow ? 600 : 620;
    const tex = staticTex(Math.round(cw * ppm), Math.round(ch * ppm), (c, w, h) => drawCard(c, w, h, job, i, narrow));
    const holder = new THREE.Group(); holder.position.set(x, y, 0.032); holder.rotation.z = tilt[i]; g.add(holder);
    const paper = mesh(new THREE.PlaneGeometry(cw, ch), printed(tex, { glow: 0.36 }), holder, 0, 0, 0);
    paper.castShadow = true;
    pushPin(holder, 0, ch / 2 - 0.04, ['#2f7fd8', '#d9622b', '#2e9a6a'][i]);
    clickable(holder, { type: 'job', id: job.id, label: `${job.role} at ${job.company}` });
    cards.push(holder);
  });

  return {
    group: g,
    clickables: cards,
    anchor: anchor(new THREE.Vector3(RIGHT, C.y, C.z), new THREE.Vector3(-1, 0, 0), [C.w + 0.12, C.h + 0.12]),
  };
}
