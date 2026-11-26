import * as THREE from 'three';
import { BACK } from '../layout.js';
import { printed, mats } from '../materials.js';
import { mesh } from '../geometry.js';
import { staticTex, textBox, rr, FONT } from '../canvasText.js';
import { frame, anchor } from './common.js';

function pin(g, cx, cy, s, col) {
  g.save(); g.fillStyle = col;
  g.beginPath(); g.arc(cx, cy - s * 0.2, s * 0.55, Math.PI * 0.85, Math.PI * 2.15); g.lineTo(cx, cy + s * 0.85); g.closePath(); g.fill();
  g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(cx, cy - s * 0.2, s * 0.22, 0, Math.PI * 2); g.fill();
  g.restore();
}

function drawPoster(g, w, h, p, narrow) {
  const bg = g.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0f1c33'); bg.addColorStop(0.6, '#15344a'); bg.addColorStop(1, '#1b4250');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  // dot grid
  g.fillStyle = 'rgba(255,255,255,0.05)';
  const step = w / 48;
  for (let y = step / 2; y < h; y += step) for (let x = step / 2; x < w; x += step) g.fillRect(x, y, 3, 3);
  // abstract layered chevrons (top right)
  const cx = narrow ? w * 0.78 : w * 0.84, cy = narrow ? h * 0.13 : h * 0.24, S = narrow ? w * 0.22 : w * 0.13;
  const chev = (dx, dy, col) => {
    g.fillStyle = col; g.beginPath();
    g.moveTo(cx + dx, cy + dy); g.lineTo(cx + dx + S, cy + dy - S); g.lineTo(cx + dx + S * 1.5, cy + dy - S); g.lineTo(cx + dx + S * 0.5, cy + dy);
    g.lineTo(cx + dx + S * 1.5, cy + dy + S); g.lineTo(cx + dx + S, cy + dy + S); g.closePath(); g.fill();
  };
  chev(-S * 0.9, 0, 'rgba(84,197,248,0.25)'); chev(-S * 0.35, 0, 'rgba(84,197,248,0.45)'); chev(S * 0.2, 0, 'rgba(255,179,92,0.7)');

  const pad = narrow ? w * 0.09 : w * 0.07, tw = w - pad * 2;
  let y = narrow ? h * 0.27 : h * 0.17;
  const hi = narrow ? 64 : 62;
  g.font = `700 ${hi}px ${FONT}`; g.fillStyle = '#ffb35c'; g.textBaseline = 'middle'; g.textAlign = 'left';
  g.letterSpacing = '8px';
  g.fillText('HI, I\'M', pad, y);
  g.letterSpacing = '0px';
  y += hi * 0.9;
  const nameH = narrow ? h * 0.16 : h * 0.24;
  const r1 = textBox(g, p.name, pad, y, tw * (narrow ? 1 : 0.8), nameH, { size: narrow ? 220 : 260, weight: 800, color: '#fff7ec', align: 'left', nowrap: true });
  y += nameH + (narrow ? 10 : 6);
  const roleH = narrow ? h * 0.08 : h * 0.11;
  textBox(g, p.role, pad, y, tw, roleH, { size: narrow ? 104 : 120, weight: 600, color: '#8fd3ff', align: 'left', nowrap: true });
  y += roleH + (narrow ? 34 : 30);
  g.fillStyle = '#ffb35c'; rr(g, pad, y, w * 0.12, 10, 5); g.fill();
  y += narrow ? 60 : 50;
  const tagH = narrow ? h * 0.17 : h * 0.15;
  textBox(g, p.tagline, pad, y, narrow ? tw : tw * 0.75, tagH, { size: narrow ? 64 : 64, weight: 500, color: '#e9eef5', align: 'left', valign: 'top', lh: 1.3 });
  // location footer
  const fy = h - (narrow ? 110 : 100);
  pin(g, pad + 18, fy, 30, '#ffb35c');
  textBox(g, p.location, pad + 56, fy - 30, tw - 60, 60, { size: 42, weight: 500, color: '#b8c7d6', align: 'left', nowrap: true });
  g.strokeStyle = 'rgba(255,179,92,0.35)'; g.lineWidth = 4; rr(g, 26, 26, w - 52, h - 52, 18); g.stroke();
  return r1;
}

/** Name poster (Home stop) on the back wall, right of the desk. */
export function buildPoster(parent, L, profile) {
  const P = L.poster, narrow = L.mode === 'narrow';
  const g = new THREE.Group(); g.name = 'poster'; g.position.set(P.x, P.y, BACK + 0.005); parent.add(g);
  frame(g, P.w, P.h, { border: 0.045, depth: 0.04, mat: mats().blackMetal });
  const ppm = narrow ? 780 : 850; // pixels per metre
  const tex = staticTex(Math.round(P.w * ppm), Math.round(P.h * ppm), (c, w, h) => drawPoster(c, w, h, profile, narrow));
  mesh(new THREE.PlaneGeometry(P.w, P.h), printed(tex, { glow: 0.42, mat: { roughness: 0.5 } }), g, 0, 0, 0.012);
  return { group: g, anchor: anchor(new THREE.Vector3(P.x, P.y, BACK), new THREE.Vector3(0, 0, 1), [P.w + 0.1, P.h + 0.1]) };
}
