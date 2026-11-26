import { Emitter } from '../core/events.js';

/**
 * What the detail modal shows: nothing, a project or a job, and which
 * screenshot (if any) is open large in the gallery.
 *
 * Event 'change' → {kind, item, imageIndex}
 */
export class DetailViewModel extends Emitter {
  /**
   * @param {import('../models/Project.js').Project[]} projects
   * @param {import('../models/Job.js').Job[]} jobs
   */
  constructor(projects, jobs) {
    super();
    this.projects = projects;
    this.jobs = jobs;
    /** @type {null|'project'|'job'} */
    this.kind = null;
    this.item = null;
    /** -1 = gallery closed */
    this.imageIndex = -1;
  }

  get isOpen() { return this.kind !== null; }
  get imageCount() { return this.kind === 'project' ? this.item.screenshots.length : 0; }

  openProject(id) {
    const p = this.projects.find((x) => x.id === id);
    if (!p) return false;
    this._set('project', p, -1);
    return true;
  }

  openJob(id) {
    const j = this.jobs.find((x) => x.id === id);
    if (!j) return false;
    this._set('job', j, -1);
    return true;
  }

  close() { if (this.isOpen) this._set(null, null, -1); }

  showImage(i) {
    if (this.kind !== 'project') return;
    const n = this.imageCount;
    this._set(this.kind, this.item, ((i % n) + n) % n);
  }

  closeImage() { if (this.imageIndex >= 0) this._set(this.kind, this.item, -1); }
  nextImage() { if (this.imageIndex >= 0) this.showImage(this.imageIndex + 1); }
  prevImage() { if (this.imageIndex >= 0) this.showImage(this.imageIndex - 1); }

  _set(kind, item, imageIndex) {
    this.kind = kind;
    this.item = item;
    this.imageIndex = imageIndex;
    this.emit('change', { kind, item, imageIndex });
  }
}
