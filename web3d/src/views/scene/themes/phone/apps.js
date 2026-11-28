import { textBox, rr, chips, wrapLines, drawCover, FONT } from '../../canvasText.js';
import { glyph } from './glyphs.js';

/*
 * The app UIs drawn into canvas textures (iOS / Material-like, light theme).
 * Every draw function works in texture pixels and gets `narrow` (portrait
 * phones: bigger text, stacked cards). Things that can be clicked are returned:
 *   cards   – separate meshes on top of the window (jobs, projects), with their own draw()
 *   regions – hit rectangles in texture space (contact links)
 */

/** The six apps of the world, one per stop after Home. */
export const APPS = {
  about: { name: 'Profile', glyph: 'user', color: '#e9789f' },
  skills: { name: 'Skills', glyph: 'spark', color: '#8577ee' },
  experience: { name: 'Experience', glyph: 'case', color: '#ef8a4c' },
  projects: { name: 'Projects', glyph: 'grid', color: '#3fae7c' },
  education: { name: 'Wallet', glyph: 'cap', color: '#2ea2b6' },
  contact: { name: 'Mail', glyph: 'mail', color: '#4a8ee6' },
};

const INK = '#1f1d2b', GREY = '#5d5a6d', SOFT = '#8b8799', BG = '#f6f5fa';

/** Mixes a #rrggbb colour with black (amount > 0) or white (amount < 0). */
export function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16), t = amount < 0 ? 255 : 0, p = Math.abs(amount);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (t - v) * p));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function alpha(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Rounded app icon (squircle) with a glyph. */
export function appIcon(g, x, y, s, color, type) {
  const gr = g.createLinearGradient(x, y, x, y + s);
  gr.addColorStop(0, shade(color, -0.18)); gr.addColorStop(1, shade(color, 0.08));
  g.fillStyle = gr; rr(g, x, y, s, s, s * 0.26); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.18)'; rr(g, x + s * 0.06, y + s * 0.05, s * 0.88, s * 0.42, s * 0.2); g.fill();
  glyph(g, type, x + s / 2, y + s / 2, s * 0.3);
}

/** Left-aligned paragraph cut to maxLines, with an ellipsis if it is longer. */
function clampLines(g, text, x, y, w, maxLines, size, color, weight = 500, lh = 1.4) {
  g.font = `${weight} ${size}px ${FONT}`;
  let lines = wrapLines(g, text, w);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    let last = lines[maxLines - 1];
    while (last && g.measureText(last + '…').width > w) last = last.slice(0, last.lastIndexOf(' ') > 0 ? last.lastIndexOf(' ') : last.length - 1);
    lines[maxLines - 1] = last.replace(/[,.;:–-]+$/, '') + '…';
  }
  g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle';
  lines.forEach((l, i) => g.fillText(l, x, y + size * lh * (i + 0.5)));
  return lines.length * size * lh;
}

function softShadow(g, x, y, w, h, r, blur = 30, a = 0.14) {
  g.save();
  g.shadowColor = `rgba(40,30,80,${a})`; g.shadowBlur = blur; g.shadowOffsetY = blur * 0.35;
  g.fillStyle = '#ffffff'; rr(g, x, y, w, h, r); g.fill();
  g.restore();
}

function statusBar(g, W, y, k, dark = INK) {
  const pad = 56 * k;
  textBox(g, '9:41', pad, y, 200 * k, 56 * k, { size: 30 * k, weight: 700, color: dark, align: 'left', nowrap: true });
  // signal, wifi, battery
  g.fillStyle = dark;
  const bx = W - pad - 58 * k, by = y + 17 * k;
  for (let i = 0; i < 4; i++) { rr(g, bx - 150 * k + i * 14 * k, by + (3 - i) * 5 * k + 4 * k, 9 * k, 14 * k + i * 5 * k - 4 * k, 2 * k); g.fill(); }
  g.lineWidth = 4 * k; g.strokeStyle = dark;
  g.beginPath(); g.arc(bx - 52 * k, by + 26 * k, 18 * k, -Math.PI * 0.78, -Math.PI * 0.22); g.stroke();
  g.beginPath(); g.arc(bx - 52 * k, by + 26 * k, 9 * k, -Math.PI * 0.78, -Math.PI * 0.22); g.stroke();
  g.lineWidth = 2.5 * k; rr(g, bx, by, 48 * k, 24 * k, 7 * k); g.stroke();
  rr(g, bx + 4 * k, by + 4 * k, 34 * k, 16 * k, 4 * k); g.fill();
  rr(g, bx + 50 * k, by + 8 * k, 4 * k, 8 * k, 2 * k); g.fill();
}

/** Window background, status bar and large-title header. Returns {y, pad, k}. */
function chrome(g, W, H, app, narrow, subtitle) {
  const k = narrow ? 1.34 : 1;
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, shade(app.color, -0.9)); bg.addColorStop(0.35, BG); bg.addColorStop(1, BG);
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  statusBar(g, W, 18 * k, k);
  const pad = 64 * k * (narrow ? 0.78 : 1);
  let y = 90 * k;
  const I = 96 * k;
  appIcon(g, pad, y, I, app.color, app.glyph);
  textBox(g, app.name, pad + I + 26 * k, y - 2 * k, W - pad * 2 - I - 26 * k, I * 0.62, { size: 60 * k, weight: 800, color: INK, align: 'left', nowrap: true });
  if (subtitle) textBox(g, subtitle, pad + I + 26 * k, y + I * 0.6, W - pad * 2 - I - 26 * k, I * 0.4, { size: 29 * k, weight: 500, color: SOFT, align: 'left', nowrap: true });
  y += I + 34 * k;
  g.fillStyle = 'rgba(30,20,60,0.08)'; g.fillRect(pad, y, W - pad * 2, 2);
  return { y: y + 34 * k, pad, k };
}

function pill(g, text, x, y, h, bg, color, size, weight = 700) {
  g.font = `${weight} ${size}px ${FONT}`;
  const w = g.measureText(text).width + h * 0.9;
  g.fillStyle = bg; rr(g, x, y, w, h, h / 2); g.fill();
  textBox(g, text, x, y, w, h, { size, weight, color, nowrap: true });
  return w;
}

/* ------------------------------------------------------------------ About */

export function drawAbout(g, W, H, { narrow, content }) {
  const app = APPS.about, p = content.profile, job = content.jobs[0];
  const { y: y0, pad, k } = chrome(g, W, H, app, narrow, 'About me');
  const bottom = H - pad * 0.9;
  const avatar = (cx, cy, r) => {
    const gr = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    gr.addColorStop(0, '#8f8cf4'); gr.addColorStop(1, '#ee86ad');
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#ffffff'; g.lineWidth = r * 0.08; g.stroke();
    textBox(g, p.name.split(' ').map((s) => s[0]).slice(0, 2).join(''), cx - r, cy - r, r * 2, r * 2, { size: r * 0.8, weight: 800, color: '#fff', nowrap: true });
  };
  const facts = [
    ['Currently', `${job.role} at ${job.company}`],
    ['Location', p.location],
  ];
  const tags = ['Android & iOS', 'Flutter · Dart', p.location.split(',').slice(-2).join(',').trim()];

  if (!narrow) {
    const lw = (W - pad * 2) * 0.37, gap = 40;
    softShadow(g, pad, y0, lw, bottom - y0, 44);
    let y = y0 + 60;
    avatar(pad + lw / 2, y + 100, 100); y += 230;
    textBox(g, p.greeting, pad + 30, y, lw - 60, 50, { size: 34, weight: 500, color: SOFT, nowrap: true }); y += 52;
    textBox(g, p.name, pad + 30, y, lw - 60, 100, { size: 84, weight: 800, color: INK, nowrap: true }); y += 104;
    textBox(g, p.role, pad + 30, y, lw - 60, 60, { size: 44, weight: 700, color: shade(app.color, 0.3), nowrap: true }); y += 76;
    textBox(g, p.tagline, pad + 40, y, lw - 80, 100, { size: 31, weight: 500, color: GREY, lh: 1.35 }); y += 120;
    g.font = `600 28px ${FONT}`;
    let tx = pad + 30;
    const widths = tags.map((t) => g.measureText(t).width + 44), tot = widths.reduce((a, b) => a + b, 0) + 14 * (tags.length - 1);
    if (tot < lw - 60) tx = pad + (lw - tot) / 2;
    tags.forEach((t, i) => {
      if (tx + widths[i] > pad + lw - 20) { tx = pad + 30; y += 64; }
      pill(g, t, tx, y, 52, shade(app.color, -0.86), shade(app.color, 0.45), 28, 600); tx += widths[i] + 14;
    });
    // right: summary card
    const rx = pad + lw + gap, rw = W - pad - rx;
    softShadow(g, rx, y0, rw, bottom - y0, 44);
    textBox(g, 'About me', rx + 54, y0 + 40, rw - 108, 64, { size: 46, weight: 800, color: INK, align: 'left', nowrap: true });
    const factsH = 2 * 96 + 20;
    textBox(g, p.summary, rx + 54, y0 + 124, rw - 108, bottom - y0 - 124 - factsH - 30, { size: 37, weight: 500, color: '#34313f', align: 'left', valign: 'top', lh: 1.5, min: 24 });
    let fy = bottom - factsH - 10;
    for (const [label, value] of facts) {
      g.fillStyle = BG; rr(g, rx + 40, fy, rw - 80, 88, 22); g.fill();
      textBox(g, label.toUpperCase(), rx + 70, fy, 220, 88, { size: 24, weight: 700, color: SOFT, align: 'left', nowrap: true });
      textBox(g, value, rx + 290, fy, rw - 360, 88, { size: 32, weight: 600, color: INK, align: 'left', nowrap: true });
      fy += 98;
    }
    return {};
  }

  // narrow: profile card on top, summary below
  const cw = W - pad * 2;
  const topH = 520;
  softShadow(g, pad, y0, cw, topH, 50);
  avatar(pad + 140, y0 + 150, 96);
  textBox(g, p.greeting, pad + 270, y0 + 56, cw - 300, 56, { size: 40, weight: 500, color: SOFT, align: 'left', nowrap: true });
  textBox(g, p.name, pad + 270, y0 + 104, cw - 300, 110, { size: 92, weight: 800, color: INK, align: 'left', nowrap: true });
  textBox(g, p.role, pad + 270, y0 + 208, cw - 300, 64, { size: 50, weight: 700, color: shade(app.color, 0.3), align: 'left', nowrap: true });
  textBox(g, p.tagline, pad + 44, y0 + 290, cw - 88, 120, { size: 42, weight: 500, color: GREY, align: 'left', lh: 1.3 });
  let tx = pad + 44;
  const ty = y0 + 420;
  for (const t of tags.slice(0, 2)) tx += pill(g, t, tx, ty, 66, shade(app.color, -0.86), shade(app.color, 0.45), 36, 600) + 16;
  const sy = y0 + topH + 36;
  const factsH = 2 * 116;
  softShadow(g, pad, sy, cw, bottom - sy, 50);
  textBox(g, 'About me', pad + 44, sy + 30, cw - 88, 70, { size: 52, weight: 800, color: INK, align: 'left', nowrap: true });
  textBox(g, p.summary, pad + 44, sy + 112, cw - 88, bottom - sy - 112 - factsH - 36, { size: 46, weight: 500, color: '#34313f', align: 'left', valign: 'top', lh: 1.42, min: 28 });
  let fy = bottom - factsH - 20;
  for (const [label, value] of facts) {
    g.fillStyle = BG; rr(g, pad + 28, fy, cw - 56, 104, 26); g.fill();
    textBox(g, label.toUpperCase(), pad + 56, fy + 8, cw - 112, 36, { size: 28, weight: 700, color: SOFT, align: 'left', nowrap: true });
    textBox(g, value, pad + 56, fy + 44, cw - 112, 52, { size: 38, weight: 600, color: INK, align: 'left', nowrap: true });
    fy += 116;
  }
  return {};
}

/* ----------------------------------------------------------------- Skills */

/** Masonry of group cards. Returns the tallest column height (draws only if draw = true). */
function skillsMasonry(g, groups, x, y, w, cols, size, draw) {
  const gap = size * 0.9, colW = (w - gap * (cols - 1)) / cols, pad = size * 0.62;
  const heights = new Array(cols).fill(0);
  for (const grp of groups) {
    const chipsH = chips(g, grp.skills, 0, 0, colW - pad * 2, { size }, false);
    const titleH = size * 1.5;
    const h = pad + titleH + chipsH + pad;
    let c = 0;
    for (let i = 1; i < cols; i++) if (heights[i] < heights[c] - 1) c = i;
    if (draw) {
      const cx = x + c * (colW + gap), cy = y + heights[c];
      softShadow(g, cx, cy, colW, h, size * 0.7, size * 0.8, 0.1);
      g.fillStyle = alpha(grp.color, 0.07); rr(g, cx, cy, colW, h, size * 0.7); g.fill();
      g.fillStyle = grp.color; rr(g, cx + pad, cy + pad + size * 0.2, size * 0.5, size * 0.5, size * 0.16); g.fill();
      textBox(g, grp.title, cx + pad + size * 0.8, cy + pad, colW - pad * 2 - size * 0.8, size * 0.95, { size: size * 0.86, weight: 800, color: shade(grp.color, 0.25), align: 'left', nowrap: true });
      chips(g, grp.skills, cx + pad, cy + pad + titleH, colW - pad * 2, { size, bg: '#ffffff', border: alpha(grp.color, 0.35), color: '#2a2735', weight: 600 });
    }
    heights[c] += h + gap;
  }
  return Math.max(...heights) - gap;
}

export function drawSkills(g, W, H, { narrow, content }) {
  const groups = content.skillGroups;
  const total = groups.reduce((n, s) => n + s.skills.length, 0);
  const { y: y0, pad } = chrome(g, W, H, APPS.skills, narrow, `${total} skills · ${groups.length} groups`);
  const w = W - pad * 2, h = H - y0 - pad * 0.7;
  // largest chip size that fits; on phones try one and two columns
  const options = narrow ? [1, 2] : [4, 3];
  let best = null;
  for (const cols of options) {
    for (let size = narrow ? 54 : 40; size >= 18; size -= 1) {
      if (skillsMasonry(g, groups, pad, y0, w, cols, size, false) <= h) {
        if (!best || size > best.size) best = { cols, size };
        break;
      }
    }
  }
  if (!best) best = { cols: options[0], size: 18 };
  skillsMasonry(g, groups, pad, y0, w, best.cols, best.size, true);
  return {};
}

/* ------------------------------------------------------------- Experience */

function drawJobCard(g, w, h, job, narrow) {
  g.fillStyle = '#ffffff'; rr(g, 0, 0, w, h, narrow ? 40 : 34); g.fill();
  const ink = shade(job.color, 0.25);
  if (!narrow) {
    const sh = h * 0.11;
    g.save(); rr(g, 0, 0, w, h, 34); g.clip();
    g.fillStyle = job.color; g.fillRect(0, 0, w, sh);
    g.restore();
    textBox(g, job.dates, 30, 0, w - 60, sh, { size: 31, weight: 700, color: '#ffffff', nowrap: true });
    let y = sh + 34;
    textBox(g, job.shortName, 40, y, w - 80, 84, { size: 70, weight: 800, color: INK, align: 'left', nowrap: true }); y += 86;
    textBox(g, job.company, 40, y, w - 80, 44, { size: 30, weight: 500, color: GREY, align: 'left', nowrap: true }); y += 64;
    g.fillStyle = job.color; rr(g, 40, y, 70, 7, 3.5); g.fill(); y += 30;
    const role = textBox(g, job.role, 40, y, w - 80, h * 0.25, { size: 40, weight: 700, color: '#2d2a38', align: 'left', valign: 'top', lh: 1.22 });
    const locY = h - 0.11 * h - 40 - 120;
    const hy = y + role.height + 26, lines = Math.floor((locY - 24 - hy) / (28 * 1.4));
    if (lines >= 2) clampLines(g, `“${job.points[0]}”`, 40, hy, w - 80, lines, 28, GREY);
    y = locY;
    textBox(g, job.location, 40, y, w - 80, 44, { size: 29, weight: 500, color: GREY, align: 'left', nowrap: true });
    textBox(g, `${job.points.length} highlights`, 40, y + 48, w - 80, 44, { size: 29, weight: 600, color: ink, align: 'left', nowrap: true });
    const bh = h * 0.1, by = h - bh - 34;
    g.fillStyle = INK; rr(g, 34, by, w - 68, bh, bh / 2); g.fill();
    textBox(g, 'View details  →', 34, by, w - 68, bh, { size: 32, weight: 700, color: '#ffffff', nowrap: true });
  } else {
    g.fillStyle = job.color; rr(g, 0, 0, 16, h, 8); g.fill();
    const x = 54, tw = w - x - 44;
    textBox(g, job.shortName, x, 30, tw * 0.5, 90, { size: 76, weight: 800, color: INK, align: 'left', nowrap: true });
    textBox(g, job.dates, x + tw * 0.5, 30, tw * 0.5, 90, { size: 38, weight: 700, color: ink, align: 'right', nowrap: true });
    textBox(g, job.role, x, 132, tw, h * 0.3, { size: 48, weight: 700, color: '#2d2a38', align: 'left', valign: 'top', lh: 1.2 });
    textBox(g, `${job.company}`, x, h - 150, tw * 0.6, 54, { size: 36, weight: 500, color: GREY, align: 'left', nowrap: true });
    textBox(g, `${job.location} · ${job.points.length} highlights`, x, h - 96, tw * 0.6, 54, { size: 33, weight: 500, color: SOFT, align: 'left', nowrap: true });
    const bw = tw * 0.36, bh = 96;
    g.fillStyle = INK; rr(g, x + tw - bw, h - bh - 34, bw, bh, bh / 2); g.fill();
    textBox(g, 'Details →', x + tw - bw, h - bh - 34, bw, bh, { size: 38, weight: 700, color: '#ffffff', nowrap: true });
  }
}

export function drawExperience(g, W, H, { narrow, content }) {
  const jobs = content.jobs;
  const { y: y0, pad } = chrome(g, W, H, APPS.experience, narrow, `${jobs.length} roles · tap a card for details`);
  const cards = [];
  if (!narrow) {
    const gap = 44, cw = (W - pad * 2 - gap * (jobs.length - 1)) / jobs.length;
    const ly = y0 + 26, top = y0 + 78, ch = H - top - pad * 0.8;
    g.fillStyle = '#ead9cf'; rr(g, pad + cw / 2, ly - 4, (cw + gap) * (jobs.length - 1), 8, 4); g.fill();
    jobs.forEach((job, i) => {
      const x = pad + i * (cw + gap);
      g.fillStyle = job.color; g.beginPath(); g.arc(x + cw / 2, ly, 22, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x + cw / 2, ly, 9, 0, Math.PI * 2); g.fill();
      softShadow(g, x, top, cw, ch, 34, 34, 0.16);
      cards.push({ type: 'job', id: job.id, label: `${job.role} at ${job.company}`, x, y: top, w: cw, h: ch, draw: (c, w, h) => drawJobCard(c, w, h, job, false) });
    });
  } else {
    const gap = 40, lx = pad + 22, cx = pad + 70, cw = W - pad - cx;
    const ch = (H - y0 - pad * 0.8 - gap * (jobs.length - 1)) / jobs.length;
    g.fillStyle = '#ead9cf'; rr(g, lx - 5, y0 + ch / 2, 10, (ch + gap) * (jobs.length - 1), 5); g.fill();
    jobs.forEach((job, i) => {
      const y = y0 + i * (ch + gap);
      g.fillStyle = job.color; g.beginPath(); g.arc(lx, y + ch / 2, 26, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#ffffff'; g.beginPath(); g.arc(lx, y + ch / 2, 10, 0, Math.PI * 2); g.fill();
      softShadow(g, cx, y, cw, ch, 40, 34, 0.16);
      cards.push({ type: 'job', id: job.id, label: `${job.role} at ${job.company}`, x: cx, y, w: cw, h: ch, draw: (c, w, h) => drawJobCard(c, w, h, job, true) });
    });
  }
  return { cards };
}

/* --------------------------------------------------------------- Projects */

function drawProjectCard(g, w, h, p, img, narrow) {
  const r = narrow ? 40 : 34;
  g.fillStyle = '#ffffff'; rr(g, 0, 0, w, h, r); g.fill();
  // cover
  const ch = h * (narrow ? 0.5 : 0.56), m = narrow ? 22 : 20;
  const bg = g.createLinearGradient(0, 0, 0, ch);
  bg.addColorStop(0, shade(p.color, -0.75)); bg.addColorStop(1, shade(p.color, -0.55));
  g.fillStyle = bg; rr(g, m, m, w - m * 2, ch - m, r - 10); g.fill();
  if (p.coverKind === 'phone') {
    // the screenshot in a small phone, cut off at the bottom like a store preview
    const pw = Math.min((w - m * 2) * 0.62, (ch - m) * 0.56), px = (w - pw) / 2, py = m + (ch - m) * 0.1;
    g.save(); rr(g, m, m, w - m * 2, ch - m, r - 10); g.clip();
    g.fillStyle = '#1d1c24'; rr(g, px - 10, py - 10, pw + 20, (ch - m) * 1.2, 44); g.fill();
    drawCover(g, img, px, py, pw, (ch - m) * 1.2, 34, true);
    g.restore();
  } else {
    const iw = w - m * 2 - 40, ih = img ? Math.min(ch - m - 40, iw * img.height / img.width) : ch - m - 40;
    const ix = (w - iw) / 2, iy = m + (ch - m - ih) / 2;
    g.save(); g.shadowColor = 'rgba(0,0,0,0.2)'; g.shadowBlur = 20; g.fillStyle = '#000'; rr(g, ix, iy, iw, ih, 14); g.fill(); g.restore();
    drawCover(g, img, ix, iy, iw, ih, 14);
  }
  // text
  const x = narrow ? 34 : 30, tw = w - x * 2;
  let y = ch + (narrow ? 26 : 24);
  const I = narrow ? 84 : 70;
  g.fillStyle = p.color; rr(g, x, y, I, I, I * 0.26); g.fill();
  textBox(g, p.title[0], x, y, I, I, { size: I * 0.56, weight: 800, color: '#ffffff', nowrap: true });
  textBox(g, p.title, x + I + 18, y - 4, tw - I - 18, I + 8, { size: narrow ? 44 : 36, weight: 800, color: INK, align: 'left', lh: 1.1, min: 22 });
  y += I + (narrow ? 22 : 18);
  const bh = narrow ? 84 : 66, by = h - bh - (narrow ? 30 : 26);
  textBox(g, p.tagline, x, y, tw, by - y - (narrow ? 70 : 64), { size: narrow ? 36 : 27, weight: 500, color: GREY, align: 'left', valign: 'top', lh: 1.28, min: 18 });
  if (!narrow) chips(g, p.techStack.slice(0, 3).map((t) => t.replace(/ \(.*\)$/, '')), x, by - 56, tw, { size: 21, bg: BG, color: GREY, weight: 600 });
  else textBox(g, `${p.screenshots.length} screenshots`, x, by - 62, tw, 50, { size: 31, weight: 600, color: SOFT, align: 'left', nowrap: true });
  g.fillStyle = '#e9effc'; rr(g, x, by, tw, bh, bh / 2); g.fill();
  textBox(g, narrow ? 'Open' : `Open · ${p.screenshots.length} screenshots`, x, by, tw, bh, { size: narrow ? 38 : 27, weight: 800, color: '#2f6fd6', nowrap: true });
}

export function drawProjects(g, W, H, { narrow, content, images }) {
  const list = content.projects;
  const { y: y0, pad } = chrome(g, W, H, APPS.projects, narrow, `${list.length} apps · tap one for screenshots`);
  const cards = [];
  const cols = narrow ? 2 : list.length, rows = Math.ceil(list.length / cols);
  const gap = narrow ? 30 : 36;
  const top = y0 + (narrow ? 0 : 6);
  const cw = (W - pad * 2 - gap * (cols - 1)) / cols, ch = (H - top - pad * 0.8 - gap * (rows - 1)) / rows;
  list.forEach((p, i) => {
    const x = pad + (i % cols) * (cw + gap), y = top + Math.floor(i / cols) * (ch + gap);
    softShadow(g, x, y, cw, ch, 34, 34, 0.16);
    cards.push({ type: 'project', id: p.id, label: `Open project ${p.title}`, x, y, w: cw, h: ch, draw: (c, w, h) => drawProjectCard(c, w, h, p, images[p.id], narrow) });
  });
  return { cards };
}

/* -------------------------------------------------------------- Education */

const PASS_GRADIENTS = [['#3d6fd8', '#6c5fd0'], ['#e06f8f', '#f09a5c']];

function drawPass(g, x, y, w, h, e, i, narrow) {
  const [a, b] = PASS_GRADIENTS[i % PASS_GRADIENTS.length];
  g.save();
  g.shadowColor = 'rgba(40,30,80,0.25)'; g.shadowBlur = 40; g.shadowOffsetY = 16;
  const gr = g.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, a); gr.addColorStop(1, b);
  g.fillStyle = gr; rr(g, x, y, w, h, narrow ? 46 : 40); g.fill();
  g.restore();
  g.save(); rr(g, x, y, w, h, 40); g.clip();
  g.fillStyle = 'rgba(255,255,255,0.08)'; g.beginPath(); g.arc(x + w * 0.92, y + h * 0.05, h * 0.75, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.06)'; g.beginPath(); g.arc(x + w * 0.1, y + h * 1.1, h * 0.6, 0, Math.PI * 2); g.fill();
  g.restore();
  const k = narrow ? 1.3 : 1, px = x + 48 * k, tw = w - 96 * k;
  glyph(g, 'cap', px + 26 * k, y + 64 * k, 28 * k);
  textBox(g, e.institution, px + 70 * k, y + 34 * k, tw - 70 * k - 140 * k, 60 * k, { size: 32 * k, weight: 700, color: '#ffffff', align: 'left', nowrap: true });
  textBox(g, e.year, x + w - 48 * k - 140 * k, y + 34 * k, 140 * k, 60 * k, { size: 34 * k, weight: 800, color: 'rgba(255,255,255,0.92)', align: 'right', nowrap: true });
  // a chip, like on a payment card
  const cy = y + h * 0.3;
  const chipG = g.createLinearGradient(px, cy, px + 90 * k, cy + 66 * k); chipG.addColorStop(0, '#f6e2a8'); chipG.addColorStop(1, '#d6b46a');
  g.fillStyle = chipG; rr(g, px, cy, 90 * k, 66 * k, 12 * k); g.fill();
  g.strokeStyle = 'rgba(120,90,30,0.45)'; g.lineWidth = 2 * k;
  g.beginPath(); g.moveTo(px + 30 * k, cy); g.lineTo(px + 30 * k, cy + 66 * k); g.moveTo(px + 60 * k, cy); g.lineTo(px + 60 * k, cy + 66 * k); g.moveTo(px, cy + 33 * k); g.lineTo(px + 90 * k, cy + 33 * k); g.stroke();
  textBox(g, e.title, px, y + h * 0.48, tw, h * 0.3, { size: 50 * k, weight: 800, color: '#ffffff', align: 'left', valign: 'top', lh: 1.15, min: 24 });
  const label = e.detail ? e.detail : 'Course completed';
  textBox(g, label, px, y + h - 92 * k, tw, 56 * k, { size: 32 * k, weight: 600, color: 'rgba(255,255,255,0.9)', align: 'left', nowrap: true });
}

export function drawEducation(g, W, H, { narrow, content }) {
  const list = content.education;
  const { y: y0, pad } = chrome(g, W, H, APPS.education, narrow, 'Degree & certificate');
  if (!narrow) {
    const gap = 56, cw = (W - pad * 2 - gap) / 2, avail = H - y0 - pad;
    const ch = Math.min(avail - 40, cw / 1.58), y = y0 + (avail - ch) / 2 - 10;
    list.forEach((e, i) => drawPass(g, pad + i * (cw + gap), y, cw, ch, e, i, false));
  } else {
    const gap = 60, cw = W - pad * 2, avail = H - y0 - pad;
    const ch = Math.min((avail - gap) / 2, cw / 1.45), y = y0 + (avail - ch * 2 - gap) / 2;
    list.forEach((e, i) => drawPass(g, pad, y + i * (ch + gap), cw, ch, e, i, true));
  }
  return {};
}

/* ---------------------------------------------------------------- Contact */

export function contactLinks(p) {
  return [
    { id: 'email', kind: 'row', icon: 'mail', label: 'Email', value: p.email, href: `mailto:${p.email}` },
    { id: 'phone', kind: 'row', icon: 'phone', label: 'Mobile', value: p.phone, href: p.phoneHref },
    { id: 'location', kind: 'row', icon: 'pin', label: 'Location', value: p.location, href: null },
    { id: 'github', kind: 'btn', icon: 'code', label: 'GitHub', href: p.github },
    { id: 'linkedin', kind: 'btn', icon: 'in', label: 'LinkedIn', href: p.linkedin },
    { id: 'resume', kind: 'btn', icon: 'down', label: 'Download resume', href: p.resume, download: true },
  ];
}

export function drawContact(g, W, H, { narrow, content, hover }) {
  const app = APPS.contact, p = content.profile;
  const { y: y0, pad, k } = chrome(g, W, H, app, narrow, 'New message');
  const links = contactLinks(p), rows = links.filter((l) => l.kind === 'row'), btns = links.filter((l) => l.kind === 'btn');
  const rects = [];
  const accent = shade(app.color, 0.15);
  const row = (l, x, y, w, h) => {
    const on = hover === l.id && l.href;
    if (on) { g.fillStyle = accent; rr(g, x, y, w, h, h * 0.26); g.fill(); } else softShadow(g, x, y, w, h, h * 0.26, 24, 0.1);
    const ic = h * 0.62, icx = x + h * 0.2;
    g.fillStyle = on ? 'rgba(255,255,255,0.22)' : shade(app.color, -0.85); rr(g, icx, y + (h - ic) / 2, ic, ic, ic * 0.28); g.fill();
    glyph(g, l.icon, icx + ic / 2, y + h / 2, ic * 0.3, on ? '#ffffff' : accent);
    const tx = icx + ic + h * 0.22, tW = x + w - tx - h * 0.25;
    textBox(g, l.label.toUpperCase(), tx, y + h * 0.12, tW, h * 0.3, { size: 25 * k, weight: 700, color: on ? 'rgba(255,255,255,0.85)' : SOFT, align: 'left', nowrap: true });
    textBox(g, l.value, tx, y + h * 0.4, tW, h * 0.46, { size: 40 * k, weight: 700, color: on ? '#ffffff' : INK, align: 'left', nowrap: true });
    if (l.href) {
      g.strokeStyle = on ? '#ffffff' : '#b9b5c6'; g.lineWidth = 4 * k;
      g.beginPath(); g.moveTo(x + w - h * 0.32, y + h * 0.4); g.lineTo(x + w - h * 0.22, y + h * 0.5); g.lineTo(x + w - h * 0.32, y + h * 0.6); g.stroke();
      rects.push({ ...l, x, y, w, h });
    }
  };
  const btn = (l, x, y, w, h, size) => {
    const on = hover === l.id;
    g.fillStyle = on ? accent : INK; rr(g, x, y, w, h, h / 2); g.fill();
    glyph(g, l.icon, x + h * 0.55, y + h / 2, h * 0.24, '#ffffff');
    textBox(g, l.label, x + h * 0.95, y, w - h * 1.2, h, { size, weight: 700, color: '#ffffff', align: 'left', nowrap: true });
    rects.push({ ...l, x, y, w, h });
  };

  if (!narrow) {
    const lw = (W - pad * 2) * 0.38, gap = 50, bottom = H - pad * 0.9;
    textBox(g, 'Let\'s talk', pad, y0 + 10, lw, 130, { size: 110, weight: 800, color: INK, align: 'left', nowrap: true });
    textBox(g, p.contactNote, pad, y0 + 160, lw, 200, { size: 38, weight: 500, color: GREY, align: 'left', valign: 'top', lh: 1.4 });
    // sender card
    const sy = bottom - 260;
    softShadow(g, pad, sy, lw, 260, 36, 30, 0.12);
    g.fillStyle = '#8f8cf4'; g.beginPath(); g.arc(pad + 90, sy + 130, 54, 0, Math.PI * 2); g.fill();
    textBox(g, 'S', pad + 36, sy + 76, 108, 108, { size: 52, weight: 800, color: '#fff', nowrap: true });
    textBox(g, p.name, pad + 170, sy + 62, lw - 200, 66, { size: 46, weight: 800, color: INK, align: 'left', nowrap: true });
    textBox(g, p.role, pad + 170, sy + 128, lw - 200, 56, { size: 33, weight: 600, color: accent, align: 'left', nowrap: true });
    const rx = pad + lw + gap, rw = W - pad - rx;
    const bh = 116, rg = 28, rh = Math.min(178, (bottom - y0 - 10 - bh - rg * 3 - 14) / 3);
    let y = y0 + 10;
    for (const l of rows) { row(l, rx, y, rw, rh); y += rh + rg; }
    y += 14;
    const bg = 24, ws = [0.29, 0.31, 0.4].map((f) => f * (rw - bg * 2));
    let bx = rx;
    btns.forEach((l, i) => { btn(l, bx, y, ws[i], bh, 36); bx += ws[i] + bg; });
  } else {
    let y = y0;
    textBox(g, 'Let\'s talk', pad, y, W - pad * 2, 140, { size: 124, weight: 800, color: INK, align: 'left', nowrap: true }); y += 150;
    textBox(g, p.contactNote, pad, y, W - pad * 2, 150, { size: 44, weight: 500, color: GREY, align: 'left', valign: 'top', lh: 1.35 }); y += 170;
    const rh = 172, rg = 28;
    for (const l of rows) { row(l, pad, y, W - pad * 2, rh); y += rh + rg; }
    y += 16;
    const bh = 128, bg = 26;
    for (const l of btns) { btn(l, pad, y, W - pad * 2, bh, 46); y += bh + bg; }
  }
  return { regions: rects };
}

export const DRAW = { about: drawAbout, skills: drawSkills, experience: drawExperience, projects: drawProjects, education: drawEducation, contact: drawContact };

/* ------------------------------------------------------ Phone home screen */

/** The giant phone's home screen: name widget + the six apps + dock. */
export function drawHomeScreen(g, W, H, { content }) {
  const p = content.profile;
  const bg = g.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, '#7178e2'); bg.addColorStop(0.55, '#9c74d4'); bg.addColorStop(1, '#c77aac');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  // soft blobs
  for (const [x, y, r, c] of [[0.85, 0.22, 0.5, 'rgba(255,255,255,0.16)'], [0.1, 0.62, 0.45, 'rgba(255,214,230,0.12)']]) {
    const gr = g.createRadialGradient(x * W, y * H, 0, x * W, y * H, r * W);
    gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }
  const k = W / 1000;
  // status bar + dynamic island
  textBox(g, '9:41', 70 * k, 40 * k, 200 * k, 70 * k, { size: 40 * k, weight: 700, color: '#ffffff', align: 'left', nowrap: true });
  g.fillStyle = '#ffffff';
  const bx = W - 140 * k, by = 62 * k;
  g.globalAlpha = 0.95; rr(g, bx, by, 66 * k, 32 * k, 10 * k); g.fill(); g.globalAlpha = 1;
  g.fillStyle = '#0b0b10'; rr(g, W / 2 - 150 * k, 32 * k, 300 * k, 88 * k, 44 * k); g.fill();
  g.fillStyle = '#1d2236'; g.beginPath(); g.arc(W / 2 + 100 * k, 76 * k, 18 * k, 0, Math.PI * 2); g.fill();
  // date + time
  const d = new Date(2026, 0, 1, 9, 41);
  textBox(g, 'Thursday, 1 January', 0, 160 * k, W, 60 * k, { size: 40 * k, weight: 600, color: 'rgba(255,255,255,0.92)', nowrap: true });
  textBox(g, `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`, 0, 210 * k, W, 200 * k, { size: 200 * k, weight: 700, color: '#ffffff', nowrap: true });
  // name widget
  const wx = 60 * k, wy = 450 * k, ww = W - 120 * k, wh = 520 * k;
  g.fillStyle = 'rgba(255,255,255,0.9)'; rr(g, wx, wy, ww, wh, 64 * k); g.fill();
  const gr = g.createLinearGradient(wx, wy, wx + 180 * k, wy + 180 * k); gr.addColorStop(0, '#8f8cf4'); gr.addColorStop(1, '#ee86ad');
  g.fillStyle = gr; g.beginPath(); g.arc(wx + 130 * k, wy + 130 * k, 78 * k, 0, Math.PI * 2); g.fill();
  textBox(g, 'SR', wx + 52 * k, wy + 52 * k, 156 * k, 156 * k, { size: 64 * k, weight: 800, color: '#fff', nowrap: true });
  textBox(g, p.greeting, wx + 240 * k, wy + 62 * k, ww - 280 * k, 56 * k, { size: 40 * k, weight: 500, color: SOFT, align: 'left', nowrap: true });
  textBox(g, p.name, wx + 240 * k, wy + 112 * k, ww - 280 * k, 110 * k, { size: 96 * k, weight: 800, color: INK, align: 'left', nowrap: true });
  textBox(g, p.role, wx + 50 * k, wy + 250 * k, ww - 100 * k, 90 * k, { size: 70 * k, weight: 800, color: '#6c5fd0', align: 'left', nowrap: true });
  textBox(g, p.tagline, wx + 50 * k, wy + 345 * k, ww - 100 * k, 130 * k, { size: 40 * k, weight: 500, color: GREY, align: 'left', valign: 'top', lh: 1.3 });
  // app grid (the six apps of the world)
  const ids = ['about', 'skills', 'experience', 'projects', 'education', 'contact'];
  const cols = 3, I = 176 * k, gx = (W - cols * I) / (cols + 1), gy0 = 1050 * k;
  ids.forEach((id, i) => {
    const a = APPS[id], cx = gx + (i % cols) * (I + gx), cy = gy0 + Math.floor(i / cols) * (I + 110 * k);
    g.save(); g.shadowColor = 'rgba(60,30,90,0.25)'; g.shadowBlur = 24 * k; g.shadowOffsetY = 10 * k;
    g.fillStyle = a.color; rr(g, cx, cy, I, I, I * 0.26); g.fill(); g.restore();
    appIcon(g, cx, cy, I, a.color, a.glyph);
    g.save(); g.shadowColor = 'rgba(40,20,70,0.45)'; g.shadowBlur = 10 * k; g.shadowOffsetY = 2 * k;
    textBox(g, a.name, cx - 40 * k, cy + I + 10 * k, I + 80 * k, 60 * k, { size: 42 * k, weight: 700, color: '#ffffff', nowrap: true });
    g.restore();
  });
  // hint
  g.save(); g.shadowColor = 'rgba(40,20,70,0.45)'; g.shadowBlur = 8 * k;
  textBox(g, 'Scroll to step inside  ↓', 0, H - 400 * k, W, 60 * k, { size: 40 * k, weight: 700, color: '#ffffff', nowrap: true });
  g.restore();
  // dock
  g.fillStyle = 'rgba(255,255,255,0.32)'; rr(g, 40 * k, H - 300 * k, W - 80 * k, 220 * k, 80 * k); g.fill();
  [['phone', '#4fb88a'], ['chat', '#40b4c8'], ['camera', '#7f8cf2'], ['music', '#ee7ca5']].forEach(([ic, col], i) => {
    const cx = 40 * k + (W - 80 * k) * (i + 0.5) / 4 - 80 * k;
    appIcon(g, cx, H - 270 * k, 160 * k, col, ic);
  });
  g.fillStyle = 'rgba(255,255,255,0.85)'; rr(g, W / 2 - 150 * k, H - 44 * k, 300 * k, 14 * k, 7 * k); g.fill();
  return {};
}

