const CACHE_NAME = "motta-cache-v13";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./assets/logos/motta-symbol-green.png",
  "./assets/logos/motta-symbol-dark.png",
  "./assets/logos/motta-symbol-gold.png",
  "./assets/logos/club-motta-transparent.png",
  "./assets/logos/club-black-transparent.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: "reload" })))).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Apenas métodos GET e esquemas http/https
  if (e.request.method !== "GET" || !e.request.url.startsWith("http")) return;
  // Network-First: busca o arquivo novo na rede; fallback para cache se estiver offline
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((res) => res || caches.match("./index.html")))
  );
});
