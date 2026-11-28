# Rà soát trang chủ local — Issue153

Phạm vi: desktop1781/1366, tablet768, mobile390. Giữ theme Tết, ảnh/bố cục mẫu1,9công cụ và dữ liệu quản trị.

| Điểm thấy qua kiểm tra | Cải tiến |
|---|---|
| Kho mẫu3ảnh nằm trong6cột, trống nửa chiều ngang | Lưới tự chia đều desktop, mobile2cột và ảnh lẻ phủ hàng |
| Chất liệu và giá ở sâu dưới trang |4liên kết đi nhanh trước khối công cụ |
| Link khám phá chất liệu, tem phụ, hướng dẫn có vùng chạm thấp | Tăng vùng tương tác tối thiểu44px |
| Chú thích ảnh và nhóm công cụ nhạt | Tăng độ đậm màu chữ |

Kiểm tra: scripts/verify-storefront-polish.cjs; verify-storefront.cjs cho báo giá, file/Zalo, poster, FAQ, menu, liên hệ và tuyến trang. Production build, TypeScript,37HTML/Facebook và62unit/API đạt. Ảnh/JSON bằng chứng trong docs/evidence/tet-storefront/polish-* và storefront-polish-results.json.

Các thay đổi là bản local để chủ xem thẩm mỹ; chưa xuất bản. Những số liệu đánh giá, giá và nội dung quản trị giữ nguyên trong lần rà soát này.
