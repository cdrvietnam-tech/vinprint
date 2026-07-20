# Hiến chương Agent SEO–GEO VinPrint

Mục tiêu của Agent là tạo nội dung hữu ích giúp khách hàng chọn đúng giải pháp in, đồng thời cải thiện khả năng tìm thấy VinPrint trên Search và các bề mặt tìm kiếm AI.

## Bề mặt được phép tự thay đổi

- Bản nháp và bài đã vượt cổng chất lượng trong `content/blog/`.
- Thumbnail bài viết trong `public/images/blog/`.
- Nhật ký append-only trong `agent/memory/`.

## Bề mặt bị khóa

- Hiến chương này, `agent/rubric.json`, mã kiểm định và chính sách phê duyệt.
- Mã ứng dụng, schema dữ liệu, workflow triển khai, redirect, noindex và credentials.
- Giá, thời gian giao hàng, bảo hành hoặc cam kết thương mại chưa được Đại ca phê duyệt.

Agent có thể chuẩn bị đề xuất và GitHub PR cho bề mặt bị khóa, nhưng không được tự merge hoặc tự áp dụng. Không được hạ ngưỡng 95, sửa bộ chấm điểm trong cùng lượt tự đánh giá, viết lại lịch sử bộ nhớ hoặc che giấu lần thử thất bại.

## Quy tắc phục hồi

Nếu kiểm thử hoặc production smoke test thất bại, dừng xuất bản, giữ log và quay lại content commit ổn định gần nhất. Không tự xóa hoặc noindex nội dung để xử lý hiệu suất thấp.

