# Sửa proxy công cụ trên workerd — Muse167

## Nguyên nhân
Production trả502 ngay cả GETảnh công khai; ảnh gốc trực tiếp200. Mã proxy dùng redirect:error cho cảasset, xử lý ảnh/video vàCDR. Cloudflare workerd không hỗ trợ mode này; constructor Request ném TypeError trước khi gửi mạng. Tái hiện bằng Miniflare/workerd xác nhận error bị từ chối, manual được nhận. Tài liệu chính thức: https://developers.cloudflare.com/workers/runtime-apis/request/.

## Sửa và ranh giới
Chỉ đổi ba fetch thành redirect:manual. Điều kiện response.ok có sẵn vẫn từ chối3xx, không theoLocation. Không thêm proxy vòng, không mở domain, không gửi cookie/token hay tùy chọn thu Xu. CDR mới trongPR34 dùng cùng chính sách. Không cần thay cấu hình Cloudflare hay Muse.

## Bằng chứng
- tests/free-tools-workerd.test.ts chạy thực trongworkerd với backend hermetic: mã cũ trả502 (red), mã sửa200 (green) cho image/asset/CDR;302 không được theo; credential không tới backend. Test này chứng minh giao thức/runtime, không giả làm converter CDR thật.
- Lưuý harness: Node FormData và FormData của Miniflare khác realm; serialize thành byte multipart +content-type trước dispatch để kiểm đúng request thật.
- Kiểm workerd với Muse HTTPS công khai: ảnhGIF200; làm nét qualitystandard miễn phí200; tải kết quả1152625byte; CDR mẫu công khai trảSVG1757ký tự. results.json trong docs/evidence/tet-storefront/workerd-proxy.
- 75unit/API đạt, bao gồm kiểm runtime;TypeScript/lint đạt. Build/HTML vàCI ghi theo phiên bản cuối củaPR.
- LỗiNodepreview trướcđây không lộ vì Node hỗ trợredirect:error. Không gọi harnessNodeHTTP là bằng chứng runtimeCloudflare nữa; cần cảworkerd và kiểm domainthật sau deploy.

Bản sửa đang ởPR34, chưa xuất bản. Vinprint.vn hiện vẫnPR33 nên không kết luận lỗi production đã hết cho đến khi merge và thử lại đúng domain.
