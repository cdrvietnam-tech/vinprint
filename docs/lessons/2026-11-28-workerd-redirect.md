# Fetch phải nghiệm thu bằng runtime đích
- Issue: Muse167, PR34.
- Nguyên nhân: redirect:error hợp lệ ởNode nhưngworkerd từ chối trước mọi yêu cầu mạng, khiến proxyproduction502 ngay. BộpreviewNode che khuất sai khác runtime.
- Sửa: manual +giữ kiểm status; không tựfollowLocation.
- Chặn: tests/free-tools-workerd.test.ts, redtrêncode cũ/greentrêncode sửa, backend hermetic và không theo302; thử thêm workerd→Muse HTTPS thật image/download/CDR đạt. Không coi mockconverter là nghiệm thu bản vẽ.
- Nguồn runtime: https://developers.cloudflare.com/workers/runtime-apis/request/. Chi tiết docs/PRODUCTION-PROXY-FIX.md.
