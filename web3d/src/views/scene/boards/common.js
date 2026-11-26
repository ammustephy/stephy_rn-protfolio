import * as THREE from 'three';
import { rbox, mesh } from '../geometry.js';
import { mats } from '../materials.js';

/**
 * A picture-frame style border around a w x h opening.
 * Returns the group; content goes at z = depth/2 - inset.
 */
export function frame(parent, w, h, { border = 0.04, depth = 0.035, mat = mats().frameWood, backMat = null } = {}) {
  const g = new THREE.Group(); parent.add(g);
  const W = w + border * 2, H = h + border * 2;
  const bar = (bw, bh, x, y) => mesh(rbox(bw, bh, depth, Math.min(0.008, border / 3)), mat, g, x, y, depth / 2, { cast: true });
  bar(W, border, 0, h / 2 + border / 2);
  bar(W, border, 0, -h / 2 - border / 2);
  bar(border, h, -w / 2 - border / 2, 0);
  bar(border, h, w / 2 + border / 2, 0);
  if (backMat) mesh(new THREE.PlaneGeometry(w, h), backMat, g, 0, 0, 0.004);
  return g;
}

/** Stores the base position of a clickable object so the hover lift can return to it. */
export function clickable(object, info) {
  object.userData.click = info;
  object.userData.basePos = object.position.clone();
  return object;
}

/**
 * Anchor = what the camera frames for a stop: the centre of a surface,
 * its outward normal and its size in metres.
 */
export function anchor(center, normal, size, extra = {}) {
  return { center: center.clone(), normal: normal.clone().normalize(), size, ...extra };
}

/** Swaps a mesh's material, disposing the old one (and its texture) if it was built for that mesh only. */
export function replaceMaterial(meshObj, mat) {
  const old = meshObj.material;
  if (old && old.userData && old.userData.own) {
    if (old.emissiveMap) old.emissiveMap.dispose();
    if (old.map && old.map !== old.emissiveMap) old.map.dispose();
    old.dispose();
  }
  meshObj.material = mat;
}

/** Disposes geometries and textures that belong only to this group (shared ones are cached and skipped). */
export function disposeGroup(group, keep = new Set()) {
  group.traverse((o) => {
    if (!o.isMesh) return;
    if (o.userData.ownGeometry && o.geometry) o.geometry.dispose();
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of ms) {
      if (!m || keep.has(m) || !m.userData.own) continue;
      for (const k of ['map', 'emissiveMap']) if (m[k] && !keep.has(m[k])) m[k].dispose();
      m.dispose();
    }
  });
}
