# VinPrint storefront

Conversion-first website for VinPrint's custom sticker and label products in TP.HCM.

## Current scope

- Editorial product-led homepage with real product imagery.
- Material chooser for paper, waterproof plastic, metallic/hologram and UV DTF.
- Reference pricing with a clear final-price disclaimer.
- Shopee public metrics, source links and six original review screenshots.
- Four-step order flow that hands the customer to Zalo `0844998499`.
- Ten indexable product detail routes under `/san-pham/:slug`.
- LocalBusiness, Product, ItemList and Breadcrumb structured data.
- Responsive navigation, keyboard skip link, visible focus states and reduced-motion support.

The current release intentionally has no public AI design studio and no website file-upload route. Customers send the file, quantity and selected material directly through Zalo.

## Business information

- Address: 254/5/40 Lê Văn Thọ, Phường Thông Tây Hội, TP.HCM
- Working hours: 09:00–17:30, Monday–Saturday; closed Sunday and public holidays
- Canonical domain: `https://vinprint.vn`

## Run locally

Requirements: Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

## Quality checks

```bash
npm test
npm run lint
```

`npm test` builds the Vinext application, validates the deployable artifact and renders the homepage plus all ten public product pages.

## Production build

```bash
npm ci
npm run build
npm run start
```

The application uses Next.js-compatible App Router code through Vinext and produces a Cloudflare Worker-compatible artifact in `dist/`. The hosting provider should preserve the canonical domain, HTTPS and public anonymous access.

## Main files

- `app/page.tsx` — storefront content and interactions
- `app/sales.css` — conversion storefront styling
- `app/globals.css` — shared tokens, product pages and responsive rules
- `app/lib/products.ts` — product catalog and source URLs
- `app/san-pham/[slug]/page.tsx` — product detail template
- `public/images/reviews/` — customer-provided Shopee review screenshots in WebP
- `design-system/vinprint-storefront/MASTER.md` — visual and accessibility rules

## Conversion analytics

The storefront sends the allow-listed conversion events to `POST /api/analytics`. The Worker writes structured, privacy-minimized event records to Cloudflare Worker logs and also forwards them to `window.dataLayer` when a tag manager is present. No contact details or uploaded artwork are included.

Tracked events include Zalo clicks, phone clicks, pricing views, map actions and mockup-interest handoffs. A mockup is not recorded as completed until a real upload/generation flow exists.

## AI crawler policy

Search and user-requested AI agents may index and cite public pages. Model-training crawlers are blocked in `robots.txt`; `llms.txt` publishes the preferred public URLs and the same no-training policy. Cloudflare's managed crawler controls should use the same setting so they do not override the application policy.
