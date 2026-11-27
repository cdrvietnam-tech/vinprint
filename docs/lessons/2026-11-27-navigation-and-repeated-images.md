# Điều hướng danh mục không được mở báo giá; chọn ảnh theo toàn trang
- Issue: https://github.com/cdrvietnam-tech/muse-aistudio/issues/145
- Triệu chứng: bấm Ấn phẩm quảng cáo bật form báo giá; trang chủ dùng lại cùng ảnh ở nhiều khối.
- Nguyên nhân gốc: dùng action báo giá thay cho navigation danh mục khi chưa có trang đích; từng khối render toàn bộ dữ liệu riêng nên không kiểm tra nguồn ảnh trùng giữa các khối.
- Sửa: tab print hiển thị sáu loại ấn phẩm; chỉ CTA cụ thể mở báo giá. featuredImage chọn sáu nguồn riêng; selectHomepageMedia dùng chung tập nguồn đã xuất hiện, bỏ query/hash trước đối chiếu. Danh mục 10 loại tem hiển thị dạng gọn; kho mẫu giữ đích điều hướng và thư viện đầy đủ. Không xóa hay ghi lại media để giải quyết lỗi trình bày.
- Chặn bằng: tests/storefront-navigation.test.ts và scripts/verify-home-navigation.cjs. Test đỏ trước sửa vì chưa có mô hình danh mục/chọn ảnh; sau sửa cả hai test đạt. Browser kiểm không có dialog khi bấm danh mục, In brochure mở đúng sản phẩm, 9 ảnh/9 nguồn duy nhất, mobile390 và media trước/sau bằng nhau.
- Bằng chứng: docs/evidence/tet-storefront/home-navigation-results.json, advertising-category.png và home-refined-full.png.
- Áp dụng chung cho: website có nhiều nhóm ảnh dùng chung bộ sưu tập; phân biệt tab điều hướng với CTA tạo yêu cầu.
