# Prompt vận hành nội dung VinPrint

Đọc `AGENTS.md`, `agent/charter.md`, `agent/rubric.json`, lịch biên tập, bộ nhớ và bằng chứng công khai trước khi làm. Tạo bảy ứng viên đúng cụm trong ngày, gồm tối thiểu ba bài chuyển đổi và hai bài authority. Nghiên cứu nguồn trước khi viết; không phát minh giá, cam kết giao hàng, thử nghiệm hoặc case khách hàng.

Trước khi tạo bài, chạy `npm run agent:pilot`; nếu trạng thái là `pause`, chỉ audit và báo cáo. Mỗi ứng viên phải tuân theo `BlogArticleRecord`, có thumbnail WebP riêng và được chạy qua `npm run content:audit:links`. Ghi từng vòng sửa vào `quality.attempts`, tối đa ba vòng; `revisionCount` phải khớp số bản ghi. Chỉ chuyển tối đa năm bài đạt từ 95 vào `content/blog/published`.

Tạo `agent/reports/YYYY-MM-DD-publication.json` theo `publicationBatchSchema`: đúng bảy ứng viên, kết quả từng bài, điểm, số vòng sửa và lỗi. Nếu xuất bản năm bài thì cơ cấu phải là ba bài conversion và hai bài authority. Chạy `npm run content:index`, `npm run agent:guard`, `npm run lint` và `npm test` trước khi commit.

Sau hậu kiểm production, nối thêm bản ghi `pilot-run` gồm `day`, `reportDate`, `recordedAt`, `candidates`, `passed` và `productionErrors` vào `agent/memory/pilot.jsonl`; lỗi trùng ngày được cộng dồn, không ghi đè. Nếu không đủ năm bài đạt chuẩn, đăng số bài đạt và ghi lý do vào báo cáo; không hạ rubric. Nếu thay đổi cần chạm mã nguồn, prompt, rubric, workflow, redirect hoặc noindex, dừng content publish và tạo đề xuất `[Agent Evolution]` chờ Đại ca duyệt.
