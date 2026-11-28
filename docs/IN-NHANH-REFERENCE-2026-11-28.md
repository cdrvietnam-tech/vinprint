# Danh mục in nhanh — dữ liệu tham khảo chủ chỉ định
Nguồn gốc: https://inthiennam.com/in-nhanh-ky-thuat-so, đọc ngày 28/11/2026.
Dữ liệu đối chiếu sáu dịch vụ và voucher thiếu nguồn nằm ở `agent/operator/drafts/in-nhanh-thien-nam/reference-prices.json`; mỗi dịch vụ có bản nháp riêng cùng thư mục. Không đưa hotline, đánh giá, thiết bị, ảnh hoặc cam kết giao trong ngày của đối thủ thành thông tin VinPrint.

| Nhóm | Đã xác minh ở nguồn | Cần chốt cho VinPrint |
|---|---|---|
| Card visit | Trang trực tiếp HTTP200; quy cách và ba điểm giá mẫu | Khả năng nhận, quy cách, giá |
| Tờ rơi | A4 hai mặt và các định lượng | Cỡ/giấy/mặt in/giá |
| Catalogue | Số trang, số cuốn, bìa/ruột/gia công | Quy cách đóng cuốn, giá |
| Folder | Cỡ, yếm, C300, bế dán | Khuôn thực tế, giá |
| Bao thư | Kích thước, loại giấy, phụ phí keo | Khuôn và giá |
| Túi giấy | Cỡ, hông, giấy, màng và dây | Gia công và giá |
| Voucher | Chưa thấy bảng riêng ở danh mục đã mở | Không suy giá; cần quy cách và nguồn riêng |

Bản sửa hiện bỏ các dịch vụ chưa có trang/thông tin xác nhận khỏi metadata và khối quảng bá ở `/san-pham`. Bảy nháp là đầu vào để duyệt mở rộng, chưa phải trang dịch vụ đã xuất bản. Giá đối thủ không được nhập vào giá VinPrint.
