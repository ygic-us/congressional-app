importScripts('/cache-polyfill.js');


// example usage:
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('airhorner').then(function(cache) {
        return cache.put('/', new Response("From the cache!"));        
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || new Response("Nothing in the cache for this request");
      })
    );
  });

// self.addEventListener('install', function(e) {
//  e.waitUntil(
//    caches.open('airhorner').then(function(cache) {
//      return cache.addAll([
//        '/',
//        '/index.html',   
//        '/view/MainPage.view.xml',
//        '/util/Formatter.js',
//        '/css/style.js',
//        '/images/ipadpro1_splash.png',
//        '/images/ipadpro2_splash.png',
//        '/images/ipadpro3_splash.png',
//        '/images/iphone6_splash.png',
//        '/images/iphoneplus_splash.png',
//        '/images/iphonex_splash.png',
//        '/images/iphonexr_splash.png',
//        '/images/iphonexsmax_splash.png',
//        '/images/ygiclogo.png',
//      ]);
//    })
//  );
// });