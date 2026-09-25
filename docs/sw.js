/* Charge Utile — service worker : tout marche sans réseau une fois l'appli ouverte une fois. */
const VERSION = 'cu-521fb50f26';
const ASSETS = ["./", "index.html", "catalogue.html", "manifest.webmanifest", "css/app.css", "js/three.min.js", "js/body.js", "js/engine.js", "js/app.js", "data/exercises.json", "data/tests.json", "moves/core.js", "moves/legs.js", "moves/posterior.js", "moves/balance.js", "moves/trunk.js", "moves/upper.js", "moves/ankle.js", "moves/velomob.js", "moves/stretch.js", "moves/trailmob.js", "moves/shoulder.js", "moves/extra.js", "moves/tests.js", "fonts/barlow-condensed-latin-600-normal.woff2", "fonts/barlow-condensed-latin-700-normal.woff2", "fonts/barlow-latin-400-normal.woff2", "fonts/barlow-latin-500-normal.woff2", "fonts/barlow-latin-600-normal.woff2", "fonts/jetbrains-mono-latin-500-normal.woff2", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== 'cu-seances').map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if(e.request.method !== 'GET' || url.origin !== location.origin) return;
  // séances : réseau d'abord (pour avoir la dernière version de Nathan), cache si pas de réseau
  if(url.pathname.includes('/data/sessions/')){
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); if(r.ok) caches.open('cu-seances').then(c => c.put(url.pathname, copy)); return r; })
      .catch(() => caches.open('cu-seances').then(c => c.match(url.pathname)).then(r => r || new Response('null', {status:503}))));
    return;
  }
  // appli : cache d'abord, réseau sinon
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(r => r || fetch(e.request).then(resp => {
    if(resp.ok){ const copy = resp.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
    return resp;
  })));
});
