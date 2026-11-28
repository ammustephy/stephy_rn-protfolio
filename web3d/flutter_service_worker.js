// Clean-up service worker.
//
// The old Flutter portfolio used to live at the site root and registered a
// service worker at this exact URL, which kept serving the old cached site to
// returning visitors. Browsers check this URL for updates, find this file,
// and install it. It then deletes the old caches, removes itself, and
// reloads open tabs so they load the new 3D developer room.
//
// The Flutter site now lives at /classic/ with its own service worker under
// that path, which this file does not touch.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: 'window' });
      for (const client of windows) {
        // Reload only pages this worker controlled (the old root site).
        if (!new URL(client.url).pathname.startsWith('/classic/')) {
          client.navigate(client.url);
        }
      }
    })()
  );
});
