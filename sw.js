/* Service worker — generato da genera_pwa.py per la versione 3.2. NON modificare a mano. */
var VERSION = '3.2', CACHE = 'toliso-' + VERSION;
var FILES = ["./", "./index.html", "./Tolleranze_ISO_UTR_3.2.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));   /* niente skipWaiting: l'aggiornamento lo decide chi usa l'app */
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('message', function (e) { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  var nav = e.request.mode === 'navigate';
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
    if (hit) return hit;
    return fetch(e.request).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return res; }
      /* pagina di una versione vecchia (404) → si riparte dall'indice, che rimanda alla versione corrente */
      return nav ? caches.match('./index.html').then(function (ix) { return ix || res; }) : res;
    }).catch(function (err) { if (nav) return caches.match('./index.html'); throw err; });
  }));
});
