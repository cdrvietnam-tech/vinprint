# GEO readiness — VinPrint

Ngày đánh giá: 20/07/2026  
Phạm vi: mã nguồn `D:\vinprint` và kiểm tra công khai `https://vinprint.vn` sau khi triển khai hub nội dung.  
Lưu ý: điểm dưới đây là **độ sẵn sàng kỹ thuật/nội dung**, không phải thứ hạng hoặc số lượt được AI trích dẫn.

## GEO Readiness Score: 88/100

| Nhóm | Điểm | Bằng chứng chính |
| --- | ---: | --- |
| Khả năng trích dẫn | 22/25 | Sáu bài có câu trả lời trực tiếp, nguồn và bảng/list có thể trích riêng. |
| Cấu trúc nội dung | 19/20 | SSR, H1–H3 rõ, heading dạng câu hỏi, liên kết nội bộ và breadcrumb. |
| Đa phương tiện | 13/15 | Mỗi bài có thumbnail riêng, alt text theo chủ đề; chưa có video hoặc công cụ tương tác. |
| Thẩm quyền và thực thể | 15/20 | Có ngày cập nhật, nguồn, quy trình biên soạn và thực thể đội ngũ; chưa có dữ liệu nghiên cứu gốc hoặc tác giả cá nhân có hồ sơ công khai. |
| Khả năng truy cập kỹ thuật | 19/20 | Nội dung server-rendered, sitemap/robots/canonical/schema hợp lệ, crawler tìm kiếm AI được cho phép. |

## Platform breakdown

| Bề mặt | Readiness | Nhận định |
| --- | ---: | --- |
| Google AI Overviews | 88/100 | Nền tảng SEO, nội dung hữu ích, schema và khả năng index tốt; cần Search Console để xác nhận index/query thực. |
| ChatGPT Search | 84/100 | OAI-SearchBot và ChatGPT-User được phép; nội dung có nguồn và passage độc lập. Tín hiệu nhắc đến thương hiệu ngoài website chưa được đo. |
| Perplexity | 82/100 | PerplexityBot được phép; trang có nguồn rõ. Cần thêm dữ liệu gốc và tín hiệu thực thể bên ngoài. |

## AI crawler access

- Cho phép: `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`.
- Chặn crawler huấn luyện/extended theo chính sách hiện tại: `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`.
- Sitemap chuẩn: `https://vinprint.vn/sitemap.xml`.

## llms.txt

`/llms.txt` đang tồn tại và liệt kê trang sản phẩm, hướng dẫn, blog và quy trình biên soạn. Tệp này chỉ được duy trì như khả năng tương thích tương lai; không tính điểm như một yếu tố xếp hạng hoặc trích dẫn. Google hiện nói không cần markup hoặc tệp dành riêng cho AI để xuất hiện trong AI features.

## Passage-level citability

- Sáu bài blog mở đầu bằng khối “Câu trả lời ngắn” khoảng 150–165 từ.
- Các phần tiếp theo dùng câu hỏi, bảng so sánh, checklist và nguồn cụ thể.
- Nội dung kỹ thuật về độ phân giải, bleed và CMYK dẫn tới tài liệu Adobe chính thức.
- Bước tiếp theo nên bổ sung dữ liệu thử nghiệm thực tế của xưởng thay vì mở rộng số lượng bài đại trà.

## Top 5 thay đổi ưu tiên tiếp theo

1. **Hoàn tất thực thể biên tập (đang triển khai):** trang `/quy-trinh-bien-soan`, schema thực thể đội ngũ và liên kết từ mọi bài.
2. **Xuất bản case study có bằng chứng gốc:** ảnh trước/sau, loại vật liệu, bề mặt, kích thước, điều kiện thử và kết quả quan sát; chỉ dùng dữ liệu đã được khách hàng cho phép.
3. **Kết nối Search Console và GA4:** đo trạng thái index, truy vấn, landing page, click Zalo và lượt chuyển đổi; không suy đoán traffic.
4. **Tạo công cụ chọn tem:** đầu vào là môi trường, bề mặt, kích thước, số lượng; đầu ra là 2–3 lựa chọn kèm lý do và bước thử mẫu.
5. **Thiết lập lịch rà soát hàng quý:** chỉ đổi `dateModified` khi nội dung thực sự thay đổi; ghi lại nguồn và lý do cập nhật.

## Nguyên tắc triển khai

GEO của VinPrint được xem là SEO nền tảng áp dụng cho bề mặt tìm kiếm AI. Ưu tiên nội dung độc đáo, có trải nghiệm thực tế và giúp khách chọn đúng; không tạo “AI markup” riêng, không nhồi biến thể từ khóa và không đổi ngày giả tạo.

Nguồn chuẩn: [Google Search Central — AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Google — Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
