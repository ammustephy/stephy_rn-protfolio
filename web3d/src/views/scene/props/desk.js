import * as THREE from 'three';
import { DESK, DESK_Z } from '../layout.js';
import { mats, std, phys } from '../materials.js';
import { rbox, rrPlane, mesh, cached, V } from '../geometry.js';
import { smokeSprite } from '../textures.js';
import { staticTex, textBox, HAND } from '../canvasText.js';

/*
 * The work desk and everything on it: 27" monitor, mechanical keyboard with
 * keycaps, mouse, 14" laptop, phone on a stand, headphones on a stand,
 * an arm lamp (the warm shadow-casting light), a coffee mug with steam,
 * and an office chair. Sizes are real-world.
 */

const black = () => new THREE.MeshBasicMaterial({ color: '#050505' });

/** Standard ANSI-ish keyboard rows in key units. */
const ROWS = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
  [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25],
];

function keyboard(parent, x, z) {
  const M = mats(), u = 0.0185;
  const g = new THREE.Group(); g.position.set(x, DESK.h, z); g.rotation.y = 0.02; parent.add(g);
  const W = 15 * u + 0.02, D = 5 * u + 0.02;
  // case with a slight tilt
  const base = mesh(rbox(W, D, 0.022, 0.006, 0.008), std('#2b2c31', { roughness: 0.45, metalness: 0.3 }), g, 0, 0.011, 0, { cast: true });
  base.rotation.x = -Math.PI / 2 + 0.06;
  const capGeo = cached('keycap', () => {
    const geo = rbox(1, 1, 1, 0.18, 0.22, 2);
    return geo;
  });
  const n = ROWS.reduce((a, r) => a + r.length, 0);
  const im = new THREE.InstancedMesh(capGeo, std('#ffffff', { roughness: 0.55 }), n);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2 + 0.06, 0, 0)), s = new THREE.Vector3(), p = new THREE.Vector3();
  const dark = new THREE.Color('#2f3036'), light = new THREE.Color('#e6e1d6'), accent = new THREE.Color('#d9622b');
  let i = 0;
  ROWS.forEach((row, r) => {
    let cx = -W / 2 + 0.01;
    row.forEach((w, k) => {
      const kw = w * u;
      p.set(cx + kw / 2, 0.028 + (2 - r) * 0.0011, -D / 2 + 0.01 + r * u + u / 2);
      s.set(kw - 0.0028, u - 0.0028, 0.009);
      m4.compose(p, q, s); im.setMatrixAt(i, m4);
      const special = w !== 1 || (r === 0 && k === 0);
      im.setColorAt(i, (r === 4 && w > 6) ? light : special ? (r === 2 && k === row.length - 1 ? accent : light) : dark);
      cx += kw; i++;
    });
  });
  im.castShadow = true; im.receiveShadow = true;
  g.add(im);
  return g;
}

function mouse(parent, x, z) {
  const g = new THREE.Group(); g.position.set(x, DESK.h, z); parent.add(g);
  const pad = mesh(rrPlane(0.3, 0.24, 0.02), std('#24282c', { roughness: 0.95 }), g, 0, 0.002, 0);
  pad.rotation.x = -Math.PI / 2;
  const body = mesh(cached('mouseBody', () => new THREE.SphereGeometry(1, 24, 16)), std('#e8e6e1', { roughness: 0.35 }), g, 0.02, 0.012, 0.0, { cast: true });
  body.scale.set(0.031, 0.019, 0.058);
  const wheel = mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.004, 12), mats().rubber, g, 0.02, 0.03, -0.02);
  wheel.rotation.z = Math.PI / 2;
  return g;
}

function monitor(parent, x, z) {
  const M = mats();
  const g = new THREE.Group(); g.position.set(x, DESK.h, z); parent.add(g);
  // stand: aluminium foot + neck
  mesh(rbox(0.26, 0.18, 0.012, 0.005, 0.04), M.aluminium, g, 0, 0.006, 0.02, { cast: true }).rotation.x = -Math.PI / 2;
  const neck = mesh(rbox(0.05, 0.3, 0.022, 0.008), M.aluminium, g, 0, 0.17, -0.04, { cast: true });
  neck.rotation.x = -0.12;
  // 27" panel: 0.615 x 0.365 outer, 0.597 x 0.336 visible
  const head = new THREE.Group(); head.position.set(0, 0.355, 0.0); head.rotation.x = -0.05; g.add(head);
  mesh(rbox(0.615, 0.365, 0.022, 0.006, 0.01), M.darkPlastic, head, 0, 0, 0, { cast: true });
  mesh(rbox(0.36, 0.22, 0.04, 0.02, 0.05), M.darkPlastic, head, 0, -0.02, -0.025, { cast: true });
  const screenMesh = mesh(rrPlane(0.597, 0.336, 0.004), black(), head, 0, 0.008, 0.0112);
  screenMesh.name = 'monitor-screen';
  // small logo LED
  mesh(new THREE.CircleGeometry(0.0025, 8), new THREE.MeshBasicMaterial({ color: '#9fd6ff', toneMapped: false }), head, 0.28, -0.172, 0.0112);
  return { g, screenMesh };
}

function laptop(parent, x, z, rotY) {
  const M = mats();
  const g = new THREE.Group(); g.position.set(x, DESK.h, z); g.rotation.y = rotY; parent.add(g);
  const W = 0.32, D = 0.222;
  const base = mesh(rbox(W, D, 0.014, 0.005, 0.012), M.aluminium, g, 0, 0.007, 0, { cast: true });
  base.rotation.x = -Math.PI / 2;
  // keyboard well + trackpad
  const well = mesh(rrPlane(0.27, 0.1, 0.006), std('#1b1c20', { roughness: 0.6 }), g, 0, 0.0142, -0.035);
  well.rotation.x = -Math.PI / 2;
  const pad = mesh(rrPlane(0.11, 0.065, 0.006), std('#aeb1b8', { roughness: 0.25, metalness: 0.8 }), g, 0, 0.0142, 0.065);
  pad.rotation.x = -Math.PI / 2;
  // lid hinged at the back edge, opened to ~105 degrees
  const lid = new THREE.Group(); lid.position.set(0, 0.014, -D / 2 + 0.004); lid.rotation.x = -0.26; g.add(lid);
  mesh(rbox(W, 0.212, 0.007, 0.003, 0.012), M.aluminium, lid, 0, 0.106, -0.0035, { cast: true });
  mesh(rrPlane(W - 0.004, 0.208, 0.01), std('#0c0c0e', { roughness: 0.3 }), lid, 0, 0.106, 0.0002);
  const screenMesh = mesh(new THREE.PlaneGeometry(0.296, 0.185), black(), lid, 0, 0.11, 0.0006);
  screenMesh.name = 'laptop-screen';
  return { g, screenMesh, screenSize: [0.296, 0.185] };
}

function phoneOnStand(parent, x, z) {
  const M = mats();
  const g = new THREE.Group(); g.position.set(x, DESK.h, z); g.rotation.y = -0.18; parent.add(g);
  mesh(rbox(0.1, 0.09, 0.012, 0.004, 0.02), M.lightWood, g, 0, 0.006, 0, { cast: true }).rotation.x = -Math.PI / 2;
  const back = mesh(rbox(0.06, 0.12, 0.01, 0.003), M.lightWood, g, 0, 0.07, -0.025, { cast: true });
  back.rotation.x = -0.3;
  const ph = new THREE.Group(); ph.position.set(0, 0.098, -0.004); ph.rotation.x = -0.3; g.add(ph);
  mesh(rbox(0.077, 0.163, 0.0082, 0.0035, 0.011), std('#2a2b31', { roughness: 0.3, metalness: 0.7 }), ph, 0, 0, 0, { cast: true });
  const screenMesh = mesh(rrPlane(0.0715, 0.1565, 0.009), black(), ph, 0, 0, 0.0042);
  screenMesh.name = 'phone-screen';
  // lip that holds the phone
  mesh(rbox(0.08, 0.012, 0.016, 0.004), M.lightWood, g, 0, 0.02, 0.012);
  return { g, screenMesh, screenSize: [0.0715, 0.1565] };
}

function headphones(parent, x, z) {
  const M = mats();
  const g = new THREE.Group(); g.position.set(x, DESK.h, z); g.rotation.y = 0.4; parent.add(g);
  mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.012, 24), M.blackMetal, g, 0, 0.006, 0, { cast: true });
  mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.26, 10), M.blackMetal, g, 0, 0.14, 0, { cast: true });
  const top = mesh(rbox(0.09, 0.012, 0.03, 0.005), M.blackMetal, g, 0, 0.275, 0, { cast: true });
  top.rotation.x = -Math.PI / 2;
  // band: half torus over the hanger, cups hanging at the sides
  const band = mesh(new THREE.TorusGeometry(0.085, 0.012, 10, 32, Math.PI), std('#1e1f24', { roughness: 0.6 }), g, 0, 0.2, 0, { cast: true });
  band.scale.set(1, 0.95, 1.4);
  for (const s of [-1, 1]) {
    const cup = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.035, 24), std('#2a2b30', { roughness: 0.4, metalness: 0.3 }), g, s * 0.087, 0.19, 0, { cast: true });
    cup.rotation.z = Math.PI / 2;
    const cushion = mesh(new THREE.TorusGeometry(0.035, 0.012, 10, 24), std('#141416', { roughness: 0.95 }), g, s * 0.067, 0.19, 0);
    cushion.rotation.y = Math.PI / 2;
    const ring = mesh(new THREE.TorusGeometry(0.045, 0.003, 6, 24), M.brass, g, s * 0.106, 0.19, 0);
    ring.rotation.y = Math.PI / 2;
  }
  return g;
}

/** Articulated arm lamp. Returns the spot light, aimed at the desk. */
function armLamp(parent, x, z, quality) {
  const M = mats();
  const lampMat = std('#1f2d2b', { roughness: 0.35, metalness: 0.6 });
  const g = new THREE.Group(); g.position.set(x, DESK.h, z); parent.add(g);
  mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.022, 28), lampMat, g, 0, 0.011, 0, { cast: true });
  const arm = (a, b) => {
    const d = b.clone().sub(a), L = d.length();
    const m = mesh(new THREE.CylinderGeometry(0.008, 0.008, L, 8), lampMat, g, 0, 0, 0, { cast: true });
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
  };
  const j1 = V(0, 0.022, 0), j2 = V(0.03, 0.42, -0.05), j3 = V(0.24, 0.6, 0.1);
  arm(j1, j2); arm(j2, j3);
  for (const j of [j2, j3]) mesh(new THREE.SphereGeometry(0.014, 12, 8), M.brass, g, j.x, j.y, j.z);
  // shade (lathe, open at the bottom) + bulb
  const pts = [[0.012, 0.06], [0.028, 0.055], [0.05, 0.02], [0.075, -0.045], [0.072, -0.047], [0.047, 0.018], [0.026, 0.05], [0.012, 0.054]];
  const shade = mesh(new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a, b)), 28), std('#1f2d2b', { roughness: 0.35, metalness: 0.6, side: THREE.DoubleSide }), g, j3.x, j3.y, j3.z, { cast: true });
  shade.rotation.set(0.35, 0, -0.55);
  const bulb = mesh(new THREE.SphereGeometry(0.022, 16, 10), new THREE.MeshStandardMaterial({ color: '#fff2d6', emissive: '#ffd9a0', emissiveIntensity: 6 }), shade, 0, -0.015, 0);
  bulb.castShadow = false;
  const spot = new THREE.SpotLight('#ffc98a', 7, 4.5, 0.82, 0.6, 2);
  const wp = new THREE.Vector3(); shade.updateWorldMatrix(true, false);
  spot.position.set(x + j3.x, DESK.h + j3.y - 0.04, z + j3.z);
  spot.target.position.set(x + 0.55, DESK.h, z + 0.4);
  spot.castShadow = true;
  spot.shadow.mapSize.set(quality.phone ? 512 : 1024, quality.phone ? 512 : 1024);
  spot.shadow.bias = -0.0006; spot.shadow.normalBias = 0.01;
  spot.shadow.camera.near = 0.05; spot.shadow.camera.far = 4;
  spot.shadow.radius = 4;
  parent.add(spot, spot.target);
  return { g, spot, wp };
}

/** Coffee mug with rising steam (sprites). Returns an update function. */
function mugWithSteam(parent, x, z) {
  const M = mats();
  const g = new THREE.Group(); g.position.set(x, DESK.h, z); g.rotation.y = 0.6; parent.add(g);
  const pts = [[0, 0], [0.036, 0], [0.04, 0.004], [0.042, 0.095], [0.039, 0.096], [0.037, 0.008], [0, 0.008]];
  mesh(new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a, b)), 32), M.ceramicTeal, g, 0, 0, 0, { cast: true });
  const handle = mesh(new THREE.TorusGeometry(0.024, 0.006, 10, 20, Math.PI * 1.15), M.ceramicTeal, g, 0.045, 0.05, 0, { cast: true });
  handle.rotation.z = -Math.PI * 0.57;
  const coffee = mesh(new THREE.CircleGeometry(0.037, 24), phys('#2a160c', { roughness: 0.08, clearcoat: 1 }), g, 0, 0.082, 0);
  coffee.rotation.x = -Math.PI / 2;
  // coaster
  mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.004, 28), std('#6b4a33', { roughness: 0.9 }), g, 0, -0.001, 0);

  const steamMat = new THREE.SpriteMaterial({ map: smokeSprite(), color: '#ffffff', transparent: true, depthWrite: false, opacity: 0.0 });
  const puffs = [];
  for (let i = 0; i < 12; i++) {
    const s = new THREE.Sprite(steamMat.clone());
    s.userData.phase = i / 12;
    s.userData.wobble = Math.random() * 6;
    g.add(s); puffs.push(s);
  }
  return (time) => {
    for (const s of puffs) {
      const t = (time * 0.22 + s.userData.phase) % 1;
      s.position.set(Math.sin(t * 5 + s.userData.wobble) * 0.012 * (1 + t * 2), 0.09 + t * 0.22, Math.cos(t * 4 + s.userData.wobble) * 0.008);
      const sc = 0.03 + t * 0.07;
      s.scale.set(sc, sc * 1.3, 1);
      s.material.opacity = Math.sin(t * Math.PI) * 0.33;
    }
  };
}

function chair(parent, x, z, rotY) {
  const M = mats();
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; parent.add(g);
  const seat = mesh(rbox(0.5, 0.48, 0.08, 0.035, 0.09), M.fabricTeal, g, 0, 0.48, 0, { cast: true });
  seat.rotation.x = -Math.PI / 2;
  const back = mesh(rbox(0.46, 0.58, 0.07, 0.03, 0.12), M.fabricTeal, g, 0, 0.88, 0.26, { cast: true });
  back.rotation.x = 0.1;
  mesh(rbox(0.06, 0.32, 0.03, 0.01), M.blackMetal, g, 0, 0.6, 0.27, { cast: true });
  for (const s of [-1, 1]) {
    mesh(rbox(0.05, 0.03, 0.28, 0.012), M.darkPlastic, g, s * 0.27, 0.68, 0.02, { cast: true });
    mesh(rbox(0.025, 0.18, 0.025, 0.008), M.blackMetal, g, s * 0.27, 0.58, 0.06);
  }
  mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.34, 12), M.chrome, g, 0, 0.27, 0, { cast: true });
  const legGeo = rbox(0.33, 0.03, 0.045, 0.01);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = mesh(legGeo, M.blackMetal, g, Math.cos(a) * 0.15, 0.07, Math.sin(a) * 0.15, { cast: true });
    leg.rotation.y = -a;
    const wheel = mesh(cached('caster', () => new THREE.SphereGeometry(0.025, 12, 8)), M.rubber, g, Math.cos(a) * 0.3, 0.025, Math.sin(a) * 0.3);
    wheel.castShadow = true;
  }
  return g;
}

function sticky(parent, text, x, y, z, rz, col = '#ffe27a') {
  const tex = staticTex(256, 256, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(0, 0, w, 34);
    textBox(g, text, 18, 40, w - 36, h - 56, { size: 64, weight: 700, color: '#4b3a1a', font: HAND });
  });
  const m = mesh(new THREE.PlaneGeometry(0.075, 0.075), std('#ffffff', { map: tex, roughness: 0.9, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.2 }), parent, x, y, z);
  m.rotation.z = rz;
  return m;
}

export function buildDesk(parent, quality) {
  const M = mats();
  const root = new THREE.Group(); root.name = 'desk'; parent.add(root);
  const x0 = DESK.x, z0 = DESK_Z;

  // desk: walnut top on black steel legs, drawer unit on the right
  const top = mesh(rbox(DESK.w, DESK.d, 0.035, 0.008), M.deskWood, root, x0, DESK.h - 0.0175, z0, { cast: true });
  top.rotation.x = -Math.PI / 2;
  const legGeo = rbox(0.045, DESK.h - 0.035, 0.045, 0.008);
  for (const [dx, dz] of [[-0.95, -0.36], [0.95, -0.36], [-0.95, 0.36], [0.95, 0.36]]) {
    mesh(legGeo, M.blackMetal, root, x0 + dx, (DESK.h - 0.035) / 2, z0 + dz, { cast: true });
  }
  mesh(rbox(1.86, 0.06, 0.02, 0.006), M.blackMetal, root, x0, DESK.h - 0.07, z0 - 0.36);
  const drawers = new THREE.Group(); drawers.position.set(x0 + 0.68, 0, z0 + 0.0); root.add(drawers);
  mesh(rbox(0.42, 0.6, 0.68, 0.01), M.deskWood, drawers, 0, 0.32, 0, { cast: true });
  for (let i = 0; i < 3; i++) {
    mesh(rbox(0.39, 0.17, 0.02, 0.006), M.deskWood, drawers, 0, 0.13 + i * 0.19, 0.345);
    mesh(rbox(0.12, 0.012, 0.016, 0.005), M.brass, drawers, 0, 0.16 + i * 0.19, 0.36);
  }

  const mon = monitor(root, x0, z0 - 0.2);
  keyboard(root, x0, z0 + 0.15);
  mouse(root, x0 + 0.42, z0 + 0.16);
  const lap = laptop(root, x0 - 0.62, z0 + 0.05, 0.28);
  const phone = phoneOnStand(root, x0 + 0.66, z0 - 0.08);
  headphones(root, x0 + 0.88, z0 - 0.24);
  const lamp = armLamp(root, x0 - 0.88, z0 - 0.25, quality);
  const steam = mugWithSteam(root, x0 - 0.33, z0 + 0.22);

  // notebook + pencil near the keyboard
  const nb = mesh(rbox(0.15, 0.21, 0.012, 0.003, 0.006), std('#8a2f2a', { roughness: 0.8 }), root, x0 + 0.48, DESK.h + 0.006, z0 - 0.12, { cast: true });
  nb.rotation.set(-Math.PI / 2, 0, 0.3);
  const pencil = mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.17, 6), std('#e6b422', { roughness: 0.6 }), root, x0 + 0.5, DESK.h + 0.016, z0 - 0.1);
  pencil.rotation.set(Math.PI / 2, 0, 0.9);

  sticky(root, 'ship it ♥', x0 - 0.33, DESK.h + 0.36, z0 - 0.186, 0.06);
  sticky(root, 'flutter pub get', x0 + 0.345, DESK.h + 0.25, z0 - 0.183, -0.08, '#9fe0d8');

  chair(root, x0 + 0.3, z0 + 0.95, Math.PI + 0.35);

  return {
    root,
    monitorScreen: mon.screenMesh,
    laptopScreen: lap.screenMesh,
    phoneScreen: phone.screenMesh,
    lampSpot: lamp.spot,
    update(time) { steam(time); },
  };
}
