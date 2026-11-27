# Tiện ích Muse miễn phí trong VinPrint

Yêu cầu/chọn cách tích hợp: chủ chọn **chạy trực tiếp trong VinPrint**, 27/11/2026. Thẻ việc Muse #146; bản local /cong-cu-mien-phi, PR VinPrint #33. Chưa xuất bản.

## Phạm vi

9 mục từ FREE_TOOLS của Muse: nén ảnh, HEIC→JPG, PDF→PNG, tách nền, nền trắng, làm nét thường, xóa vùng chọn, album sản phẩm và tải video. Nền trắng/tách nền dùng chung dịch vụ tách nền, sau đó nền trắng được ghép trong trình duyệt. Không nhúng iframe, không mở công cụ ở tab Muse.

Nén, HEIC và PDF xử lý trên thiết bị; file không tải lên server. JPG được ghép nền trắng; PNG/WebP giữ alpha. PDF có tùy chọn nền trong suốt, 96/150/300/600 DPI, tối đa 20 trang/lượt và 50 MB/file, có ZIP. HEIC tối đa20MB, ảnh thường tối đa12MB. Giới hạn canvas được giữ từ module PDF Muse; khi giảm kích thước cần thông báo đúng mức thực xuất.

Các tác vụ khác chỉ gửi khi bấm xử lý. Kết quả miễn phí có thể có dấu thương hiệu của dịch vụ. Dừng chờ hủy việc chờ trên trình duyệt, không cam kết dừng tác vụ đã chạy trên server. Các sàn/nền tảng có thể hạn chế một số URL; lỗi được báo và không tạo kết quả giả.

## Kết nối

- Client dùng /api/free-tools/<tool>, /api/free-tools/asset; giữ giao diện VinPrint.
- Production: Worker handleFreeToolRequest, mặc định https://www.muse-aistudio.com. Có thể cấu hình biến server MUSE_FREE_TOOLS_ORIGIN. Không dùng biến NEXT_PUBLIC cho origin nội bộ.
- Local Next development: mặc định http://127.0.0.1:5000, đúng Muse đang chạy. Không sửa/restart Muse, watchdog hay tunnel.
- API tạo lại payload: enhance luôn mode=enhance, quality=standard, scale=2x. Không chuyển Authorization, Cookie, token, mode hoặc chất lượng của khách. restore/outpaint/enhance_ai không có endpoint.
- Xóa vùng chọn chỉ nhận data ảnh/mask, không nhận đường dẫn file/URL tùy ý. Album/video chỉ nhận HTTPS ở danh sách nền tảng; tài sản chỉ nhận clean_media/uploads hợp lệ hoặc CDN ảnh đã cho phép. Không proxy một URL máy chủ do khách chỉ định.
- File kết quả tải về tên VinPrint, đuôi theo MIME thực. Video giữ Range/206 để xem trước và seek.
- /cong-cu-mien-phi?tool=pdf (hoặc id khác) mở đúng công cụ. Trang có canonical /cong-cu-mien-phi, đăng ký sitemap, truy cập từ menu và khối công cụ ở homepage.

## Thư viện và CSP

PDF: module app/lib/pdf-to-png.js từ Muse, tài nguyên PDF.js4.10.38 và giấy phép được lưu public/vendor. HEIC: heic2any0.0.4 MIT, giữ LICENSE.txt. scripts/patch-heic-csp.mjs thay bốn wrapper Embind sinh mã động bằng closure/invoker tĩnh; không thay thuật toán giải mã. Xem README trong vendor.

Worker chỉ bổ sung worker-src self blob để chạy worker trình duyệt. Không thêm unsafe-eval. Blob kết quả được giữ trong Map để tải/ZIP, không fetch(blob:) vì connect-src hiện tại không cho phép. Khi kiểm build phải khởi động lại harness sau build để manifest/asset cùng phiên bản.

## Bằng chứng

- verify-free-tools.cjs: nén giữ alpha/kích thước, tải WebP; HEIC tải JPG; PDF2trang/ZIP; làm nét/tách nền/nền trắng/xóa vùng chọn qua API Muse thật; album; mobile390 và deep link, không pageerror.
- verify-free-tools-production.cjs: HEIC/PDF + tải JPG/ZIP dưới CSP Worker build thật, không pageerror, analytics bị chặn trong kiểm thử.
- verify-heic-equivalence.cjs: hai HEIC mẫu chính thức của thư viện cho JPEG giống byte/SHA256 giữa bản Muse gốc và bản CSP.
- Video: liên kết TikTok công khai đã trả MP4; browser đọc được kích thước khung hình và tải file thật. Liên kết YouTube test không còn truy cập được trả lỗi đúng, không báo thành công.
- tests/free-tools-api.test.ts: cố định miễn phí, không chuyển credential, chặn paid/private URL, MIME và đuôi file, lỗi không lộ kỹ thuật, Range và route Worker.
- Kết quả máy đọc và ảnh trong docs/evidence/tet-storefront/free-tools* và heic-equivalence-results.json.

## Chạy kiểm tra

Dùng VINPRINT_PLAYWRIGHT_MODULE trỏ tới playwright-core nếu ngoài repo; VINPRINT_EVIDENCE_DIR chọn nơi lưu. PDF2trang và các HEIC chính thức cần nằm .preview/sample.pdf, sample.heic, sample-6.heic. Tạo PDF bằng jspdf; HEIC lấy demo/1.heic và demo/6.heic từ github.com/alexcorvi/heic2any, không đưa file khách vào test.

Bản production local: build trước, chạy scripts/preview-built-storefront.mjs trên127.0.0.1:4182 (ASSETS binding đọc dist/client + public), sau đó verify-free-tools-production.cjs. Đặt VINPRINT_HEIC_REFERENCE_MODULE tới heic2any.min.js gốc để đối chiếu. Dừng riêng harness4182 khi xong. Preview4181 giữ chạy để chủ duyệt.

Hoàn tác: revert commit tích hợp; không có migration nội dung hay thay cấu hình Muse. Merge main là xuất bản, cần duyệt đúng head. Sau khi xuất bản phải thử kết nối public Muse vì local kết nối localhost5000 không chứng minh đường mạng production.
