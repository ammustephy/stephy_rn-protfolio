import * as THREE from 'three';
import { screen } from '../materials.js';
import { mkCanvas, canvasTex, textBox, rr, FONT, MONO } from '../canvasText.js';
import { replaceMaterial, clickable, anchor } from './common.js';

/*
 * Laptop and phone screens. The contact page shows on the laptop (wide
 * screens) or the phone (portrait phones); the other device shows a code
 * editor / lock screen. Links on the contact page are hit regions in
 * texture space, so they can be clicked in 3D.
 */

function icon(g, type, cx, cy, s, col) {
  g.save(); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = s * 0.13; g.lineCap = 'round'; g.lineJoin = 'round';
  switch (type) {
    case 'mail':
      rr(g, cx - s * 0.75, cy - s * 0.5, s * 1.5, s, s * 0.14); g.stroke();
      g.beginPath(); g.moveTo(cx - s * 0.65, cy - s * 0.38); g.lineTo(cx, cy + s * 0.08); g.lineTo(cx + s * 0.65, cy - s * 0.38); g.stroke(); break;
    case 'phone':
      rr(g, cx - s * 0.38, cy - s * 0.7, s * 0.76, s * 1.4, s * 0.16); g.stroke();
      g.beginPath(); g.moveTo(cx - s * 0.12, cy + s * 0.48); g.lineTo(cx + s * 0.12, cy + s * 0.48); g.stroke(); break;
    case 'pin':
      g.beginPath(); g.arc(cx, cy - s * 0.2, s * 0.48, Math.PI * 0.85, Math.PI * 2.15); g.lineTo(cx, cy + s * 0.72); g.closePath(); g.stroke();
      g.beginPath(); g.arc(cx, cy - s * 0.2, s * 0.16, 0, Math.PI * 2); g.fill(); break;
    case 'code':
      g.beginPath(); g.moveTo(cx - s * 0.3, cy - s * 0.45); g.lineTo(cx - s * 0.75, cy); g.lineTo(cx - s * 0.3, cy + s * 0.45);
      g.moveTo(cx + s * 0.3, cy - s * 0.45); g.lineTo(cx + s * 0.75, cy); g.lineTo(cx + s * 0.3, cy + s * 0.45); g.stroke(); break;
    case 'in':
      g.font = `800 ${s * 1.1}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('in', cx, cy + s * 0.05); break;
    case 'down':
      g.beginPath(); g.moveTo(cx, cy - s * 0.6); g.lineTo(cx, cy + s * 0.25); g.moveTo(cx - s * 0.4, cy - s * 0.1); g.lineTo(cx, cy + s * 0.3); g.lineTo(cx + s * 0.4, cy - s * 0.1);
      g.moveTo(cx - s * 0.6, cy + s * 0.65); g.lineTo(cx + s * 0.6, cy + s * 0.65); g.stroke(); break;
  }
  g.restore();
}

function contactLinks(p) {
  return [
    { id: 'email', kind: 'row', icon: 'mail', label: 'Email', value: p.email, href: `mailto:${p.email}` },
    { id: 'phone', kind: 'row', icon: 'phone', label: 'Mobile', value: p.phone, href: p.phoneHref },
    { id: 'location', kind: 'row', icon: 'pin', label: 'Location', value: p.location, href: null },
    { id: 'github', kind: 'btn', icon: 'code', label: 'GitHub', href: p.github },
    { id: 'linkedin', kind: 'btn', icon: 'in', label: 'LinkedIn', href: p.linkedin },
    { id: 'resume', kind: 'btn', icon: 'down', label: 'Resume', href: p.resume, download: true },
  ];
}

/** Draws the contact page and returns the clickable rectangles (canvas pixels). */
function drawContact(g, w, h, p, hover, portrait) {
  const bg = g.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#fff1e2'); bg.addColorStop(1, '#ffd9cf');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(217,98,43,0.08)'; g.beginPath(); g.arc(w * 0.92, h * 0.05, w * 0.3, 0, Math.PI * 2); g.fill();
  const links = contactLinks(p), rects = [];
  const pad = portrait ? w * 0.08 : w * 0.06, tw = w - pad * 2;
  let y = portrait ? h * 0.07 : h * 0.07;
  if (portrait) { // status bar
    textBox(g, timeString(), pad, 14, 200, 50, { size: 30, weight: 600, color: '#2a1d2e', align: 'left', nowrap: true });
    g.fillStyle = '#111'; rr(g, w / 2 - 70, 18, 140, 38, 19); g.fill();
  }
  const hH = portrait ? h * 0.085 : h * 0.15;
  textBox(g, 'Let\'s talk', pad, y, tw, hH, { size: portrait ? 120 : 140, weight: 800, color: '#2a1d2e', align: 'left', nowrap: true });
  y += hH;
  const nH = portrait ? h * 0.075 : h * 0.07;
  textBox(g, p.contactNote, pad, y, tw, nH, { size: portrait ? 34 : 36, weight: 500, color: '#5b4a55', align: 'left', valign: 'top', lh: 1.3 });
  y += nH + (portrait ? 20 : 26);

  const rows = links.filter((l) => l.kind === 'row'), btns = links.filter((l) => l.kind === 'btn');
  const rowH = portrait ? h * 0.1 : h * 0.125, rowGap = portrait ? 16 : 14;
  for (const l of rows) {
    const on = hover === l.id && l.href;
    g.fillStyle = on ? '#2a1d2e' : 'rgba(255,255,255,0.72)'; rr(g, pad, y, tw, rowH, rowH * 0.28); g.fill();
    const ic = rowH * 0.5;
    g.fillStyle = on ? '#ff9d6b' : '#2a1d2e'; g.beginPath(); g.arc(pad + rowH * 0.55, y + rowH / 2, ic * 0.72, 0, Math.PI * 2); g.fill();
    icon(g, l.icon, pad + rowH * 0.55, y + rowH / 2, ic * 0.55, on ? '#2a1d2e' : '#ffffff');
    const tx = pad + rowH * 1.1, tW = tw - rowH * 1.2;
    textBox(g, l.label.toUpperCase(), tx, y + rowH * 0.1, tW, rowH * 0.32, { size: portrait ? 24 : 26, weight: 700, color: on ? '#ffb38f' : '#9a6a5a', align: 'left', nowrap: true });
    textBox(g, l.value, tx, y + rowH * 0.4, tW, rowH * 0.5, { size: portrait ? 40 : 46, weight: 700, color: on ? '#ffffff' : '#2a1d2e', align: 'left', nowrap: true });
    if (l.href) rects.push({ ...l, x: pad, y, w: tw, h: rowH });
    y += rowH + rowGap;
  }
  y += portrait ? 14 : 10;
  const bH = portrait ? h * 0.07 : h * 0.12;
  if (portrait) {
    for (const l of btns) {
      const on = hover === l.id;
      g.fillStyle = on ? '#d9622b' : '#2a1d2e'; rr(g, pad, y, tw, bH, bH / 2); g.fill();
      icon(g, l.icon, pad + bH * 0.6, y + bH / 2, bH * 0.32, '#ffffff');
      textBox(g, l.id === 'resume' ? 'Download resume' : l.label, pad + bH, y, tw - bH * 1.4, bH, { size: 40, weight: 700, color: '#ffffff', align: 'left', nowrap: true });
      rects.push({ ...l, x: pad, y, w: tw, h: bH });
      y += bH + 16;
    }
  } else {
    const gap = 22, bw = (tw - gap * 2) / 3;
    btns.forEach((l, i) => {
      const on = hover === l.id, x = pad + i * (bw + gap);
      g.fillStyle = on ? '#d9622b' : '#2a1d2e'; rr(g, x, y, bw, bH, bH / 2); g.fill();
      icon(g, l.icon, x + bH * 0.55, y + bH / 2, bH * 0.3, '#ffffff');
      textBox(g, l.id === 'resume' ? 'Download resume' : l.label, x + bH * 0.95, y, bw - bH * 1.15, bH, { size: 38, weight: 700, color: '#ffffff', align: 'left', nowrap: true });
      rects.push({ ...l, x, y, w: bw, h: bH });
    });
  }
  return rects;
}

function timeString(d = new Date()) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function drawLock(g, w, h) {
  const bg = g.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#1b1a44'); bg.addColorStop(0.55, '#b4567a'); bg.addColorStop(1, '#f08a5d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = '#111'; rr(g, w / 2 - 70, 18, 140, 38, 19); g.fill();
  const d = new Date();
  textBox(g, timeString(d), 0, h * 0.12, w, h * 0.12, { size: 190, weight: 300, color: '#ffffff', nowrap: true });
  textBox(g, d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }), 0, h * 0.25, w, 60, { size: 38, weight: 500, color: '#ffe2c4', nowrap: true });
  g.fillStyle = 'rgba(255,255,255,0.2)'; rr(g, 30, h * 0.62, w - 60, 150, 30); g.fill();
  textBox(g, 'Flutter build', 60, h * 0.62 + 18, w - 120, 50, { size: 30, weight: 700, color: '#ffffff', align: 'left', nowrap: true });
  textBox(g, 'app-release.aab built successfully ✓', 60, h * 0.62 + 70, w - 120, 60, { size: 28, weight: 500, color: '#fff', align: 'left' });
}

function drawCode(g, w, h) {
  g.fillStyle = '#1e1f29'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#272836'; g.fillRect(0, 0, w, 54); g.fillRect(0, 54, 230, h);
  g.fillStyle = '#1e1f29'; g.fillRect(230, 8, 260, 46);
  g.font = `500 24px ${MONO}`; g.textBaseline = 'middle'; g.textAlign = 'left';
  g.fillStyle = '#d6d6e2'; g.fillText('portfolio.dart', 252, 31);
  ['lib', '  main.dart', '  views', '  viewmodels', '  models', '  data'].forEach((t, i) => { g.fillStyle = '#9a9ab0'; g.fillText(t, 20, 96 + i * 40); });
  const code = [
    [['class ', '#ff8fb1'], ['Stephy ', '#8fe3e0'], ['extends ', '#ff8fb1'], ['Developer {', '#e6e6f0']],
    [['  final ', '#ff8fb1'], ['stack = [', '#e6e6f0'], ["'Flutter'", '#ffd08a'], [', ', '#e6e6f0'], ["'Dart'", '#ffd08a'], ['];', '#e6e6f0']],
    [['  final ', '#ff8fb1'], ['city = ', '#e6e6f0'], ["'Thiruvananthapuram'", '#ffd08a'], [';', '#e6e6f0']],
    [['', '#e6e6f0']],
    [['  @override', '#9ad27f']],
    [['  Widget ', '#8fe3e0'], ['build', '#9fb8ff'], ['(context) {', '#e6e6f0']],
    [['    return ', '#ff8fb1'], ['Portfolio', '#8fe3e0'], ['(', '#e6e6f0']],
    [['      apps: ', '#e6e6f0'], ['projects', '#9fb8ff'], [',', '#e6e6f0']],
    [['      langs: ', '#e6e6f0'], ["['EN', 'FR', 'AR']", '#ffd08a'], [',', '#e6e6f0']],
    [['    );', '#e6e6f0']],
    [['  }', '#e6e6f0']],
    [['}', '#e6e6f0']],
  ];
  code.forEach((line, i) => {
    let x = 310; const y = 96 + i * 52;
    g.font = `500 30px ${MONO}`;
    g.fillStyle = '#5c5d72'; g.fillText(String(i + 1).padStart(2, ' '), 250, y);
    for (const [t, c] of line) { g.fillStyle = c; g.fillText(t, x, y); x += g.measureText(t).width; }
  });
  g.fillStyle = '#ffd08a'; g.fillRect(310, 96 + 12 * 52 - 18, 16, 36);
}

/** A screen whose texture is redrawn only when its state changes. */
function dynScreen(meshObj, w, h, draw) {
  const [c, g] = mkCanvas(w, h);
  const tex = canvasTex(c);
  replaceMaterial(meshObj, screen(tex));
  let last = null, rects = [];
  return {
    set(state) {
      const key = JSON.stringify(state);
      if (key === last) return;
      last = key;
      g.clearRect(0, 0, w, h);
      rects = draw(g, w, h, state) || [];
      tex.needsUpdate = true;
    },
    hit(uv) {
      const x = uv.x * w, y = (1 - uv.y) * h;
      return rects.find((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) || null;
    },
  };
}

/**
 * Sets up the laptop and phone screens for a layout.
 * Returns {clickables, anchor, update(), setHover(id)}.
 */
export function buildScreens(L, profile, laptopScreen, phoneScreen) {
  const portrait = L.mode === 'narrow';
  const lap = dynScreen(laptopScreen, 1480, 925, (g, w, h, s) => (s.page === 'contact' ? drawContact(g, w, h, profile, s.hover, false) : drawCode(g, w, h)));
  const ph = dynScreen(phoneScreen, 715, 1565, (g, w, h, s) => (s.page === 'contact' ? drawContact(g, w, h, profile, s.hover, true) : drawLock(g, w, h)));
  const contactMesh = portrait ? phoneScreen : laptopScreen;
  const contact = portrait ? ph : lap;
  let hover = null, minute = '';
  const refresh = () => {
    lap.set({ page: portrait ? 'code' : 'contact', hover: portrait ? null : hover });
    ph.set({ page: portrait ? 'contact' : 'lock', hover: portrait ? hover : null, t: minute });
  };
  refresh();
  clickable(contactMesh, { type: 'regions', label: 'Contact links', lift: 0, hit: (uv) => contact.hit(uv) });

  // framing: the screen centre and its facing direction in world space
  contactMesh.updateWorldMatrix(true, false);
  const c = new THREE.Vector3(), n = new THREE.Vector3(0, 0, 1);
  contactMesh.getWorldPosition(c);
  n.applyQuaternion(contactMesh.getWorldQuaternion(new THREE.Quaternion()));
  const size = portrait ? [0.0715 * 1.12, 0.1565 * 1.08] : [0.296 * 1.1, 0.185 * 1.12];

  return {
    clickables: [contactMesh],
    anchor: anchor(c, n, size, { near: true }),
    setHover(id) { if (id !== hover) { hover = id; refresh(); } },
    update() {
      const m = timeString();
      if (m !== minute) { minute = m; refresh(); }
    },
  };
}
