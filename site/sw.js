/* Service worker netral (self-destruct).
   Menggantikan SW BentoPDF lama yang ber-scope root dan mencegat navigasi
   dengan app shell dari cache. Tidak ada handler fetch di sini,
   sehingga semua request langsung menuju jaringan (nginx). */

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    try {
      var keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    } catch (e) {}
    try {
      await self.registration.unregister();
    } catch (e) {}
    try {
      var list = await self.clients.matchAll({ type: 'window' });
      list.forEach(function (c) { c.navigate(c.url).catch(function () {}); });
    } catch (e) {}
  })());
});
