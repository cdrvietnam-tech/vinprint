# Kết nối và bàn giao — 12/09/2026

| Kết nối | Đã xác minh | Còn cần |
|---|---|---|
| Website công khai | GET vinprint.vn, robots, sitemap, crawl HTML thành công | Không cần thêm quyền audit công khai |
| GitHub | cdrvietnam-tech/vinprint; pull/push/admin qua connector; main ở 57b94cf25f61e8767aee00aef474393f1ee0e5e0 lúc bắt đầu | PR bộ operator cần chủ duyệt trước merge |
| Bảo vệ main | API branches/main trả protected=false ngày 12/09 | Bật required quality + approval checks sau khi tích hợp workflow; hiện chưa cưỡng chế |
| Sites | .openai/hosting.json trỏ appgprj_6a573dd68f9c8191abaad5e978559c5c; tài khoản owner; bản 6; URL vinprint-ai.cdrvietnam.chatgpt.site | Xác nhận đây có phải bản phục vụ domain vinprint.vn và mapping DNS/Worker; chưa deploy |
| Cloudflare/DNS | HTTP server header cloudflare; www không phân giải trong hai phép thử | Quyền xem DNS/routes/deployment history và xác nhận zone; quyền thay rule chỉ sau duyệt |
| Search Console | Chưa có property/credential đã xác minh | Property chính xác, quyền đọc performance/inspection qua tài khoản được cấp; không cần chủ chuyển mật khẩu |
| GA4 | Repo và HTML live đều có measurement ID công khai G-0XQZ3FCJN0/gtag; chưa có property/credential đọc dữ liệu | Numeric property ID ứng với measurement ID này, quyền Viewer và OAuth analytics.readonly; kiểm tra thực nhận events |
| PageSpeed/CrUX | API PSI mobile trả HTTP 429 | API key có quota hoặc report PSI/GSC CWV; chưa có điểm CWV |
| NAP | Website ghi Số 13, Đường Thạnh Lộc 42, An Phú Đồng, TP.HCM; 0844998499; T2–T7 09:00–17:30 | Chủ xác nhận bộ địa chỉ/điện thoại/giờ làm chuẩn và nguồn được phép |
| n8n Facebook | Workflow nhập tại `automation/n8n/vinprint-facebook-to-web.json`; Page ID khóa cứng 105514821740093; GitHub nhận qua `repository_dispatch` | Cần một máy chủ n8n, Page access token chỉ đọc, GitHub credential gửi dispatch và chạy thử trước khi bật Active |

## Nối Google sau khi có quyền

Điền gsc_property (ví dụ property domain phải dùng đúng ID do GSC trả về) và
ga4_property_id trong bản cấu hình riêng tại work. Cấp access token qua biến môi trường
VINPRINT_GOOGLE_ACCESS_TOKEN bằng OAuth với scopes webmasters.readonly và
analytics.readonly. Không paste token vào chat, config công khai hoặc commit.
Runner không tự mở màn hình đăng nhập hoặc lấy token từ trình duyệt.

Access token ngắn hạn cần cơ chế refresh an toàn trước khi coi kết nối chạy lâu dài.
Chưa triển khai token refresh vì chưa có danh tính/tài sản Google được chủ cấp.
Với service account, chủ cấp tài sản đúng phạm vi, lưu credential ở kho bí mật/runner
riêng; không thêm key vào GitHub công khai. Chỉ đọc Google API, không chỉnh tài sản.

VINPRINT_PSI_API_KEY là khóa riêng cho quota PageSpeed, không phải quyền GA4/GSC.
Không cần OpenAI API key cho runner: việc nghiên cứu/tạo draft do phiên Codex thực hiện.

Không tuyên bố đã kết nối chỉ vì đã viết adapter. Dữ liệu Google live, URL Inspection,
ranking, traffic và conversion còn chưa kiểm thử với tài sản thật.
