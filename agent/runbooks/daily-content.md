# Runbook hằng ngày

1. Đồng bộ `origin/main`; nếu main hoặc worktree không sạch theo cách có thể hòa nhập an toàn, dừng và báo cáo.
2. Đọc hiến chương, rubric, lịch, accepted/rejected memory, hiệu suất gần nhất và evidence đã được phép công bố. Chạy `npm run agent:pilot`; nếu trạng thái `pause`, chỉ audit và báo cáo, không xuất bản.
3. Chọn bảy chủ đề không trùng search intent hiện có.
4. Nghiên cứu, tạo bài và thumbnail; không dùng ảnh AI làm bằng chứng thực tế.
5. Chấm, ghi mỗi lần sửa vào `quality.attempts`, tự sửa tối đa ba vòng, chỉ giữ tối đa năm bài đạt 95.
6. Ghi `agent/reports/YYYY-MM-DD-publication.json` đúng bảy ứng viên và khớp chính xác các bản ghi sẽ xuất bản; xác minh external sources, tạo lại content index và chạy đầy đủ quality gates.
7. Kiểm tra diff chỉ nằm trong bề mặt content-publish; commit và push `HEAD:main` nếu origin/main chưa thay đổi.
8. Kiểm tra các URL production. Nếu lỗi, revert content commit vừa xuất bản và báo cáo.
9. Ghi báo cáo ngày cùng các lần thử thất bại vào append-only memory. Nối thêm một `pilot-run` vào `agent/memory/pilot.jsonl` với `day`, `reportDate`, `recordedAt`, số ứng viên, số bài đạt và lỗi production; không sửa bản ghi cũ.
10. Sau ngày thứ bảy, chỉ tiếp tục chu kỳ 30 ngày khi `npm run agent:pilot` trả `continue`; nếu trả `pause`, dừng xuất bản tự động và trình Đại ca báo cáo nguyên nhân.
