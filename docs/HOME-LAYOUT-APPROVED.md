# Bố cục trang chủ đã duyệt — Issue164

Chủ duyệt ảnh demo bố cục, yêu cầu giữ thanh menu trên cùng như local cũ và giữ ảnh bìa đang có. Chỉ áp dụng local/PR nháp.

## Kết quả
- Header và hero giữ nguyên markup so với d72e46f sau chuẩn hóa xuống dòng; hero desktop vẫn244/90/1516/335.
- Sidebar7mục, dòng dịch vụ4mục (mobile2cột), bỏ banner bộ sưu tập trung gian và hàng điều hướng phụ.
- Bốn thẻ chất liệu lớn dùng ảnh theo demo: giấy/nhựa chống nước/trong/ánh kim. Có liên kết sản phẩm thật, ảnh được ghi minh họa AI.
- Năm ô công cụ nổi bật có ảnh minh họa chuyển động đúng demo; đủ9công cụ vẫn ở trang công cụ. Dừng khi ngoài viewport và khi reduced-motion.
- Giữ10lựa chọn chất liệu đầy đủ phía dưới, giá/quy trình/FAQ/liên hệ và dữ liệu quản trị. Mẫu Tết6mục và quảng cáo6mục vẫn truy cập được.
- Các trường banner cũ được gom vào phần lưu trữ trong quản trị, không xóa dữ liệu.

## Nghiệm thu
verify-home-layout-approved.cjs:1781/1536/768/390px, header/hero không đổi, không overflow, menu mobile, link sản phẩm/công cụ, quote.
verify-tool-motion.cjs:5scene, animation thật, pause offscreen, reduced-motion và link mobile.
verify-home-navigation.cjs: quảng cáo không mở quote ở cấp danh mục, dữ liệu media không đổi.
verify-storefront.cjs: báo giá/clipboard/validate/Zalo/file/bảng giá/FAQ/map, lưu quản trị thật trên local rồi phục hồi, ảnh không méo.
Build sạch, TypeScript, lint,45HTML/Facebook và63unit đạt. Bằng chứng: docs/evidence/tet-storefront/home-layout-v2.

## Build local trong môi trường hiện tại
Thư mục E đang thiếu quyền xóa artifact cũ từ tài khoản thực thi hiện tại. Source đã được sao chép theo các file Git sang vùng build được phép ghi, không sao chép .env hoặc credential; dùng cùng node_modules qua junction. Bản build sạch đã đạt.
Helper scripts/preview-built-storefront.mjs hỗ trợ VINPRINT_PREVIEW_BUILD_DIR để chọn artifact sạch. Mặc định vẫn dùng dist như trước; không đổi build/deploy production.
Thông tin Worker đang phục vụ nằm trong .preview/layout-review-processes.json. Chỉ thay đúng Worker4182, proxy4181 được giữ; không chạm Muse5000/watchdog/tunnel.

Chưa xuất bản. Bố cục mới thay phần trang chủ trong bản bàn giao d72e46f; cần duyệt lại head mới nếu xuất bản.
