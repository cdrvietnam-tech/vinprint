# Kiểm cả chuyển đổi và tải file dưới CSP thật
- Issue: https://github.com/cdrvietnam-tech/muse-aistudio/issues/146
- Triệu chứng: HEIC chạy dev nhưng treo dưới CSP; sau khi sửa giải mã, tải kết quả/ZIP vẫn có thể thất bại.
- Nguyên nhân gốc: heic2any cũ tạo wrapper Embind bằng Function nên cần eval; fetch blobURL bị connect-src chặn dù img-src đã cho blob. Harness Node thông thường còn thiếu ASSETS binding cho gói Cloudflare; build lại mà giữ tiến trình cũ có thể dùng manifest/vendor cũ.
- Sửa: bốn wrapper thành closure/invoker tĩnh, giữ destructor/arg conversion; giữ Blob trong Map để tải/ZIP không fetch blobURL; harness dùng đúng ASSETS binding và khởi động mới sau build. Không nới unsafe-eval/connect-src.
- Chặn: scripts/verify-free-tools-production.cjs kiểm HEIC/PDF, tải JPG/ZIP, pageerror dưới CSP thật. scripts/verify-heic-equivalence.cjs đối chiếu hai HEIC với Muse gốc cho cùng SHA256 JPEG. API tests cố định chế độ miễn phí, không chuyển cookie/token và chặn URL riêng/paid endpoints.
- Bằng chứng: docs/evidence/tet-storefront/free-tools-production-results.json, heic-equivalence-results.json. Bản gốc bị CSP chặn; bản mới chuyển và tải đạt, kết quả hai mẫu giống byte.
- Áp dụng chung cho: chuyển công cụ xử lý file từ SPA sang website có CSP/Worker; test dev không thay thế test artifact production và bước download thực.
