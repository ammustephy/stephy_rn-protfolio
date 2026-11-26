/*
 * Room dimensions and where every board sits, for the two layouts:
 *   'wide'   – landscape screens (laptops, desktops, tablets on their side)
 *   'narrow' – portrait phones: boards become taller and narrower with bigger text
 *
 * Units are metres. The room is open at the front (z = +ROOM.d/2) like a dollhouse.
 * Back wall inner face: z = -4.5. Left wall: x = -6. Right wall: x = +6.
 */
export const ROOM = { w: 12, d: 9, h: 3.2 };
export const BACK = -ROOM.d / 2;
export const LEFT = -ROOM.w / 2;
export const RIGHT = ROOM.w / 2;

export const DESK = { x: 0.9, w: 2.0, d: 0.8, h: 0.75 };
export const DESK_Z = BACK + DESK.d / 2 + 0.03;

export const WINDOW = { x: -4.5, y: 1.72, w: 1.5, h: 1.5 };

export function layoutFor(mode) {
  const n = mode === 'narrow';
  return {
    mode,
    poster: n ? { x: 3.9, y: 1.78, w: 1.5, h: 2.1 } : { x: 3.9, y: 1.8, w: 2.4, h: 1.4 },
    about: n ? { x: -2.15, y: 1.86, w: 1.25, h: 1.86 } : { x: -2.15, y: 1.74, w: 1.95, h: 1.32 },
    // project frames on the wall above the desk (the monitor shows the 4th project)
    frames: n
      ? [{ id: 'wallflow', x: 0.6, y: 1.72 }, { id: 'educk', x: 1.2, y: 1.72 }, { id: 'kdch', x: 0.9, y: 2.44 }]
      : [{ id: 'wallflow', x: 0.3, y: 1.8 }, { id: 'educk', x: 0.9, y: 1.8 }, { id: 'kdch', x: 1.5, y: 1.8 }],
    frameSize: { w: 0.5, h: 0.66 },
    skills: n ? { z: -1.4, y: 1.52, w: 1.6, h: 2.56 } : { z: -1.4, y: 1.66, w: 3.9, h: 2.1 },
    cork: n ? { z: -1.9, y: 1.62, w: 1.66, h: 2.62 } : { z: -1.9, y: 1.66, w: 3.4, h: 1.95 },
    certs: n
      ? [{ z: 1.6, y: 2.04 }, { z: 1.6, y: 1.16 }]
      : [{ z: 1.0, y: 1.6 }, { z: 2.22, y: 1.6 }],
    certSize: { w: 1.08, h: 0.78 },
    clock: n ? { z: 1.6, y: 2.78 } : { z: 1.61, y: 2.5 },
  };
}
