# Hướng dẫn đo lường cho VinPrint.vn (GA4 trực tiếp)

*Mục tiêu: biết mỗi ngày bao nhiêu khách bấm **Nhắn Zalo**, **Gọi**, **xem bảng giá**, mở **bản đồ** — và đến từ nguồn nào. Từ đó tối ưu quảng cáo.*

Website **đã gắn sẵn GA4 trực tiếp** trong mã (mã đo `G-0XQZ3FCJN0`). Chạy tự động khi deploy, **không cần cấu hình gì thêm**, không cần Google Tag Manager.

> Ghi chú kỹ thuật: site dùng **một đường đo duy nhất là GA4 trực tiếp (gtag)**. Google Tag Manager đã **tắt** để tránh đo trùng (mỗi lượt bị đếm 2 lần). Nếu sau này muốn chuyển sang GTM, phải gắn lại `<GoogleTagManager/>` trong `app/layout.tsx` và bỏ GA4 trực tiếp — đừng bật cả hai.

---

## 1. Kiểm tra GA4 đã chạy chưa (sau khi deploy)

1. Vào https://analytics.google.com → chọn tài khoản/property của VinPrint (mã `G-0XQZ3FCJN0`).
2. Mở **Reports → Realtime** (Thời gian thực).
3. Mở https://vinprint.vn trên điện thoại/máy khác, bấm thử nút **Nhắn Zalo**, **Gọi**.
4. Sau ~30 giây, thấy số người dùng và sự kiện nhảy lên là **đã chạy đúng**.

## 2. Các sự kiện website tự gửi về GA4

| Tên sự kiện | Khi nào |
|---|---|
| `click_zalo` | Khách bấm nút Nhắn Zalo (mọi vị trí) |
| `click_phone` | Khách bấm số điện thoại / Gọi xưởng |
| `view_pricing` | Khách xem/mở bảng giá |
| `open_google_maps` | Khách bấm mở Google Maps |
| `load_google_map` | Khách tải bản đồ nhúng |

## 3. Đánh dấu hành động quan trọng là "key event"

Trong GA4 → **Admin → Events**: sau khi có dữ liệu, bật **Mark as key event** cho `click_zalo` và `click_phone` — đây là 2 hành động đáng tiền nhất (khách chủ động liên hệ).

## 4. Nếu muốn đổi sang tài khoản GA4 khác

Mã đo mặc định nằm trong `app/components/GoogleAnalytics.tsx`. Có thể ghi đè bằng biến môi trường trên Cloudflare:

- Name: `NEXT_PUBLIC_GA_ID`
- Value: `G-XXXXXXXXXX` (mã GA4 mới)

Rồi deploy lại. Nếu không đặt biến, site dùng mã mặc định đã nhúng sẵn.

---

## Tóm tắt cho anh
- GA4 **đã bật sẵn**, không cần làm gì để nó chạy.
- Chỉ cần vào GA4 → Realtime kiểm tra, và bật **key event** cho `click_zalo` / `click_phone`.
- Bảo mật: mã `G-...` là mã công khai, để trong web là bình thường; không cần gửi mật khẩu Google cho ai.
