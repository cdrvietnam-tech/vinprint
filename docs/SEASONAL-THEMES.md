# Theme theo dịp lễ — Muse Issue166

## Cách dùng
1. Vào /admin/themes, hoặc chọn **Theme theo dịp lễ** trong menu quản trị.
2. Chọn Tết sum vầy, VinPrint thường ngày, Giáng sinh, 8/3, 20/10 hoặc 20/11.
3. Xem trước; có thể sửa hai dòng tiêu đề, lời giới thiệu và đường dẫn ảnh bìa riêng.
4. Bấm **Lưu và áp dụng theme**, tải lại website để xem.

Theme không tự đổi theo ngày. Đây là thao tác chọn thủ công như yêu cầu của chủ. Tết vẫn là theme mặc định và đang dùng trên local.

## Phạm vi lưu
- ID theme đang dùng, cấu hình lời giới thiệu/ảnh bìa riêng của cả sáu theme lưu trong seasonalThemes của settings/home-content.json trên R2 bằng API quản trị hiện có.
- Khi mở thư viện, lấy nội dung banner đang dùng để lưu đúng bản chủ đã sửa. Chuyển sang theme khác rồi quay lại giữ bản này. ContentAdmin vẫn sửa banner của theme đang dùng.
- Màu và bộ trang trí từng dịp nằm trong app/lib/seasonal-themes.ts, seasonal-themes.css và public/images/themes. Tết dùng nguyên ảnh bìa, logo và trang trí đã duyệt. Bộ vector còn lại do dự án tạo, không dùng tài nguyên đối thủ.
- Bố cục/menu/danh mục/công cụ dùng chung. Ảnh sản phẩm và thư viện giữ nguyên, không đổi hàng loạt khi chọn dịp lễ. Mục Bộ ảnh sản phẩm Tết trong quản trị ảnh là tác vụ riêng.
- Ảnh bìa riêng dùng /media/ hoặc /images/ nội bộ, nên có tỷ lệ 1516 × 335 và chừa vùng trái cho chữ. Để trống để dùng bộ ảnh có sẵn.
- Khi áp dụng, đọc lại dữ liệu mới nhất và chỉ thay seasonalThemes/tetHome; giữ thay đổi mới về giá, liên hệ và các mục khác. Nếu theme bị sửa ở phiên khác, yêu cầu tải lại thay vì ghi đè. API vẫn dùng xác thực quản trị hiện có.
- Lỗi tải chặn lưu; lỗi lưu giữ bản nháp. Chọn lại Tết để hoàn tác giao diện. Khôi phục toàn bộ nội dung mặc định sẽ xóa cả các tùy chỉnh theme, theo cảnh báo của nút đó.

## Nghiệm thu
- Build, TypeScript, lint; 66 unit/API, 45 HTML/Facebook và 6 operator đạt.
- scripts/verify-seasonal-themes.cjs: sáu theme lưu/tải lại, chữ tùy chỉnh riêng, 390px, dữ liệu kinh doanh giữ nguyên, xung đột phiên chỉnh sửa, lỗi tải/lưu và theme ID không hợp lệ.
- Chuyển đủ sáu theme rồi quay lại Tết: ảnh hero trùng từng pixel với ảnh trước khi chuyển.
- Thử thêm quản trị dark 390px, ảnh bìa riêng được lưu, khung trang sản phẩm dùng theme đang chọn.
- Bằng chứng: docs/evidence/tet-storefront/seasonal-themes, results.json và extra-results.json; ảnh desktop/mobile của cả sáu theme.

Chỉ local/PR nháp. Chưa merge/deploy website thật; không thay cổng duyệt xuất bản.
