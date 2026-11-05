// Service worker e-tempah TRENDSS: rangkaian dahulu (sentiasa versi terkini), cache hanya sebagai sandaran.
const C = 'trendss-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'e-TempahIcon.png', 'logo-sekolah.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request;
  // Biarkan panggilan ke Apps Script (POST / domain lain) tidak disentuh
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('index.html')))
  );
});
