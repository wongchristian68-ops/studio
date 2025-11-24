/// <reference lib="webworker" />
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

// Cache Google Fonts
registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

registerRoute(
  ({url}) => url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-webfonts',
    cacheableResponse: {
      statuses: [0, 200],
    },
  })
);

// Cache Unsplash Images
registerRoute(
    ({url}) => url.origin === 'https://images.unsplash.com',
    new StaleWhileRevalidate({
        cacheName: 'unsplash-images',
        cacheableResponse: {
            statuses: [0, 200]
        }
    })
)

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
