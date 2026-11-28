# Theme phải đổi cả nền cố định ở mobile
- Issue/PR: Muse166, VinPrint33.
- Triệu chứng: chọn Noel thì màu nhấn xanh nhưng hero mobile vẫn nền đỏ của Tết.
- Nguyên nhân gốc: CSS hero đặt nền cố định, trong khi đổi token màu chỉ ảnh hưởng chữ/nút; mặt nạ ảnh mobile làm lộ nền cũ.
- Chặn bằng: seasonal-themes.css đặt --season-dark và nền hero riêng cho từng dịp, chỉ áp dụng ngoài Tết. verify-seasonal-themes.cjs kiểm màu mobile và ảnh chụp cả sáu dịp; quay lại Tết đối chiếu hero từng pixel.
- Áp dụng chung: theme không chỉ đổi màu nhấn; kiểm nền phía sau mask, trang trí dùng chung và responsive. Không chỉnh CSS của theme đã duyệt để sửa theme mới.
