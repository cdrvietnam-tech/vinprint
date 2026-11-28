# Giới hạn kích thước icon khi dùng chung khung storefront
- Issue/PR: VinPrint PR #33; GitHub token invalid nên chưa cập nhật thẻ.
- Triệu chứng: mũi tên thẻ bài viết phóng lớn, chữ CTA xuống nhiều dòng sau khi chuyển theme.
- Nguyên nhân gốc: selector `.vinprint-storefront svg` đặt mọi SVG width/height 100%, ghi đè utility 16px của icon.
- Chặn bằng: `scripts/verify-blog-theme.cjs` assert mọi icon SVG trong main <=20px trên toàn bộ URL blog; CSS scoped `.vp-blog-content svg` đặt 16px và không co.
- Áp dụng chung cho: chuyển component vào shell có CSS kế thừa rộng; kiểm ảnh screenshot cùng kích thước thực, không chỉ HTTP200.
