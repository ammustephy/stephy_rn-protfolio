import * as THREE from 'three';
import { BACK, WINDOW } from '../layout.js';
import { mats } from '../materials.js';
import { rbox, mesh, rng } from '../geometry.js';
import { staticTex } from '../canvasText.js';

/** Dusk sky over the Kerala backwaters (far layer). */
function skyTexture() {
  const R = rng(7);
  return staticTex(1024, 640, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#1b1a44'); gr.addColorStop(0.35, '#4a2f6b'); gr.addColorStop(0.62, '#b4567a');
    gr.addColorStop(0.8, '#f08a5d'); gr.addColorStop(1, '#ffc477');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + R() * 0.6})`; const s = R() < 0.1 ? 2.2 : 1.3; g.fillRect(R() * w, R() * h * 0.42, s, s); }
    // sun sinking behind the hills
    const sg = g.createRadialGradient(w * 0.58, h * 0.84, 0, w * 0.58, h * 0.84, 160);
    sg.addColorStop(0, 'rgba(255,236,190,1)'); sg.addColorStop(0.3, 'rgba(255,200,130,0.65)'); sg.addColorStop(1, 'rgba(255,170,110,0)');
    g.fillStyle = sg; g.fillRect(0, 0, w, h);
    // thin clouds
    for (let i = 0; i < 7; i++) {
      g.fillStyle = `rgba(255,${150 + R() * 60},${140 + R() * 40},${0.12 + R() * 0.12})`;
      g.beginPath(); g.ellipse(R() * w, h * (0.45 + R() * 0.25), 120 + R() * 160, 6 + R() * 8, 0, 0, Math.PI * 2); g.fill();
    }
    // far hills and water
    g.fillStyle = '#5b3157';
    g.beginPath(); g.moveTo(0, h);
    for (let x = 0; x <= w; x += 16) g.lineTo(x, h * 0.86 + Math.sin(x * 0.01) * 14 + Math.sin(x * 0.027) * 7);
    g.lineTo(w, h); g.fill();
    g.fillStyle = 'rgba(255,190,140,0.35)';
    for (let i = 0; i < 14; i++) g.fillRect(w * 0.5 + (R() - 0.5) * 220, h * (0.92 + R() * 0.07), 30 + R() * 60, 2);
  });
}

/** Palm tree silhouettes (near layer, transparent). */
function palmTexture() {
  return staticTex(1024, 820, (g, w, h) => {
    const palm = (x, hgt, lean, s = 1) => {
      g.strokeStyle = '#140f1c'; g.fillStyle = '#140f1c'; g.lineCap = 'round';
      const tx = x + lean, ty = h - hgt;
      g.lineWidth = 14 * s;
      g.beginPath(); g.moveTo(x, h + 10); g.quadraticCurveTo(x + lean * 0.15, h - hgt * 0.55, tx, ty); g.stroke();
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI + i * (Math.PI / 8) + (i % 2 ? 0.08 : -0.05), L = (110 + (i % 3) * 25) * s;
        const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.45 + 50 * s;
        g.lineWidth = 9 * s;
        g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(tx + Math.cos(a) * L * 0.55, ty + Math.sin(a) * L * 0.5 - 30 * s, ex, ey); g.stroke();
        // leaflets
        g.lineWidth = 3 * s;
        for (let k = 1; k < 8; k++) {
          const t = k / 8, px = tx + (ex - tx) * t, py = ty + (ey - ty) * t - Math.sin(t * Math.PI) * 26 * s;
          g.beginPath(); g.moveTo(px, py); g.lineTo(px + 6 * s, py + 26 * s * (1 - t * 0.5)); g.stroke();
          g.beginPath(); g.moveTo(px, py); g.lineTo(px - 8 * s, py + 22 * s * (1 - t * 0.5)); g.stroke();
        }
      }
    };
    palm(190, 600, 60, 1.1); palm(330, 470, -40, 0.9); palm(780, 560, -70, 1.05); palm(930, 380, 30, 0.75);
    g.fillStyle = '#140f1c';
    g.beginPath(); g.moveTo(0, h);
    for (let x = 0; x <= w; x += 12) g.lineTo(x, h - 40 - Math.abs(Math.sin(x * 0.045)) * 26 - Math.sin(x * 0.013) * 10);
    g.lineTo(w, h); g.fill();
  });
}

/** Curtain panel with soft vertical folds. */
function curtainGeometry(w, h) {
  const g = new THREE.PlaneGeometry(w, h, 28, 6);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), t = (h / 2 - y) / h;
    p.setZ(i, Math.sin((x / w) * Math.PI * 7) * 0.035 * (0.6 + t * 0.6));
  }
  g.computeVertexNormals();
  return g;
}

export function buildWindow(parent) {
  const M = mats();
  const g = new THREE.Group(); g.name = 'window';
  g.position.set(WINDOW.x, WINDOW.y, BACK); parent.add(g);
  const W = WINDOW.w, H = WINDOW.h;

  // outside: sky far away, palms nearer (parallax as the camera moves)
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(9, 5.6), new THREE.MeshBasicMaterial({ map: skyTexture(), fog: false }));
  sky.position.set(0.3, 0.6, -6); g.add(sky);
  const palms = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 4.16), new THREE.MeshBasicMaterial({ map: palmTexture(), transparent: true, fog: false }));
  palms.position.set(0.1, 0.1, -2.6); g.add(palms);

  // frame inside the wall opening (white painted timber)
  const fw = 0.06, fd = 0.1, fz = -0.09;
  const frame = M.trim;
  for (const [w, h, x, y] of [[W, fw, 0, H / 2 - fw / 2], [W, fw, 0, -H / 2 + fw / 2], [fw, H, -W / 2 + fw / 2, 0], [fw, H, W / 2 - fw / 2, 0], [0.04, H, 0, 0], [W, 0.04, 0, 0.32]]) {
    mesh(rbox(w, h, fd, 0.008), frame, g, x, y, fz, { cast: true });
  }
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.08, H - 0.08), M.glass);
  glass.position.set(0, 0, fz); glass.renderOrder = 2; g.add(glass);

  // deep sill, trim around the opening
  mesh(rbox(W + 0.28, 0.045, 0.24, 0.01), frame, g, 0, -H / 2 - 0.02, 0.06, { cast: true });
  for (const [w, h, x, y] of [[W + 0.2, 0.07, 0, H / 2 + 0.035], [0.07, H + 0.07, -W / 2 - 0.035, 0.035], [0.07, H + 0.07, W / 2 + 0.035, 0.035]]) {
    mesh(rbox(w, h, 0.025, 0.006), frame, g, x, y, 0.012);
  }

  // curtains + brass rod
  const cg = curtainGeometry(0.62, 2.45);
  const cl = mesh(cg, M.fabricCurtain, g, -W / 2 - 0.3, -0.12, 0.14, { cast: true });
  const cr = mesh(cg, M.fabricCurtain, g, W / 2 + 0.3, -0.12, 0.14, { cast: true });
  cl.receiveShadow = cr.receiveShadow = true;
  const rod = mesh(new THREE.CylinderGeometry(0.014, 0.014, W + 1.0, 12), M.brass, g, 0, 1.1, 0.15);
  rod.rotation.z = Math.PI / 2;
  for (const s of [-1, 1]) mesh(new THREE.SphereGeometry(0.03, 12, 8), M.brass, g, s * (W / 2 + 0.52), 1.1, 0.15);
  for (const s of [-1, 1]) mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 8).rotateX(Math.PI / 2), M.brass, g, s * (W / 2 + 0.35), 1.1, 0.08);

  // small plant pot on the sill
  return g;
}
