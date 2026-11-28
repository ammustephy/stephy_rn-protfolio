import * as THREE from 'three';
import { rbox, mesh, rng } from '../../geometry.js';
import { staticTex, textBox, rr } from '../../canvasText.js';
import { glyph, FIELD_GLYPHS, PASTELS } from './glyphs.js';
import { appIcon } from './apps.js';

/*
 * The world inside the phone: a pastel sky, a grid floor, ~190 rounded app
 * icons that bob gently (instanced: one draw call for the bodies, one for the
 * glyphs, one for the contact shadows) and a pedestal with a big app per stop.
 */
export const FLOOR = -12;

function own(m) { m.userData.own = true; return m; }

/** Gradient sky dome (not tone mapped, no fog). */
export function skyDome() {
  const m = own(new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color('#aebcff') }, mid: { value: new THREE.Color('#f7dcec') }, bottom: { value: new THREE.Color('#ece5fb') } },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vDir;
      void main(){
        float h = vDir.y;
        vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.55, h)) : mix(mid, bottom, smoothstep(0.0, 0.3, -h));
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  }));
  const sky = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), m);
  sky.renderOrder = -2; sky.frustumCulled = false;
  return sky;
}

/** Radial soft shadow texture used for every contact shadow. */
function shadowTex() {
  return staticTex(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 2, 64, 64, 64);
    gr.addColorStop(0, 'rgba(70,50,130,0.36)'); gr.addColorStop(0.55, 'rgba(70,50,130,0.14)'); gr.addColorStop(1, 'rgba(70,50,130,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  });
}

/**
 * @param {THREE.Object3D} parent
 * @param {{id: string, at: THREE.Vector3, app: any, clear: number[]}[]} sections  pedestal positions + the area to keep free
 */
export function buildWorld(parent, sections) {
  const world = new THREE.Group(); world.name = 'appWorld'; parent.add(world);
  const R = rng(17);

  // floor with a soft grid
  const gridTex = staticTex(256, 256, (g) => {
    g.fillStyle = '#efeafb'; g.fillRect(0, 0, 256, 256);
    g.fillStyle = 'rgba(255,255,255,0.95)'; g.fillRect(0, 0, 256, 5); g.fillRect(0, 0, 5, 256);
    g.fillStyle = 'rgba(150,130,215,0.16)'; g.beginPath(); g.arc(128, 128, 5, 0, Math.PI * 2); g.fill();
  }, { repeat: [80, 80] });
  const floorMat = own(new THREE.MeshStandardMaterial({ color: '#ffffff', map: gridTex, roughness: 0.82, metalness: 0, envMapIntensity: 0.5 }));
  const floor = mesh(new THREE.PlaneGeometry(520, 520), floorMat, world, 0, FLOOR, -150);
  floor.rotation.x = -Math.PI / 2;

  const shTex = shadowTex();
  const shadowMat = own(new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false, toneMapped: false }));

  // ---- pedestals with the big section apps ----
  const pedGeo = new THREE.CylinderGeometry(4.4, 4.7, 0.9, 64);
  const pedTopGeo = new THREE.CylinderGeometry(4.0, 4.0, 0.06, 64);
  const pedMat = own(new THREE.MeshPhysicalMaterial({ color: '#fbf9ff', roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.3, envMapIntensity: 0.7 }));
  const bigGeo = rbox(5.6, 5.6, 1.4, 0.42, 1.35, 4);
  const glyphPlane = new THREE.PlaneGeometry(3.6, 3.6);
  const big = {};
  for (const s of sections) {
    const g = new THREE.Group(); g.position.copy(s.at); world.add(g);
    mesh(pedGeo, pedMat, g, 0, FLOOR - s.at.y + 0.45, 0);
    const ring = mesh(pedTopGeo, own(new THREE.MeshStandardMaterial({ color: s.app.color, roughness: 0.5, envMapIntensity: 0.5, transparent: true, opacity: 0.22 })), g, 0, FLOOR - s.at.y + 0.92, 0);
    ring.renderOrder = 1;
    const sh = mesh(new THREE.PlaneGeometry(14, 14), shadowMat, g, 0, FLOOR - s.at.y + 0.02, 0.4);
    sh.rotation.x = -Math.PI / 2;
    const icon = new THREE.Group(); g.add(icon);
    mesh(bigGeo, own(new THREE.MeshPhysicalMaterial({ color: s.app.color, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.0 })), icon);
    mesh(glyphPlane, own(new THREE.MeshBasicMaterial({ map: staticTex(256, 256, (c) => glyph(c, s.app.glyph, 128, 128, 80)), transparent: true })), icon, 0, 0, 0.71);
    // name plaque in front of the pedestal
    const lblTex = staticTex(640, 150, (c, w, h) => {
      c.fillStyle = 'rgba(255,255,255,0.94)'; rr(c, 4, 4, w - 8, h - 8, (h - 8) / 2); c.fill();
      appIcon(c, 26, 25, 100, s.app.color, s.app.glyph);
      textBox(c, s.app.name, 140, 0, w - 170, h, { size: 72, weight: 800, color: '#2b2740', align: 'left', nowrap: true });
    });
    const lblMat = own(new THREE.MeshBasicMaterial({ map: lblTex, transparent: true, toneMapped: false }));
    const lbl = mesh(new THREE.PlaneGeometry(5.6, 1.31), lblMat, g, 0, FLOOR - s.at.y + 2.0, 5.3);
    lbl.rotation.x = -0.12;
    big[s.id] = { group: g, icon, label: lbl, lblMat, shadow: sh };
  }

  // ---- the icon field (instanced) ----
  const keepFree = (x, z) => sections.some(({ clear: [a, b, c, d] }) => x > a && x < b && z > c && z < d) || (Math.abs(x) < 16 && z > -22);
  const cand = [];
  for (let x = -66; x <= 66; x += 6.2) {
    for (let z = -16; z >= -250; z -= 6.2) {
      const jx = x + (R() - 0.5) * 1.6, jz = z + (R() - 0.5) * 1.6;
      if (!keepFree(jx, jz)) cand.push({ x: jx, z: jz });
    }
  }
  // seeded shuffle, keep 190
  for (let i = cand.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [cand[i], cand[j]] = [cand[j], cand[i]]; }
  const cells = cand.slice(0, 190).map((c) => ({
    ...c, h: 1.6 + R() * 2.4, ph: R() * 6.28, ry: (R() - 0.5) * 0.7, rx: (R() - 0.5) * 0.2,
    col: Math.floor(R() * PASTELS.length), gl: Math.floor(R() * FIELD_GLYPHS.length), s: 0.85 + R() * 0.35,
  }));
  const n = cells.length;

  const bodyGeo = rbox(2.6, 2.6, 0.72, 0.24, 0.66, 2);
  const bodyMat = own(new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.34, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.9 }));
  const bodies = new THREE.InstancedMesh(bodyGeo, bodyMat, n);
  const col = new THREE.Color();
  cells.forEach((c, i) => bodies.setColorAt(i, col.set(PASTELS[c.col])));

  // glyphs: one 4 x 4 atlas, per-instance UV offset
  const atlas = staticTex(512, 512, (g) => {
    FIELD_GLYPHS.forEach((t, i) => glyph(g, t, (i % 4) * 128 + 64, Math.floor(i / 4) * 128 + 64, 40));
  });
  const glyphGeo = new THREE.PlaneGeometry(1.6, 1.6);
  const off = new Float32Array(n * 2);
  cells.forEach((c, i) => { off[i * 2] = (c.gl % 4) * 0.25; off[i * 2 + 1] = 1 - (Math.floor(c.gl / 4) + 1) * 0.25; });
  glyphGeo.setAttribute('uvOff', new THREE.InstancedBufferAttribute(off, 2));
  const glyphMat = own(new THREE.MeshBasicMaterial({ map: atlas, transparent: true, depthWrite: false }));
  glyphMat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec2 uvOff;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\n#ifdef USE_MAP\n  vMapUv = vMapUv * 0.25 + uvOff;\n#endif');
  };
  glyphMat.customProgramCacheKey = () => 'phoneGlyphAtlas';
  const glyphs = new THREE.InstancedMesh(glyphGeo, glyphMat, n);
  glyphs.renderOrder = 1;

  const shadows = new THREE.InstancedMesh(new THREE.PlaneGeometry(3.8, 3.8).rotateX(-Math.PI / 2), shadowMat, n);
  for (const im of [bodies, glyphs, shadows]) { im.frustumCulled = false; world.add(im); }

  const dummy = new THREE.Object3D(), front = new THREE.Matrix4().makeTranslation(0, 0, 0.37), m = new THREE.Matrix4();
  function place(time, k) {
    cells.forEach((c, i) => {
      const bob = Math.sin(time * 1.1 + c.ph) * 0.3 * k;
      dummy.position.set(c.x, FLOOR + c.h + bob, c.z);
      dummy.rotation.set(c.rx + Math.sin(time * 0.7 + c.ph) * 0.05 * k, c.ry + Math.sin(time * 0.5 + c.ph) * 0.08 * k, 0);
      dummy.scale.setScalar(c.s);
      dummy.updateMatrix();
      bodies.setMatrixAt(i, dummy.matrix);
      m.multiplyMatrices(dummy.matrix, front); glyphs.setMatrixAt(i, m);
      dummy.position.set(c.x, FLOOR + 0.03, c.z); dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(c.s * (1.05 - 0.06 * (c.h + bob - 1.6)));
      dummy.updateMatrix(); shadows.setMatrixAt(i, dummy.matrix);
    });
    bodies.instanceMatrix.needsUpdate = true; glyphs.instanceMatrix.needsUpdate = true; shadows.instanceMatrix.needsUpdate = true;
  }
  place(0, 1);

  return {
    world, big, iconCount: n,
    update(time, k) {
      place(time, k);
      let i = 0;
      for (const id in big) {
        const b = big[id];
        b.icon.rotation.y = Math.sin(time * 0.6 + i) * 0.08 * k;
        i++;
      }
    },
  };
}
