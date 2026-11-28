# Không cho lưu dữ liệu mặc định khi tải quản trị thất bại
- Issue/PR: Muse #163, VinPrint PR #33.
- Triệu chứng: API lỗi nhưng form nội dung và bộ sưu tập vẫn hiện mặc định, cho phép sửa/lưu hoặc thao tác khôi phục.
- Nguyên nhân: ContentAdmin dùng chung trạng thái lỗi đọc/lưu mà không phân biệt đã nạp dữ liệu; VideoAdmin thay kết quả đọc lỗi bằng DEFAULT_MEDIA_COLLECTIONS.
- Sửa: chưa nạp thành công thì ẩn form và cho thử tải lại; lỗi lưu sau khi đã nạp vẫn giữ bản nháp.
- Chặn bằng: scripts/verify-admin-errors.cjs trên Worker build (503, recovery, giữ draft khi PUT503, gallery rỗng), không ghi backend. scripts/verify-admin-load-regression.cjs đối chiếu nguồn e8a536a với mới: ContentAdmin182→0 trường sửa, VideoAdmin44→0 khi API503.
- Áp dụng chung: giá trị mặc định để hiển thị công khai không được dùng làm dữ liệu đã nạp trong trình sửa quản trị.
