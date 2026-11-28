# Đối chiếu đối thủ và cải tiến SEO/GEO VinPrint

Ngày khảo sát: 28/11/2026. Phạm vi: bốn URL công khai, không phải điều tra toàn thị trường hay bằng chứng thứ hạng. Script `scripts/research-print-competitors.py` kiểm robots.txt, giới hạn bốn trang, không theo link, tải ảnh, gửi form hoặc lưu toàn văn. Bốn trang đều trả HTTP200; biên nhận tại `docs/evidence/tet-storefront/competitor-metadata-summary.json`.

| Nguồn trực tiếp | Điều quan sát được | Khoảng trống cần bù ở VinPrint |
|---|---|---|
| [Print Fast](https://fasto.vn/vi/dich-vu-in-tem-nhan-decal) | Giá được chia theo vật liệu, số lượng và kích thước | Dẫn khách tới bài giải thích quy cách/giá đã có, không nhập bảng giá đối thủ |
| [HONO](https://inanhono.com/in-tem-nhan/) | Giải thích chất liệu, file và rủi ro in | Hướng dẫn chọn theo môi trường, thử trên bao bì thật; không kế thừa số liệu lỗi, thiết bị hay thời gian của họ |
| [Thế Giới In Ấn](https://thegioiinan.com/sanpham/in-nhan-decal-uv-dtf-nhan-decal-uv-noi-tem-nhan-uv-dtf.html) | Trang UV DTF có đường dẫn tới lưu ý file, giao nhận và quy trình | Nối hướng dẫn/kỹ thuật với trang sản phẩm, nêu giới hạn bề mặt thay vì cam kết dán mọi vật |
| [In Đại Việt](https://indaiviet.com/san-pham/in-decal/) | Tách nội dung giấy, nhựa và câu hỏi so sánh | Bảng so sánh HTML giúp khách xem cùng một bộ tiêu chí |

Các nhận xét trên là phân tích biên tập; không xác minh độc lập giá, năng lực hay claim của đối thủ. Không sao chép bài, ảnh, đánh giá, thông tin doanh nghiệp hoặc số liệu của họ sang VinPrint.

## Đã chuẩn bị trên local

- `/huong-dan/chon-chat-lieu-tem`: bảng HTML năm nhóm vật liệu, nhu cầu và điểm cần thử; quy trình thử độ bám. Liên kết đến bốn trang sản phẩm hiện có.
- `/huong-dan/ky-thuat-in-tem`: phân biệt bế demi/cắt rời theo cách bóc và giao thành phẩm. Dẫn tới sticker và checklist file.
- Trang chủ: dẫn tới trang so sánh, bài chuẩn bị file và bài giải thích giá đang có. Không thêm URL trùng intent với topical map.
- Metadata và trang sản phẩm ghi đúng ảnh minh họa. Không dùng hình AI như bằng chứng đơn hàng thật.
- Bỏ FAQPage ghi cứng ở homepage vì không lấy dữ liệu đang hiển thị từ quản trị, chứa cam kết tuyệt đối. Giữ FAQ hiển thị và các schema khác. FAQ ở trang hướng dẫn/sản phẩm vẫn khớp dữ liệu nguồn của chính trang đó; không coi FAQ schema là đòn bẩy rich result.
- Ngày cập nhật chỉ đổi trên hai trang có sửa nội dung, hiển thị cùng `dateModified` và sitemap hiện có. Không đổi canonical, robots, URL, giá hoặc NAP.

Đây là nội dung nguyên bản và diff local chờ chủ xem, chưa xuất bản. Cơ sở chính thức và giới hạn GEO ở [SEO-GEO-OFFICIAL-SOURCES.md](SEO-GEO-OFFICIAL-SOURCES.md). Google yêu cầu nền tảng SEO, nội dung văn bản hữu ích và schema khớp; không có schema AI đặc biệt. [Nguồn Google](https://developers.google.com/search/docs/appearance/ai-features).

## Điều cần làm tiếp sau duyệt xuất bản

1. Đối chiếu địa chỉ/phường và vị trí bản đồ thật trên web, trang liên hệ, schema và Business Profile. Repo còn dữ liệu NAP khác cách viết và tọa độ lịch sử; chưa đủ căn cứ tự thay bằng phỏng đoán.
2. Dùng ảnh xưởng, mẫu in và quy trình thực có quyền công khai để bổ sung bằng chứng chuyên môn. Không lấy ảnh của đối thủ.
3. Kết nối quyền đọc Search Console/GA4 đúng tài sản để lưu baseline theo URL và nhóm truy vấn. Phiên này không có công cụ Google đã xác thực để đọc báo cáo; không suy ra traffic/index/thứ hạng từ sitemap hoặc tìm kiếm công khai.
4. So sánh các kỳ 28 ngày về impression/click/CTR/position và hành động liên hệ; ghi ảnh hưởng mùa Tết, quảng cáo, thay đổi web. Theo dõi trích dẫn AI riêng khi báo cáo thực có sẵn, không xem đó là đơn hàng.

## Nguồn chuẩn và kiểm soát xuất bản

Đã đọc homepage production và remote main `b866cad58aeedc3969533476aa1c3cd6aa23bef2`. Production vẫn giao diện cũ, khác preview Tết là điều đã biết. API GitHub deployments không trả deployment gần nhất; chưa xác minh commit Cloudflare đang phục vụ, không gọi đây là active-deployment SHA. Không merge/deploy trong tác vụ này; PR33 chứa toàn bộ bản Tết và thay đổi SEO để duyệt cùng nhau.

Không cam kết top Google, index, traffic hoặc được AI trích dẫn. Không dùng backlink spam, nhồi từ khóa, địa điểm giả, đánh giá giả hay sinh hàng loạt trang cùng ý định tìm kiếm.
