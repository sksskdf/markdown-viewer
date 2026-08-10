/* MD Viewer — 오프라인 서비스워커 (stale-while-revalidate)
   캐시에서 즉시 응답하되 백그라운드로 새 버전을 받아 두므로,
   배포 후 앱을 다시 실행하면 설치본이 자동으로 최신이 된다. */
const CACHE = "mdviewer-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./favicon.ico",
  "./vendor/mermaid.min.js",   // 머메이드 다이어그램도 오프라인에서 렌더되도록 미리 캐시
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      // cache:"reload" → HTTP 캐시를 건너뛰고 서버에서 최신 자산을 받아 담음
      .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then(hit => {
      const refresh = fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      });
      if (hit) {
        e.waitUntil(refresh.catch(() => {}));       // 오프라인이면 조용히 무시
        return hit;
      }
      return refresh.catch(() => caches.match("./index.html"));   // 오프라인 폴백
    })
  );
});
