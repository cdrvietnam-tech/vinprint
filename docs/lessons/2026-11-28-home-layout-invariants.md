# Khóa phần đã duyệt khi đổi bố cục trang chủ
- Issue/PR: Muse164, VinPrint33.
- Chủ xác nhận bìa local đang được; sau đó yêu cầu thanh trên cùng như cũ, còn lại theo demo. Không áp dụng thanh tìm kiếm hay hero mới trong ảnh đề xuất.
- Chặn bằng: verify-home-layout-approved.cjs đối chiếu markup header/hero với d72e46f, geometry và4viewport; vẫn kiểm quảng cáo, menu, quote và link công cụ.
- Lỗi nghiệm thu mobile: rule dịch vụ4cột có specificity cao hơn rule responsive2cột. Sửa selector responsive cùng mức và thêm assert2cột tại390px; screenshot sau sửa đã kiểm.
- Áp dụng chung: tách rõ vùng đóng băng/vùng thay đổi, kiểm cả mã và ảnh thực tế; giữ dữ liệu quản trị cho khối bị bỏ vào phần lưu trữ.
