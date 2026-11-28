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


## Trang sản phẩm chưa đẹp — Issue156
- Chủ từ chối thẩm mỹ trang UV DTF. Nguyên nhân: bổ sung SEO trong template chi tiết cũ (khối tím lớn/chữ display quá to/header cũ), không bảo đảm cùng hệ giao diện Tết của homepage. HTML/link pass không thay thế nghiệm thu hình ảnh.
- Theo yêu cầu xem demo trước đã có trong phiên: tạo ảnh đề xuất mới với sidebar/header đỏ/hồng, ảnh trái/thông tin phải, checklist3cột và quy trìnhngắn; chưa sửa layout local.
- Ảnh demo: C:/Users/Admin/.codex/generated_images/01a21d35-bbb2-7981-8522-5bc64ec2d532/exec-9a1770b2-becc-431c-89b2-2fe3fba9c0a1.png. Đợi chủ chọn trước khi code giao diện; ảnh demo không phải screenshot local hoặc bằng chứng chức năng. Khi triển khai phải giữ toàn bộ nội dung hữu ích, nhãn ảnh minh họa, giá thực và test1440/390.


## Áp dụng demo sản phẩm đã duyệt — Issue156
- Chủ đã trả lời duyệt cho ảnh exec-9a1770b2-becc-431c-89b2-2fe3fba9c0a1.png; quyền này là triển khai local, không phải merge/deploy.
- ProductDetail dùng cùng sidebar/header/tokens với storefront; ảnh trái/thông tin phải, checklist3cột, quytrìnhngắn, relatedcóảnh; giữ nội dung hướng dẫn/FAQ/schema/giá và10mapping. CSS có scope vp-product-storefront, không dùng header trongsection để tránh CSSsticky/fixed.
- Nút Nhận báo giá mởdialog đúngsảnphẩm, dựngnộidung và clipboard, khách tựgửiZalo. Kiểm clipboard Windows phải chuẩn hóa CRLF khi đối chiếu.
- Sidebar advertising mang query danh-muc=print; homepage đồng bộquery sauframe và cócancelcleanup, tránh setState trực tiếp trongeffect bịlintchặn. Browser kiểm6ấnphẩm và không mởdialogngoàiýmuốn.
- scripts/verify-approved-product-design.cjs kiểm4viewport,hero2cột/đỏtheme/giá, báo giá/clipboard/Escape và menuadvertising; verify-product-order-content.cjs kiểm10trang. Ảnh screenshot chỉ ẩn nextjs-portal làwidgetdev, không đổiUIkhách.


## Danh mục và khung dùng chung — Issue157
- Trang catalog cònbanner tím dùproductđãđổitheme vì dùngtemplateHeader riêng. Tách StorefrontFrame dùngchung vớiProductDetail, giữnguyênluồngquote đãkiểmtra.
- RenderpropopenQuote khôngđọcref khi render: openQuote chỉđổistate, effect đồngbộshowModal, nativeonClose đặtstatefalse. Lintreact-hooks/refs bắtcallbackđọcref bịđưa qua renderprop.
- Slugrỗng trêncatalog khôngđược so href.endsWith(slug) vìmọilinkđềuđúng. isCurrent kiểmriêng /san-pham; browserassert đúng1aria-current.
- Browser kiểm10cards/10routes, nhómfilterkhôngmởquote, searchkhôngdấu/0result/reset,3nhóminấn,4viewport, mobilemenu vàquote. SSRtest xácminh10cards+3nhóm cótrongHTMLkhôngcầnJS.
