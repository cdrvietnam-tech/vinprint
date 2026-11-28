# Bộ ảnh phải kiểm bằng hình; quản trị phải thử sau khi tải dữ liệu
- Issue: https://github.com/cdrvietnam-tech/muse-aistudio/issues/144
- Triệu chứng: một số ảnh tạo lại thành dashboard hoặc cảnh quá rộng; thư viện quản trị vỡ khi URL có query, và trang mobile tràn ngang sau khi bộ sưu tập tải xong.
- Nguyên nhân gốc: prompt lấy từ trạng thái chung trong lượt tạo chưa hoàn tất, kèm ảnh tham chiếu cả dashboard làm sai phạm vi. Ảnh quản trị được đưa qua bộ tối ưu không nhận query. Input tải file `sr-only` đặt tuyệt đối theo trang vì nhãn thiếu containing block; các input trong dải cuộn đẩy chiều rộng tài liệu dù thẻ đã được cắt đúng.
- Sửa: dùng prompt đầy đủ và tham chiếu một ảnh sản phẩm đạt; loại bỏ ảnh sai bằng đối chiếu trực quan, giữ 1448×1086 khi mã hóa WebP. Ảnh quản trị xem trực tiếp `unoptimized`; nhãn trong admin có `position:relative`.
- Chặn bằng: `tests/product-theme.test.ts`, `tests/product-theme-api.test.ts`, `scripts/verify-theme-admin.cjs`. Kiểm URL ảnh, object-fit, tải/xóa/khôi phục, giữ metadata, sao lưu không ghi đè, quyền admin và chiều rộng 390px sau khi dữ liệu đã tải.
- Bằng chứng: `docs/evidence/tet-storefront/theme-admin-results.json` và ảnh quản trị. Trước sửa, doc.scrollWidth=3415 ở viewport390; sau sửa=390. Test API/ảnh đạt, không lỗi pageerror.
- Áp dụng chung cho: thay theme có bộ sưu tập lưu riêng trong R2; giao diện có input ẩn nằm trong vùng cuộn; tạo hàng loạt hình từ tham chiếu.
