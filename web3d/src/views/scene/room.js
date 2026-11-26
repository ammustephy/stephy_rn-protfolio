import * as THREE from 'three';
import { ROOM, BACK, LEFT, RIGHT, WINDOW } from './layout.js';
import { mats, std } from './materials.js';
import { rbox, mesh, cached } from './geometry.js';
import { buildWindow } from './props/window.js';

/**
 * Box with UVs in metres (so tiled wall/floor textures keep their real size).
 */
export function boxM(w, h, d) {
  return cached('boxM' + [w, h, d].join(), () => {
    const g = new THREE.BoxGeometry(w, h, d);
    const uv = g.attributes.uv;
    const size = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++) {
      for (let k = 0; k < 4; k++) {
        const i = f * 4 + k;
        uv.setXY(i, uv.getX(i) * size[f][0], uv.getY(i) * size[f][1]);
      }
    }
    return g;
  });
}

/**
 * The shell of the room: floor, walls (the back wall has a real window opening
 * so the cool evening light falls in), ceiling, skirting and cornice.
 */
export function buildRoomShell(parent) {
  const M = mats(), T = 0.16, H = ROOM.h;
  const g = new THREE.Group(); g.name = 'shell'; parent.add(g);

  // floor
  const floor = mesh(boxM(ROOM.w + 2 * T, 0.1, ROOM.d + 0.4), M.floor, g, 0, -0.05, 0.2);
  floor.receiveShadow = true;

  // back wall around the window opening
  const z = BACK - T / 2, W0 = LEFT - T, W1 = RIGHT + T;
  const ox0 = WINDOW.x - WINDOW.w / 2, ox1 = WINDOW.x + WINDOW.w / 2;
  const oy0 = WINDOW.y - WINDOW.h / 2, oy1 = WINDOW.y + WINDOW.h / 2;
  const piece = (x0, x1, y0, y1) => {
    const m = mesh(boxM(x1 - x0, y1 - y0, T), M.wallBack, g, (x0 + x1) / 2, (y0 + y1) / 2, z, { cast: true });
    return m;
  };
  piece(W0, ox0, 0, H);
  piece(ox1, W1, 0, H);
  piece(ox0, ox1, 0, oy0);
  piece(ox0, ox1, oy1, H);

  // side walls
  mesh(boxM(T, H, ROOM.d), M.wallSide, g, LEFT - T / 2, H / 2, 0, { cast: true });
  mesh(boxM(T, H, ROOM.d), M.wallSide, g, RIGHT + T / 2, H / 2, 0, { cast: true });

  // ceiling (one-sided, faces down, so the overview from the front stays open)
  const ceil = mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.d), M.ceiling, g, 0, H, 0);
  ceil.rotation.x = Math.PI / 2;
  ceil.receiveShadow = false;

  // skirting boards and cornice
  const skirtBack = rbox(ROOM.w, 0.1, 0.02, 0.004);
  const skirtSide = rbox(ROOM.d, 0.1, 0.02, 0.004);
  mesh(skirtBack, M.trim, g, 0, 0.05, BACK + 0.01);
  mesh(skirtSide, M.trim, g, LEFT + 0.01, 0.05, 0).rotation.y = Math.PI / 2;
  mesh(skirtSide, M.trim, g, RIGHT - 0.01, 0.05, 0).rotation.y = -Math.PI / 2;
  const cornB = rbox(ROOM.w, 0.07, 0.06, 0.01);
  const cornS = rbox(ROOM.d, 0.07, 0.06, 0.01);
  mesh(cornB, M.trim, g, 0, H - 0.035, BACK + 0.03);
  mesh(cornS, M.trim, g, LEFT + 0.03, H - 0.035, 0).rotation.y = Math.PI / 2;
  mesh(cornS, M.trim, g, RIGHT - 0.03, H - 0.035, 0).rotation.y = -Math.PI / 2;

  // power socket + light switch details
  const plate = rbox(0.08, 0.08, 0.01, 0.003, 0.008);
  const white = std('#f2efe9', { roughness: 0.4 });
  mesh(plate, white, g, 2.25, 0.3, BACK + 0.006);
  mesh(plate, white, g, 2.36, 0.3, BACK + 0.006);
  mesh(rbox(0.08, 0.12, 0.012, 0.003, 0.008), white, g, RIGHT - 0.007, 1.2, 3.6).rotation.y = -Math.PI / 2;

  buildWindow(g);
  return g;
}
