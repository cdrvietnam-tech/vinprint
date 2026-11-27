# Tích hợp giao diện Tết đã duyệt

Bản tích hợp dựa trên main b866cad, giữ bố cục V5 đã được chủ duyệt.
Chưa merge, chưa deploy.

## Thông tin và luồng khách
- 6 gợi ý thiết kế Tết, 10 dòng tem trong danh mục, 4 bảng giá, 5 bước đặt in.
- Sản phẩm hot và kho mẫu đọc từ API media đang có; mảng rỗng được giữ nguyên theo quản trị.
- Giá, liên hệ, FAQ, quy trình, đánh giá và chân trang dùng SiteContent hiện có.
- Nhóm tetHome riêng cho chữ banner/bộ sưu tập, có form ở /admin/noi-dung.
- Dữ liệu quản trị cũ thiếu tetHome vẫn hợp lệ; không đổi hay xóa các override đã lưu.
- Báo giá: nhập quy cách → sao chép nội dung → khách tự gửi qua Zalo.
- File: khách đính kèm trực tiếp trong Zalo. Không có upload giả hoặc thông báo gửi thành công giả.
- Ví Xu/tài khoản minh họa được thay bằng điện thoại và liên hệ thật.
- Danh mục hiện có chưa xác nhận in tem cuộn, túi/hộp thành phẩm; các ô liên quan được nối tới tem chống nước và tem dán bao bì đang có.

## Chạy local trên Windows
Từ root repo, chạy trong 2 terminal (hoặc tiến trình ẩn):
1. node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 4180 --webpack
2. node --import tsx scripts/preview-storefront.mjs

Mở http://127.0.0.1:4181 và /admin/noi-dung.
Preview chỉ ghi .preview/site-content.json, không ghi API sản xuất.
Media và nội dung seed chỉ đọc từ endpoint công khai của vinprint.vn.
File .preview, .env, model và node_modules không nằm trong commit.

## Kiểm chứng
- Vinext build và scripts/validate-artifact.sh.
- TypeScript và ESLint.
- 33 kiểm thử HTML, 46 unit/API tests.
- Playwright: 25 route HTTP200; lọc, clipboard, validate số lượng, Zalo/file handoff, lightbox bảng giá, FAQ, đánh giá, bản đồ tải khi yêu cầu, mobile menu.
- Lưu quản trị qua API local thật, kiểm trang chủ cập nhật, giá cũ giữ nguyên rồi khôi phục dữ liệu ban đầu.
- Không dùng kết quả mock R2 để khẳng định đã ghi website thật.
- Khung desktop: hero x244,y90,w1516,h335; kiểm tỷ lệ ảnh ở 1781/1366/768/390.

## Triển khai và hoàn tác
Main tự triển khai. Merge PR là hành động xuất bản, cần duyệt đúng head.
Không có migration dữ liệu; tetHome dùng mặc định khi chưa lưu.
Hoàn tác code bằng revert commit tích hợp, không xóa nội dung R2 hoặc nhóm hero cũ.
Ảnh Tết là minh họa theo mẫu được cung cấp, không dùng làm bằng chứng thành phẩm thực tế.
