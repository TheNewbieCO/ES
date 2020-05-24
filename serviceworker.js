
const STATIC_CACHE = 'static-v1-' + new Date().getTime();
const DYNAMIC_CACHE = 'dynamic-v1' + new Date().getTime();
const INMUTABLE_CACHE = 'inmutable-v1' + new Date().getTime();


const APP_SHELL = [

];


const APP_SHELL_INMUTABLE = [

];


// Guardar los dos arreglos de cache
self.addEventListener("install", event => {

  const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));



    event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});

//  Verificar si hay diferencias entre el cache guardado y el que está en la funete
self.addEventListener('activate', event => {
    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }

            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }

        });

    });

    event.waitUntil(respuesta);



});


// Guardar y actualizar en el cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {


    if (res.ok) {

        return caches.open(dynamicCache).then(cache => {

            cache.put(req, res.clone());

            return res.clone();

        });

    } else {
        return res;
    }



}


self.addEventListener('fetch', e => {


    const respuesta = caches.match(e.request).then(res => {

        if (res) {
            return res;
        } else {

            return fetch(e.request).then(newRes => {

                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

            });

        }

    });

    e.respondWith( respuesta );
});