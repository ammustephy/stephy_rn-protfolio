/*
 * Theme selection. A theme is the 3D world the tour walks through; the content,
 * viewmodels, input, camera rig, picking and the HTML overlay are shared.
 *
 *   phone (default)  "Inside a phone": a giant smartphone; the camera flies into its screen
 *                    and every section is an app that opens on a pedestal.
 *   room             the original developer room at dusk. Only reachable with ?theme=room.
 *
 * Every theme module exports `Theme` (a class) and `meta` (UI strings). A Theme instance has:
 *   camera, build(content, onProgress), modeForViewport(), setLayout(mode) → changed?,
 *   shotFor(stopId), introShot(), cameraBounds, clickables, setContactHover(id),
 *   resize(), update(time), render(), dispose(),
 *   and optionally pathControl(fromPos, toPos, fromId, toId) and attach({tour, rig}).
 */
export const THEMES = ['phone', 'room'];
export const DEFAULT_THEME = 'phone';

/** Reads ?theme=… from the URL; anything unknown falls back to the default. */
export function themeFromUrl(search = location.search) {
  const t = (new URLSearchParams(search).get('theme') || '').toLowerCase();
  return THEMES.includes(t) ? t : DEFAULT_THEME;
}

/** Loads a theme module on demand, so the room code is never downloaded for the phone theme and vice versa. */
export async function loadTheme(name) {
  if (name === 'room') return import('./room/index.js');
  return import('./phone/index.js');
}
