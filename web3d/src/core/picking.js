import * as THREE from 'three';

/**
 * Raycast picking for clickable 3D objects.
 * - hover: pointer cursor + a small lift towards the viewer
 * - click: on pointer up, only if the pointer barely moved (drags are ignored)
 * Clickable objects carry userData.click = {type, id, label, lift?, hit?(uv)}.
 */
export class Picking {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {THREE.Camera} camera
   * @param {{getTargets: () => THREE.Object3D[], onClick: (info: any, region: any) => void, onHover: (info: any, region: any) => void, enabled: () => boolean}} opts
   */
  constructor(canvas, camera, opts) {
    this.canvas = canvas;
    this.camera = camera;
    this.opts = opts;
    this.ray = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();
    this.hovered = null;
    this.region = null;
    this.down = null;
    this.lifted = new Set();
    this._needsHover = false;
    this._last = null;

    canvas.addEventListener('pointerdown', (e) => { this.down = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }; });
    canvas.addEventListener('pointermove', (e) => {
      this._last = e;
      if (e.pointerType === 'mouse') this._needsHover = true;
    });
    canvas.addEventListener('pointerleave', () => this._setHover(null, null));
    canvas.addEventListener('pointerup', (e) => {
      const d = this.down; this.down = null;
      if (!d || !this.opts.enabled()) return;
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8 || performance.now() - d.t > 700) return;
      const hit = this._pick(e.clientX, e.clientY);
      if (!hit) return;
      if (hit.info.type === 'regions' && !hit.region) return;
      this.opts.onClick(hit.info, hit.region);
    });
  }

  _pick(x, y) {
    const r = this.canvas.getBoundingClientRect();
    this.ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera);
    const hits = this.ray.intersectObjects(this.opts.getTargets(), true);
    for (const h of hits) {
      let o = h.object;
      while (o && !o.userData.click) o = o.parent;
      if (!o) continue;
      const info = o.userData.click;
      const region = info.type === 'regions' && h.uv ? info.hit(h.uv) : null;
      return { object: o, info, region };
    }
    return null;
  }

  _setHover(obj, region) {
    if (obj !== this.hovered || region !== this.region) {
      this.hovered = obj; this.region = region;
      const clickable = obj && (obj.userData.click.type !== 'regions' || region);
      this.canvas.style.cursor = clickable ? 'pointer' : '';
      this.opts.onHover(obj ? obj.userData.click : null, region);
    }
  }

  update(dt) {
    if (this._needsHover && this._last) {
      this._needsHover = false;
      if (!this.opts.enabled()) this._setHover(null, null);
      else {
        const hit = this._pick(this._last.clientX, this._last.clientY);
        this._setHover(hit ? hit.object : null, hit ? hit.region : null);
      }
    }
    // ease hovered objects forward, others back
    const k = 1 - Math.exp(-dt * 14);
    for (const o of this.opts.getTargets()) {
      const base = o.userData.basePos;
      if (!base) continue;
      const lift = o.userData.click.lift ?? 0.025;
      const on = o === this.hovered && lift > 0;
      const target = on ? lift : 0;
      o.userData.liftNow = (o.userData.liftNow || 0) + (target - (o.userData.liftNow || 0)) * k;
      o.position.copy(base);
      o.translateZ(o.userData.liftNow);
      const s = 1 + o.userData.liftNow * 0.6;
      if (lift > 0) o.scale.setScalar(s);
    }
  }

  /** Forget hover state (e.g. after the scene was rebuilt). */
  reset() { this._setHover(null, null); }
}
