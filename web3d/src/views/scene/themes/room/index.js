/*
 * "Developer room" theme: a thin adapter around the original room
 * (views/scene/sceneView.js and everything it builds). The room code itself is
 * unchanged; this file only adds the theme metadata and a dispose().
 */
import { SceneView } from '../../sceneView.js';

export const meta = {
  id: 'room',
  kicker: 'Developer room',
  loading: 'Loading the 3D room',
  viewLabel: '3D room',
  failNote: 'The 3D room could not load (no connection to the 3D library?), so here is the plain version.',
};

export class Theme extends SceneView {
  /** Frees GPU memory (geometries, materials, textures) and the WebGL context. */
  dispose() {
    if (this.boards) this.boards.dispose();
    const seen = new Set();
    this.scene.traverse((o) => {
      if (o.geometry && !seen.has(o.geometry)) { seen.add(o.geometry); o.geometry.dispose(); }
      const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of ms) {
        if (seen.has(m)) continue;
        seen.add(m);
        for (const v of Object.values(m)) if (v && v.isTexture && !seen.has(v)) { seen.add(v); v.dispose(); }
        m.dispose();
      }
    });
    if (this.scene.environment) this.scene.environment.dispose();
    this.rv.renderer.dispose();
  }
}
