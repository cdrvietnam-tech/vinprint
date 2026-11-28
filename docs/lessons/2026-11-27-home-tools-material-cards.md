# Homepage cần ô công cụ và tín hiệu chất liệu để chọn nhanh
- Issue: https://github.com/cdrvietnam-tech/muse-aistudio/issues/147
- Phản hồi: công cụ chỉ có một CTA chung; danh mục tem dạng hàng dài chưa phù hợp giao diện mới.
- Nguyên nhân gốc: homepage giấu các tiện ích sau trang hub và mô tả sản phẩm bằng danh sách chữ, chưa giúp phân biệt hiệu ứng chất liệu khi chọn tem.
- Sửa: chín ô công cụ lấy từ cùng freeTools, deep link ?tool đúng id; đặt ngay sau nhóm sản phẩm Tết. Mười thẻ lấy dữ liệu sản phẩm hiện có, thêm mẫu đồ họa giấy/trong/bạc/vàng/hologram và ứng dụng, không tái sử dụng ảnh sản phẩm ở nhiều khối. Giữ giá và URL.
- Chặn: scripts/verify-home-tools-layout.cjs mở đủ9 đích, kiểm10 thẻ/0 ảnh lặp trong danh mục, báo giá đúng chất liệu, khung hero335 và không tràn ở1781/1366/768/390. scripts/verify-home-navigation.cjs kiểm9ảnh/9nguồn toàn trang và bộ sưu tập không thay đổi.
- Bằng chứng: docs/evidence/tet-storefront/home-tools-layout-results.json, home-tools-desktop.png, material-cards-desktop.png. Ảnh chụp component tạm ẩn thanh điều hướng cố định/skip-link trong thao tác screenshot để không chồng lên ảnh dài; giao diện thật không bị đổi.
- Áp dụng chung: trang dịch vụ cần làm rõ lựa chọn trước khi mở form; có trang hub không thay thế khả năng khám phá công cụ từ homepage.

## Minh họa động chức năng — Issue148
Chín ô có cảnh SVG/CSS riêng, không chỉ lắc/phóng icon. Không dùng ảnh chụp tĩnh để kết luận có chuyển động: verify-tool-motion.cjs đo transform ở hai thời điểm, kiểm nhiều animation chạy, pause ngoài viewport và chế độ reduced motion, rồi bấm đúng ứng dụng trên390px. Ghi video yêu cầu binary ffmpeg của Playwright; khi môi trường không có, dùng đo trạng thái thực và hai khung hình, không cài phần mềm chỉ để làm bằng chứng. Minh họa không gọi API xử lý và không tạo tác vụ nền trên Muse.

## Chủ từ chối khối thẻ chất liệu — Issue149
- Kết quả chức năng đạt không chứng minh thiết kế đã được chủ duyệt. Các hình tem CSS quá nhỏ và lặp cấu trúc, cả khối10thẻ vẫn dài và khó phân biệt chất liệu.
- Bản thay: MaterialExplorer dùng một ảnh bộ mẫu riêng, 10tab và chỉ một chi tiết hiện; giá/ứng dụng lấy từ cùng products. Ảnh là minh họa, không coi là mẫu in thật đã sản xuất.
- Không tái sử dụng class vp-catalog-item cho tabpanel: quy tắc anchor ảnh cũ có aspect-ratio4/3 làm link cuối thành khoảng trắng lớn. Dùng class riêng và kiểm chiều cao khối trong browser. Không xóa CSS theo vị trí media query đầu tiên vì có thể cắt mất phần giá/FAQ phía sau; giữ stylesheet chung, đặt CSS mới theo component.
- Kiểm thử: cuộn đúng img lazy vào viewport rồi chờ naturalWidth với timeout; decode() trước lúc lazy request bắt đầu có thể chờ vô hạn. Khi chụp mobile phải chờ sidebar kết thúc transition.
- scripts/verify-material-explorer.cjs kiểm10tab/1panel, chọn đủ10loại, keyboard Home/End/Arrow, báo giá, tỷ lệ ảnh và4viewport. Nghiệm thu thẩm mỹ vẫn cần chủ xem bản local.


## Mẫu ảnh được chốt — Issue150
- Khi chủ yêu cầu xem ảnh trước, không áp dụng thêm phương án local trước khi chủ chọn rõ. Chủ đã chọn MẪU 1, không phải ảnh cuối trong nhóm.
- Dựng đúng một thẻ lớn + sáu ảnh nhỏ + ba liên kết. Xóa khối hot khỏi homepage, giữ dữ liệu admin.
- CSS header toàn trang áp position fixed lên header của component ở mobile. Đổi wrapper thành div có class riêng; verify-approved-catalog.cjs chặn bằng assert đáy tiêu đề nằm trước đầu ảnh trên cả ba viewport phụ. Ảnh chụp390px xác minh thực tế.


## Đồng bộ theme — Issue151
- Chủ phản hồi đúng bố cục nhưng khối tem vẫn khác theme: tiêu đề đen42px, vạch vàng và viền nâu được sao chép độc lập từ ảnh demo. Mẫu duyệt xác định bố cục/ảnh; phần chữ, nút và viền cần dùng hệ màu và thang chữ trang hiện có.
- Sửa sang token --red/--ink/--line, tiêu đề24px (mobile20px), nền hồng kem, thẻ trắng và nút đỏ bo tròn; giữ ảnh và bố cục mẫu1.
- verify-approved-catalog.cjs kiểm màu tiêu đề bằng đỏ theme, cỡ tối đa24px, bỏ vạch trái, cùng kiểm4viewport/10URL/báo giá. Ảnh desktop/mobile được xem trực tiếp trước khi báo cáo.


## Khối công cụ — Issue152
- Phản hồi chưa đẹp: nhãn vàng/nền nâu và các hàng link không có hành động rõ khiến khối tiện ích thiếu đồng bộ. Chỉnh lại thành9thẻ có preview, tên/mô tả và hàng nhóm/Mở công cụ; dùng cùng nền hồng kem, viền hồng, chữ đỏ của theme. Giữ9scene động và deep link.
- Chặn bằng verify-home-tools-layout.cjs:9CTA/9đích,4viewport và hero không đổi; verify-tool-motion.cjs kiểm animation, pause ngoài viewport, reduced motion. Chờ sidebar đóng trước screenshot mobile; điều kiện scrollWidth không đủ vì sidebar đang transform.
