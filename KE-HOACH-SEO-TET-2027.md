# VinPrint.vn — Kế hoạch SEO và kéo khách mùa Tết 2027

*Lập ngày 27/11/2026. Mùng 1 Tết Đinh Mùi: thứ Bảy 6/2/2027 (còn khoảng 10 tuần).*

## 1. Hiện trạng (kiểm tra 27/11/2026)

- Nền kỹ thuật tốt: sitemap, robots, llms.txt, schema LocalBusiness/Product/Article, GA4 (`G-0XQZ3FCJN0`).
- Nội dung đứng yên từ 24/07/2026: 16 bài blog, 4 bản nháp chưa đăng, sitemap ghi ngày 16/07.
- Chưa có trang nào nhắm từ khóa mùa vụ (Tết, quà Tết, bánh mứt, Noel).
- Các trang `/nganh/*`, `/huong-dan/*` không có link nội bộ trong bài (chỉ có menu và footer).
- Tìm "vinprint.vn in tem nhãn" trên web chưa thấy vinprint.vn trong kết quả đầu: cần kiểm tra index trong Search Console.
- Chưa có Google Business Profile ở địa chỉ mới (ghi chú trong `app/lib/business-info.ts`).
- Đã sửa tên phường thành An Phú Đông trên toàn bộ mã nguồn (27/11). Nếu anh từng lưu khối Liên hệ/Footer trong `/admin/noi-dung`, sửa lại địa chỉ ở đó vì bản lưu ghi đè mặc định.

## 2. Đã làm trong mã nguồn (chờ anh chạy test và push)

| File | Thay đổi |
|---|---|
| `app/lib/seasonal-pages.ts` (mới) | 3 trang mùa Tết: `/nganh/tem-nhan-tet`, `/nganh/tem-banh-mut-tet`, `/nganh/sticker-hop-qua-tet` |
| `app/lib/content-pages.ts` | Thêm trường tùy chọn `updatedAt`, `faqs`, `related`; nạp trang mùa vụ; thêm link liên quan cho `thuc-pham`, `handmade` |
| `app/components/content/ContentPage.tsx` | Hiển thị khối "Câu hỏi thường gặp" + "Xem thêm"; schema FAQPage và `dateModified` |
| `app/components/home/SeasonalBanner.tsx` (mới) + `app/page.tsx` | Dải "Mùa Tết 2027" ngay dưới Hero, dẫn tới 3 trang trên |
| `app/sitemap.ts` | `lastModified` theo `updatedAt` của từng trang |
| `app/llms.txt/route.ts` | Thêm 3 URL mùa Tết |
| `tests/rendered-html.test.mjs` | Thêm 3 route mới vào danh sách phải render 200 |
| `app/components/admin/admin-nav.ts`, `AdminShell.tsx` (mới) | Khung quản trị theo mẫu Muse: sidebar theo nhóm, thu gọn được, menu trượt trên điện thoại, tìm nhanh Ctrl+K, link nhanh Search Console/GA4/PageSpeed |
| `app/admin/**`, `BlogDashboard`, `ContentAdmin`, `HeroImageAdmin` | Bọc bằng `AdminShell`, bỏ thanh nút `AdminNav` cũ; trang Tổng quan có số liệu thật và mục "Việc nên làm" |
| `tests/admin-nav.test.ts` (mới) | Khóa: id menu không trùng, tìm không dấu, mọi trang quản trị dùng chung khung |

Nội dung 3 trang chỉ dùng thông tin đã có trên web (nhận số lượng ít, hỗ trợ thiết kế, duyệt mẫu trước in). Không ghi giá mới, ưu đãi, hạn chót nhận đơn hay cam kết giao hàng.

Lệnh kiểm tra và đưa lên:

```
npx tsc --noEmit
npm run lint
npm test
git checkout -b agent-evolution/tet-2027
git add app/lib/seasonal-pages.ts app/lib/content-pages.ts app/components/content/ContentPage.tsx app/components/home/SeasonalBanner.tsx app/page.tsx app/sitemap.ts app/llms.txt/route.ts tests/rendered-html.test.mjs KE-HOACH-SEO-TET-2027.md
git commit -m "feat: trang mua Tet 2027, FAQ + link lien quan, sitemap theo ngay cap nhat"
git push -u origin agent-evolution/tet-2027
```

Sau khi lên web: Search Console → Kiểm tra URL → Yêu cầu lập chỉ mục cho 3 trang mới và trang chủ; gửi lại sitemap.

## 3. Đã chốt với anh (27/11) và còn chờ

- Chưa chạy ưu đãi Tết: các trang không ghi khuyến mãi.
- Phường: **An Phú Đông** (đã sửa toàn bộ mã nguồn).
- Từ khóa thêm: **"in tem Tết lấy liền"** — đã đưa vào title, mô tả, một mục riêng và FAQ của `/nganh/tem-nhan-tet`, cùng meta keywords.
- Còn chờ: hạn chót nhận đơn trước Tết và lịch nghỉ Tết; 3–6 ảnh thật hàng Tết đã dán tem; Google Business Profile ở địa chỉ mới.

## 4. Lộ trình 10 tuần

### Tuần 1 (27/11 – 3/12): mở đường
- Push thay đổi ở mục 2, yêu cầu index.
- Tạo/xác minh Google Business Profile ở địa chỉ mới; thêm ảnh xưởng, sản phẩm, giờ làm việc; thay link trong `business-info.ts`.
- Search Console: kiểm tra số trang đã index, lỗi thu thập; GA4: bật key event `click_zalo`, `click_phone`.
- Đăng 4 bản nháp đang chờ trong `content/blog/drafts` (qua đúng quy trình Agent).

### Tuần 2–4 (4/12 – 24/12): nội dung Tết
Chạy lại Agent nội dung với cụm chủ đề Tết (mỗi bài một search intent, không trùng bài cũ):

| Từ khóa chính | Loại | Link về |
|---|---|---|
| tem dán hũ mứt Tết | conversion | /nganh/tem-banh-mut-tet |
| tem niêm phong hộp quà | conversion | /nganh/sticker-hop-qua-tet |
| sticker chúc Tết in theo yêu cầu | conversion | /nganh/tem-nhan-tet |
| tem nhãn cho hũ hạt dinh dưỡng | conversion | /nganh/tem-banh-mut-tet |
| tem dán túi giấy quà Tết | conversion | /nganh/sticker-hop-qua-tet |
| in logo UV DTF lên ly, bình quà tặng | conversion | /san-pham/tem-uv-dtf |
| màu đỏ, vàng khi in tem Tết: lưu ý màu in | authority | /huong-dan/ky-thuat-in-tem |
| chọn kích thước tem tròn dán nắp hũ | authority | /huong-dan/chon-kich-thuoc-tem |
| checklist đặt in tem trước mùa cao điểm | authority | /nganh/tem-nhan-tet |
| tem dán bao lì xì, phong bao theo thương hiệu | conversion | /nganh/tem-nhan-tet |

- Mỗi bài mới thêm 1–2 link về trang mùa vụ; trang mùa vụ thêm lại link tới bài (trường `related`).
- Shopee: thêm dòng "Xem mẫu tem Tết và gửi file tại vinprint.vn" trong mô tả shop/sản phẩm nếu chính sách sàn cho phép.
- Zalo OA/Facebook: 2 bài/tuần dẫn về 3 trang mùa vụ, gắn `?utm_source=zalo` / `facebook` để GA4 tách nguồn.

### Tuần 5–8 (25/12 – 21/1): cao điểm
- Mỗi tuần xem GA4 + Search Console: truy vấn nào có hiển thị nhưng ít nhấp → sửa title/description trang đó.
- Bổ sung ảnh thật hàng Tết và câu hỏi khách hay hỏi trên Zalo vào FAQ.
- Xin đánh giá Google từ khách vừa nhận hàng (gửi link GBP qua Zalo sau khi giao).

### Tuần 9–10 (22/1 – 6/2): chốt mùa
- Cập nhật thông báo hạn chót, lịch nghỉ Tết.
- Sau Tết: bỏ `<SeasonalBanner />`, giữ nguyên 3 URL (đổi nội dung sang mùa sau, không xóa trang).

## 5. SEO nền (làm song song, sau cao điểm vẫn tiếp tục)

- Trang sản phẩm: thêm mô tả dài 200–300 chữ, FAQ, link bài blog liên quan cho 10 trang `/san-pham/*`.
- Thống nhất giá: chốt giá tem trong, tem bạc/vàng (đang "Gửi file để xác nhận").
- Ảnh: alt mô tả sản phẩm thay cho "Mẫu tem VinPrint 1–10"; ảnh riêng cho `tem-bao-hanh`, `sticker-trang-tri`, `tem-phu-san-pham`.
- Trang khu vực: "In tem nhãn Quận 12", "Gò Vấp", "Hóc Môn" (chỉ viết khi có thông tin giao nhận thật).
- Hiệu năng mobile: thay framer-motion bằng CSS (đã ghi trong đánh giá 07/2026).
- Bật security headers qua Cloudflare.

## 6. Dùng lại gì từ Muse (D:\CLONEVIDEO)

Hai dự án khác nền (Muse: React + Vite + Express chạy trên máy; VinPrint: Next/vinext trên Cloudflare Workers + R2), nên không chép thẳng file được; dùng lại theo ba cách:

| Từ Muse | Dùng cho VinPrint | Cách |
|---|---|---|
| `shadcn-admin/` (adminNav.js, Sidebar, Header, Ctrl+K, Overview) | Khung quản trị có sidebar nhóm mục + tìm nhanh, thay thanh nút hiện tại | Viết lại bằng TSX theo cùng cấu trúc: một file `adminNav` là nguồn duy nhất |
| `AdminSeoArticlesTab.jsx` | Màn sửa SEO từng trang: title, meta, từ khóa, ảnh OG 1200x630, alt ảnh, xem trước SERP, khôi phục gốc | Làm bản rút gọn lưu vào R2 như `site-content` hiện có |
| `lib/trafficSource.js` | Ghi nguồn khách (`utm_source`, `src`) 30 ngày, gắn vào sự kiện `click_zalo` | Chuyển sang TS gần như nguyên vẹn |
| `PromoCodeAdminPanel.jsx` | Quản lý mã/ưu đãi theo mùa hiển thị trên dải khuyến mãi | Chỉ khi anh chạy ưu đãi |
| `AuditSecurityTab.jsx` | Nhật ký ai sửa gì trong quản trị | Giai đoạn sau |
| Công cụ miễn phí: PDF → PNG, tách nền, làm nét, xem CDR/AI | Kéo khách in ấn: trang "Chuẩn bị file in" trên vinprint.vn dẫn sang công cụ Muse, và Muse dẫn ngược về VinPrint khi khách xử lý file xong | Link chéo hai chiều, không cần chép code |

## 7. Cải tiến trang quản trị theo Muse (sau khi xong đợt Tết)

1. ~~Khung sidebar + tiêu đề trang + Ctrl+K~~ — đã làm 27/11.
2. ~~Trang Tổng quan~~ — đã làm 27/11 (chưa có "lần sửa nội dung gần nhất").
3. Mục "SEO từng trang": sửa title/meta/ảnh OG cho trang chủ, sản phẩm, trang ngành, trang mùa vụ.
4. Mục "Trang mùa vụ & khuyến mãi": bật/tắt dải mùa vụ, sửa chữ, đặt ngày hết hạn.
5. CMS sản phẩm và soạn bài viết trên web (việc tồn từ REVIEW-2026-07, mục 6).

Mỗi mục là một PR `[Agent Evolution]` riêng, có test, theo đúng AGENTS.md.
