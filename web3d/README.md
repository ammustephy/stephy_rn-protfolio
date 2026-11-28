# Stephy R N — 3D portfolio

A portfolio you walk through as a guided tour. It has two 3D themes that share all content, navigation and UI:

- **Inside a phone** (default): a giant floating smartphone with her name on the home screen; the camera flies into the
  screen, into a pastel world of rounded app icons, and every section is an app that opens on a pedestal.
- **Developer room**: the original developer's room at dusk in Kerala. Not linked anywhere; open it with `?theme=room`.

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
| `/?theme=room` | The developer-room theme (hidden: not linked in the UI). Combine with deep links: `/?theme=room#skills`. |
| `/?theme=phone` | The "Inside a phone" theme explicitly (same as no parameter; unknown values also fall back to it). |
| `/?bloom=1` | Turns on the bloom post-process (off by default: on an Intel UHD laptop GPU it tripled the frame time). |

In the console, `window.__room` exposes `{tour, detail, scene, theme}` for debugging (the name is historical; it is there for both themes).

## How the tour works

The page never scrolls. The visit is a sequence of **stops**; one wheel notch, one swipe, `↓ → PageDown Space Enter` or the
**Next** button moves to the next stop and the camera flies there (eased, 1.4–1.8 s). `↑ ← PageUp` / swipe down / **Back** go back,
`Home`/`End` jump to the ends, and the dots jump anywhere. Input during a move is ignored, and a wheel burst (trackpad inertia)
counts as one move. With `prefers-reduced-motion` the camera cuts instead of flying.

Each stop's camera framing comes from an **anchor** (centre, facing direction, size in metres) of the board it shows. The camera
distance is computed from the screen aspect and from the area the overlay leaves free, so the same stop fits 1920×1080, 1280×800 and a
375×812 phone. On portrait phones the boards are rebuilt in a **narrow layout** (taller boards, bigger text, cards stacked, the contact page
on the phone instead of the laptop).

## Themes

`src/views/scene/themes/index.js` reads `?theme=` (`phone` by default, `room` only when asked for; anything else falls back to
`phone`) and loads just that theme's module, so a visitor never downloads the other one. Both themes implement the same small
interface that `main.js`, the camera rig and picking use: `build(content, onProgress)`, `shotFor(stopId)` (camera framing),
`introShot()`, `clickables` (jobs, projects, contact links), `setContactHover(id)`, `modeForViewport()` / `setLayout(mode)` (wide or
portrait-phone layout), `update(time)`, `render()`, `resize()` and `dispose()`. A theme may also bend the camera path
(`pathControl`) and listen to the tour (`attach`). Everything else (content, models, viewmodels, input, modal, nav, loader, plain-text
version) is shared.

**Room** (`themes/room/index.js`): a thin adapter over the original `sceneView.js` and the files it builds from; the room code is untouched.

**Inside a phone** (`themes/phone/`):

| Stop | What you see |
| --- | --- |
| Home | A large floating smartphone (aluminium frame, glass that reflects the environment, dynamic island, side buttons, camera bump) in a pastel sky, with floating app icons. Its home screen shows the name widget and the six apps. |
| → About | The camera flies through the screen (it passes the glass with a short fade) into the app world: a pastel grid floor and 190 rounded app icons (instanced) that bob gently. |
| About | Profile app: avatar, name, role, tagline and the full summary. |
| Skills | Skills app: all 35 skills as chips in their 7 groups. |
| Experience | Timeline app with the three jobs; each card opens the job modal. |
| Projects | Store-like app with the four projects and their cover screenshots; each card opens the project modal with the gallery. |
| Education | Wallet app with the degree and the course as two passes. |
| Contact | Mail app: email (mailto), mobile (tel), location, GitHub, LinkedIn and Download resume, all clickable with a hover highlight. |

Each later stop is a big app on a pedestal that opens into its window as the camera arrives (and closes when it leaves). The windows are
drawn on canvas (`apps.js`) at 120 texture pixels per unit, and redrawn in a portrait layout on phones (taller windows, stacked cards,
bigger text). Files: `index.js` (theme class, framing, camera path, opening), `device.js` (the phone), `world.js` (sky, floor, icon
field, pedestals), `apps.js` (app UIs and the home screen), `glyphs.js` (icon glyphs).

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
      cameraRig.js        stop framing (anchor → camera) + eased tween along a curved path (a theme can supply the path)
      picking.js          raycast hover (pointer cursor + lift) and click (ignores drags)
    views/
      scene/
        themes/
          index.js        theme selection (?theme=phone|room, default phone) and lazy loading
          room/index.js   adapter: the developer room (sceneView.js below) as a theme
          phone/          "Inside a phone": index.js, device.js, world.js, apps.js, glyphs.js
        sceneView.js      builds the room, per-layout boards, camera shots (room theme)
        renderer.js       WebGLRenderer (sRGB, ACES Filmic, PCF soft shadows), PMREM RoomEnvironment, optional bloom (both themes)
        lighting.js       hemisphere fill + cool dusk light through the window (shadows)
        room.js           floor, walls with a real window opening, ceiling, skirting, cornice
        layout.js         room size and every board position, for 'wide' and 'narrow'
        materials.js      shared PBR materials
        textures.js       procedural canvas textures (planks, walnut, oak, cork, rug, wall paint, fabric, glow, steam)
        canvasText.js     text-to-texture helpers (wrap, shrink-to-fit, chips) (both themes)
        geometry.js       rounded boxes / planes (cached), seeded random (both themes)
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
- Phone theme: same DPR caps; no shadow maps at all (contact shadows are soft textures); the 190 background icons are three
  instanced meshes (bodies, glyphs from one 4 × 4 texture atlas, shadows); only the open app window is clickable and visible. Not
  yet measured on the Intel UHD laptop.
- Each theme has a `dispose()` that frees its geometries, materials, textures and the WebGL context (called when the page is unloaded).
