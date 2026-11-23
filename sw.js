/* Офлайн-кэш: после первой загрузки игра работает без сети.
   Версию бампать при изменении файлов, иначе телефон отдаст старую копию. */
const CACHE = "fruitjug-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./img/cherry.png",
  "./img/strawberry.png",
  "./img/lime.png",
  "./img/orange.png",
  "./img/dragon.png",
  "./img/pineapple.png",
  "./img/watermelon.png",
  "./scene/background.jpg",
  "./scene/jug-back.png",
  "./scene/jug-front.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
