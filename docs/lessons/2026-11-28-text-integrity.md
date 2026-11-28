# Kiểm tính toàn vẹn tệp văn bản trước bàn giao
- Issue/PR: Muse #163, VinPrint PR #33.
- Triệu chứng: hai tệp ghi chú nghiệm thu có byte NUL. Chưa đủ bằng chứng kết luận nguyên nhân phát sinh.
- Sửa: phục hồi tài liệu tích hợp từ Git, viết lại checklist qua tệp tạm, thay thế rồi đọc lại so byte.
- Chặn bằng: scripts/check-changed-text.mjs, hỗ trợ --base. Đã thử tệp probe chứa NUL: bị từ chối; xóa probe rồi kiểm các tệp thay đổi đạt.
- Áp dụng chung: tài liệu/bằng chứng phải đọc lại được; không lấy exit0 của thao tác ghi làm bằng chứng nội dung còn nguyên.
