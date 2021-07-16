// self.importScripts('data/games.js');

// Files to cache
const cacheName = 'Boringly-v1';
const appShellFiles = [
  './Public/',
  './Public/index.html',
  './Public/styles/style.css',
  './Public/styles/addtohomescreen.css',
  './Public/scripts/addtohomescreen.js',
  './Public/scripts/draggable.js',
  './Public/scripts/p5.min.js',
  './Public/scripts/script.js',
  './Public/assets/icon.png',
  './Public/assets/splashscreens/ipad_splash.png',
  './Public/assets/splashscreens/ipadpro1_splash.png',
  './Public/assets/splashscreens/ipadpro2_splash.png',
  './Public/assets/splashscreens/ipadpro3_splash.png',
  './Public/assets/splashscreens/iphone5_splash.png',
  './Public/assets/splashscreens/iphone6_splash.png',
  './Public/assets/splashscreens/iphoneplus_splash.png',
  './Public/assets/splashscreens/iphonex_splash.png',
  './Public/assets/splashscreens/iphonexr_splash.png',
  './Public/assets/splashscreens/iphonexsmax_splash.png',
];
const gamesImages = [];
// for (let i = 0; i < games.length; i++) {
//   gamesImages.push(`data/img/${games[i].slug}.jpg`);
// }
const contentToCache = appShellFiles.concat(gamesImages);

// Installing Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});