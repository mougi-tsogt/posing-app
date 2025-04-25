self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('poses-app').then(function(cache) {
      return cache.addAll([
        '/poses-app/',
        '/poses-app/index.html',
        '/poses-app/css/style.css',
        '/poses-app/js/app.js',
        '/poses-app/poses.json'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});