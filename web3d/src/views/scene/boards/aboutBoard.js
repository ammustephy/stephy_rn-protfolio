import * as THREE from 'three';
import { BACK } from '../layout.js';
import { printed, mats } from '../materials.js';
import { mesh } from '../geometry.js';
import { staticTex, textBox, rr, paperGrain, FONT, SERIF } from '../canvasText.js';
import { frame, anchor } from './common.js';

function drawAbout(g, w, h, p, narrow) {
  g.fillStyle = '#f5efe3'; g.fillRect(0, 0, w, h);
  paperGrain(g, w, h, 0.035, 5);
  const pad = w * (narrow ? 0.08 : 0.06), tw = w - pad * 2;
  let y = pad * 0.9;
  const titleH = narrow ? h * 0.085 : h * 0.13;
  textBox(g, 'About me', pad, y, tw, titleH, { size: narrow ? 120 : 130, weight: 700, color: '#1d3b4a', align: 'left', font: SERIF, nowrap: true });
  y += titleH + 8;
  g.fillStyle = '#d9622b'; rr(g, pad, y, w * 0.12, 9, 4); g.fill();
  y += narrow ? 44 : 40;
  const factsH = narrow ? h * 0.2 : h * 0.16;
  const bodyH = h - y - factsH - pad * 1.1;
  textBox(g, p.summary, pad, y, tw, bodyH, { size: narrow ? 52 : 50, weight: 500, color: '#2a2a2e', align: 'left', valign: 'top', lh: 1.42, min: 20 });
  // three small facts along the bottom
  const facts = [['1.5+ years', 'Flutter experience'], ['Android & iOS', 'production apps'], ['Kerala, India', 'Thiruvananthapuram']];
  const fy = h - pad * 0.9 - factsH;
  if (narrow) {
    const rowH = factsH / 3;
    facts.forEach(([a, b], i) => {
      const yy = fy + i * rowH;
      g.fillStyle = ['#2f7fd8', '#2e9a6a', '#d9622b'][i]; rr(g, pad, yy + rowH * 0.2, 12, rowH * 0.6, 6); g.fill();
      textBox(g, a, pad + 34, yy, tw * 0.48, rowH, { size: 50, weight: 700, color: '#1d3b4a', align: 'left', nowrap: true });
      textBox(g, b, pad + 34 + tw * 0.48, yy, tw * 0.5 - 34, rowH, { size: 40, weight: 500, color: '#5a5a60', align: 'left', nowrap: true });
    });
  } else {
    const cw = (tw - 40) / 3;
    facts.forEach(([a, b], i) => {
      const x = pad + i * (cw + 20);
      g.fillStyle = 'rgba(29,59,74,0.07)'; rr(g, x, fy, cw, factsH, 18); g.fill();
      g.fillStyle = ['#2f7fd8', '#2e9a6a', '#d9622b'][i]; rr(g, x, fy, 10, factsH, 5); g.fill();
      textBox(g, a, x + 34, fy + factsH * 0.1, cw - 50, factsH * 0.46, { size: 54, weight: 700, color: '#1d3b4a', align: 'left', nowrap: true });
      textBox(g, b, x + 34, fy + factsH * 0.52, cw - 50, factsH * 0.38, { size: 38, weight: 500, color: '#5a5a60', align: 'left', nowrap: true });
    });
  }
}

/** Framed "About me" board on the back wall above the sideboard. */
export function buildAboutBoard(parent, L, profile) {
  const A = L.about, narrow = L.mode === 'narrow';
  const g = new THREE.Group(); g.name = 'about'; g.position.set(A.x, A.y, BACK + 0.005); parent.add(g);
  frame(g, A.w, A.h, { border: 0.05, depth: 0.045, mat: mats().frameWood });
  const ppm = narrow ? 820 : 1000;
  const tex = staticTex(Math.round(A.w * ppm), Math.round(A.h * ppm), (c, w, h) => drawAbout(c, w, h, profile, narrow));
  mesh(new THREE.PlaneGeometry(A.w, A.h), printed(tex, { glow: 0.38 }), g, 0, 0, 0.01);
  return { group: g, anchor: anchor(new THREE.Vector3(A.x, A.y, BACK), new THREE.Vector3(0, 0, 1), [A.w + 0.12, A.h + 0.12]) };
}
