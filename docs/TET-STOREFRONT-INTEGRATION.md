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
Preview chỉ ghi .preview/site-content.json, media-collections.json và ảnh trong .preview; không ghi API sản xuất.
Media và nội dung seed chỉ đọc từ endpoint công khai của vinprint.vn.
File .preview, .env, model và node_modules không nằm trong commit.

## Kiểm chứng
- Vinext build và scripts/validate-artifact.sh.
- TypeScript và ESLint.
- 37 kiểm thử HTML/Facebook, 62 unit/API tests.
- Playwright: 26 route HTTP200; lọc, clipboard, validate số lượng, Zalo/file handoff, lightbox bảng giá, FAQ, đánh giá, bản đồ tải khi yêu cầu, mobile menu.
- Lưu quản trị qua API local thật, kiểm trang chủ cập nhật, giá cũ giữ nguyên rồi khôi phục dữ liệu ban đầu.
- Không dùng kết quả mock R2 để khẳng định đã ghi website thật.
- Khung desktop: hero x244,y90,w1516,h335; kiểm tỷ lệ ảnh ở 1781/1366/768/390.

## Triển khai và hoàn tác
Main tự triển khai. Merge PR là hành động xuất bản, cần duyệt đúng head.
tetHome dùng mặc định khi chưa lưu. Bộ ảnh Tết có migration chủ động trong /admin/hinh-anh; không tự ghi R2 khi deploy hoặc GET.
Hoàn tác code bằng revert commit tích hợp, không xóa nội dung R2 hoặc nhóm hero cũ.
Ảnh Tết là minh họa theo mẫu được cung cấp, không dùng làm bằng chứng thành phẩm thực tế.

## Bộ ảnh và dashboard Muse
- 12 ảnh minh họa cùng tỷ lệ 4:3, nền kem, lụa đỏ và hoa mai. Manifest: docs/design/tet-product-images.json. Không thay banner/bộ sưu tập đã được duyệt, giá hoặc URL sản phẩm.
- Danh mục 10 sản phẩm và 6 thẻ nổi bật dùng ảnh mới. Local đã áp dụng cho 6 hero, 15 sản phẩm hot, 12 mẫu thư viện; giữ ID, tiêu đề, liên kết và thứ tự. AI247 giữ nguyên.
- /admin dùng mẫu shell/tổng quan Muse Studio: sidebar 256/80px, breadcrumb, Ctrl+K, lọc menu không dấu, trạng thái dữ liệu thật, sáng/tối. Thống kê/biểu đồ lấy từ nội dung VinPrint; không có số doanh thu giả.
- Trong quản trị ảnh, **Áp dụng bộ ảnh Tết** đổi nguồn ảnh của ba bộ sưu tập và giữ bản manifest trước lần đổi đầu tiên. **Khôi phục bộ trước** phục hồi bản manifest đó; thay đổi sau lần áp dụng đầu sẽ bị thay bằng bản sao. File ảnh cũ không bị xóa bởi migration. Upload riêng sau migration hoạt động bình thường.
- Worker backup: collections/backups/tet-2027/<collection>.json. Local tương ứng: .preview/theme-backups/<collection>.json. Bản sao không bị ghi đè khi áp dụng lại. Không dùng thao tác này để khôi phục binary đã bị thay bằng upload cùng ID sau đó.
- Ảnh cũ được giữ trong nhóm **Ảnh cũ lưu trữ**, ẩn khỏi danh sách mặc định. Không đổi ảnh bài viết, bảng giá, avatar khách hàng.
- Nghiệm thu: scripts/verify-theme-admin.cjs kiểm ảnh, upload/delete local, override ảnh tĩnh, menu, sáng/tối, mobile và nút áp dụng thật. Chạy với VINPRINT_PLAYWRIGHT_MODULE và VINPRINT_EVIDENCE_DIR nếu Playwright nằm ngoài repo.
- Sau khi được duyệt xuất bản, cần áp dụng bộ ảnh trong quản trị trên production để thay các manifest R2 hiện hữu. Bản demo hiện tại chỉ thao tác dữ liệu local.

## Điều hướng quảng cáo và chọn ảnh trang chủ
- Tab Ấn phẩm quảng cáo hiển thị tờ rơi, brochure, poster, menu, standee và phiếu bảo hành. Không mở báo giá ở cấp danh mục; chỉ mở khi khách bấm CTA của một loại ấn phẩm.
- Sáu thẻ Tết dùng sáu ảnh riêng. Sản phẩm hot và mẫu tham khảo dùng tập nguồn ảnh chung để bỏ trùng giữa các khối; tối đa 3 hot, 4 mẫu chưa xuất hiện. Loại query/hash khi đối chiếu nguồn. Không thay đổi mảng media gốc.
- Danh mục đầy đủ giữ 10 loại tem dạng danh sách gọn thay vì lặp lại ảnh. Khi không còn ảnh khác cho khối kho mẫu, dùng liên kết mẫu theo ngành và thư viện riêng, vẫn giữ đích #mau-thuc-te.
- Browser local hiện đo 9 ảnh sản phẩm / 9 nguồn duy nhất. Thư viện quản trị vẫn giữ 33 media. Bộ ấn phẩm dùng ảnh riêng khi chọn tab print.
- Chạy scripts/verify-home-navigation.cjs để kiểm điều hướng desktop/mobile, ảnh trùng và đảm bảo media trước/sau không bị sửa.

## Công cụ miễn phí Muse
Tích hợp 9 tiện ích chạy trực tiếp trong /cong-cu-mien-phi, không iframe/chuyển tab. Xem docs/MUSE-FREE-TOOLS.md về phạm vi miễn phí, xử lý trình duyệt/server, CSP, bằng chứng và rollback. Trang chủ có menu và khối mở công cụ; banner đã duyệt giữ nguyên.

Homepage hiện hiển thị đủ9 ô ngay sau sản phẩm Tết; mỗi ô deep link đúng ?tool. Menu cuộn tới khối công cụ. Danh mục10tem dùng MaterialExplorer: một ảnh bộ chất liệu lớn riêng và10lựa chọn tương tác; chỉ chi tiết loại đang chọn hiển thị, có benefit/ứng dụng/giá từ products, link chi tiết và báo giá riêng. Dùng được bằng bàn phím. Ảnh minh họa mới1448×1086 giữ tỷ lệ4:3, WebP278194bytes, nguồn tạo mới exec-2cfeae11-13f2-417e-94be-4b7e271f36c6.png; không lấy ảnh đã xuất hiện ở các khối khác. Kiểm chứng bằng scripts/verify-material-explorer.cjs ở4kích thước; xem ảnh material-explorer trong evidence. Bản thẻ đồ họa nhỏ trước đó bị chủ từ chối, không coi là thiết kế đã duyệt.

Mỗi ô công cụ có cảnh SVG/CSS động104×76px (mobile88×66), mô tả thao tác riêng: nén, đổi định dạng, tách trang, xóa nền, nền trắng, làm nét, xóa vùng, gom album, tải video. Không tải GIF/video hoặc ảnh ngoài. IntersectionObserver và visibilitychange tạm dừng ngoài viewport/tab ẩn; prefers-reduced-motion hiển thị trạng thái tĩnh. scripts/verify-tool-motion.cjs đo transform theo thời gian, số animation chạy, dừng ngoài màn hình, reduced motion và bấm đúng công cụ ở390px. Các con số trong minh họa nén là ví dụ, không phải cam kết mức giảm dung lượng.
