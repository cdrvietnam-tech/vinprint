# VinPrint — Bản local sẵn sàng duyệt

Bản xem: http://127.0.0.1:4181/ · Quản trị: http://127.0.0.1:4181/admin
PR nháp: https://github.com/cdrvietnam-tech/vinprint/pull/33
Thẻ việc: https://github.com/cdrvietnam-tech/muse-aistudio/issues/163
Ảnh đo/cắt đã chọn: https://github.com/cdrvietnam-tech/muse-aistudio/issues/162

## Đối chiếu yêu cầu
| Yêu cầu | Kết quả và bằng chứng |
|---|---|
| Theme Tết theo ảnh đã duyệt, ảnh không méo | Hero244/90/1516/335; desktop và1366/768/390 px đạt; final/desktop.png, verification.json |
| Thông tin đầy đủ, ảnh sản phẩm mới | Giá/liên hệ/quy trình/FAQ từ quản trị;10 trang sản phẩm, danh mục và bộ ảnh Tết; dữ liệu cũ/override giữ nguyên |
| Dashboard Muse | Khung quản trị, tìm menu/CtrlK/sáng tối/mobile; theme-admin-results.json |
| Tab quảng cáo và ảnh lặp | Cấp danh mục không mở báo giá; lọc đúng ấn phẩm; loại trùng ảnh homepage và Kho mẫu |
|9 công cụ miễn phí và ô động trên trang chủ | Chạy ngay trong VinPrint; chuỗi đầy đủ trên Worker build/CSP gồm tải file và video, mobile/deep link; free-tools-results.json |
| Mẫu1 danh mục tem; bỏ khối đang hot | Bố cục đã duyệt,10 lựa chọn; không xóa dữ liệu hot-products khỏi quản trị |
| So sánh trực quan, đo/cắt theo ảnh chọn | Ảnh đo lớn + hai ảnh bế demi/cắt rời, zoom, tư vấn, nhãn AI; approved-guide-1536.png |
| Toàn site đồng bộ | Kho mẫu,13 trang thông tin/ngành,34 URL cẩm nang/bài/quy trình,404,AI247 cùng khung;65 URL sitemap/109 đích nội bộ đạt |
| SEO/GEO | Metadata/canonical/JSON-LD/sitemap/nội dung và nguồn được kiểm; docs/SEO-GEO-COMPETITOR-REVIEW.md và SEO-GEO-OFFICIAL-SOURCES.md. Không có cam kết thứ hạng/traffic |
| An toàn nội dung quản trị | Khi đọc lỗi không cho sửa mặc định; thử lại, giữ draft khi lưu lỗi, tôn trọng gallery rỗng; admin-error-results.json và admin-load-regression.json |

## Kiểm chứng cuối
-45 HTML/Facebook,63 unit,6 operator;TypeScript,ESLint,build,artifact và agent guard đạt.
- Bàn phím/nhãn trường nhập trên8 nhómtrang, motion thường/giảm đạt.
- Hai PNG chung4166274→746990 byteWebP chất lượng 94, cùng1781 × 883. Lượt đo tải toàn bộ ảnh trang chủ giảm khoảng41%;3 trang đo không có ảnh hỏng.
- Số đo hiệu năng là Worker build local390×844, browser context mới, không giới hạnCPU/mạng; không phải PageSpeed production hoặc CWV người dùng thật.
- Bằng chứng phiên bản: docs/evidence/tet-storefront/final/receipt.json và các JSON/ảnh cùng thư mục.

## Chạy và cập nhật bản duyệt
Build: node node_modules/vinext/dist/cli.js build
Worker: node scripts/preview-built-storefront.mjs (4182)
Proxy: đặt VINPRINT_PREVIEW_BUILT_PORT=4182 rồi chạy node --import tsx scripts/preview-storefront.mjs (4181).
Proxy giữ API nội dung/ảnh ghi .preview; không ghi website thật. Sau build mới phải khởi động lại đúng Worker local để asset và manifest cùng phiên bản. Có thể bỏ biến để dùng Next dev4180 như trước.
Trên máy hiện tại proxy được bundle bằng esbuild trong .preview để chạy ổn định dưới tài khoản sandbox, không cần thay cấu hình đăng nhập.
Nghiệm thu công cụ build riêng: scripts/verify-built-free-tools.cjs tự dùng4183, không dừng bản duyệt4181/4182.

## Xuất bản và hoàn tác
Chưa merge/deploy. Cần chủ duyệt đúng head PR #33 trước merge vì main tự xuất bản, theo AGENTS.md.
Sau duyệt, áp dụng bộ ảnh Tết qua quản trị production theo hướng dẫn TET-STOREFRONT-INTEGRATION.md; có backup manifest trước đổi, không tự xóa ảnh cũ.
Hoàn tác code bằng revert commit đã xuất bản. Dữ liệuR2 thay đổi riêng phải dùng backup/quản trị, không dùng revert code để khẳng định đã phục hồi dữ liệu.
GitHub API đã khôi phục qua credential Git đang có; token gh mặc định vẫn cũ. Board #2 thiếu read:project nên chưa đổi cột; quyền tiếp tục local của chủ vẫn áp dụng.
