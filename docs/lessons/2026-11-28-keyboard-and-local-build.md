# Kiểm bàn phím và quyền build local
- Issue/PR: VinPrint PR #33; GitHub chưa cập nhật do token invalid.
- Triệu chứng: liên kết bỏ qua điều hướng ở công cụ không chuyển focus; build thử bằng tài khoản khác lỗi EPERM.
- Nguyên nhân: main công cụ thiếu tabIndex=-1; Lenis chặn sự kiện neo gồm skip-link. Artifact do CodexSandboxOffline sở hữu, tài khoản Admin không có quyền delete file đó ở token hiện hành.
- Sửa: main nhận focus, Lenis bỏ qua skip-link; build chạy bằng tài khoản sở hữu artifact. Không giữ các thử nghiệm sửa plugin/xóa thư mục vì không phải nguyên nhân gốc.
- Chặn bằng: scripts/verify-keyboard-labels.cjs kiểm8nhómtrang ở390px, tên trường nhập, skiplink Enter và chế độ chuyển động thường/giảm. Đã thấy fail trước, pass sau. Build đúng tài khoản đã pass sau EPERM.
- Áp dụng chung: không coi cuộn tới nội dung là đã chuyển focus; không chuyển tài khoản cho build dùng chung artifact khi chưa kiểm ACL.
