import * as THREE from 'three';
import * as T from './textures.js';

/*
 * Shared PBR materials. Created once and reused by every prop, so the GPU
 * compiles few shader variants. envMapIntensity is kept low for an evening room
 * and raised for glossy things (glass, metal, ceramic).
 */

let M = null;

export function std(color, o = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0, envMapIntensity: 0.45, ...o });
}

export function phys(color, o = {}) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: 0.4, metalness: 0, envMapIntensity: 0.8, ...o });
}

/** Paper / printed surface: lit like paper, with a little self-light so text stays readable. */
export function printed(map, o = {}) {
  const m = new THREE.MeshStandardMaterial({
    map, roughness: 0.82, metalness: 0, envMapIntensity: 0.3,
    emissive: new THREE.Color('#ffffff'), emissiveMap: map, emissiveIntensity: o.glow ?? 0.32, ...o.mat,
  });
  m.userData.own = true;
  return m;
}

/**
 * Display panel: the picture is emitted (not lit), the glass on top reflects the room.
 * toneMapped off keeps UI colours true.
 */
export function screen(map, o = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color: '#000000', emissive: new THREE.Color('#ffffff'), emissiveMap: map, emissiveIntensity: o.intensity ?? 0.92,
    roughness: 0.55, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.35, envMapIntensity: 0.3, specularIntensity: 0.4, toneMapped: false,
  });
  m.userData.own = true;
  return m;
}

/** All shared materials, built on first use. */
export function mats() {
  if (M) return M;
  M = {
    wallBack: std('#5d7d77', { map: T.tiled(T.wallPaint(), 3, 3), roughness: 0.92 }),
    wallSide: std('#cdbfaa', { map: T.tiled(T.wallPaint(), 3, 3), roughness: 0.92 }),
    ceiling: std('#e9e1d4', { roughness: 0.95 }),
    floor: std('#ffffff', { map: T.tiled(T.floorPlanks(), 0.5, 0.5), bumpMap: T.tiled(T.floorPlanks(), 0.5, 0.5), bumpScale: 0.6, roughness: 0.5, envMapIntensity: 0.6 }),
    trim: std('#efe6d8', { roughness: 0.55 }),
    deskWood: std('#ffffff', { map: T.tiled(T.deskWood(), 0.6, 1.2), roughness: 0.42, envMapIntensity: 0.6 }),
    lightWood: std('#ffffff', { map: T.tiled(T.lightWood(), 1, 1), roughness: 0.55 }),
    frameWood: std('#ffffff', { map: T.tiled(T.deskWood(), 2, 2), roughness: 0.48 }),
    blackMetal: std('#1c1c20', { roughness: 0.38, metalness: 0.75, envMapIntensity: 0.9 }),
    darkPlastic: std('#1d1e23', { roughness: 0.45, metalness: 0.0, envMapIntensity: 0.6 }),
    aluminium: std('#c3c6cc', { roughness: 0.28, metalness: 1.0, envMapIntensity: 1.0 }),
    brass: std('#c9a25a', { roughness: 0.3, metalness: 1.0, envMapIntensity: 1.0 }),
    chrome: std('#e8e8ea', { roughness: 0.12, metalness: 1.0, envMapIntensity: 1.2 }),
    glass: phys('#ffffff', { roughness: 0.04, transmission: 0, transparent: true, opacity: 0.07, envMapIntensity: 0.7, depthWrite: false }),
    ceramicWhite: phys('#f1ede6', { roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
    ceramicTerracotta: std('#b8643f', { roughness: 0.75 }),
    ceramicTeal: phys('#2f7f86', { roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.15 }),
    fabricTeal: std('#2f6a6a', { map: T.tiled(T.fabric(), 4, 4), roughness: 0.95, envMapIntensity: 0.25 }),
    fabricMustard: std('#c48a2c', { map: T.tiled(T.fabric(), 3, 3), roughness: 0.96, envMapIntensity: 0.25 }),
    fabricCurtain: std('#d9c7a7', { map: T.tiled(T.fabric(), 2, 6), roughness: 0.95, side: THREE.DoubleSide, envMapIntensity: 0.25 }),
    rug: std('#ffffff', { map: T.rugWeave(), bumpMap: T.rugWeave(), bumpScale: 1.2, roughness: 1, envMapIntensity: 0.2 }),
    cork: std('#ffffff', { map: T.tiled(T.cork(), 1.5, 1.5), bumpMap: T.tiled(T.cork(), 1.5, 1.5), bumpScale: 1.5, roughness: 1, envMapIntensity: 0.2 }),
    whiteboard: phys('#f7f7f4', { roughness: 0.18, clearcoat: 0.7, clearcoatRoughness: 0.1, envMapIntensity: 0.5 }),
    soil: std('#3a2a1e', { roughness: 1 }),
    leafA: std('#3f7a3a', { roughness: 0.55, side: THREE.DoubleSide }),
    leafB: std('#2f6630', { roughness: 0.55, side: THREE.DoubleSide }),
    leafC: std('#5a9147', { roughness: 0.55, side: THREE.DoubleSide }),
    rubber: std('#151515', { roughness: 0.9 }),
    keycap: std('#2a2b30', { roughness: 0.55 }),
    keycapLight: std('#d9d6cf', { roughness: 0.55 }),
    paperWhite: std('#f4f0e8', { roughness: 0.9 }),
  };
  return M;
}
