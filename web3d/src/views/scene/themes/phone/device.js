import * as THREE from 'three';
import { rbox, rrPlane, mesh } from '../../geometry.js';
import { mkCanvas, canvasTex, staticTex } from '../../canvasText.js';
import { drawHomeScreen } from './apps.js';
import { glyph, PASTELS } from './glyphs.js';

/*
 * The giant smartphone of the Home stop: aluminium frame, glass front that
 * reflects the environment, dynamic island (drawn on the screen), side buttons
 * and a camera bump on the back. Faces +z; the screen plane is at z = SCREEN_Z.
 */
export const PHONE = { w: 10.4, h: 21, d: 1.0 };
export const SCREEN_Z = PHONE.d / 2 + 0.012;

function own(m) { m.userData.own = true; return m; }

export function buildPhone(parent, content) {
  const root = new THREE.Group(); root.name = 'phone';
  root.rotation.set(0.03, -0.2, 0);
  parent.add(root);
  const body = new THREE.Group(); root.add(body); // everything except the screen; hidden once the camera is inside

  const frameMat = own(new THREE.MeshPhysicalMaterial({ color: '#c9c6c0', metalness: 1, roughness: 0.26, envMapIntensity: 1.15, clearcoat: 0.3, clearcoatRoughness: 0.2 }));
  const darkMat = own(new THREE.MeshStandardMaterial({ color: '#0a0a0d', roughness: 0.2, metalness: 0, envMapIntensity: 0.6 }));
  const backMat = own(new THREE.MeshPhysicalMaterial({ color: '#dcd6cf', roughness: 0.45, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.35, envMapIntensity: 0.8 }));
  const lensMat = own(new THREE.MeshPhysicalMaterial({ color: '#101218', roughness: 0.08, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.6 }));
  const ringMat = own(new THREE.MeshStandardMaterial({ color: '#b8b5ae', metalness: 1, roughness: 0.22, envMapIntensity: 1.2 }));

  // frame (rounded slab) and black front
  mesh(rbox(PHONE.w, PHONE.h, PHONE.d, 0.34, 1.75, 4), frameMat, body);
  mesh(rrPlane(PHONE.w - 0.22, PHONE.h - 0.22, 1.62, 10), darkMat, body, 0, 0, PHONE.d / 2 + 0.004);
  // back glass + camera bump
  const back = mesh(rrPlane(PHONE.w - 0.24, PHONE.h - 0.24, 1.6, 10), backMat, body, 0, 0, -PHONE.d / 2 - 0.004);
  back.rotation.y = Math.PI;
  const bump = mesh(rbox(4.0, 4.2, 0.36, 0.14, 1.05, 3), backMat, body, PHONE.w / 2 - 2.55, PHONE.h / 2 - 2.65, -PHONE.d / 2 - 0.12);
  bump.rotation.y = Math.PI;
  const lensGeo = new THREE.CylinderGeometry(0.72, 0.78, 0.32, 40).rotateX(Math.PI / 2);
  const ringGeo = new THREE.TorusGeometry(0.8, 0.09, 12, 40);
  for (const [x, y] of [[-0.85, 0.9], [-0.85, -0.95], [0.95, 0]]) {
    const px = PHONE.w / 2 - 2.55 - x, py = PHONE.h / 2 - 2.65 + y, z = -PHONE.d / 2 - 0.42;
    mesh(lensGeo, lensMat, body, px, py, z);
    mesh(ringGeo, ringMat, body, px, py, z - 0.15);
  }
  // side buttons
  const btn = (x, y, h) => mesh(rbox(0.2, h, 0.42, 0.08, 0.1), frameMat, body, x, y, 0);
  btn(PHONE.w / 2 + 0.05, 3.6, 3.0); // power
  btn(-PHONE.w / 2 - 0.05, 5.6, 1.1); // action button
  btn(-PHONE.w / 2 - 0.05, 3.4, 2.0); // volume up
  btn(-PHONE.w / 2 - 0.05, 1.0, 2.0); // volume down

  // screen (home screen drawn on canvas) and the glass on top of it
  const sw = PHONE.w - 0.62, sh = PHONE.h - 0.62;
  const [c, g] = mkCanvas(1000, Math.round(1000 * sh / sw));
  drawHomeScreen(g, c.width, c.height, { content });
  const tex = canvasTex(c);
  const screenMat = own(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true, fog: false }));
  const screen = mesh(rrPlane(sw, sh, 1.42, 10), screenMat, root, 0, 0, PHONE.d / 2 + 0.008);
  // glass: additive, black diffuse, so only the environment reflection shows on top of the screen
  const glassMat = own(new THREE.MeshPhysicalMaterial({
    color: '#000000', roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.4,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  const glass = mesh(rrPlane(PHONE.w - 0.22, PHONE.h - 0.22, 1.62, 10), glassMat, root, 0, 0, SCREEN_Z);
  glass.renderOrder = 2;
  // a soft sheen across the glass
  const sheenTex = staticTex(256, 512, (s, w, h) => {
    const gr = s.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.42, 'rgba(255,255,255,0)');
    gr.addColorStop(0.5, 'rgba(255,255,255,0.09)'); gr.addColorStop(0.62, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    s.fillStyle = gr; s.fillRect(0, 0, w, h);
  });
  const sheenMat = own(new THREE.MeshBasicMaterial({ map: sheenTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }));
  const sheen = mesh(rrPlane(PHONE.w - 0.22, PHONE.h - 0.22, 1.62, 10), sheenMat, root, 0, 0, SCREEN_Z + 0.002);
  sheen.renderOrder = 3;

  // soft glow behind the phone
  const glowTex = staticTex(256, 256, (s) => {
    const gr = s.createRadialGradient(128, 128, 10, 128, 128, 128);
    gr.addColorStop(0, 'rgba(255,255,255,0.85)'); gr.addColorStop(0.5, 'rgba(222,208,255,0.35)'); gr.addColorStop(1, 'rgba(222,208,255,0)');
    s.fillStyle = gr; s.fillRect(0, 0, 256, 256);
  });
  const glow = mesh(new THREE.PlaneGeometry(34, 42), own(new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, fog: false })), body, 0, 0, -2.5);
  glow.userData.ownGeometry = true;

  // a few app icons floating around the phone (outside view only)
  const outside = new THREE.Group(); parent.add(outside);
  const iconGeo = rbox(2.6, 2.6, 0.72, 0.24, 0.66, 3);
  const glyphGeo = new THREE.PlaneGeometry(1.6, 1.6);
  const floats = [];
  [[-12, 7.5, -3, 0, 'chat'], [11.5, 6, -4, 1, 'music'], [-10.5, -6.5, -2, 2, 'camera'], [12, -7.5, -5, 7, 'heart'],
    [-16, 0.5, -8, 5, 'cloud'], [16, 0.8, -9, 4, 'play'], [-6.5, 13, -10, 9, 'pin'], [8, 13.5, -12, 6, 'star']].forEach(([x, y, z, ci, ic], i) => {
    const grp = new THREE.Group(); grp.position.set(x, y, z);
    grp.rotation.set(0.12 * Math.sin(i * 1.7), -0.3 * Math.sign(x), 0.1 * Math.cos(i));
    outside.add(grp);
    const mat = own(new THREE.MeshPhysicalMaterial({ color: PASTELS[ci], roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.9 }));
    mesh(iconGeo, mat, grp);
    const gm = own(new THREE.MeshBasicMaterial({ map: staticTex(128, 128, (s) => glyph(s, ic, 64, 64, 40)), transparent: true, fog: false }));
    mesh(glyphGeo, gm, grp, 0, 0, 0.37);
    floats.push({ grp, y, ph: i * 1.3, rx: grp.rotation.x, ry: grp.rotation.y });
  });

  const local = new THREE.Vector3();
  return {
    root, body, screen, glass, sheen, outside,
    screenMat,
    /** Centre of the screen and its outward normal in world space (without the bobbing). */
    screenPoint: new THREE.Vector3(0, 0, SCREEN_Z).applyEuler(root.rotation),
    screenNormal: new THREE.Vector3(0, 0, 1).applyEuler(root.rotation),
    /** Signed distance of a world point in front of the screen plane. */
    depthOf(p) { local.copy(p); root.worldToLocal(local); return local.z - SCREEN_Z; },
    update(time, k) {
      root.position.y = Math.sin(time * 0.8) * 0.15 * k;
      root.rotation.y = -0.2 + Math.sin(time * 0.5) * 0.012 * k;
      root.updateMatrixWorld();
      for (const f of floats) {
        f.grp.position.y = f.y + Math.sin(time * 0.9 + f.ph) * 0.35 * k;
        f.grp.rotation.y = f.ry + Math.sin(time * 0.6 + f.ph) * 0.12 * k;
      }
    },
  };
}
