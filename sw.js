// imports
// importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    '/index.php',
    '/css/style.css',
    '/images/icono.ico',
    '/images/empresasolidaria.ico',
    '/images/apple-touch-icon.png',
    '/images/AdminLTELogo.png',
    '/images/icono.png',
    '/images/hero-img.png',
    '/images/more-services-1.jpg',
    '/images/solidaria.png',
    '/images/logo_v.png',
    '/js/app.js'
];

const APP_SHELL_INMUTABLE = [
    '/fonts/font-awesome/css/font-awesome.css'
    //    'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
    'js/jquery.js'
];


// Guardar los dos arreglos de cache
self.addEventListener('install', e => {


    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));



    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});

//  Verificar si hay diferencias entre el cache guardado y el que está en la funete

self.addEventListener('activate', e => {

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

    e.waitUntil(respuesta);

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



    e.respondWith(respuesta);

});