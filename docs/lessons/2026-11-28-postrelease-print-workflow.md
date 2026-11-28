# Kiểm luồng in sau kết quả, không chỉ HTTP200
- Issue: muse-aistudio#172.
- Triệu chứng: mất thanh Zalo/gọi sau đổi layout; ảnh miễn phí có dấu Muse; proxy gọi vô hạn; FAQ/giá hiển thị không khớp dữ liệu SEO; SVG tải cả sheet lớn.
- Nguyên nhân: layout mới không mount MobileActionBar; dùng API ẩn danh đóng dấu mặc định và khởi tạo phiên AI mỗi lượt; chưa có admission chung; test bỏ FAQ và dùng điều hướng/ảnh mẫu cũ làm chuẩn thay vì nhu cầu hiện tại.
- Chặn bằng: site-content.test.ts (root mount), free-tools-limit.test.ts (workerd/R2, quota chung và không gọi upstream khi chặn), vinprint-bridge.test.ts (key riêng), free-tools-api.test.ts (từ chối brandMarked), faq-schema.test.ts (cùng dữ liệu và chống script), rendered-html.test.mjs (FAQ, giá và phân trang blog). Harness UI phải kiểm naturalWidth/CSP trước khi lấy screenshot làm bằng chứng.
- Tối ưu ảnh: xuất đúng crop bằng Sharp, giữ ảnh gốc cho zoom; img loading=lazy cho danh mục. Không coi SVG image là lazy-loaded.
- Phạm vi đo: cầu nối cô lập loopback; tốc độ warm không đại diện cold hoặc mạng production. Không tuyên bố đã sửa Muse thật trước khi tích hợp và nghiệm thu production.
