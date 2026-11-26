# Stephy R N — 3D developer room

A portfolio you walk through as a guided tour of a developer's room at dusk in Kerala.
Plain browser ES modules + [three.js 0.160](https://threejs.org) from the jsDelivr CDN.
**No build step, no npm.**

## Run it locally

ES modules do not load from `file://`, so serve the folder over HTTP. Any static server works, for example:

```powershell
# Python
python -m http.server 8097 --directory D:\my_portfolio\web3d
# or VS Code "Live Server", or any other static file server
```

Then open <http://localhost:8097/>. An internet connection is needed for three.js and the Google Fonts.

Useful URLs while working:

| URL | What it does |
| --- | --- |
| `/#skills` | Deep link: skips the loader and jumps straight to a stop (`home`, `about`, `skills`, `experience`, `projects`, `education`, `contact`). The hash follows the tour. |
| `/#projects&open=wallflow` | Also opens a detail modal (project id or job id: `sigosoft`, `kefi`, `aptara`). Add `&img=0` to open the screenshot viewer. |
| `/?bloom=1` | Turns on the bloom post-process (off by default: on an Intel UHD laptop GPU it tripled the frame time). |

In the console, `window.__room` exposes `{tour, detail, scene}` for debugging.

## How the tour works

The page never scrolls. The visit is a sequence of **stops**; one wheel notch, one swipe, `↓ → PageDown Space Enter` or the
**Next** button moves to the next stop and the camera flies there (eased, 1.4–1.8 s). `↑ ← PageUp` / swipe down / **Back** go back,
`Home`/`End` jump to the ends, and the dots jump anywhere. Input during a move is ignored, and a wheel burst (trackpad inertia)
counts as one move. With `prefers-reduced-motion` the camera cuts instead of flying.

Each stop's camera framing comes from an **anchor** (centre, facing direction, size in metres) of the board it shows. The camera
distance is computed from the screen aspect and from the area the overlay leaves free, so the same stop fits 1920×1080, 1280×800 and a
375×812 phone. On portrait phones the boards are rebuilt in a **narrow layout** (taller boards, bigger text, cards stacked, the contact page
on the phone instead of the laptop).

## Structure (MVVM, like the Flutter app)

```
web3d/
  index.html              importmap, SEO/OG tags, JSON-LD, overlay HTML, static plain-text copy of all content
  styles/main.css         overlay UI, modal, loader, plain-text version, phone layout
  assets/                 project screenshots (+ thumbs/), resume PDF
  src/
    main.js               bootstrap only: models → viewmodels → views
    data/content.js       ALL text (single source): profile, skill groups, jobs, education, projects, stops
    models/               Project, Job, Education, Stop
    viewmodels/
      TourViewModel.js    current stop, next/prev/goTo, busy flag, events
      DetailViewModel.js  open/close project or job, gallery image index
    core/
      events.js           tiny emitter
      input.js            wheel / touch / keys → TourViewModel
      cameraRig.js        stop framing (anchor → camera) + eased tween along a curved path
      picking.js          raycast hover (pointer cursor + lift) and click (ignores drags)
    views/
      scene/
        sceneView.js      builds the room, per-layout boards, camera shots
        renderer.js       WebGLRenderer (sRGB, ACES Filmic, PCF soft shadows), PMREM RoomEnvironment, optional bloom
        lighting.js       hemisphere fill + cool dusk light through the window (shadows)
        room.js           floor, walls with a real window opening, ceiling, skirting, cornice
        layout.js         room size and every board position, for 'wide' and 'narrow'
        materials.js      shared PBR materials
        textures.js       procedural canvas textures (planks, walnut, oak, cork, rug, wall paint, fabric, glow, steam)
        canvasText.js     text-to-texture helpers (wrap, shrink-to-fit, chips)
        geometry.js       rounded boxes / planes (cached), seeded random
        props/            desk (monitor, keyboard, mouse, laptop, phone, headphones, arm lamp, mug + steam, chair),
                          window (dusk sky, palms, curtains), shelf (books), plants, decor (rug, beanbag, sideboard with
                          brass oil lamp, pendant, sconces, real-time clock, neon "</>", fairy lights)
        boards/           poster (Home), aboutBoard, skillsBoard, corkBoard (Experience, clickable cards),
                          projectsWall (framed apps + monitor), certificates (Education), screens (Contact page)
      ui/
        nav.js            Back/Next buttons, dots with labels, hint, live region, hash
        actions.js        per-stop DOM buttons (open jobs/projects, contact links) for keyboard and screen readers
        modal.js          project/job modal + screenshot gallery (lazy thumbnails, lightbox, focus trap, Esc)
        loader.js         progress + Enter button
        fulltext.js       plain HTML version of everything
```

Views listen to viewmodels; viewmodels never touch three.js or the DOM.

## Editing content

Change `src/data/content.js`; boards, modals and the plain-text version all follow.
`index.html` also holds a static copy of the plain-text version (between `FULLTEXT:START` and `FULLTEXT:END`) so search
engines and visitors without JavaScript see everything. It is replaced at runtime, but after content edits regenerate it:
open the site, run `copy(document.getElementById('fulltext').innerHTML)` in the console and paste it between the markers.

Screenshots: put images in `assets/projects/<project>/` (lowercase, hyphens) and a 240 px wide JPEG with the same name in `thumbs/`.
The 3D frames use `thumbs/cover.jpg`.

## Accessibility and fallbacks

- The canvas is decorative (`aria-hidden`); all content is in the DOM as the plain-text version (visually hidden, read by screen readers).
- **Text version** button in the top bar shows that plain page; without WebGL (or if three.js cannot load) it is shown automatically,
  and `<noscript>` shows it without JavaScript.
- Every 3D click has a DOM equivalent in the bar under the scene. Modals trap focus, close with `Esc`, and return focus.

## Performance notes

- DPR capped at 2 (1.5 on phones); 2 shadow-casting lights (arm lamp spot, window light); shadow maps are rendered once after
  building (nothing that casts a visible shadow moves).
- Geometries and materials are cached and shared; books, keycaps, leaves and fairy lights are instanced.
- Bloom is opt-in (`?bloom=1`) and never used on phones.
- Measured on an Intel UHD (i5 laptop) at 1280×800, DPR 1.25: about 9 ms per frame without bloom.
