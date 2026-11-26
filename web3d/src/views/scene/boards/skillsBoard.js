import * as THREE from 'three';
import { LEFT } from '../layout.js';
import { printed, mats, std } from '../materials.js';
import { rbox, mesh } from '../geometry.js';
import { staticTex, textBox, chips, rr, FONT, HAND } from '../canvasText.js';
import { anchor } from './common.js';

function tint(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Masonry of skill groups; font size is the largest that fits the board. */
function drawSkills(g, w, h, groups, narrow) {
  // whiteboard surface with faint marker ghosting
  g.fillStyle = '#fbfbf8'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(80,90,110,0.05)'; g.lineWidth = 18; g.lineCap = 'round';
  g.beginPath(); g.moveTo(w * 0.1, h * 0.8); g.bezierCurveTo(w * 0.3, h * 0.6, w * 0.5, h * 0.95, w * 0.8, h * 0.7); g.stroke();

  const pad = w * (narrow ? 0.045 : 0.03);
  const titleH = narrow ? h * 0.075 : h * 0.1;
  textBox(g, 'Skills', pad, pad * 0.6, w * 0.5, titleH, { size: 150, weight: 700, color: '#1d3b4a', align: 'left', font: HAND, nowrap: true });
  textBox(g, `${groups.reduce((a, x) => a + x.skills.length, 0)} skills · ${groups.length} groups`, w * 0.5, pad * 0.6, w * 0.5 - pad, titleH,
    { size: narrow ? 40 : 44, weight: 500, color: '#6a7080', align: 'right', nowrap: true });

  const top = pad * 0.6 + titleH + pad * 0.5, avail = h - top - pad * 0.7;
  const cols = narrow ? 2 : 4, gap = pad * 0.6, cw = (w - pad * 2 - gap * (cols - 1)) / cols;

  const layout = (size, draw) => {
    const heights = new Array(cols).fill(0);
    const inner = size * 0.75, headH = size * 1.55;
    for (const grp of groups) {
      let c = 0; for (let i = 1; i < cols; i++) if (heights[i] < heights[c] - 1) c = i;
      const x = pad + c * (cw + gap), y = top + heights[c];
      const chipH = chips(g, grp.skills, x + inner, 0, cw - inner * 2, { size }, false);
      const cardH = inner + headH + chipH + inner;
      if (draw) {
        g.fillStyle = tint(grp.color, 0.09); rr(g, x, y, cw, cardH, size * 0.6); g.fill();
        g.fillStyle = grp.color; rr(g, x, y, size * 0.32, cardH, size * 0.16); g.fill();
        textBox(g, grp.title, x + inner, y + inner * 0.6, cw - inner * 2, headH, { size: size * 1.28, weight: 700, color: grp.color, align: 'left', font: HAND, nowrap: true, min: 10 });
        chips(g, grp.skills, x + inner, y + inner * 0.6 + headH + size * 0.2, cw - inner * 2, { size, bg: '#ffffff', border: tint(grp.color, 0.55), color: '#23262e', weight: 600 }, true);
      }
      heights[c] += cardH + gap;
    }
    return Math.max(...heights) - gap;
  };
  let size = narrow ? 60 : 64;
  while (size > 14 && layout(size, false) > avail) size -= 1;
  layout(size, true);
}

/** Whiteboard with every skill, on the left wall. */
export function buildSkillsBoard(parent, L, groups) {
  const S = L.skills, narrow = L.mode === 'narrow', M = mats();
  const g = new THREE.Group(); g.name = 'skills';
  g.position.set(LEFT + 0.005, S.y, S.z); g.rotation.y = Math.PI / 2; parent.add(g);
  // aluminium frame + board
  const bw = S.w, bh = S.h, fr = 0.025;
  mesh(rbox(bw + fr * 2, bh + fr * 2, 0.03, 0.008, 0.012), M.aluminium, g, 0, 0, 0.015, { cast: true });
  const ppm = narrow ? 600 : 560;
  const tex = staticTex(Math.round(bw * ppm), Math.round(bh * ppm), (c, w, h) => drawSkills(c, w, h, groups, narrow));
  const surf = mesh(new THREE.PlaneGeometry(bw, bh), printed(tex, { glow: 0.3, mat: { roughness: 0.5, envMapIntensity: 0.2 } }), g, 0, 0, 0.0305);
  surf.receiveShadow = true;
  // marker tray with markers and an eraser
  mesh(rbox(bw * 0.5, 0.025, 0.07, 0.006), M.aluminium, g, 0, -bh / 2 - fr - 0.012, 0.05, { cast: true });
  ['#1d3b4a', '#c23b6b', '#2f7fd8'].forEach((col, i) => {
    const m = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.13, 10), std(col, { roughness: 0.4 }), g, -0.2 + i * 0.08, -bh / 2 - fr + 0.008, 0.055, { cast: true });
    m.rotation.z = Math.PI / 2 + (i - 1) * 0.05;
  });
  mesh(rbox(0.12, 0.03, 0.045, 0.008), std('#3a3f4a', { roughness: 0.8 }), g, 0.22, -bh / 2 - fr + 0.012, 0.055, { cast: true });
  return { group: g, anchor: anchor(new THREE.Vector3(LEFT, S.y, S.z), new THREE.Vector3(1, 0, 0), [bw + 0.1, bh + 0.16]) };
}
