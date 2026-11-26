import * as THREE from 'three';
import { mkCanvas, canvasTex } from './canvasText.js';
import { rng } from './geometry.js';

/*
 * Procedural textures drawn on canvases (no image files needed):
 * floor planks, desk wood, cork, rug weave, wall paint, fabric, glow and smoke sprites.
 * Textures are cached; use tiled() to get a copy with its own repeat.
 */

const cache = new Map();
function once(key, make) {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
}

function hsl(h, s, l, a = 1) { return `hsla(${h},${s}%,${l}%,${a})`; }

/** Wood grain lines inside a rectangle (used by planks and desk top). */
function grain(g, x, y, w, h, R, base, lines = 40, horizontal = true) {
  g.save();
  g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = base; g.fillRect(x, y, w, h);
  const grd = horizontal ? g.createLinearGradient(x, y, x + w, y) : g.createLinearGradient(x, y, x, y + h);
  grd.addColorStop(0, 'rgba(0,0,0,0.06)'); grd.addColorStop(0.5, 'rgba(255,255,255,0.05)'); grd.addColorStop(1, 'rgba(0,0,0,0.08)');
  g.fillStyle = grd; g.fillRect(x, y, w, h);
  for (let i = 0; i < lines; i++) {
    const off = R() * (horizontal ? h : w), amp = 1 + R() * 4, freq = 0.004 + R() * 0.02, ph = R() * 10;
    g.strokeStyle = R() < 0.5 ? `rgba(40,20,8,${0.08 + R() * 0.14})` : `rgba(255,230,200,${0.04 + R() * 0.06})`;
    g.lineWidth = 0.6 + R() * 1.6;
    g.beginPath();
    const L = horizontal ? w : h;
    for (let t = 0; t <= L; t += 6) {
      const d = off + Math.sin(t * freq + ph) * amp + Math.sin(t * freq * 3.1 + ph) * amp * 0.3;
      if (horizontal) { if (t) g.lineTo(x + t, y + d); else g.moveTo(x + t, y + d); }
      else if (t) g.lineTo(x + d, y + t); else g.moveTo(x + d, y + t);
    }
    g.stroke();
  }
  if (R() < 0.35) {
    const kx = x + R() * w, ky = y + R() * h;
    for (let r = 10; r > 1; r -= 2.5) {
      g.strokeStyle = 'rgba(50,25,10,0.12)'; g.lineWidth = 1.2;
      g.beginPath(); g.ellipse(kx, ky, r * 2.4, r, 0, 0, Math.PI * 2); g.stroke();
    }
  }
  g.restore();
}

/** Oak floor planks. One tile = 2 m x 2 m (planks 0.2 m wide). */
export function floorPlanks() {
  return once('floor', () => {
    const R = rng(11), S = 1024, [c, g] = mkCanvas(S, S);
    const rows = 10, ph = S / rows;
    for (let r = 0; r < rows; r++) {
      let x = -R() * 400;
      while (x < S) {
        const len = 300 + R() * 420;
        grain(g, x, r * ph, len, ph, R, hsl(27 + R() * 8, 36 + R() * 12, 33 + R() * 9), 14, true);
        g.fillStyle = 'rgba(20,10,4,0.55)'; g.fillRect(x, r * ph, 2, ph);
        x += len;
      }
      g.fillStyle = 'rgba(20,10,4,0.6)'; g.fillRect(0, r * ph + ph - 2, S, 2);
    }
    return canvasTex(c);
  });
}

/** Warm walnut for the desk top. */
export function deskWood() {
  return once('desk', () => {
    const R = rng(21), [c, g] = mkCanvas(1024, 512);
    grain(g, 0, 0, 1024, 512, R, '#7a4d2e', 70, true);
    return canvasTex(c);
  });
}

/** Lighter oak for frames and the bookshelf. */
export function lightWood() {
  return once('light', () => {
    const R = rng(23), [c, g] = mkCanvas(512, 512);
    grain(g, 0, 0, 512, 512, R, '#b48459', 40, true);
    return canvasTex(c);
  });
}

export function cork() {
  return once('cork', () => {
    const R = rng(31), S = 512, [c, g] = mkCanvas(S, S);
    g.fillStyle = '#b8875a'; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 9000; i++) {
      const v = R();
      g.fillStyle = v < 0.45 ? `rgba(110,62,28,${0.25 + R() * 0.3})` : v < 0.85 ? `rgba(235,200,150,${0.15 + R() * 0.25})` : 'rgba(60,30,10,0.35)';
      const s = 1 + R() * 3.5;
      g.beginPath(); g.ellipse(R() * S, R() * S, s, s * (0.5 + R() * 0.6), R() * 3, 0, Math.PI * 2); g.fill();
    }
    return canvasTex(c);
  });
}

/** Hand-woven rug with a border, stripes and diamonds. */
export function rugWeave() {
  return once('rug', () => {
    const R = rng(41), W = 1024, H = 768, [c, g] = mkCanvas(W, H);
    g.fillStyle = '#e6d6bb'; g.fillRect(0, 0, W, H);
    const bands = [['#8a2f2a', 40], ['#e6d6bb', 22], ['#c9932f', 14], ['#e6d6bb', 22], ['#2f5f5a', 18]];
    let inset = 0;
    for (const [col, wdt] of bands) {
      g.strokeStyle = col; g.lineWidth = wdt;
      g.strokeRect(inset + wdt / 2, inset + wdt / 2, W - inset * 2 - wdt, H - inset * 2 - wdt);
      inset += wdt;
    }
    g.fillStyle = 'rgba(138,47,42,0.75)';
    for (let i = 0; i < 5; i++) {
      const cx = W * (0.25 + i * 0.125), cy = H / 2;
      g.beginPath(); g.moveTo(cx, cy - 70); g.lineTo(cx + 45, cy); g.lineTo(cx, cy + 70); g.lineTo(cx - 45, cy); g.closePath(); g.fill();
    }
    g.strokeStyle = 'rgba(47,95,90,0.7)'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(200, H / 2); g.lineTo(W - 200, H / 2); g.stroke();
    for (let y = 0; y < H; y += 4) {
      for (let x = (y / 4) % 2 ? 0 : 2; x < W; x += 4) {
        g.fillStyle = `rgba(0,0,0,${0.04 + R() * 0.07})`; g.fillRect(x, y, 2, 2);
      }
    }
    return canvasTex(c);
  });
}

/** Very subtle wall paint (roller texture). Colour comes from the material. */
export function wallPaint() {
  return once('wall', () => {
    const R = rng(51), S = 512, [c, g] = mkCanvas(S, S);
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 14000; i++) {
      g.fillStyle = R() < 0.5 ? `rgba(0,0,0,${R() * 0.045})` : `rgba(255,255,255,${R() * 0.05})`;
      g.fillRect(R() * S, R() * S, 1 + R() * 3, 1 + R() * 3);
    }
    return canvasTex(c);
  });
}

/** Neutral woven fabric (tinted by material colour). */
export function fabric() {
  return once('fabric', () => {
    const R = rng(61), S = 256, [c, g] = mkCanvas(S, S);
    g.fillStyle = '#dcdcdc'; g.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 2) { g.fillStyle = `rgba(0,0,0,${0.05 + R() * 0.07})`; g.fillRect(0, y, S, 1); }
    for (let x = 0; x < S; x += 2) { g.fillStyle = `rgba(255,255,255,${0.05 + R() * 0.07})`; g.fillRect(x, 0, 1, S); }
    for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(0,0,0,${R() * 0.08})`; g.fillRect(R() * S, R() * S, 3, 1); }
    return canvasTex(c);
  });
}

/** Soft round glow used for bulb halos. */
export function glowSprite() {
  return once('glow', () => {
    const [c, g] = mkCanvas(128, 128);
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return canvasTex(c);
  });
}

/** Wispy puff for the coffee steam. */
export function smokeSprite() {
  return once('smoke', () => {
    const R = rng(71), [c, g] = mkCanvas(128, 128);
    for (let i = 0; i < 18; i++) {
      const x = 40 + R() * 48, y = 40 + R() * 48, r = 14 + R() * 26;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(255,255,255,0.22)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    }
    return canvasTex(c);
  });
}

/** A copy of a shared texture with its own repeat (the image is shared). */
export function tiled(tex, rx, ry, rot = 0) {
  const t = tex.clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  if (rot) { t.center.set(0.5, 0.5); t.rotation = rot; }
  t.needsUpdate = true;
  return t;
}
