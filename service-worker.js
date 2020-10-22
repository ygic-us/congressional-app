//importScripts('/cache-polyfill.js');


// // // example usage:
// self.addEventListener('install', function(event) {
//   console.log('Install:', event);
//     event.waitUntil(
//       caches.open('airhorner').then(function(cache) {
//         return cache.put('/', new Response("Loaded from cache"));  
        
//       })
//     );
//   });
  
//   self.addEventListener('fetch', function(event) {
//     console.log('Fetching:', event.request.url);
//     // event.respondWith(
//     //   caches.match(event.request).then(function(response) {
//     //     return response || new Response("Nothing in the cache for this request");
//     //   })
//     // );
//   });

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('ygicvoluteer').then(function(cache) {
     return cache.addAll([
       '/Component.js',
       '/Component-preload.js',
       '/i18n/i18n_en_US.properties',       
       'https://openui5.hana.ondemand.com/resources/sap-ui-core.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/core/library-preload.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/core/themes/sap_belize/library.css',
       '/manifest.webmanifest',
       '/manifest.json',
       '/images/favicon-32x32.png',
       '/images/ygiclogo.png',
       'https://openui5.hana.ondemand.com/resources/sap/ui/layout/messagebundle_en.properties',
       'https://openui5.hana.ondemand.com/resources/sap/m/messagebundle_en.properties',
       '/css/style.css',
       '/model/models.js',
       '/view/MainPage.view.xml',
       '/controller/MainPage.controller.js',
       '/util/Formatter.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/CalendarDateInterval.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/CalendarUtils.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/Calendar.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/DatesRow.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/MonthPicker.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/YearPicker.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/YearRangePicker.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/CalendarDate.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/library.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/CalendarDateIntervalRenderer.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/DateRange.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/DateTypeRange.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/Header.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/Month.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/CalendarRenderer.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/DatesRowRenderer.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/MonthPickerRenderer.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/YearPickerRenderer.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/YearRangePickerRenderer.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/ColorPickerDisplayMode.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/FileUploaderHttpRequestMethod.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/HeaderRenderer.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/calendar/MonthRenderer.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/CalendarLegend.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/CalendarLegendRenderer.js',              
       'https://openui5.hana.ondemand.com/resources/sap/ui/unified/CalendarLegendItem.js',
       'https://openui5.hana.ondemand.com/resources/sap/ui/core/themes/sap_belize/fonts/72-Regular.woff2'
     ]).catch(error => console.error('Oops! ' + error));;
   })
 );
});

self.addEventListener('fetch', function(event) {
    //console.log(event.request.url);
   
    event.respondWith(
      caches.match(event.request).then(function(response) {
        //console.log(response)
        return response || fetch(event.request);
      })
    );
   });


   self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });