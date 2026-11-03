// Tapback offline support: network-first for pages, cache-first for assets.
const CACHE = 'tapback-v5';
const CORE = ['./', 'index.html', 'app.html', 'demo.html', 'faq.html', '404.html', 'styles.css', 'site.js', 'favicon.ico', 'share.js', 'recap.js', 'onboard.js', 'manifest.webmanifest', 'assets/icon-192.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.headers.has('range') || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(r, c)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('404.html'))));
    return;
  }
  // stale-while-revalidate: serve cached copy instantly, refresh it in the background
  e.respondWith(caches.open(CACHE).then(k => k.match(r).then(m => {
    const net = fetch(r).then(res => { if (res.ok) k.put(r, res.clone()); return res; }).catch(() => m);
    return m || net;
  })));
});
