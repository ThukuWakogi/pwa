const staticCacheName = 'site-static-v0.2'
const dynamicCacheName = 'site-dynamic-v0.1'
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  '/pages/fallback.html',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
]

const limitCacheSize = (name, size) => {
  caches
    .open(name)
    .then(cache => {
      cache
      .keys()
      .then(keys => {
        console.log(keys)
        if (keys.length > size) 
          cache
            .delete(keys[0])
            .then(limitCacheSize(name, size))
      })
    })
}

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches
      .open(staticCacheName)
      .then(cache => {
        console.log('caching shell assets')
        cache.addAll(assets)
      })
  )
})

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches
      .keys()
      .then(keys => Promise
        .all(
          keys
            .filter(key => key !== staticCacheName && key !== dynamicCacheName)
            .map(key => caches.delete(key))
        )
      )
  )
})

self.addEventListener('fetch', evt => {
  // evt.respondWith(
  //   caches
  //     .match(evt.request)
  //     .then(cacheRes => {
        
  //       return cacheRes ||
  //         fetch(evt.request)
  //           .then(fetchRes => {

  //             return caches
  //               .open(dynamicCacheName)
  //               .then(cache => {
  //                 cache.put(evt.request.url, fetchRes.clone())
  //                 limitCacheSize(dynamicCacheName, 3)

  //                 return fetchRes
  //               })
  //           })
  //     })
  //     .catch(() => {
  //       if(evt.request.url.indexOf('.html') > -1)
  //         return caches.match('/pages/fallback.html')}
  //     )
  // )
})
