'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "main.dart.js": "8feec0d906c132a912640ab0b60807c6",
"manifest.json": "f412a6837564d70138d1bcd904d723ad",
"index.html": "66a4e3560bde16944d1cf5422d5e5ae3",
"/": "66a4e3560bde16944d1cf5422d5e5ae3",
"version.json": "49e60ba61ddf1e421cbd688733230701",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/AssetManifest.json": "65767b2ee70ee8bf20cce2fd610e2f66",
"assets/NOTICES": "b5ba7aea4e4ef7b35e2ddae84c7c1e59",
"assets/packages/easy_localization/i18n/ar.json": "acc0a8eebb2fcee312764600f7cc41ec",
"assets/packages/easy_localization/i18n/en.json": "5f5fda8715e8bf5116f77f469c5cf493",
"assets/packages/easy_localization/i18n/en-US.json": "5f5fda8715e8bf5116f77f469c5cf493",
"assets/packages/easy_localization/i18n/ar-DZ.json": "acc0a8eebb2fcee312764600f7cc41ec",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "55e1b2080ad05895e3c48af25b1bd5bb",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/assets/l10n/ru.json": "2b34e1594ed490063fbe2a71278ba402",
"assets/assets/l10n/en-US.json": "8e44c673733265acf5cae2d64e951a02",
"assets/assets/svg/sort_icon.svg": "041d92f8256e18a6846d3b4f8ea10dd1",
"assets/assets/svg/currency_icon.svg": "38e7916307de5d5dd4d6d2ff69b22b62",
"assets/assets/svg/properties/property_people_icon.svg": "09db667195b02043ff1e5a9b459ce17b",
"assets/assets/svg/properties/property_weather_sunny_icon.svg": "09f873b6068b7f69a2f1469cf5c8e0d2",
"assets/assets/svg/properties/property_size_icon.svg": "88d30a3a1b8fc670b5e5c7e318f2e543",
"assets/assets/svg/properties/property_configuration_bbb_icon.svg": "e909007e0a53457322eeaad37523d84b",
"assets/assets/svg/properties/property_height_icon.svg": "8063996f7d69ef12f32545ed83a746ce",
"assets/assets/svg/properties/property_floor_icon.svg": "d6471277a984ce41b612fb18ff61559e",
"assets/assets/svg/properties/property_weather_coldly_icon.svg": "b0ecb6c162775d677dd570500d1aa849",
"assets/assets/svg/properties/property_configuration_b_icon.svg": "bdc6d30d720ca936b9595b72d3ff1fc6",
"assets/assets/svg/properties/property_configuration_bkb_icon.svg": "b6b64400bcae7056f393588bc6ea377d",
"assets/assets/svg/properties/property_configuration_bb_icon.svg": "f7880ef3f8c80f573960d329d82fb5fa",
"assets/assets/svg/search_icon.svg": "8b69195486b0e16ee91c13e58c437aec",
"assets/assets/svg/manager_icon.svg": "3d9efe5ec9da354f137fbc9355485f61",
"assets/assets/svg/add_icon.svg": "56279cca6b4f3d75205431ff25475354",
"assets/assets/svg/purpose_building_icon.svg": "10853991c2ee2428cad50b52c67f9c28",
"assets/assets/svg/arrow_down_icon.svg": "0982d0f4cf3c65dd7eeb13df9bd4bb8f",
"assets/assets/svg/close_icon.svg": "63b57868ee063cc372bba4eb281b729a",
"assets/assets/svg/calendar_icon.svg": "2dffeb28ae98f5ee5d5bcfd6ac951a8c",
"assets/assets/svg/building_icon.svg": "3b0f041eefaddc2ee444703df9ad12c9",
"assets/assets/svg/filter_icon.svg": "d421d3bf2bc6d7498671f6888f916dff",
"assets/assets/svg/app_icon.svg": "a6b25b5c00da8ba8be420117785a549b",
"assets/assets/svg/placeholder_icon.svg": "71775922f4e291c5397e417731369a46"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
