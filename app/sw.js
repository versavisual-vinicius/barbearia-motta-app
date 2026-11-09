const CACHE_NAME = "motta-cache-v30";
const ASSETS = [
	"./",
	"./index.html",
	"./styles.css",
	"./styles.css?v=30",
	"./app.js",
	"./app.js?v=30",
	"./play-game.js",
	"./play-game.js?v=30",
	"./icon.svg",
	"./manifest.webmanifest",
	"./play/index.html",
	"./play/_next/static/css/a0deaa1ff7a9a58d.css",
	"./play/_next/static/chunks/webpack-a7230f1e20f2668d.js",
	"./play/_next/static/chunks/4bd1b696-c023c6e3521b1417.js",
	"./play/_next/static/chunks/255-1e7798b93640e410.js",
	"./play/_next/static/chunks/main-app-a65206d79a00ed48.js",
	"./play/_next/static/chunks/app/page-940a18aaa76400e0.js",
	"./assets/experiencia/atendimento.jpg",
	"./assets/experiencia/fundo-motta.svg",
	"./manifest.json",
	"./assets/logos/motta-symbol-green.png",
	"./assets/logos/motta-symbol-dark.png",
	"./assets/logos/motta-symbol-gold.png",
	"./assets/logos/club-motta-transparent.png",
	"./assets/logos/club-black-transparent.png",
	"./assets/barbeiros/Matheus%20Ferreira.png",
	"./assets/barbeiros/Maycon%20Angelo-1.png",
	"./assets/barbeiros/Maycon%20Angelo.png",
	"./assets/barbeiros/Michel%20Nogueira-1.png",
	"./assets/barbeiros/Michel%20Nogueira-2.png",
	"./assets/barbeiros/Michel%20Nogueira-3.png",
	"./assets/barbeiros/Michel%20Nogueira-4.png",
	"./assets/barbeiros/Michel%20Nogueira-5.png",
	"./assets/barbeiros/Michel%20Nogueira.png",
	"./assets/barbeiros/Orlando%20Junior.png",
	"./assets/barbeiros/Wanderson%20Mota.png",
];

self.addEventListener("install", (e) => {
	e.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) =>
				cache.addAll(
					ASSETS.map((url) => new Request(url, { cache: "reload" })),
				),
			)
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener("activate", (e) => {
	e.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)),
				),
			)
			.then(() => self.clients.claim()),
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
			.catch(() =>
				caches
					.match(e.request)
					.then((res) => {
						if (res) return res;
						if (e.request.mode === "navigate") {
							return caches.match("./index.html");
						}
						return new Response("", { status: 503, statusText: "Offline" });
					}),
			),
	);
});
