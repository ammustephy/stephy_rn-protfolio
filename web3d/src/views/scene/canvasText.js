import * as THREE from 'three';

/* Canvas helpers for text drawn into textures (boards, screens, cards). */

export const FONT = '"Inter", "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif';
export const SERIF = '"Fraunces", Georgia, "Times New Roman", serif';
export const MONO = '"JetBrains Mono", Consolas, "Cascadia Mono", Menlo, monospace';
export const HAND = '"Caveat", "Segoe Print", "Comic Sans MS", cursive';

let maxAniso = 8;
export function setMaxAnisotropy(n) { maxAniso = Math.max(1, Math.min(16, n)); }

export function mkCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

/** sRGB colour texture from a canvas, with mipmaps and anisotropy for text at an angle. */
export function canvasTex(c, opts = {}) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = opts.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  if (opts.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(opts.repeat[0], opts.repeat[1]); }
  return t;
}

export function staticTex(w, h, draw, opts) {
  const [c, g] = mkCanvas(w, h);
  draw(g, w, h);
  return canvasTex(c, opts);
}

/** Path of a rounded rectangle. */
export function rr(g, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

export function wrapLines(g, text, maxW) {
  const out = [];
  for (const para of String(text).split('\n')) {
    const words = para.split(' ');
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
    }
    out.push(line);
  }
  return out;
}

/**
 * Draws text wrapped and shrunk until it fits the box. Returns {size, height}.
 * o: size, min, lh (line height), weight, font, color, align, valign ('top'|'middle'|'bottom'), nowrap
 */
export function textBox(g, text, x, y, w, h, o = {}) {
  let size = o.size || 40;
  const lh = o.lh || 1.22, wt = o.weight || 600, fam = o.font || FONT, min = o.min || 8;
  let lines;
  for (;;) {
    g.font = `${o.italic ? 'italic ' : ''}${wt} ${size}px ${fam}`;
    lines = o.nowrap ? [text] : wrapLines(g, text, w);
    const fits = lines.length * size * lh <= h + 0.5 && lines.every((l) => g.measureText(l).width <= w + 0.5);
    if (fits || size <= min) break;
    size = Math.max(min, Math.floor(size * 0.94));
  }
  g.fillStyle = o.color || '#222';
  g.textBaseline = 'middle';
  g.textAlign = o.align || 'center';
  const total = lines.length * size * lh;
  let yy = (o.valign === 'top' ? y : o.valign === 'bottom' ? y + h - total : y + (h - total) / 2) + (size * lh) / 2;
  const xx = o.align === 'left' ? x : o.align === 'right' ? x + w : x + w / 2;
  for (const l of lines) { g.fillText(l, xx, yy); yy += size * lh; }
  return { size, height: total };
}

/**
 * Lays out chips (pills) left to right with wrapping. Returns the height used.
 * If draw is false it only measures.
 */
export function chips(g, items, x, y, w, o, draw = true) {
  const size = o.size, padX = size * 0.62, padY = size * 0.42, gap = size * 0.4, hgt = size + padY * 2;
  g.font = `${o.weight || 600} ${size}px ${o.font || FONT}`;
  let cx = x, cy = y;
  for (const it of items) {
    const tw = Math.min(g.measureText(it).width, w - padX * 2);
    const cw = tw + padX * 2;
    if (cx > x && cx + cw > x + w) { cx = x; cy += hgt + gap; }
    if (draw) {
      g.fillStyle = o.bg || '#eee';
      rr(g, cx, cy, cw, hgt, hgt / 2); g.fill();
      if (o.border) { g.strokeStyle = o.border; g.lineWidth = Math.max(1.5, size * 0.07); rr(g, cx, cy, cw, hgt, hgt / 2); g.stroke(); }
      g.fillStyle = o.color || '#222';
      g.textBaseline = 'middle'; g.textAlign = 'left';
      g.fillText(it, cx + padX, cy + hgt / 2 + size * 0.04, w - padX * 2);
    }
    cx += cw + gap;
  }
  return cy + hgt - y;
}

/** Subtle paper grain over the whole canvas. */
export function paperGrain(g, w, h, amount = 0.05, seed = 1) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const n = Math.floor((w * h) / 600);
  for (let i = 0; i < n; i++) {
    g.fillStyle = rnd() < 0.5 ? `rgba(0,0,0,${amount})` : `rgba(255,255,255,${amount})`;
    g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2);
  }
}

/** Draws an image cover-fitted into a box (clipped to a rounded rect). */
export function drawCover(g, img, x, y, w, h, r = 0, alignTop = false) {
  g.save();
  rr(g, x, y, w, h, r); g.clip();
  if (img) {
    const s = Math.max(w / img.width, h / img.height);
    const iw = img.width * s, ih = img.height * s;
    g.drawImage(img, x + (w - iw) / 2, alignTop ? y : y + (h - ih) / 2, iw, ih);
  } else {
    g.fillStyle = '#333'; g.fillRect(x, y, w, h);
  }
  g.restore();
}
