import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const THEME_COLOR = '#1c3056'

// https://vite.dev/config/
// Framework code changes rarely: keep it in its own files so browsers keep it cached across app updates
const vendorChunk = (id) => {
  if (!id.includes('node_modules')) return undefined
  if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react'
  if (/node_modules\/(react-router|react-router-dom)\//.test(id)) return 'router'
  if (/node_modules\/(@reduxjs|react-redux|redux|immer|reselect)\//.test(id)) return 'redux'
  return undefined
}

export default defineConfig({
  build: {
    target: 'es2020',
    rollupOptions: {
      output: { manualChunks: vendorChunk },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Ask the user before switching to a new version (see PwaPrompts.jsx)
      registerType: 'prompt',
      includeAssets: ['icons/icon.svg', 'icons/apple-touch-icon-180.png'],
      manifest: {
        id: '/',
        name: 'AwaitStore – Supplements & Nutrition',
        short_name: 'AwaitStore',
        description: 'Shop protein, vitamins and supplements. Works offline.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: THEME_COLOR,
        lang: 'en-IN',
        categories: ['shopping', 'health', 'lifestyle'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
        shortcuts: [
          { name: 'Search products', short_name: 'Search', url: '/search', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          { name: 'My orders', short_name: 'Orders', url: '/account/orders', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Checkout', short_name: 'Checkout', url: '/checkout', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        // Precache the whole app shell so every page opens offline
        globPatterns: ['**/*.{js,css,html,svg,png,webp,json,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Product images served from other hosts (real backend / CDN)
            urlPattern: ({ request, sameOrigin }) => request.destination === 'image' && !sameOrigin,
            handler: 'CacheFirst',
            options: {
              cacheName: 'awaitstore-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Real backend GET requests: fresh when online, cached copy when offline
            urlPattern: ({ url, request }) => request.method === 'GET' && url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'awaitstore-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 },
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
})
