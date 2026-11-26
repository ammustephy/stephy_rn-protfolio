import * as THREE from 'three';

/**
 * Moves the camera between stops.
 *
 * Each stop has a "shot": the point to look at, the direction the camera
 * looks from, and the size (w x h metres) that must fit on screen. The camera
 * distance is computed from the screen aspect and from the screen area that
 * the HTML overlay leaves free (safe insets), so the same shot works on a
 * 1920x1080 monitor and on a 375x812 phone.
 *
 * Moves are eased tweens along a curve that bends towards the middle of the
 * room, so the camera never cuts through a wall.
 */
export class CameraRig {
  /**
   * @param {THREE.PerspectiveCamera} camera
   * @param {import('../viewmodels/TourViewModel.js').TourViewModel} tour
   * @param {{shotFor: (id: string) => any, introShot: () => any, insets: () => {top:number,right:number,bottom:number,left:number}, reducedMotion: boolean}} opts
   */
  constructor(camera, tour, opts) {
    this.camera = camera;
    this.tour = tour;
    this.opts = opts;
    this.pos = new THREE.Vector3();
    this.look = new THREE.Vector3();
    this.tween = null;
    this.idle = 0;
    this.pointer = new THREE.Vector2();
    this.sway = new THREE.Vector2();
    this._apply(this._solve(opts.introShot()));
    tour.on('change', (e) => this._onChange(e));
  }

  setPointer(x, y) { this.pointer.set(x, y); }

  /** Computes camera position and look point for a shot with the current viewport. */
  _solve(shot) {
    const cam = this.camera;
    if (shot.pos) return { pos: shot.pos.clone(), look: shot.look.clone() };
    const ins = this.opts.insets(), W = window.innerWidth, H = window.innerHeight;
    const fl = ins.left / W, fr = ins.right / W, ft = ins.top / H, fb = ins.bottom / H;
    const availW = Math.max(0.4, 1 - fl - fr), availH = Math.max(0.4, 1 - ft - fb);
    const tanV = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), tanH = tanV * cam.aspect;
    const [w, h] = shot.size, m = shot.margin || 1.06;
    const dist = Math.max(h / 2 / (tanV * availH), w / 2 / (tanH * availW)) * m;
    const dir = shot.dir.clone().normalize();
    const pos = shot.look.clone().addScaledVector(dir, dist);
    // shift so the subject sits in the middle of the free area, not the middle of the screen
    const fwd = dir.clone().negate();
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(right, fwd).normalize();
    const cx = fl + availW / 2 - 0.5, cy = ft + availH / 2 - 0.5; // offsets in screen fractions
    const shift = right.multiplyScalar(-cx * 2 * tanH * dist).add(up.multiplyScalar(cy * 2 * tanV * dist));
    pos.add(shift);
    const look = shot.look.clone().add(shift);
    // stay inside the room: use the tighter alternative shot if there is one, otherwise move closer
    const b = this.opts.bounds;
    if (b && !b.containsPoint(pos)) {
      if (shot.alt) return this._solve(shot.alt);
      const ray = new THREE.Ray(pos.clone(), look.clone().sub(pos).normalize());
      const hit = ray.intersectBox(b, new THREE.Vector3());
      if (hit) pos.copy(hit);
    }
    return { pos, look };
  }

  _apply({ pos, look }) {
    this.pos.copy(pos); this.look.copy(look);
  }

  _onChange({ stop, instant }) {
    const target = this._solve(this.opts.shotFor(stop.id));
    if (instant || this.opts.reducedMotion) {
      this.tween = null;
      this._apply(target);
      this.tour.arrive();
      return;
    }
    const from = { pos: this.pos.clone(), look: this.look.clone() };
    const d = from.pos.distanceTo(target.pos);
    // bend the path towards the middle of the room
    const mid = from.pos.clone().lerp(target.pos, 0.5);
    const safe = new THREE.Vector3(0.6, 1.75, 0.6);
    const ctrl = mid.clone().lerp(safe, Math.min(0.65, d / 10));
    this.tween = { from, target, ctrl, t: 0, dur: THREE.MathUtils.clamp(1.35 + d * 0.045, 1.4, 1.8) };
  }

  /** Re-solves the current stop after a resize / layout change. */
  refresh() {
    const s = this.tour.current;
    const target = this._solve(s ? this.opts.shotFor(s.id) : this.opts.introShot());
    if (this.tween) this.tween.target = target;
    else this._apply(target);
  }

  update(dt) {
    const tw = this.tween;
    if (tw) {
      tw.t = Math.min(1, tw.t + dt / tw.dur);
      const t = tw.t, e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
      const a = tw.from.pos, b = tw.target.pos, c = tw.ctrl;
      const u = 1 - e;
      this.pos.set(
        u * u * a.x + 2 * u * e * c.x + e * e * b.x,
        u * u * a.y + 2 * u * e * c.y + e * e * b.y,
        u * u * a.z + 2 * u * e * c.z + e * e * b.z,
      );
      this.look.lerpVectors(tw.from.look, tw.target.look, e);
      if (t >= 1) { this.tween = null; this.tour.arrive(); }
    }
    // gentle parallax with the mouse while resting at a stop (off for reduced motion)
    const k = this.opts.reducedMotion ? 0 : 1;
    this.sway.lerp(this.pointer, 1 - Math.exp(-dt * 3));
    const dist = this.pos.distanceTo(this.look);
    const amt = Math.min(0.06, dist * 0.012) * k;
    this.camera.position.copy(this.pos);
    const fwd = this.look.clone().sub(this.pos).normalize();
    const right = new THREE.Vector3().crossVectors(fwd, this.camera.up).normalize();
    this.camera.position.addScaledVector(right, this.sway.x * amt).addScaledVector(this.camera.up, -this.sway.y * amt * 0.6);
    this.camera.lookAt(this.look);
  }
}
