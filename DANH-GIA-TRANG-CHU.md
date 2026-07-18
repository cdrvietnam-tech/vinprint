# Đánh giá trang chủ VinPrint — 17.07.2026

Phương pháp: đọc toàn bộ source trong `D:\vinprint`, chạy site thật trên `localhost:5173`, cuộn kiểm tra từng section, đọc console, đối chiếu với mockup thiết kế.

## Bảng điểm

| Hạng mục | Điểm | Nhận xét ngắn |
|---|---|---|
| 1. Giao diện & khớp mockup | 9/10 | Layout bám mockup rất sát: header, hero, dark stats, AI section, carousel, bảng giá tím 5 cột, gallery+review 2 cột, FAQ+AI mockup+QR Zalo, CTA đỏ cuối trang |
| 2. Tính năng tương tác | 8.5/10 | Before/After, lọc gallery, tab review, FAQ accordion, counter, carousel — đủ và chạy |
| 3. Chất lượng code | 7.5/10 | Chia 14 component gọn, Tailwind 4 chuẩn. Trừ điểm: dead code (page.old.tsx + 9 component cũ), import `Stats` không dùng, 3 file CSS cũ vẫn load song song Tailwind (~115KB thừa) |
| 4. SEO | 6/10 | Metadata/OG/robots/sitemap giữ tốt. **Mất toàn bộ JSON-LD ở trang chủ** (LocalBusiness, ItemList, FAQ) — tụt hạng so với bản cũ |
| 5. Độ tin cậy nội dung | 5/10 | **Vấn đề nặng nhất** — xem mục A |
| 6. Hiệu năng | 7/10 | Console sạch, không hydration error. Trừ: hero-collage dùng .png (có sẵn .webp), 7 ảnh hotlink Unsplash, framer-motion trong 9 component |
| 7. Accessibility | 6.5/10 | 16/16 ảnh có alt (tốt). Thiếu: skip-link, aria-label (0 trong home components), chưa test bàn phím |
| **Tổng** | **7.1/10** | Nền tảng tốt, đẹp, chạy ổn — nhưng chưa nên lên production khi chưa xử lý P0 |

## A. Ba vấn đề P0 (bắt buộc sửa trước khi chạy thật)

### 1. Nội dung "tự chế" gây rủi ro pháp lý & niềm tin
- Review có tên người + avatar Unsplash ("Nguyễn Thị Hồng — Google Review"...) là **review dựng**, không có nguồn kiểm chứng. Bản cũ dùng screenshot Shopee thật + link nguồn — đó là tài sản quý, nên khôi phục.
- Số liệu mâu thuẫn và không kiểm chứng được: "90.000+ khách hàng", "100K+ đơn", "900+ đánh giá" (bản cũ: 900+ khách, 33.2K follower, 90K+ đã bán — số công khai từ Shopee).
- Cam kết "Sai hàng hoàn tiền 100%", "giao trong 2 giờ" — chỉ giữ nếu xưởng thật sự cam kết được (Luật Quảng cáo + Bảo vệ NTD).
- Việc cần làm: thống nhất một bộ số liệu thật; thay 3 review dựng bằng review Shopee thật (ảnh gốc trong `public/images/reviews/` vẫn còn đó).

### 2. Trang chủ mất JSON-LD
Schema LocalBusiness + ItemList + FAQ chỉ còn trong `page.old.tsx` (không được render). Google mất rich result + local SEO.
- Cách sửa nhanh: port 3 khối `<script type="application/ld+json">` từ `page.old.tsx` sang `page.tsx` (hoặc layout). FAQ schema phải khớp đúng câu hỏi đang hiển thị.

### 3. Ảnh sai / trống / phụ thuộc ngoài
- "Tem ép kim" đang hiện ảnh **hội trường ghế đỏ** (Unsplash sai chủ đề).
- Thumb "Tem hologram", "Tem 7 màu" trống (placeholder màu be).
- 7 ảnh hotlink Unsplash: chậm, có thể chết link, không phải sản phẩm thật → thay bằng ảnh thật của xưởng.
- `hero-collage.png` nặng — đổi sang `.webp` (file đã có sẵn cùng thư mục).

## B. Việc P1 (nên làm trong tuần)

4. Dọn dead code: xóa `app/page.old.tsx` và 9 component cũ không còn dùng (`before-after.tsx`, `gallery.tsx`, `price-bar.tsx`, `tem-types.tsx`, `ai-flow.tsx`, `price-calculator.tsx`, `counter.tsx`, `reveal.tsx`, `ai-design-lab.tsx` nếu không dùng) — hoặc chuyển vào thư mục `_backup/`. Bỏ import `Stats` thừa trong `page.tsx`.
5. Gỡ bớt CSS cũ: `sales.css` + phần lớn `enhancements.css` không còn được dùng bởi giao diện mới → giảm ~100KB CSS. Giữ lại `:root` tokens trong `globals.css`.
6. Sửa test: `tests/rendered-html.test.mjs` đang kỳ vọng chuỗi "Tem đẹp đúng chất" — hero mới là "XƯỞNG IN SIÊU TỐC" → `npm test` sẽ fail. Cập nhật test theo nội dung mới.
7. Khôi phục mobile bottom bar (Zalo / AI Design / Gọi) — bản mới chưa có thanh CTA dính đáy trên điện thoại, mất kênh chốt đơn quan trọng nhất với khách mobile.
8. Accessibility: thêm skip-link, aria-label cho nút icon, kiểm tra focus ring + Tab order.
9. Chạy QA trên máy: `npm run build`, `npm run lint`, Lighthouse (mobile + desktop). Lỗi EPERM khi dev là do Windows khóa file — xóa `node_modules\.vite` rồi chạy lại.

## C. Đề xuất tiến hóa (P2 — lộ trình)

10. **AI Design Lab thành trang thật** `/ai-thiet-ke`: dùng lại `ai-design-lab.tsx` (đã có engine SVG mock) làm playground; sau này nối API sinh ảnh thật. Đây là USP khác biệt nhất so với xưởng in khác.
11. **Đo chuyển đổi**: `trackEvent` đã có sẵn — nối vào GA4/GTM, đo click Zalo theo vị trí (hero / bảng giá / mobile bar) để biết CTA nào ra đơn.
12. **Deploy Cloudflare**: project đã build ra `dist/` chuẩn Worker — gắn domain `vinprint.vn`, bật HTTPS, sau đó chạy Lighthouse thật và Search Console.
13. **SEO nội dung**: 10 trang `/san-pham/[slug]` đã có schema — bổ sung bài viết theo từ khóa ("in tem nhãn giá rẻ TP.HCM", "tem UV DTF là gì"...) trỏ về trang chủ.
14. **Form nhận file ngay trên web** (kèm upload) làm phương án phụ ngoài Zalo — giảm rớt khách không dùng Zalo.

## Kết luận
Trang đã đạt chất lượng giao diện và trải nghiệm tốt hơn hẳn bản cũ, cấu trúc code sạch. Ba việc P0 (nội dung tin cậy, JSON-LD, ảnh) làm trong ~1 buổi là đủ điều kiện lên production. Điểm dự kiến sau khi xử lý P0+P1: **8.5–9/10**.
