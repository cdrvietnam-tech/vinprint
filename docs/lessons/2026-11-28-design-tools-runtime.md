# Tích hợp công cụ phải kiểm runtime và giao thức frame thật
- Issue: Muse169, PR34.
- CDR thất bại thật: API422 do thiếu executable chuyển vector, không phải do file hay parser. Bổ sung portable đã kiểm SHA vào đường dẫn Muse nhận động; API200 sau đó mà không restart server.
- PTS cảnh báo document.referrer is empty khi dùng no-referrer; đổi strict-origin-when-cross-origin và kiểm referrer chỉ có origin. Không cấp clipboard; chủ đã duyệt Photopea nhúng.
- Chặn bằng scripts/verify-design-tools.cjs: iframe handshake, mở/xuất lại PSD đối chiếu pixel PNG, CDR mẫu công khai chuyển/xem/tải thật, lỗi file giữ kết quả, mobile. Mock API chỉ dùng unit test cho lỗi/credential, không coi là nghiệm thu converter.
- Khi build lại phải nạp lại Worker trước test; port còn sống không chứng minh module đã nạp manifest mới. Build/server lệch nhau có thể gây nút không hydrate.

- Kiểm SVG qua fetch(blob:) trong script bị CSP connect-src chặn, dù ảnh và tải file vẫn được cho phép. Dùng chính nút tải SVG để kiểm nội dung xuất, không mở rộng CSP chỉ để test. Quản lý URL blob trong hành động đổi trang/file và giải phóng khi thay/unmount.
