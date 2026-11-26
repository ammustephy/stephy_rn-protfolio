import * as THREE from 'three';

/*
 * Geometry helpers: rounded boxes (cached), rounded planes for screens and
 * paper, and a tiny mesh factory. Geometries are cached by size, so the same
 * box is only built once and shared by every mesh that uses it.
 */

const cache = new Map();

/** Rounded rectangle outline without a duplicated start/end point. */
export function shapeRR(w, h, r, seg = 6) {
  const x = -w / 2, y = -h / 2, pts = [];
  r = Math.max(1e-4, Math.min(r, w / 2 - 1e-5, h / 2 - 1e-5));
  const corners = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]];
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * Math.PI / 2;
      pts.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
    }
  }
  return new THREE.Shape(pts);
}

/** Smooth normals except across sharp creases. */
function creased(g, ang = 0.75) {
  if (g.index) g = g.toNonIndexed();
  const p = g.attributes.position.array, n = p.length / 3, fn = new Float32Array(p.length);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < n; i += 3) {
    a.fromArray(p, i * 3); b.fromArray(p, i * 3 + 3); c.fromArray(p, i * 3 + 6);
    b.sub(a); c.sub(a); b.cross(c).normalize();
    for (let k = 0; k < 3; k++) b.toArray(fn, (i + k) * 3);
  }
  const map = new Map(), keys = new Array(n);
  for (let i = 0; i < n; i++) {
    const k = Math.round(p[i * 3] * 1e4) + ',' + Math.round(p[i * 3 + 1] * 1e4) + ',' + Math.round(p[i * 3 + 2] * 1e4);
    keys[i] = k;
    let arr = map.get(k); if (!arr) map.set(k, arr = []); arr.push(i);
  }
  const out = new Float32Array(p.length), cs = Math.cos(ang);
  for (let i = 0; i < n; i++) {
    let x = 0, y = 0, z = 0;
    const fx = fn[i * 3], fy = fn[i * 3 + 1], fz = fn[i * 3 + 2];
    for (const j of map.get(keys[i])) {
      if (fx * fn[j * 3] + fy * fn[j * 3 + 1] + fz * fn[j * 3 + 2] > cs) { x += fn[j * 3]; y += fn[j * 3 + 1]; z += fn[j * 3 + 2]; }
    }
    const l = Math.hypot(x, y, z) || 1;
    out[i * 3] = x / l; out[i * 3 + 1] = y / l; out[i * 3 + 2] = z / l;
  }
  g.setAttribute('normal', new THREE.BufferAttribute(out, 3));
  return g;
}

/**
 * Rounded box, front face towards +z. b = edge bevel, cr = corner radius seen from the front.
 * UVs are planar (front projection, 0..1), good enough for wood/fabric maps.
 */
export function rbox(w, h, d, b = 0.01, cr = b, seg = 2) {
  const key = 'rb' + [w, h, d, b, cr, seg].join();
  if (cache.has(key)) return cache.get(key);
  b = Math.min(b, d / 2 - 1e-4, w / 2 - 1e-4, h / 2 - 1e-4);
  const shape = shapeRR(w - 2 * b, h - 2 * b, Math.max(cr - b, 1e-4), seg + 1);
  const depth = Math.max(d - 2 * b, 1e-4);
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: seg, curveSegments: seg + 1 });
  g.translate(0, 0, -depth / 2);
  const out = creased(g); g.dispose();
  // planar UVs in metres (so textures with repeat look the same size everywhere)
  const pos = out.attributes.position, nrm = out.attributes.normal, uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const ax = Math.abs(nrm.getX(i)), ay = Math.abs(nrm.getY(i));
    if (ay > 0.7) { uv[i * 2] = pos.getX(i); uv[i * 2 + 1] = pos.getZ(i); }
    else if (ax > 0.7) { uv[i * 2] = pos.getZ(i); uv[i * 2 + 1] = pos.getY(i); }
    else { uv[i * 2] = pos.getX(i); uv[i * 2 + 1] = pos.getY(i); }
  }
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  cache.set(key, out);
  return out;
}

/** Flat rounded rectangle with 0..1 UVs (screens, paper, labels). */
export function rrPlane(w, h, r, seg = 6) {
  const key = 'rp' + [w, h, r, seg].join();
  if (cache.has(key)) return cache.get(key);
  const g = new THREE.ShapeGeometry(shapeRR(w, h, r, seg), seg);
  const uv = g.attributes.uv, p = g.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5);
  cache.set(key, g);
  return g;
}

/** Cached plane geometry. */
export function plane(w, h, sx = 1, sy = 1) {
  const key = 'pl' + [w, h, sx, sy].join();
  if (!cache.has(key)) cache.set(key, new THREE.PlaneGeometry(w, h, sx, sy));
  return cache.get(key);
}

/** Cached generic geometry by key. */
export function cached(key, make) {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
}

/** Creates a mesh, positions it and adds it to a parent. */
export function mesh(geo, mat, parent, x = 0, y = 0, z = 0, opts = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if (opts.cast) m.castShadow = true;
  if (opts.receive !== false) m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}

export const V = (x, y, z) => new THREE.Vector3(x, y, z);

/** Deterministic random numbers so the room looks the same on every visit. */
export function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
