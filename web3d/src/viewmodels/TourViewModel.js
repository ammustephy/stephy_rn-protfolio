import { Emitter } from '../core/events.js';

/**
 * State of the guided tour: which stop we are at and whether the camera is
 * still moving. Knows nothing about three.js or the DOM.
 *
 * Events:
 *  - 'change' {index, from, stop, instant}  a move to a new stop has started
 *  - 'busy'   boolean                       moving / settled
 *  - 'started' {deepLink}                   the visitor pressed Enter, or arrived with a #stop link
 */
export class TourViewModel extends Emitter {
  /** @param {import('../models/Stop.js').Stop[]} stops */
  constructor(stops) {
    super();
    this.stops = stops;
    /** -1 = intro shot before the first stop. */
    this.index = -1;
    this.busy = false;
    this.started = false;
  }

  get current() { return this.stops[this.index] || null; }
  get canNext() { return this.index < this.stops.length - 1; }
  get canPrev() { return this.index > 0; }

  indexOf(id) { return this.stops.findIndex((s) => s.id === id); }

  /** Leaves the loader. With a target stop the camera jumps there, otherwise it flies to the first stop. */
  start(targetId) {
    if (this.started) return;
    this.started = true;
    this.emit('started', { deepLink: !!targetId });
    const i = targetId ? this.indexOf(targetId) : -1;
    if (i >= 0) this.goTo(i, { instant: true });
    else this.goTo(0);
  }

  next() { if (this.canNext) return this.goTo(this.index + 1); return false; }
  prev() { if (this.canPrev) return this.goTo(this.index - 1); return false; }

  /**
   * @param {number|string} target index or stop id
   * @param {{instant?: boolean, force?: boolean}} [opts]
   * @returns {boolean} whether a move started
   */
  goTo(target, opts = {}) {
    const i = typeof target === 'string' ? this.indexOf(target) : target;
    if (i < 0 || i >= this.stops.length) return false;
    if (this.busy && !opts.force) return false;
    if (i === this.index && !opts.force) return false;
    const from = this.index;
    this.index = i;
    this._setBusy(!opts.instant);
    this.emit('change', { index: i, from, stop: this.stops[i], instant: !!opts.instant });
    return true;
  }

  /** Called by the camera view when the move has finished. */
  arrive() { this._setBusy(false); }

  _setBusy(b) {
    if (this.busy === b) return;
    this.busy = b;
    this.emit('busy', b);
  }
}
