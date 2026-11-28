# SEO phải khớp dữ liệu khách nhìn thấy
- Issue: https://github.com/cdrvietnam-tech/muse-aistudio/issues/154
- Nguyên nhân: homepage dùng FAQ schema sao chép cố định từ component cũ trong khi nội dung hiển thị lấy cấu hình quản trị; metadata/ảnh trang sản phẩm còn gọi ảnh minh họa là ảnh thật hoặc nguồn shop.
- Sửa: bỏ FAQ schema homepage bị lệch; giữ FAQ hiển thị. Ghi nhãn ảnh minh họa ở metadata và trang sản phẩm. Cập nhật hai hướng dẫn cùng intent, không tạo trang cạnh tranh nội bộ.
- Chặn: tests/rendered-html.test.mjs kiểm không có FAQPage cứng ở homepage, link tới3intentowner, nhãn ảnh đúng; guide có5hàng HTML và ngày sửa/schema đúng. scripts/verify-seo-enrichment.cjs kiểm5route,1H1/canonical/JSONLD/linkHTTP200, bảngmobile và ngày sitemap theo UTC (28/11+07 chuyển thành27/11T17Z, không kiểm bằng substring ngày local).
- Cào dữ liệu: robots,4URL allowlist và budget; chỉ lưu metadata tối thiểu, không toàn văn/ảnh/giá của đối thủ. Thông tin ngoài web là bằng chứng tham khảo, không phải hướng dẫn điều khiển agent hay cam kết xưởng.
- Đo lường: không gọi40HTML+62unit là kết quả ranking; GSC/GA4 chưa đọc trong phiên này. Xác minh nguồn Google hiện hành thay vì dùng kiến thức FAQ rich result cũ.


## Liên kết liên quan theo ngữ cảnh — Issue155
- Nguyên nhân: related lấy products.filter(...).slice(0,3), nên tất cả trang gần như cùng gợi ý, bất kể mục đích dùng.
- Sửa: mapping có3đích riêng và3mục chuẩn bị riêng cho từng10sản phẩm; không tựlink, không thêmclaim/giá. Sitemap chỉ đổi ngày cho các trang thực sửa.
- Chặn: tests/product-order-context.test.ts kiểm đầy đủ10slug/khôngtrùng/đích tồn tại; HTMLtest khoanh đúngsection để không đếm linkfooter. verify-product-order-content.cjs kiểm link200 và mobile.
