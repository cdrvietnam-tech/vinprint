# Đồng bộ Facebook sang vinprint.vn bằng n8n

Workflow `vinprint-facebook-to-web.json` chạy hoàn toàn theo quy tắc cố định, không có node OpenAI, ChatGPT hay mô hình AI. Mỗi ngày lúc 08:30 giờ Việt Nam, workflow đọc tối đa 20 bài gần nhất của Page ID `105514821740093`, chọn tối đa hai bài chưa từng chuyển, rồi gửi một `repository_dispatch` sang GitHub.

GitHub kiểm tra lại nguồn, giới hạn số bài, post ID, caption, permalink và miền ảnh. Ảnh được tải từ Facebook CDN, chuyển sang WebP và nội dung được đưa vào trang `/mau-tem-moi`. Hệ thống chạy lint, build và tests rồi mới tạo PR `[Agent Evolution]`. Main và Cloudflare không bị ghi trực tiếp.

## Cài một lần

1. Dùng n8n Cloud hoặc một máy chủ n8n riêng. Cloudflare Worker đang phục vụ vinprint.vn không thể chạy n8n lâu dài.
2. Import `vinprint-facebook-to-web.json` vào n8n.
3. Tạo credential HTTP Header Auth tên `Facebook Page Access Token`, header là `Authorization`, value là `Bearer <PAGE_ACCESS_TOKEN>`. Token phải chỉ có quyền đọc dữ liệu cần thiết của fanpage do anh quản lý. Không ghi token vào workflow hoặc GitHub.
4. Tạo fine-grained GitHub token cho riêng repository `cdrvietnam-tech/vinprint`, với `Contents: Read and write` và `Pull requests: Read and write`. Lưu token vào credential n8n tên `GitHub VinPrint` và đồng thời lưu trong GitHub Actions secret tên `VINPRINT_AUTOMATION_PAT`. Action dùng token này để PR mới kích hoạt đầy đủ quality/approval checks; token mặc định của GitHub Actions không bảo đảm tạo chuỗi workflow tiếp theo.
5. Trong repository Settings > Actions > General, cho phép GitHub Actions tạo pull request nếu tổ chức đang tắt quyền này.
6. Workflow đang khóa Graph API `v25.0`. Khi Meta ngừng hỗ trợ phiên bản này, cập nhật URL của node `Lấy bài fanpage` sang phiên bản còn hiệu lực và chạy thử lại trước khi bật lịch.
7. Mở từng node credential và chọn đúng credential vừa tạo. Chạy thử thủ công với một bài đã biết, kiểm tra GitHub Actions tạo PR đúng. Sau khi thử đạt, bật Active.

Việc tạo credential hoặc token là bước cấp quyền truy cập lâu dài nên chủ tài khoản thực hiện trực tiếp trong Meta, GitHub và n8n. Không gửi token qua chat.

## Quy tắc an toàn

- Chỉ nhận Page ID đã khóa cứng trong workflow và script.
- Mỗi lượt tối đa hai bài có caption, ảnh và permalink Facebook.
- Chống trùng bằng post ID trong n8n và bằng post ID + SHA-256 trong repository.
- Ảnh chỉ được tải qua HTTPS từ Facebook hoặc Facebook CDN, tối đa 12 MB.
- Caption được xử lý như văn bản; không thực thi HTML, lệnh hoặc nội dung từ bài đăng.
- Không đọc inbox, bình luận, dữ liệu khách, Sapo hoặc credential.
- Không tự sửa giá, trang sản phẩm, URL, redirect, robots, sitemap ngoài mục trang tổng hợp đã duyệt.
- Mọi gói hiện vẫn qua PR và cổng duyệt đúng head SHA. Muốn tự merge sau checks cần một thay đổi policy riêng được duyệt.

## Khôi phục

Tắt Active trong n8n để dừng lượt mới. Nếu một PR có nội dung sai, đóng PR và giữ post ID trong lịch sử n8n hoặc thêm ID vào `seenPostIds`; website production không đổi trước khi PR được merge. Nếu nội dung đã merge, tạo PR hoàn tác đúng commit theo SOP của VinPrint Web Operator.
