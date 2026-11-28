# VinPrint — bản sửa sau xuất bản, Issue172

## Trạng thái
Bản sửa local và đề xuất PR; chưa thay production/Muse thật. Theme Tết và bố cục bìa giữ theo bản đã duyệt. Không dùng phê duyệt PR34 cho head mới.

| Phản hồi | Bản sửa / bằng chứng |
|---|---|
| Mất Zalo/gọi mobile | Mount thanh liên hệ trong root, trừ admin; lấy số/link từ quản trị; kiểm 390px trên /, công cụ và sản phẩm; không bấm tạo lead |
| Công cụ không dẫn đặt in | Nút Zalo trực tiếp ở hub và thanh cố định; hướng dẫn tải rồi đính kèm file |
| Ảnh có dấu/chậm | Bridge có key riêng; miễn đóng dấu chỉ cho request đã xác thực, không tắt chính sách chung. Session tách nền dùng lại, giữ kích thước; proxy từ chối kết quả brandMarked. Kiểm download PNG và xem ảnh thật |
| Gọi vô hạn | R2 CAS chung, 12 job/IP/ngày UTC; 2 job/phút; 2 job đồng thời toàn bộ; 100 job/giờ toàn bộ; GET asset 20/phút và120/ngày/IP. /64 cho IPv6. Thiếu cấu hình/lỗi kho trạng thái thì503, không mở lại tự do |
| Dịch vụ thiếu trang/giá | Bỏ claim thiếu xác nhận khỏi /san-pham. Thu thập 6 dịch vụ từ nguồn chủ chỉ định + voucher chưa thấy nguồn. 7 bản nháp tách riêng; chưa nhập giá đối thủ làm giá VinPrint |
| FAQ/bảng giá | JSON-LD lấy cùng faq.items hiển thị, escape dấu <; 4 bảng giá chữ mở sẵn; thumbnail nhỏ, zoom giữ bản gốc |
| Blog Tết | 3 bài local về bộ hũ mứt, chia file nhiều mẫu, chai đồ uống lạnh; nguồn nội bộ, nhãn ảnh AI, không hứa giao/giá chưa xác nhận |
| Ảnh nặng | Crop đúng phần demo, không AI tái tạo; lazy img cho danh mục; ảnh đầu mobile từ1367442 xuống155486 byte (89%) ở390×844, context mới, không cuộn. Đây là dung lượng ảnh trong phép đo, không phải CWV |

## Bằng chứng
`docs/evidence/postrelease-quality/` có kết quả UI, ảnh và quota; 82 unit/API,45 HTML/Facebook,6 operator; TypeScript/lint/build đạt. Runtime quota dùng workerd/Miniflare với conditional R2 thật của harness. File ảnh demo là tài sản minh họa công khai, không phải file khách. Số đo tốc độ cold/warm xem cutout-timings.json; cold đầu11.2s, warm0.7s cho384×288. UI/harness khoảng0.9–2.8s tách nền,1.1s nền trắng,5.6s làm nét ở lượt đo; chưa phải production.

## Cổng trước merge/publish
1. Chủ duyệt exact head PR và phạm vi bridge Muse, secret server-only, restart có kiểm soát + xuất bản VinPrint. Thiếu bridge key thì API bản mới cố ý trả503; không merge trước khi làm xong phụ thuộc này.
2. `integrations/muse/install-bridge.py D:/CLONEVIDEO` chỉ patch4điểm duy nhất và copy3file, không tạo key/restart. Đã thử trên bản sao nguồn Muse hiện tại và node --check đạt. Sao lưu/diff đúng4điểm trước khi áp dụng; không ghi đè source người khác. Cài secret ngẫu nhiên >=32byte vào `server/storage/.vinprint-bridge-key` (đã nằm trong storage gitignore); cùng giá trị đặt secret `MUSE_VINPRINT_KEY` của Worker bằng kho secret. Không log/commit key, không cấp clipboard.
3. Không cài/nâng Python package. Dùng rembg/onnxruntime/PIL và u2net.onnx đã cài; kiểm model có trước restart. U2Net Apache2, rembg MIT: https://github.com/xuebinqin/U-2-Net/blob/master/LICENSE ; https://github.com/danielgatis/rembg/blob/main/LICENSE.txt . Không bundle model vào Git.
4. Nếu cần restart, chỉ dùng `call scripts\ops\RESTART-SERVER.bat` theo AGENTS Muse; không tự mở server5000. Trước đó kiểm tra toàn bộ nguồn thay đổi sau thời điểm server khởi động; không kéo theo code khác chưa duyệt. Harness hiện chạy4184 riêng, không đăng ký route trên5000.
5. Nghiệm thu bridge thật trước merge: request không key403, key hợp lệ trả PNG không dấu; đo cold/warm và ảnh gốc, làm nét alpha; health Muse200. Merge sau khi tất cả required checks và owner approval đạt, rồi kiểm API/ảnh/FAQ/mobile trên vinprint.vn. Không công bố thứ hạng/index từ schema.

## Bản duyệt và hoàn tác
Preview4181 dùng Worker4182 và harness bridge4184; API nội dung ghi .preview riêng. Bridge test dùng key tạm riêng, không dùng secret production. Tiến trình test phải close browser/worker khi xong; các preview do phiên tạo giữ để duyệt.
Hoàn tác web bằng revert commit đã xuất bản. Hoàn tác bridge bằng diff4điểm và chỉ3file do installer tạo; giữ chính sách đóng dấu Muse cũ. Không reset/clean repo Muse đang có thay đổi khác. Giới hạn R2 ở `limits/vinprint-free-tools-v1.json`, không đọc/ghi bộ sưu tập hay giá. Log state chỉ hash IP theo ngày, không raw IP; tối đa4096counter, tự thay state qua ngày.
