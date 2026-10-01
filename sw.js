// 씽씽씽 사운드 콘솔 — 오프라인용 서비스 워커
// 페이지·목록은 인터넷이 되면 새로 받고(안 되면 저장본), 음원은 저장본 우선.
const CACHE = 'ssscue-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const isAudio = /\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(new URL(req.url).pathname);
  if (isAudio){
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(req.url);
      if (hit) return hit;
      const r = await fetch(req.url);
      if (r.ok) c.put(req.url, r.clone());
      return r;
    }));
  } else {
    e.respondWith(fetch(req).then(r => {
      if (r.ok){ const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
      return r;
    }).catch(() => caches.match(req).then(h => h || caches.match('./'))));
  }
});
