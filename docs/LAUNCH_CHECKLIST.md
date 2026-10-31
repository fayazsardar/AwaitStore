# AwaitStore launch checklist

What has to be done before AwaitStore takes real orders and payments.
Based on a review of this repo (frontend) and [`fyzsrd/Nutrify-Backend`](https://github.com/fyzsrd/Nutrify-Backend) (Express + MongoDB) on 30 Oct 2026.

**Status:** not ready to publish. The storefront works end to end on the built-in dummy backend.
The real backend has login, catalogue, cart and addresses, but cannot create orders or take payments yet,
and has security issues that must be fixed first.

Priorities: **P0** = blocks launch, **P1** = needed in the first weeks, **P2** = later.

---

## 1. Backend security (P0)

- [ ] Remove or protect `POST /api/admin/auth/signup`: today anyone can create an admin account.
- [ ] Stop logging login codes: `src/services/user/auth.service.js` prints every OTP to the server log.
- [ ] Use 6-digit OTPs, allow at most 5 wrong attempts per code, and rate-limit `POST /api/user/auth` per number and per IP (`express-rate-limit`).
- [ ] Check `expiresAt` in `verifyOtp` (today a code works until MongoDB's TTL cleanup removes it).
- [ ] Restrict CORS to the store's domains: `src/app.js` uses `cors({ origin: true, credentials: true })`.
- [ ] Return 401 (not 500) for expired or invalid tokens in `src/middlewares/userAuth.middleware.js`.
- [ ] Add `helmet`, request body size limits and input validation on every write route.
- [ ] Fix the start script: `package.json` runs `node server.js` but the file is `Server.js` (fails on Linux hosts).
- [ ] Change the OTP SMS text from "Nutraline" to "AwaitStore".
- [ ] Keep all secrets (JWT, Twilio, Cloudinary, Razorpay, MongoDB) in the host's environment settings, never in the repo.

## 2. Backend features the store already calls (P0)

| Feature | Backend today | To build |
|---|---|---|
| Place order | `GET /order/initiate` only | `POST /api/user/order` (creates order + order items, reserves stock) |
| Order history | none | `GET /order`, `GET /order/:id` |
| Cancel order | none | `PATCH /order/:id/cancel` (+ refund for paid orders) |
| Stock | checked in initiate only | Decrease stock atomically when an order is paid/confirmed; restore on cancel |
| Cart quantity | none | `PATCH /cart/:variantId` |
| Address update | `PUT /address/:id` | Accept `PATCH` (store sends PATCH) and add `PATCH /address/:id/default` |
| Profile | `POST /profile` only | `GET` and `PATCH /profile`, `GET`/`PATCH /preferences`, `DELETE /account` |
| Search | none | `GET /api/nutrify/search?q=&category=&sort=&page=` (store currently searches only the 10 home products) |
| Pagination | none | `page`/`limit` on category and search lists |

- [ ] Make `GET /order/initiate` read-only: it currently deletes out-of-stock items from the cart.
- [ ] Send order confirmation (SMS now via Twilio; email later).

## 3. Payments: Razorpay (P0)

Flow:

1. `POST /order` saves the order as `pending` and, for online payment, creates a Razorpay order (amount in paise, `receipt` = our order ID). Returns `razorpayOrderId` and the public key.
2. The store opens Razorpay Checkout (UPI, cards, netbanking, wallets).
3. On success the store calls `POST /order/:id/verify` with `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`. The backend verifies the HMAC-SHA256 signature with the key secret, then marks the order paid, reduces stock and clears the cart.
4. Webhook `POST /webhooks/razorpay` (signature-verified, idempotent) handles `payment.captured`, `payment.failed`, `refund.processed`, so closed tabs and retries still end in the right state.
5. Cancelling a paid order calls Razorpay's refund API; order shows "Refund initiated" → "Refunded".

- [ ] Add a `Payment` model (order, gateway IDs, amount, status, raw webhook events). The `Order` model already has `paymentStatus` and `paymentMethod: razorpay`.
- [ ] Unpaid online orders expire after ~30 min and release reserved stock.
- [ ] Cash on delivery rules: order value limit, optional COD fee, phone must be verified.
- [ ] Test end to end in Razorpay **test mode**, including failure, retry, closed tab and refund.
- [ ] Razorpay account activation (business owner): business PAN, bank account, GST number, and a live site with Terms, Privacy, Refund, Shipping and Contact pages showing a real business address.

## 4. Storefront (this repo)

P0
- [ ] Connect to the real API: set `VITE_USE_MOCK_API=false` and `VITE_DATABASE_API_URL`, then fix data differences:
  - home products send `defaultThumbnail` as an array (store expects one URL),
  - list items lack `category`, `defaultVariant`, `rating`, `reviews`, `tag` (quick-add, category filters and ratings depend on them; map `isBestSeller` to the "Bestseller" tag),
  - product detail has `category`, store reads `categoryId` (breadcrumb, related products).
- [ ] Razorpay Checkout on the checkout page and the payment-verify call.
- [ ] Log the user out on any 401 response and show the login sheet again.
- [ ] Exclude `/api/user/*` from the service worker's API cache (`vite.config.js`) so a customer's cart, orders and addresses never stay cached on a shared device.
- [ ] Remove or substantiate every marketing claim: "Rated 4.6 by 20,000+ customers" (hero), "Lab-tested", "100% authentic", "Ships in 24 hours", "7-day returns", "Free delivery on every order", "Up to 25% off" and "Creatine from ₹799" banners. Ratings must come from real reviews.
- [ ] Hide ratings until a reviews system exists.
- [ ] Replace Nutraline's email and address on Contact Us; rewrite Terms, Refund and Shipping pages with the real policies.
- [ ] Add a Privacy Policy page and a Grievance Officer (name, contact) as required for e-commerce in India.

P1
- [ ] Show FSSAI licence number (backend `Product.fssaiNumber`) and country of origin on every product page.
- [ ] Real coupons (model + apply/validate API) or remove the coupon box.
- [ ] Store the login token in the httpOnly `userToken` cookie the backend already sets, instead of `localStorage`.
- [ ] Sitemap and per-product page titles/descriptions; consider prerendering product pages for search engines (P2).

## 5. Admin and operations (P1)

- [ ] Admin order management: list and filter orders, update status, add courier + tracking ID (fields exist on `Order`), process refunds and cancellations. No admin order APIs or admin panel exist yet.
- [ ] Shipping partner (Shiprocket or Delhivery): PIN-code serviceability at checkout, labels, tracking updates.
- [ ] GST-compliant invoices (PDF) per order.
- [ ] Notifications: order placed, shipped, out for delivery, delivered, refund.
- [ ] Reviews and ratings (only verified buyers).

## 6. Hosting, quality and monitoring (P0 unless marked)

- [ ] Backend hosting (Render, Railway or a VPS) with HTTPS; MongoDB Atlas with daily backups.
- [ ] Storefront on Vercel (already configured) with the real domain.
- [ ] Separate staging and production environments, each with its own database and Razorpay keys.
- [ ] Error monitoring (Sentry) on frontend and backend; uptime check on the API.
- [ ] Automated tests for login, place order, payment verification, webhook and refunds; CI on every pull request (neither repo has tests yet).
- [ ] Analytics (GA4) with a cookie/consent notice (P1).

## 7. Launch steps

1. Backend security fixes and order APIs (sections 1–2).
2. Razorpay in test mode, webhooks and refunds (section 3).
3. Storefront connected to staging API; content and legal pages updated (section 4).
4. Full staging run: browse → cart → login → address → pay (success, failure, refund) → cancel → admin updates status.
5. Switch Razorpay to live keys, point the domain, launch.

## Needed from the business owner

- Push access to the backend repo (or a fork under the AwaitStore account).
- Razorpay account (test keys now, live keys after KYC).
- Legal business name, registered address, GSTIN, FSSAI licence number, support email and phone, grievance officer.
- Real delivery charges and times, return/refund policy, COD rules.
