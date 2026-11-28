# Kiểm nguồn chậm có giới hạn, không bỏ qua nguồn lỗi
- Issue: Muse170, PR34.
- Triệu chứng: CI liên tục thất bại ở hai nguồn Fedrigoni sau12giây.
- Nguyên nhân đã đo: cùng UA audit, GET12giây timeout; curlIPv4 trả200 sau17.146giây. GET30giây trả200 ở10.192giây và14.832giây. Đây là phản hồi chậm/dao động, không đủ căn cứ gọi là nguồn hỏng.
- Sửa: checkExternalSource dùng timeout30giây, tối đa2lượt, đợi1giây giữa các lượt lỗi mạng/5xx. 404/429 lỗi ngay; hết lượt vẫn fail. Giữ nguyên URL trích dẫn, luật403 có sẵn và toàn bộ workflow/gate; không đổi nguồn hay cho timeout thành pass.
- Chặn bằng tests/external-source-check.test.ts: phục hồi timeout một lần, lỗi mạng dai dẳng,404,503,429. Audit thật28bài/toàn bộ nguồn đã đạt,74unit/API đạt.
- Áp dụng chung: chờ kết quả terminal trước kết luận; phiên curl đang chạy chưa phải timeout. Phân biệt độ trễ nguồn ngoài với lỗi nội dung, ghi đo thực tế trước sửa.
