# AwaitStore

Supplement e-commerce storefront (React + Vite + Redux Toolkit + Tailwind/Flowbite), based on NutrifyStore.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Dummy backend

By default the app needs no server: every API call is answered in the browser by
`src/app/api/mockBaseQuery.js` using the sample catalogue in `src/app/api/mockData.js`.
Login accepts any mobile number and any OTP. Cart and addresses are saved in localStorage.

To use a real backend, edit `.env`:

```
VITE_USE_MOCK_API=false
VITE_DATABASE_API_URL=https://your-backend.example.com
```
