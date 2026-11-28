import { rr } from '../../canvasText.js';

/*
 * Simple app glyphs drawn with canvas paths (no icon fonts or image files).
 * Used for the big section apps, the home screen, the floating icons and the
 * instanced icon field (as one texture atlas).
 */
export function glyph(g, type, cx, cy, s, col = '#fff') {
  g.save(); g.fillStyle = col; g.strokeStyle = col; g.lineWidth = s * 0.14; g.lineCap = 'round'; g.lineJoin = 'round';
  const P = Math.PI;
  const cut = (fn) => { g.globalCompositeOperation = 'destination-out'; fn(); g.globalCompositeOperation = 'source-over'; };
  switch (type) {
    case 'user':
      g.beginPath(); g.arc(cx, cy - s * 0.32, s * 0.32, 0, 2 * P); g.fill();
      g.beginPath(); g.ellipse(cx, cy + s * 0.62, s * 0.62, s * 0.5, 0, P, 2 * P); g.fill(); break;
    case 'spark':
      for (const [dx, dy, k] of [[0, 0, 1], [s * 0.55, -s * 0.5, 0.45]]) {
        const x = cx + dx - s * 0.1, y = cy + dy + s * 0.1, r = s * 0.7 * k;
        g.beginPath(); g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r);
        g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r); g.fill();
      } break;
    case 'case':
      rr(g, cx - s * 0.78, cy - s * 0.35, s * 1.56, s * 0.98, s * 0.16); g.fill();
      rr(g, cx - s * 0.3, cy - s * 0.62, s * 0.6, s * 0.4, s * 0.1); g.stroke(); break;
    case 'grid':
      for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { rr(g, cx - s * 0.7 + i * s * 0.78, cy - s * 0.7 + j * s * 0.78, s * 0.62, s * 0.62, s * 0.16); g.fill(); } break;
    case 'mail':
      rr(g, cx - s * 0.8, cy - s * 0.55, s * 1.6, s * 1.1, s * 0.16); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.moveTo(cx - s * 0.7, cy - s * 0.42); g.lineTo(cx, cy + s * 0.08); g.lineTo(cx + s * 0.7, cy - s * 0.42); g.stroke(); break;
    case 'cap': // graduation cap
      g.beginPath(); g.moveTo(cx, cy - s * 0.62); g.lineTo(cx + s * 0.95, cy - s * 0.2); g.lineTo(cx, cy + s * 0.22); g.lineTo(cx - s * 0.95, cy - s * 0.2); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(cx - s * 0.55, cy + s * 0.02); g.lineTo(cx - s * 0.55, cy + s * 0.45); g.quadraticCurveTo(cx, cy + s * 0.78, cx + s * 0.55, cy + s * 0.45); g.lineTo(cx + s * 0.55, cy + s * 0.02); g.lineTo(cx, cy + s * 0.3); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(cx + s * 0.8, cy - s * 0.15); g.lineTo(cx + s * 0.8, cy + s * 0.5); g.stroke(); break;
    case 'wallet':
      rr(g, cx - s * 0.82, cy - s * 0.56, s * 1.64, s * 1.12, s * 0.2); g.fill();
      cut(() => { rr(g, cx + s * 0.2, cy - s * 0.16, s * 0.72, s * 0.36, s * 0.18); g.fill(); });
      g.beginPath(); g.arc(cx + s * 0.4, cy + s * 0.02, s * 0.09, 0, 2 * P); g.fill(); break;
    case 'phone':
      g.beginPath(); g.moveTo(cx - s * 0.55, cy - s * 0.7);
      g.quadraticCurveTo(cx - s * 0.85, cy - s * 0.1, cx - s * 0.1, cy + s * 0.55); g.quadraticCurveTo(cx + s * 0.5, cy + s * 0.95, cx + s * 0.75, cy + s * 0.55);
      g.lineTo(cx + s * 0.4, cy + s * 0.2); g.lineTo(cx + s * 0.15, cy + s * 0.35); g.quadraticCurveTo(cx - s * 0.25, cy + s * 0.05, cx - s * 0.32, cy - s * 0.2);
      g.lineTo(cx - s * 0.15, cy - s * 0.42); g.closePath(); g.fill(); break;
    case 'chat':
      rr(g, cx - s * 0.8, cy - s * 0.6, s * 1.6, s * 1.05, s * 0.4); g.fill();
      g.beginPath(); g.moveTo(cx - s * 0.4, cy + s * 0.3); g.lineTo(cx - s * 0.55, cy + s * 0.8); g.lineTo(cx, cy + s * 0.35); g.fill(); break;
    case 'camera':
      rr(g, cx - s * 0.8, cy - s * 0.5, s * 1.6, s * 1.1, s * 0.22); g.fill();
      cut(() => { g.beginPath(); g.arc(cx, cy + s * 0.05, s * 0.34, 0, 2 * P); g.fill(); });
      g.beginPath(); g.arc(cx, cy + s * 0.05, s * 0.2, 0, 2 * P); g.fill(); break;
    case 'music':
      g.beginPath(); g.ellipse(cx - s * 0.45, cy + s * 0.5, s * 0.25, s * 0.2, -0.4, 0, 2 * P); g.fill();
      g.beginPath(); g.ellipse(cx + s * 0.45, cy + s * 0.35, s * 0.25, s * 0.2, -0.4, 0, 2 * P); g.fill();
      g.beginPath(); g.moveTo(cx - s * 0.24, cy + s * 0.45); g.lineTo(cx - s * 0.24, cy - s * 0.55); g.lineTo(cx + s * 0.66, cy - s * 0.7); g.lineTo(cx + s * 0.66, cy + s * 0.3); g.stroke(); break;
    case 'pin':
      g.beginPath(); g.arc(cx, cy - s * 0.2, s * 0.55, P * 0.85, P * 2.15); g.lineTo(cx, cy + s * 0.85); g.closePath(); g.fill();
      cut(() => { g.beginPath(); g.arc(cx, cy - s * 0.2, s * 0.22, 0, 2 * P); g.fill(); }); break;
    case 'heart':
      g.beginPath(); g.moveTo(cx, cy + s * 0.75); g.bezierCurveTo(cx - s * 1.1, cy, cx - s * 0.6, cy - s * 0.85, cx, cy - s * 0.35);
      g.bezierCurveTo(cx + s * 0.6, cy - s * 0.85, cx + s * 1.1, cy, cx, cy + s * 0.75); g.fill(); break;
    case 'star':
      g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? s * 0.36 : s * 0.85, a = -P / 2 + i * P / 5; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r + s * 0.06); } g.closePath(); g.fill(); break;
    case 'play':
      g.beginPath(); g.arc(cx, cy, s * 0.78, 0, 2 * P); g.stroke();
      g.beginPath(); g.moveTo(cx - s * 0.22, cy - s * 0.38); g.lineTo(cx + s * 0.4, cy); g.lineTo(cx - s * 0.22, cy + s * 0.38); g.closePath(); g.fill(); break;
    case 'cloud':
      for (const [dx, dy, r] of [[-0.4, 0.15, 0.38], [0.05, -0.12, 0.5], [0.45, 0.15, 0.36]]) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s, 0, 2 * P); g.fill(); }
      rr(g, cx - s * 0.78, cy + s * 0.05, s * 1.56, s * 0.48, s * 0.24); g.fill(); break;
    case 'cal':
      rr(g, cx - s * 0.75, cy - s * 0.6, s * 1.5, s * 1.35, s * 0.2); g.fill();
      g.fillStyle = 'rgba(0,0,0,.25)';
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) g.fillRect(cx - s * 0.5 + i * s * 0.38, cy - s * 0.05 + j * s * 0.34, s * 0.22, s * 0.2);
      break;
    case 'gear':
      g.beginPath(); for (let i = 0; i < 16; i++) { const r = i % 2 ? s * 0.62 : s * 0.82, a = i * P / 8; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.closePath(); g.fill();
      cut(() => { g.beginPath(); g.arc(cx, cy, s * 0.28, 0, 2 * P); g.fill(); }); break;
    case 'code':
      g.lineWidth = s * 0.16; g.beginPath(); g.moveTo(cx - s * 0.35, cy - s * 0.5); g.lineTo(cx - s * 0.85, cy); g.lineTo(cx - s * 0.35, cy + s * 0.5);
      g.moveTo(cx + s * 0.35, cy - s * 0.5); g.lineTo(cx + s * 0.85, cy); g.lineTo(cx + s * 0.35, cy + s * 0.5);
      g.moveTo(cx + s * 0.15, cy - s * 0.65); g.lineTo(cx - s * 0.15, cy + s * 0.65); g.stroke(); break;
    case 'down':
      g.beginPath(); g.moveTo(cx, cy - s * 0.6); g.lineTo(cx, cy + s * 0.25); g.moveTo(cx - s * 0.4, cy - s * 0.1); g.lineTo(cx, cy + s * 0.3); g.lineTo(cx + s * 0.4, cy - s * 0.1);
      g.moveTo(cx - s * 0.6, cy + s * 0.65); g.lineTo(cx + s * 0.6, cy + s * 0.65); g.stroke(); break;
    case 'in':
      g.font = `800 ${s * 1.15}px Inter, Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('in', cx, cy + s * 0.05); break;
    case 'photo':
      rr(g, cx - s * 0.8, cy - s * 0.6, s * 1.6, s * 1.2, s * 0.2); g.fill();
      g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.moveTo(cx - s * 0.65, cy + s * 0.45); g.lineTo(cx - s * 0.2, cy - s * 0.1); g.lineTo(cx + s * 0.15, cy + s * 0.25);
      g.lineTo(cx + s * 0.35, cy + s * 0.05); g.lineTo(cx + s * 0.65, cy + s * 0.45); g.closePath(); g.fill(); break;
  }
  g.restore();
}

/** Glyphs used by the background icon field (one texture atlas, 4 x 4 cells). */
export const FIELD_GLYPHS = ['chat', 'camera', 'music', 'pin', 'heart', 'star', 'play', 'cloud', 'cal', 'gear', 'photo', 'code', 'mail', 'spark', 'grid', 'user'];

/** Soft pastel app colours (no neon). */
export const PASTELS = ['#7f8cf2', '#4fb88a', '#f2b545', '#ec7a68', '#a57be6', '#40b4c8', '#ff9466', '#ee7ca5', '#6fa4ee', '#57bfa6', '#c38ae8', '#f5a25d'];
