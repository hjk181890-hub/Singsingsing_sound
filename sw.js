// 씽씽씽 사운드 콘솔 — 오프라인용 서비스 워커 (v2)
// 페이지·목록만 저장해 두고(인터넷 되면 새로 받음), 음원은 건드리지 않는다.
// 음원은 콘솔이 브라우저 저장소에 따로 보관한다. (사파리는 서비스 워커를 거친 음원 재생에 문제가 있음)
const CACHE = 'ssscue-v2';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (/\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(new URL(req.url).pathname)) return;   // 음원은 통과
  e.respondWith(fetch(req).then(r => {
    if (r.ok){ const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return r;
  }).catch(() => caches.match(req).then(h => h || caches.match('./'))));
});
