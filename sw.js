const CACHE = 'ooh-v31';
const ASSETS = ['manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Intercept Share Target POST (PDF compartilhado)
  if (e.request.method === 'POST' && url.pathname === '/Ooh/') {
    e.respondWith((async () => {
      try {
        const data = await e.request.formData();
        const file = data.get('pdf');
        if (file && file.size > 0) {
          const buf = await file.arrayBuffer();
          const cache = await caches.open(CACHE);
          await cache.put('/Ooh/shared-pdf', new Response(buf, {
            headers: {
              'Content-Type': 'application/pdf',
              'X-Filename': file.name || 'documento.pdf'
            }
          }));
        }
      } catch(err) {}
      return Response.redirect('/Ooh/?pdf=1', 303);
    })());
    return;
  }

  // Navegação: sempre busca versão fresca do servidor (sem cache HTTP)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request, {cache: 'no-cache'})
        .catch(() => caches.match('index.html'))
    );
    return;
  }

  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
