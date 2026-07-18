# VinPrint V3 — Hướng dẫn nâng cấp & chạy thử

Bản này **giữ nguyên** codebase đang chạy (Vinext + Cloudflare, SEO, sản phẩm, đánh giá, AI design lab)
và **thêm** các tính năng/animation V3 theo dạng module tách biệt.

> ⚠️ Mình viết code trong môi trường không cài được thư viện mới (proxy chặn), nên **chưa chạy được `npm run build`**.
> Anh chạy các lệnh bên dưới trên máy Windows để cài thư viện và build kiểm tra. Nếu có lỗi, gửi log mình sửa.

---

## 1. Những gì đã thêm

| Tính năng | File mới | Ghi chú |
|---|---|---|
| Smooth scroll (Lenis) | `app/components/smooth-scroll.tsx` | Gắn ở `app/layout.tsx`, tự tắt khi user bật giảm chuyển động |
| Reveal khi cuộn (Framer Motion) | `app/components/reveal.tsx` | Bọc quanh nội dung để hiện dần lên |
| Đếm số động | `app/components/counter.tsx` | Dùng ở dải "Shopee public proof" |
| Before/After slider | `app/components/before-after.tsx` | `react-compare-slider`, kéo chuột/chạm |
| Máy tính giá | `app/components/price-calculator.tsx` | `react-hook-form` + `zod`, ra Zalo kèm nội dung |
| Gallery lọc ngành + load more | `app/components/gallery.tsx` | Masonry, lazy-load ảnh |
| CSS cho các module trên | `app/enhancements.css` | Tách riêng, không đụng `globals.css`/`sales.css` |

Các file đã sửa: `app/layout.tsx`, `app/page.tsx`, `package.json`.

Thư viện mới trong `package.json`: `framer-motion`, `lenis`, `react-compare-slider`,
`react-hook-form`, `zod`, `@hookform/resolvers`.

---

## 2. Cài đặt & chạy (Windows)

Mở PowerShell trong thư mục dự án:

```powershell
# 1. Cài toàn bộ thư viện (gồm 6 thư viện mới)
npm install

# 2. Chạy thử ở chế độ dev
npm run dev
```

Mở trình duyệt vào địa chỉ mà lệnh `dev` in ra (thường `http://localhost:5173`).
Kéo thử: menu "Tính giá", section "So sánh Trước/Sau", "Thành phẩm thực tế".

---

## 3. Build kiểm tra (bắt buộc trước khi deploy)

```powershell
npm run build      # build + kiểm tra artifact
npm run lint       # kiểm tra ESLint
```

Nếu `npm run build` báo lỗi TypeScript/thiếu type, thường chỉ cần:

```powershell
npm install
```

lại cho chắc, rồi build lại. Có lỗi lạ thì copy nguyên đoạn log gửi mình.

---

## 4. Việc anh cần chỉnh cho đúng dữ liệu thật

1. **Giá trong máy tính giá** — mở `app/components/price-calculator.tsx`, sửa mảng `MATERIALS`
   (giá `base` cho 1 tem khổ trung bình) cho khớp giá thật của xưởng. Số hiện tại chỉ là ví dụ.

2. **Ảnh Before/After** — mở `app/components/before-after.tsx`, thay `before`/`after`
   bằng **ảnh thật của cùng một sản phẩm** (ảnh chưa dán tem và ảnh đã dán tem) để hiệu ứng thuyết phục.

3. **Ảnh Gallery** — mở `app/components/gallery.tsx`, thay mảng `ITEMS` bằng ảnh thành phẩm thật
   và đúng danh mục (Mỹ phẩm, Trà·Cafe, Đồ uống, Thực phẩm, Handmade, Pet...).

---

## 5. Về mục tiêu tốc độ (Lighthouse)

Anh đã chọn **ưu tiên trải nghiệm animation**. Lenis + Framer Motion làm mượt và sang hơn
nhưng thêm JS, nên điểm Performance có thể ~85–95 thay vì 98–100.
Mọi animation đều **tự tắt** khi thiết bị bật "giảm chuyển động", nên vẫn thân thiện và an toàn.
Nếu sau này muốn kéo điểm lên, mình có thể chuyển một phần reveal sang CSS thuần — nói mình biết.

---

## 6. Trạng thái kiểm thử

- ✅ Cân bằng thẻ JSX trong `page.tsx`, import hợp lệ, không trùng `id`.
- ✅ Code viết đúng API các thư viện.
- ⏳ **Chưa chạy `npm run build`** trong môi trường của trợ lý (không cài được thư viện mới).
  → Anh chạy mục 3 trên máy để xác nhận.
