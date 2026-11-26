import * as THREE from 'three';
import { BACK, DESK } from '../layout.js';
import { printed, screen, mats } from '../materials.js';
import { mesh } from '../geometry.js';
import { staticTex, textBox, rr, drawCover, FONT, MONO } from '../canvasText.js';
import { frame, anchor, clickable, replaceMaterial } from './common.js';

/** Framed print for one app project: phone mock-up with a real screenshot, title and tagline. */
function drawFramePrint(g, w, h, p, img) {
  const bg = g.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, p.color); bg.addColorStop(1, '#141824');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,0.06)';
  g.beginPath(); g.arc(w * 0.85, h * 0.1, w * 0.4, 0, Math.PI * 2); g.fill();
  // phone mock-up
  const pw = w * 0.42, ph = pw * 2.04, px = (w - pw) / 2, py = h * 0.05;
  g.fillStyle = '#0d0e12'; rr(g, px - 8, py - 8, pw + 16, ph + 16, 34); g.fill();
  drawCover(g, img, px, py, pw, ph, 26, true);
  g.fillStyle = '#0d0e12'; rr(g, px + pw / 2 - 30, py + 10, 60, 14, 7); g.fill();
  // text block
  const ty = py + ph + 30;
  textBox(g, p.title, 26, ty, w - 52, h * 0.1, { size: 64, weight: 800, color: '#ffffff', nowrap: true });
  textBox(g, p.tagline, 26, ty + h * 0.095, w - 52, h * 0.06, { size: 30, weight: 500, color: 'rgba(255,255,255,0.82)', nowrap: true });
  const bw = w * 0.56, bh = h * 0.062, bx = (w - bw) / 2, by = h - bh - h * 0.035;
  g.fillStyle = '#ffffff'; rr(g, bx, by, bw, bh, bh / 2); g.fill();
  textBox(g, 'View project →', bx, by, bw, bh, { size: 30, weight: 700, color: '#141824', nowrap: true });
}

/** Monitor screen: a browser window showing the portfolio website project. */
function drawMonitor(g, w, h, p, img) {
  g.fillStyle = '#1b1d24'; g.fillRect(0, 0, w, h);
  // browser chrome
  g.fillStyle = '#2a2d36'; g.fillRect(0, 0, w, 64);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(34 + i * 30, 32, 9, 0, Math.PI * 2); g.fill(); });
  g.fillStyle = '#1b1d24'; rr(g, 150, 12, 300, 52, 10); g.fill();
  textBox(g, 'Portfolio · Flutter web', 170, 12, 270, 52, { size: 22, weight: 500, color: '#d6d9e0', align: 'left', nowrap: true });
  g.fillStyle = '#3a3e49'; rr(g, 480, 16, w - 520, 34, 17); g.fill();
  textBox(g, 'stephy-rn · portfolio', 500, 16, w - 560, 34, { size: 20, weight: 500, color: '#aeb3bf', align: 'left', nowrap: true, font: MONO });
  // the site screenshot
  drawCover(g, img, 0, 64, w, h - 64, 0, true);
  // caption bar
  const bh = h * 0.2, by = h - bh;
  const gr = g.createLinearGradient(0, by - 40, 0, h);
  gr.addColorStop(0, 'rgba(10,12,18,0)'); gr.addColorStop(0.35, 'rgba(10,12,18,0.88)'); gr.addColorStop(1, 'rgba(10,12,18,0.95)');
  g.fillStyle = gr; g.fillRect(0, by - 40, w, bh + 40);
  textBox(g, p.title, 40, by + 6, w * 0.6, bh * 0.5, { size: 62, weight: 800, color: '#ffffff', align: 'left', nowrap: true });
  textBox(g, p.tagline, 40, by + bh * 0.52, w * 0.6, bh * 0.36, { size: 32, weight: 500, color: '#c9ced8', align: 'left', nowrap: true });
  const bw = w * 0.24, bb = bh * 0.46, bx = w - bw - 40, byy = by + (bh - bb) / 2;
  g.fillStyle = p.color; rr(g, bx, byy, bw, bb, bb / 2); g.fill();
  textBox(g, 'View project →', bx, byy, bw, bb, { size: 34, weight: 700, color: '#ffffff', nowrap: true });
}

/**
 * The three app projects as framed prints above the desk, and the portfolio
 * website on the 27" monitor. All four are clickable.
 */
export function buildProjectsWall(parent, L, projects, images, monitorScreen) {
  const g = new THREE.Group(); g.name = 'projects'; parent.add(g);
  const clickables = [];
  const { w: fw, h: fh } = L.frameSize;
  for (const f of L.frames) {
    const p = projects.find((x) => x.id === f.id);
    const holder = new THREE.Group(); holder.position.set(f.x, f.y, BACK + 0.005); g.add(holder);
    frame(holder, fw, fh, { border: 0.028, depth: 0.03, mat: mats().frameWood });
    const tex = staticTex(600, Math.round(600 * fh / fw), (c, w, h) => drawFramePrint(c, w, h, p, images[p.id]));
    mesh(new THREE.PlaneGeometry(fw, fh), printed(tex, { glow: 0.24, mat: { roughness: 0.6 } }), holder, 0, 0, 0.008);
    const glass = mesh(new THREE.PlaneGeometry(fw, fh), mats().glass, holder, 0, 0, 0.022);
    glass.renderOrder = 2;
    clickable(holder, { type: 'project', id: p.id, label: `Open project ${p.title}` });
    clickables.push(holder);
  }

  const web = projects.find((x) => x.coverKind === 'wide');
  const monTex = staticTex(1600, 900, (c, w, h) => drawMonitor(c, w, h, web, images[web.id]));
  replaceMaterial(monitorScreen, screen(monTex));
  clickable(monitorScreen, { type: 'project', id: web.id, label: `Open project ${web.title}`, lift: 0 });
  clickables.push(monitorScreen);

  // framing: frames + monitor + desk front edge
  const ys = L.frames.map((f) => f.y);
  const top = Math.max(...ys) + fh / 2 + 0.05, bottom = DESK.h + 0.1;
  const xs = L.frames.map((f) => f.x);
  const left = Math.min(...xs) - fw / 2 - 0.05, right = Math.max(...xs) + fw / 2 + 0.05;
  return {
    group: g,
    clickables,
    anchor: anchor(new THREE.Vector3((left + right) / 2, (top + bottom) / 2, BACK + 0.25), new THREE.Vector3(0, 0, 1), [right - left + 0.1, top - bottom]),
  };
}
