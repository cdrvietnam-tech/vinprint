# PTS online và đọc CDR — Muse169 / PR34

## Sử dụng
- Trang chủ có thêm hai ô động PTS online và Đọc file CDR. Hub /cong-cu-mien-phi có tổng11công cụ; link trực tiếp ?tool=pts và ?tool=cdr.
- PTS: bấm Mở trình biên tập, chọn ảnh/PSD/PSB/SVG/PDF tối đa60MB, sửa theo lớp, tải PNG hoặc PSD. Có tạo file mới, toàn màn hình và tải lại. Photopea chỉ được nạp khi bấm mở, không cấp clipboard.
- Chủ đã cho phép khung Photopea và việc mở file do chủ động chọn qua câu hỏi trong chat. Không tự tải file khách vào frame. Kiểm origin và source của postMessage; chỉ nhận ArrayBuffer khi đang chờ xuất, kiểm chữ ký PNG/PSD. API chính thức: https://www.photopea.com/api/live và /api/environment. Khung bên ngoài có thể có quảng cáo/tùy chọn riêng; không tắt/bypass các điều kiện của họ.
- CDR: chọn file tối đa30MB, nội dung giải nén tối đa80MB; thư viện Muse tách các trang ZIP hiện đại khi đọc được metadata, tối đa20trang. Chuyển từng trang theo yêu cầu và cache kết quả trong phiên. Định dạng cũ chưa xác định tổng trang được ghi rõ, không tạo trang giả từ thumbnail.
- Vector qua /api/free-tools/cdr → /api/cdr/import-vector của Muse. Không chuyển token/cookie, không có tùy chọn thu Xu. SVG được lọc DOMPurify, bỏ tham chiếu ngoài trước xem/tải. Có zoom, SVG tải về và ảnh preview nhúng đối chiếu nếu có.
- CDR chuyển thành SVG có thể thay đổi font, hiệu ứng và bố cục; không cam kết giữ dữ liệu chỉnh sửa Corel hay toàn bộ phiên bản. Ảnh preview nhúng là bitmap, không thay cho bản vector và không dùng làm bản in.

## Thành phần máy chủ được bổ sung
API Muse ban đầu trả422: chưa có executable chuyển vector. Đã tải archive portable Inkscape1.4.4 từ https://media.inkscape.org/dl/resources/file/inkscape-1.4.4_2026-05-05_dcaf3e7-x64_mHK170m.7z, đối chiếu SHA256 c4dbd64a92628abe7d7316c43f9325396e4d48417866027ee3d993d4f5b54c6a với manifest ScoopInstaller/Extras và nguồn phát hành chính thức. Bản GPL-3.0-or-later.
Windows không cho ghi Program Files; không có cài đặt dở dang tại đó. Đã giải nén vào C:/Users/Admin/AppData/Local/MuseTools/inkscape/inkscape, đúng đường dẫn Muse hỗ trợ sẵn. Không sửa code/cấu hình hoặc restart server Muse. API CDR sau đó trả200, SVG1757ký tự trên mẫu công khai. Thư mục cài không nằm trong Git.

## Nghiệm thu
- Bảy ô động homepage đủ đích, có pause ngoài viewport/reduced-motion, 4viewport đạt; menu gọn giữ nguyên.
- Build, TypeScript, ESLint;70unit/API,45HTML/Facebook và6operator đạt.
- scripts/verify-design-tools.cjs:11ô trong hub,7ô trang chủ; Photopea handshake thật, mở ảnh, xuất PNG/PSD, mở lại PSD và xuất PNG có pixel giống bản đầu; không clipboard. CDR chuyển mẫu thật qua Muse, hiển thị635×898, zoom125%, tải SVG, mobile390, chọn file hỏng vẫn giữ bản vẽ trước. Không pageerror. Kiểm riêng SVG có gradient dùng dấu nháy giữ đúng, script/ảnh ngoài bị loại; mẫu độc hại chỉ dùng cho kiểm tra sanitizer, không tính là chuyển CDR thật.
- Mẫu CDR công khai từ LibreOffice/core: writerperfect/qa/unit/data/draw/libcdr/pass/fdo65220-2.cdr (https://github.com/LibreOffice/core/tree/master/writerperfect/qa/unit/data/draw/libcdr/pass). Không dùng dữ liệu khách. Mẫu là định dạng cũ, tổng số trang chưa xác định; không dùng nó để khẳng định mọi phiên bản/font CDR đều chính xác.
- Ảnh và JSON: docs/evidence/tet-storefront/design-tools. File xuất dùng để kiểm thử được giữ riêng trong .preview, không đăng kèm như mẫu thiết kế của VinPrint.
- Đã sửa nhãn tiêu đề mobile bị ép hẹp và cảnh báo referrer rỗng trong editor: gửi origin bằng strict-origin-when-cross-origin, không gửi đường dẫn trang/file qua referrer. CSP chỉ bổ sung https://www.photopea.com vào frame-src.

Giữ bản sửa sidebar của Muse168 trong cùng PR34. Chỉ local/PR, chưa merge/deploy head mới. Website thật vẫn là PR33; proxy công cụ production còn Muse167, không lấy kiểm tra local làm bằng chứng production.
Hoàn tác: revert commit tích hợp; bản portable là dependency máy chủ riêng, không tự xóa nếu Muse còn sử dụng.
