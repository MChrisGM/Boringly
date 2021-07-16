// self.importScripts('data/games.js');

// Files to cache
const cacheName = 'Boringly-v1.3';
const appShellFiles = [
  './',
  './index.html',
  './styles/style.css',
  './styles/addtohomescreen.css',
  './scripts/addtohomescreen.js',
  './scripts/draggable.js',
  './scripts/p5.min.js',
  './scripts/script.js',
  './assets/icon.png',
  './assets/splashscreens/ipad_splash.png',
  './assets/splashscreens/ipadpro1_splash.png',
  './assets/splashscreens/ipadpro2_splash.png',
  './assets/splashscreens/ipadpro3_splash.png',
  './assets/splashscreens/iphone5_splash.png',
  './assets/splashscreens/iphone6_splash.png',
  './assets/splashscreens/iphoneplus_splash.png',
  './assets/splashscreens/iphonex_splash.png',
  './assets/splashscreens/iphonexr_splash.png',
  './assets/splashscreens/iphonexsmax_splash.png',
];

const contentToCache = appShellFiles;

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
    fetch(e.request).catch(async function () {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) return r;
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      caches.delete(key);
    }))
  })());
});