# SOP — VinPrint Web Operator

## Trạng thái và nguồn chuẩn

Yêu cầu của chủ website ngày 12/09/2026 thay thế pilot tự publish trước đây.
Repo: https://github.com/cdrvietnam-tech/vinprint. Cấu hình website ở
`.openai/hosting.json`; chưa khẳng định GitHub main tự triển khai sang vinprint.vn.
Runner không có quyền/nhánh lệnh ghi production. Bản nháp và báo cáo có thể tự cập nhật
trong phạm vi dưới đây; thêm quyền tự sửa website phải thành một rule riêng được duyệt.

## Ma trận quyền

| Việc | Quyền hiện tại | Điều kiện |
|---|---|---|
| GET website, robots, sitemap, link nội bộ | Tự làm | Đúng domain, không admin/API/form, ngân sách request |
| GSC/GA4 chỉ đọc | Tự làm sau khi kết nối | Đúng tài sản, OAuth readonly, không lưu token/log nhạy cảm |
| Log, báo cáo, backlog, draft nội bộ | Tự làm | Có nguồn, không tự đánh dấu approved/published |
| Sửa title/meta/H1/internal link trên website | Đề xuất và chuẩn bị diff | Hiện chưa có rule sản xuất cụ thể; duyệt trước khi merge |
| Canonical, robots, sitemap, schema | Cần duyệt | Rủi ro index hoặc claim; không coi là chỉnh kỹ thuật vô hại |
| Nội dung mới, xóa, 301, đổi URL, giá, claim, giao diện lớn | Cần duyệt | Duyệt gắn với exact head SHA và phạm vi |
| Deploy, merge, thay đổi policy/quyền | Cần duyệt | Người có thẩm quyền thao tác, đủ checks và rollback |
| Spam backlink, stuffing, doorway, review/traffic giả | Cấm | Không có ngoại lệ do KPI |

Rule ít rủi ro hiện có là tự tạo/cập nhật tài liệu vận hành nội bộ; không có live
auto-fix bật sẵn. Muốn thêm rule, ghi trigger, file/URL cho phép, giới hạn số mục,
điều kiện trước/sau, cách test, rollback, ngày duyệt và người duyệt. Mọi thao tác
không khớp allowlist đều bị chặn. Hàm policy_decision chỉ phân loại, không cấp quyền.

## Lịch và chu kỳ

Lịch Codex heartbeat: 08:30 hằng ngày giờ Việt Nam. Thứ Hai làm thêm báo cáo tuần,
lần đầu dự kiến 14/09/2026. Đọc state trước để không chạy trùng cùng ngày. Máy/ứng dụng
phải hoạt động và còn quyền truy cập; đây chưa phải dịch vụ server chạy 24/7.
Heartbeat dùng thư mục clone cụ thể được lưu trong cấu hình lịch, không tự chuyển
sang một main còn policy cũ. Chỉ nâng phiên bản sau khi đã xác minh PR được duyệt.

Chạy từ root repo, Python 3.11 trở lên, không cần package Python ngoài:

```
python agent/operator/test_operator.py
python agent/operator/audit.py --output work/web-operator
```

Mỗi lần audit: khóa chống chạy chồng → kiểm tra log → lấy robots/sitemap → crawl
có giới hạn → kiểm tra HTML/HTTP → PSI → Google đã kết nối → so sánh → ghi snapshot,
dashboard và log. Tối đa 90 trang, 160 request, khoảng nghỉ 0,3 giây, timeout 15 giây,
6 lần chuyển hướng. Khi gặp 429 dừng crawl website. Không vượt robots khi bị chặn.
Robots parser chuẩn Python là baseline; nếu xuất hiện wildcard/nhóm phức tạp hoặc
Cloudflare thay quy tắc, đối chiếu Googlebot rules bằng tay trước khi kết luận index.

Không thực thi JavaScript, không POST analytics, không bấm nút liên hệ để tạo số liệu.
Kết quả phản ánh HTML trả từ máy chủ, không thay cho kiểm tra trải nghiệm trình duyệt.
Link nội bộ từ thẻ a được kiểm tra; file ảnh/download, link có query và link ngoài
không nằm trong crawl mặc định. Thứ Hai kiểm tra nguồn bài viết bằng
`npm run content:audit:links`; ghi riêng link bị timeout/403 so với 404 thật.

## Diễn giải và ưu tiên

- 404 chỉ đáng chuyển hướng khi có trang thay thế cùng intent hoặc lịch sử giá trị;
  xem GSC/backlink/referral/server log trước. Không redirect tất cả URL về trang chủ.
- Canonical phải nhất quán với sitemap và internal links. Không dùng robots/noindex
  thay cho hợp nhất URL. HTTP 200, index/follow và sitemap không chứng minh đã index.
- So sánh title/meta/H1 và nội dung chính; hai URL có query chung chỉ là ứng viên
  cannibalization. Xem intent, thiết bị/quốc gia và biến động URL theo tuần trước quyết định.
- Score backlog = impact (1–5) × confidence (0–1) / effort (1–5); đây là ưu tiên
  định tính, không phải dự báo tiền/traffic. Mỗi mục ghi bằng chứng, chủ xử lý đề xuất,
  phụ thuộc, trạng thái, test và điều kiện hoàn thành. Tối đa ba ưu tiên tuần.
- NAP lấy từ hồ sơ được chủ website xác nhận. Không tự sửa tên phường, số điện thoại
  hay giờ làm theo nguồn thứ ba; đối chiếu website, schema, Facebook và Google Business.

## Dữ liệu hiệu quả

GSC: hai kỳ liên tiếp 28 ngày, chừa ba ngày cho dữ liệu hoàn chỉnh; query + page,
clicks, impressions, CTR và average position. Lọc cơ hội vị trí 4–20 và ≥30 impressions
là ngưỡng triage ban đầu, không phải mục tiêu tăng trưởng. Search Analytics bỏ query
ẩn danh và chỉ trả các hàng hàng đầu; không cộng hàng query thành tổng site.
URL Inspection lấy mẫu năm URL; báo rõ độ phủ, verdict, Google canonical và last crawl.

GA4: organic sessions, engaged sessions, key events theo landing page. Kiểm tra
timezone, event definitions, consent, thresholding và dữ liệu bị gộp. Zalo/phone click
là tín hiệu liên hệ, chưa phải đơn đã chốt. Không lấy Sapo doanh thu gán cho SEO nếu
chưa có cơ chế attribution hợp lệ. Không tính average position từ trung bình của
các trung bình; sử dụng số liệu cùng chiều hoặc weighted theo impressions.

CWV: phân biệt field URL với field origin và Lighthouse lab. Đọc p75 LCP/INP/CLS
và kỳ thu thập khi có CrUX. Mốc tốt: LCP ≤2,5s, INP ≤200ms, CLS ≤0,1. TBT lab không
phải INP. Lỗi PSI/quota hoặc thiếu mẫu = unavailable, không tự gán điểm.

## Draft và duyệt

Đối chiếu topical-map.json và inventory trước mỗi draft. Ưu tiên mở rộng trang đang
sở hữu intent; không tạo hàng loạt landing page theo địa phương. Draft phải có:
intent, target hiện có/đề xuất, nội dung hoàn chỉnh, title/meta/H1, link nguồn và
internal link, claim cần xác nhận, schema phù hợp chỉ khi có dữ liệu thật.
Giữ rubric 95 cho nội dung được chuyển vào hệ thống xuất bản; điểm không cấp quyền.

Approval packet: vấn đề và ảnh hưởng → URL/file trước/sau → exact PR head SHA →
kiểm thử → rủi ro → rollback đúng commit → hành động xin duyệt (merge/deploy/publish).
Agent không tạo approval comment thay chủ. Chủ admin tự ghi lệnh duyệt đúng SHA
trong PR; workflow hiện dùng comment, không tự coi review chung là duyệt triển khai.
Lệnh revoke đúng SHA hủy lần duyệt trước.
Commit mới khiến duyệt cũ không còn hiệu lực. Không dùng timeout/im lặng làm phê duyệt.

Workflow approval phải chạy từ base tin cậy, chỉ gọi API metadata, không checkout
hoặc thực thi code từ PR. Quality verification chạy riêng để hoàn thiện kiểm thử
trước lúc xin duyệt. Bật protected branch sau khi workflow vào main: yêu cầu PR và
cả quality + approval checks, chặn force push/delete, bỏ bypass. Trạng thái hiện tại
main chưa protected; khi chưa bật, đây không phải hàng rào cưỡng chế repo-wide.
Agent không tự bypass dù tài khoản kết nối có quyền admin.

## Log, lỗi và phục hồi

events.jsonl là append-only và hash chain; audit.json là bản mới nhất; history giữ
snapshot. Hash chain giúp phát hiện sửa giữa log, không chống được người có toàn
quyền viết lại toàn bộ log; dùng backup/WORM/CI artifact nếu cần mức bảo đảm cao hơn.
Log chỉ ghi timestamp, decision, config/report hash và kết quả; không token, cookie,
toàn văn hội thoại khách hoặc query riêng tư. private-google.json nằm trong work
được ignore; không đưa vào output chia sẻ công khai hoặc artifact GitHub công khai.

Mất quyền nguồn: báo lỗi một lần, giữ dữ liệu cũ kèm thời gian, không báo mọi thứ tốt.
Snapshot ít trang hơn không chứng minh lỗi cũ đã được khắc phục. Xác nhận lại lỗi mới
trước khi đề nghị thay website. Không lặp vô hạn sau timeout/429. Lock cũ: xem PID,
ghi recovery event rồi chỉ gỡ lock khi đã chắc tiến trình kết thúc.

Trước một lần triển khai được duyệt: lưu commit và cấu hình hiện tại, preview/test,
ghi người duyệt và phiên bản. Sau triển khai kiểm HTTP/canonical/render/conversion
không phát sinh lead giả. Nếu regression: dừng tự động, giữ log, trình rollback đúng
commit. Chỉ rollback tự động khi approval triển khai đã bao gồm chính rollback đó.

## Bàn giao

Agent tiếp theo đọc AGENTS.md → SKILL.md → CONNECTIONS.md → report mới nhất → backlog.
Giữ ID PR, head SHA, lịch, đường dẫn state và các việc chờ duyệt. Đồng bộ bằng fetch
và review diff; không reset/hard-delete local drafts. Lưu workflow và prompt trong repo;
lịch chạy Codex chỉ là cơ chế gọi lại, không phải nơi duy nhất giữ tri thức vận hành.

Nguồn kỹ thuật:
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/robots/intro
- https://developers.google.com/search/docs/appearance/core-web-vitals
- https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- https://developers.google.com/analytics/devguides/reporting/data/v1/basics
- https://developers.google.com/speed/docs/insights/v5/get-started
- https://learn.chatgpt.com/docs/automations?surface=app
