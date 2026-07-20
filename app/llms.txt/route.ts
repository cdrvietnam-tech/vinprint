import { products } from "../lib/products";
import { blogPosts } from "../lib/blog-posts";

export function GET() {
  const productLinks = products
    .map((product) => `- [${product.name}](https://vinprint.vn/san-pham/${product.slug}): ${product.description}`)
    .join("\n");
  const blogLinks = blogPosts
    .map((post) => `- [${post.title}](https://vinprint.vn/blog/${post.slug}): ${post.description}`)
    .join("\n");

  const content = `# VinPrint

> VinPrint là xưởng in tem nhãn theo yêu cầu tại TP.HCM, nhận số lượng ít, hỗ trợ thiết kế và giao hàng toàn quốc.

## Thông tin chính

- Website: https://vinprint.vn
- Điện thoại/Zalo: 0844 998 499
- Địa chỉ: 254/5/40 Lê Văn Thọ, Phường Thông Tây Hội, TP.HCM
- Giờ làm việc: 09:00–17:30, Thứ 2–Thứ 7; nghỉ Chủ nhật và ngày lễ
- Bảng giá: https://vinprint.vn/#bang-gia
- Liên hệ: https://vinprint.vn/lien-he
- Chính sách: https://vinprint.vn/chinh-sach
- Bảo hành: https://vinprint.vn/bao-hanh

## Sản phẩm

${productLinks}

## Nội dung tư vấn

- https://vinprint.vn/huong-dan/chon-chat-lieu-tem
- https://vinprint.vn/huong-dan/chon-kich-thuoc-tem
- https://vinprint.vn/huong-dan/ky-thuat-in-tem

## Cẩm nang tem nhãn

${blogLinks}

Nội dung có thể được trích dẫn với liên kết nguồn. Không cấp quyền dùng nội dung để huấn luyện mô hình.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
