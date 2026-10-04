/* ربحي v5.4.2 — ضع هذا الملف بجانب ملف التطبيق على استضافة https */
var CACHE = 'rabhi-5.4.2';
var APP = './app-rabhi-7k3q.html';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return Promise.all(['./', APP].map(function (u) { return c.add(u).catch(function () {}); })); }).catch(function () {}));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  /* الشبكة أولاً (لتصل التحديثات)، ثم النسخة المخزنة عند انقطاع الإنترنت */
  e.respondWith(fetch(r).then(function (res) {
    if (res && res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); }
    return res;
  }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match(APP) || caches.match('./'); }); }));
});
