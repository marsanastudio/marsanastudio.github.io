// Lilly's Crayon Adventures — offline support. A new game build changes CACHE, so phones pick it up.
const CACHE = 'lilly-1.3.2-e5afe6c6';
const FILES = ["./", "index.html", "three.module.js", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "fonts/fredoka-latin-400-normal.woff2", "fonts/fredoka-latin-500-normal.woff2", "fonts/fredoka-latin-600-normal.woff2", "fonts/fredoka-latin-700-normal.woff2", "fonts/fredoka-latin-ext-400-normal.woff2", "fonts/fredoka-latin-ext-500-normal.woff2", "fonts/fredoka-latin-ext-600-normal.woff2", "fonts/fredoka-latin-ext-700-normal.woff2", "fonts/gaegu-latin-400-normal.woff2", "fonts/gaegu-latin-700-normal.woff2"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // the game page: try the network first so updates arrive, fall back to the saved copy offline
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('index.html', c)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    if (r.ok && new URL(e.request.url).origin === location.origin) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
    return r; })));
});
