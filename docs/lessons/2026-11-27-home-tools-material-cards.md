# Homepage cần ô công cụ và tín hiệu chất liệu để chọn nhanh
- Issue: https://github.com/cdrvietnam-tech/muse-aistudio/issues/147
- Phản hồi: công cụ chỉ có một CTA chung; danh mục tem dạng hàng dài chưa phù hợp giao diện mới.
- Nguyên nhân gốc: homepage giấu các tiện ích sau trang hub và mô tả sản phẩm bằng danh sách chữ, chưa giúp phân biệt hiệu ứng chất liệu khi chọn tem.
- Sửa: chín ô công cụ lấy từ cùng freeTools, deep link ?tool đúng id; đặt ngay sau nhóm sản phẩm Tết. Mười thẻ lấy dữ liệu sản phẩm hiện có, thêm mẫu đồ họa giấy/trong/bạc/vàng/hologram và ứng dụng, không tái sử dụng ảnh sản phẩm ở nhiều khối. Giữ giá và URL.
- Chặn: scripts/verify-home-tools-layout.cjs mở đủ9 đích, kiểm10 thẻ/0 ảnh lặp trong danh mục, báo giá đúng chất liệu, khung hero335 và không tràn ở1781/1366/768/390. scripts/verify-home-navigation.cjs kiểm9ảnh/9nguồn toàn trang và bộ sưu tập không thay đổi.
- Bằng chứng: docs/evidence/tet-storefront/home-tools-layout-results.json, home-tools-desktop.png, material-cards-desktop.png. Ảnh chụp component tạm ẩn thanh điều hướng cố định/skip-link trong thao tác screenshot để không chồng lên ảnh dài; giao diện thật không bị đổi.
- Áp dụng chung: trang dịch vụ cần làm rõ lựa chọn trước khi mở form; có trang hub không thay thế khả năng khám phá công cụ từ homepage.

## Minh họa động chức năng — Issue148
Chín ô có cảnh SVG/CSS riêng, không chỉ lắc/phóng icon. Không dùng ảnh chụp tĩnh để kết luận có chuyển động: verify-tool-motion.cjs đo transform ở hai thời điểm, kiểm nhiều animation chạy, pause ngoài viewport và chế độ reduced motion, rồi bấm đúng ứng dụng trên390px. Ghi video yêu cầu binary ffmpeg của Playwright; khi môi trường không có, dùng đo trạng thái thực và hai khung hình, không cài phần mềm chỉ để làm bằng chứng. Minh họa không gọi API xử lý và không tạo tác vụ nền trên Muse.
