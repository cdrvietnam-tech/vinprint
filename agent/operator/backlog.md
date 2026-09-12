# Backlog ưu tiên — 12/09/2026

Điểm = impact × confidence / effort. Impact/effort 1–5 là đánh giá vận hành,
không phải lượng traffic hoặc doanh thu dự kiến. Tất cả là proposed, chưa đã sửa.

| ID | Việc và bằng chứng | I / C / E → điểm | Điều kiện hoàn thành | Quyền/phụ thuộc |
|---|---|---|---|---|
| VWO-01 | HTTP homepage trả 200, không Location ở hai phép GET độc lập | 5 / 1 / 1 → 5 | HTTP → HTTPS một bước, giữ path/query, HTTPS ổn định | Duyệt rule hosting; xác nhận Cloudflare zone |
| VWO-02 | Main protected=false; quy tắc cũ tự publish | 5 / 1 / 2 → 2,5 | PR operator duyệt, merge; required quality + approval checks và chặn bypass | Chủ repo duyệt; không tự coi workflow chưa merge là active |
| VWO-03 | Chưa có GSC/GA4; chưa có baseline traffic/conversion | 5 / 1 / 2 → 2,5 | Hai kỳ 28 ngày, kiểm định dữ liệu, opportunity/query-page và key-event baseline | Property + readonly access, refresh credential riêng |
| VWO-04 | www trả lỗi DNS từ Node và Python | 3 / 0,8 / 1 → 2,4 | Xác minh DNS từ nguồn khác; nếu chọn hỗ trợ www thì TLS + redirect một bước | Duyệt DNS/redirect; không tự tạo record |
| VWO-05 | NAP website chưa được chủ xác nhận là nguồn chuẩn | 4 / 1 / 1 → 4 | Chủ chốt NAP; website/schema/Facebook/GBP được đối chiếu | Thông tin chủ xác nhận, quyền xem GBP nếu có |
| VWO-06 | /shop/ và /about-us-3/ hiện 404, không nằm trong sitemap, chưa thấy link nội bộ | 2 / 0,8 / 2 → 0,8 | Xem traffic/link cũ rồi giữ 404 hoặc đề xuất mapping cùng intent | Chưa tự 301; cần GSC hoặc server/referral logs |
| VWO-07 | PSI mobile HTTP 429; chưa có CWV | 4 / 1 / 2 → 2 | Có CrUX URL/origin p75 và lab tách riêng, đo mobile các mẫu trang | PSI quota/API key hoặc báo cáo GSC CWV |
| VWO-08 | Guide/blog chọn kích thước có chủ đề gần nhau | 3 / 0,6 / 2 → 0,9 | So sánh query-page và nội dung, xác định vai trò mỗi URL | Đây là ứng viên chồng intent, chưa chứng minh cannibalization |
| VWO-09 | Nội dung tem đồ uống có trang ngành và bài hướng dẫn sẵn | 3 / 0,6 / 2 → 0,9 | Duyệt draft cập nhật /nganh/do-uong, kiểm internal links và chuyển đổi sau đổi | Không tạo landing mới trùng intent |
| VWO-10 | Schema có tọa độ cố định trong khi liên kết Maps đã dùng truy vấn địa chỉ mới | 3 / 0,7 / 1 → 2,1 | Chủ xác nhận vị trí xưởng và pin Maps khớp NAP; chỉ chỉnh geo sau xác nhận | Chưa khẳng định tọa độ sai; không tự đổi claim địa điểm |

Ba ưu tiên tuần đầu: HTTPS; phê duyệt/bảo vệ repo; nối đo lường và chốt NAP.
Sau khi có dữ liệu, chọn tối đa ba query/page có cơ hội đã quan sát, cập nhật tại chỗ,
so sánh với 28 ngày trước và ghi rõ chưa thể tách tác động SEO khỏi mùa vụ/quảng cáo.

Không có thay đổi giá, claim hay giao diện trong gói triển khai operator.
