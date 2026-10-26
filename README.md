# AwaitStore

Supplement e-commerce storefront (React + Vite + Redux Toolkit + Tailwind/Flowbite), based on NutrifyStore.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Installable app (PWA)

AwaitStore is a Progressive Web App: it can be installed to the home screen, opens full-screen,
and works fully offline (pages, cart, login and ordering all run on the built-in dummy backend).

The service worker only runs in a production build, so to try the app features locally:

```bash
npm run build
npm run preview      # http://localhost:4173
```

- **Install:** Chrome/Edge/Android show an "Install AwaitStore" card (or use the install icon in
  the address bar). On iPhone/iPad, open in Safari → Share → *Add to Home Screen*.
- **Offline:** after the first visit, turn off the network and reload. Everything keeps working.
- **Updates:** when a new version is deployed, the app shows "A new version is available → Update".
- **Phone access:** `npm run preview -- --host` and open the Network URL. Installing needs HTTPS
  (or localhost), so use a deployed URL such as Vercel to install on a phone.

PWA settings (name, colours, icons, shortcuts, caching) live in `vite.config.js`; icons are in
`public/icons/`.

## Design

Colours, font and spacing are defined once as design tokens in `src/index.css`
(`brand-*` navy built around the logo, `accent-*` orange for offers). Use classes like
`bg-brand-700`, `text-accent-700` and the `page` utility (centred page width + gutters).

## Performance

- The HTML contains a small app shell, so the page paints before any JavaScript runs.
- Each page is its own file; product, category and search pages are prefetched when the
  browser is idle, and the service worker caches everything for instant repeat visits.
- React, React Router and Redux are split into separate long-cached files.
- Images reserve their space and placeholders match real content, so nothing jumps while loading.

## Dummy backend

By default the app needs no server: every API call is answered in the browser by
`src/app/api/mockBaseQuery.js` using the sample catalogue in `src/app/api/mockData.js`.
Login accepts any mobile number and any OTP. Cart and addresses are saved in localStorage.

To use a real backend, edit `.env`:

```
VITE_USE_MOCK_API=false
VITE_DATABASE_API_URL=https://your-backend.example.com
```
