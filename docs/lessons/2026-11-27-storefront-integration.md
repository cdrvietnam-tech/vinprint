# CSS giao diện mới và schema nội dung phải tương thích dữ liệu cũ
- Issue: https://github.com/cdrvietnam-tech/muse-aistudio/issues/143
- Triệu chứng: nav điện thoại chồng vị trí vì CSS .nav cũ; nút/link đổi màu do độ ưu tiên :is(button,a.vp-action). Thêm field bắt buộc vào schema còn có nguy cơ khiến nội dung R2 cũ bị trả {}.
- Nguyên nhân gốc: scope CSS chỉ chống ghi ra ngoài, không tự xóa thuộc tính nhận từ class toàn cục; :is dùng specificity nhánh mạnh nhất. Validator dùng toàn bộ schema mới cho nội dung đã lưu.
- Sửa: nav dùng vp-nav; nhóm button/link dùng :where để không tăng specificity; seasonal tetHome tách riêng và chỉ bổ sung mặc định field mới khi xác thực dữ liệu legacy.
- Chặn: tests/storefront.test.ts, tests/site-content-api.test.ts kiểm dữ liệu cũ qua worker; scripts/verify-storefront.cjs bấm menu mobile thật và lưu API local rồi kiểm giữ pricing.
- Kiểm chứng: bản lỗi menu từng bị link cuối chặn bấm; bản sửa thao tác thành công. Toàn bộ HTML/API và browser checks được ghi trong evidence.
- Áp dụng cho: chuyển demo độc lập vào ứng dụng có CSS và nội dung quản trị đang hoạt động.
