# VinPrint.vn — Tổng hợp đánh giá & việc cần làm
*Cập nhật: 22/07/2026 · Website đã online tại https://vinprint.vn*

═══════════════════════════════════════════
## PHẦN 1 — GỬI SẾP (tóm tắt điều hành)
═══════════════════════════════════════════

**Tình trạng:** Website đã chạy chính thức trên tên miền vinprint.vn (hạ tầng Cloudflare, tốc độ tốt, có HTTPS).

**Điểm chất lượng tổng thể: 7.5 → 8.1 / 10** (sau đợt sửa lỗi lần 1). Dự kiến đạt **~8.9/10** khi hoàn tất 3 việc còn lại.

**Điểm mạnh:** Nền tảng SEO tốt (dễ lên Google), tốc độ nhanh, cấu trúc ổn định, có đầy đủ nút liên hệ Zalo/gọi điện.

**Đã khắc phục trong đợt này (3 việc):**
1. Sửa lỗi link trong trang sản phẩm bấm bị "rơi" sai chỗ → nay bấm là tới đúng bảng giá/danh mục (giữ được khách, tăng khả năng chốt đơn).
2. Đồng bộ menu và chân trang trên toàn website (trước đây trang sản phẩm khác kiểu) → nhận diện thương hiệu chuyên nghiệp, nhất quán.
3. Dọn thẻ kỹ thuật thừa để lộ chữ "development" trên bản chạy thật.

**Còn lại 3 việc (cần quyết định/tài nguyên nội bộ):**
| Việc | Lợi ích | Cần từ nội bộ |
|---|---|---|
| Thống nhất bảng giá | Khách không bối rối, tăng tin tưởng | Chốt giá 2 loại tem |
| Gắn công cụ đo lường (GA4) | Biết bao nhiêu khách bấm Zalo, từ nguồn nào → tối ưu quảng cáo | 5 phút tạo tài khoản (miễn phí) |
| Thay ảnh sản phẩm | Tránh vỡ ảnh, chuyên nghiệp hơn | Ảnh thật của sản phẩm |

**Khuyến nghị:** Ưu tiên gắn công cụ đo lường (GA4) — đây là nền tảng để biết hiệu quả và tối ưu chi phí marketing về sau.

═══════════════════════════════════════════
## PHẦN 2 — GỬI DEV (checklist kỹ thuật)
═══════════════════════════════════════════

Repo: github.com/cdrvietnam-tech/vinprint · Stack: Next.js (vinext) + Cloudflare Workers + Tailwind v4.
Kiểm tra: `tsc --noEmit` sạch (exit 0), Cloudflare build OK.

### A. ĐÃ SỬA — đang ở working tree, cần review + commit + push

**1. `app/san-pham/[slug]/page.tsx`**
- Sửa 5 link neo hỏng: `/#products` → `/#cac-loai-tem`, `/#pricing` → `/#bang-gia`
  (ở: breadcrumb JSON-LD, nav header cũ, link breadcrumb, nút "Xem giá tham khảo").
  *Lý do:* trang chủ dùng id `cac-loai-tem` / `bang-gia`, không có `products` / `pricing`.
- Bỏ `<header class="product-page__header">` + `<footer class="product-page__footer">` riêng,
  thay bằng `<Header/>` + `<Footer/>` dùng chung từ `components/home/`, bọc nội dung trong
  `<main class="product-page pt-20">`.

**2. `app/layout.tsx`**
- Xóa dòng `"codex-preview": "development"` trong `metadata.other`.

⚠️ **Lưu ý khi commit:**
- Nhiều file khác đang hiện "modified" do **line-ending CRLF vs LF** (không phải thay đổi thật).
  → CHỈ stage đúng 2 file trên, KHÔNG `git add .`.
- Có file khóa kẹt: xóa `\.git\index.lock` trước.
```
Remove-Item D:\vinprint\.git\index.lock -Force
git add "app/layout.tsx" "app/san-pham/[slug]/page.tsx"
git commit -m "fix: sua link neo + gop header/footer + xoa meta dev"
git push
```
- Nên chuẩn hoá line-ending về LF cho repo (thêm `.gitattributes`: `* text=auto eol=lf`) để hết nhiễu CRLF về sau.

### B. CẦN LÀM — P0 (đúng dữ liệu)

**3. Thống nhất giá — chuẩn theo tờ/A4/A5** *(P0)*
- Hiện lệch đơn vị: trang chủ `Pricing.tsx` ghi "đ/tem" (150–450đ); trang sản phẩm + JSON-LD `products.ts` ghi "đ/A4/A5" (10.000–25.000đ).
- Giá hard-code ở **2 nơi** → gộp về 1 nguồn (`app/lib/products.ts` hoặc tạo `app/lib/pricing.ts`), `Pricing.tsx` import từ đó.
- Cần chốt giá theo tờ cho `tem-nhua-trong` và `tem-bac`/`tem-vang` (hiện đang "Gửi file").
- Đảm bảo `offers.price` trong JSON-LD (Product schema) khớp giá hiển thị.

### C. CẦN LÀM — P1 (ổn định & đo lường)

**4. Gắn GA4 + GTM** *(P1 — ưu tiên cao nhất)*
- Hiện `app/lib/analytics.ts` + `app/api/analytics/route.ts` chỉ `console.log` + localStorage, có push `dataLayer` nhưng **chưa nạp script GTM/GA4** → không có dashboard.
- Việc: thêm GTM container (hoặc GA4 gtag) vào `app/layout.tsx`; map các event có sẵn (`click_zalo`, `click_phone`, `view_pricing`, `ai_design_click`) thành GA4 conversion.

**5. Self-host ảnh sản phẩm** *(P1)*
- 4 sản phẩm trong `app/lib/products.ts` hotlink ảnh từ `down-vn.img.susercontent.com` (Shopee CDN) → rủi ro vỡ ảnh + lọt vào Product schema.
- Tải về `public/images/products/`, trỏ nội bộ; sau đó bỏ `remotePatterns` Shopee trong `next.config.ts`.
- 1 ảnh placeholder đang dùng lại cho 3 sản phẩm (tem-nhua-chong-nuoc, tem-bao-hanh, sticker-trang-tri) → cần ảnh riêng.

### D. NÊN LÀM — P2 (tối ưu, chưa gấp)
- `framer-motion` (~108KB, 8 component) chủ yếu cho fade-in đơn giản → cân nhắc thay bằng CSS để giảm JS mobile.
- Rà soát số liệu marketing cho nhất quán (90.000+ khách / 32.000 đánh giá / 211.000+ mẫu / 100K+ đơn).
- Muốn có sao đánh giá trên Google: đẩy review thật về Google Business Profile (đừng thêm AggregateRating tự đăng — Google không cho).
- Bật security headers (HSTS, X-Content-Type-Options, CSP cơ bản) qua Cloudflare.

═══════════════════════════════════════════
### Bảng điểm chi tiết
═══════════════════════════════════════════

| Hạng mục | Trước | Sau đợt 1 | Khi xong hết |
|---|---|---|---|
| SEO & dữ liệu cấu trúc | 9.0 | 9.5 | 9.5 |
| Kiến trúc & bảo trì | 8.0 | 8.5 | 9.0 |
| UX & Chuyển đổi | 7.0 | 8.0 | 8.5 |
| Hiệu năng | 7.0 | 7.0 | 8.0 |
| Độ ổn định | 7.0 | 7.0 | 8.5 |
| Nội dung & Tin cậy | 7.0 | 7.0 | 8.5 |
| Đo lường / Analytics | 4.0 | 4.0 | 8.0 |
| **TỔNG** | **7.5** | **8.1** | **~8.9** |
