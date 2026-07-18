# VinPrint storefront design system

This file records the visual and interaction rules used by the current sales-first website. It is the review reference for future edits.

## Direction

- Style: editorial sticker lab — tactile, bold, trustworthy and product-led.
- Goal: move visitors from product need → material → reference price → public proof → Zalo order.
- Current scope: storefront only. No public AI studio and no website file-upload flow.
- Primary CTA: `Nhắn Zalo nhận giá`; supporting CTA: `Xem giá tham khảo`.

## Tokens

| Role | Token | Value |
|---|---|---|
| Primary text / dark surface | `--ink` | `#171310` |
| Secondary dark surface | `--ink-soft` | `#29231F` |
| Page background | `--paper` | `#F5F0E7` |
| Secondary background | `--paper-2` | `#EBE4D8` |
| Card surface | `--white` | `#FFFDF8` |
| Conversion accent | `--coral` | `#FF512F` |
| Proof / highlight accent | `--lime` | `#D5FF43` |
| Premium accent | `--violet` | `#6545ED` |
| Supporting text | `--muted` | `#756D65` |

- Display type: Be Vietnam Pro, weight 800–900, tight tracking.
- Body and controls: Inter, weight 500–800.
- Spacing follows a 4/8px rhythm; section gaps scale with `clamp()`.
- Desktop content width is controlled by one shared `--shell` token.

## Component rules

- Buttons and important links use pill geometry, a minimum 44×44px hit area, visible focus rings and 150–300ms feedback.
- Structural icons are inline SVG with a shared 1.8px rounded stroke; emojis are not used as interface icons.
- Product cards always pair a real product image with one benefit, one reference price and one clear detail action.
- Price cards state that final pricing is confirmed only after file, quantity, material and finishing are checked.
- Reviews preserve the customer quote, date, product, original screenshot and Shopee source link.
- Dark proof sections use lime for verified metrics and coral for the conversion action.
- Floating Zalo actions are supplementary; the same action remains available in normal document flow.

## Responsive behavior

- ≥1240px: full editorial split hero and four-column product/price grids.
- 721–1040px: stacked hero, two-column pricing and simplified navigation.
- ≤720px: one-column decisions/pricing, 16px+ readable body copy, 44px controls and a fixed two-action mobile bar.
- No horizontal overflow; fixed bottom actions reserve content space.
- Motion is removed under `prefers-reduced-motion: reduce`.

## Accessibility and quality gate

- One H1 per page and sequential H2/H3 hierarchy.
- Every meaningful image has descriptive `alt` text.
- Every icon-only action has an accessible label.
- Keyboard users receive a skip link and a visible 3px focus ring.
- External links opened in a new tab use `rel="noreferrer"`.
- No route may ship with a broken internal hash, blank image, missing source link or touch target under 44px.
