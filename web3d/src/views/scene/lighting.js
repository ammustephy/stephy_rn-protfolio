import * as THREE from 'three';
import { WINDOW, BACK } from './layout.js';

/*
 * Base lighting for an evening room:
 *  - a dim warm/cool hemisphere fill (bounce light),
 *  - cool dusk light coming in through the window (shadow caster #2),
 *
 * The warm arm lamp (shadow caster #1), pendant, wall sconces and neon live
 * with their props in props/desk.js and props/decor.js.
 */
export function buildLighting(scene, quality) {
  const hemi = new THREE.HemisphereLight('#ffe6cc', '#3b2a22', 0.32);
  scene.add(hemi);

  const dusk = new THREE.DirectionalLight('#a9bfff', 1.6);
  dusk.position.set(WINDOW.x + 1.2, 4.6, BACK - 6);
  dusk.target.position.set(WINDOW.x + 2.8, 0, BACK + 3.5);
  dusk.castShadow = true;
  const s = quality.phone ? 1024 : 2048;
  dusk.shadow.mapSize.set(s, s);
  const cam = dusk.shadow.camera;
  cam.left = -9; cam.right = 9; cam.top = 7; cam.bottom = -7; cam.near = 1; cam.far = 26;
  dusk.shadow.bias = -0.0005; dusk.shadow.normalBias = 0.02; dusk.shadow.radius = 5;
  scene.add(dusk, dusk.target);

  // (no light in front of the monitor: it showed up as a hot spot on the glossy screen)

  return { hemi, dusk };
}
