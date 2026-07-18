import { products, SHOPEE_SHOP_URL } from "../../lib/products";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "VinPrint - Xưởng in nhanh TP.HCM",
  url: "https://vinprint.vn",
  telephone: "+84844998499",
  image: "https://vinprint.vn/images/hero-collage.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: "254/5/40 Lê Văn Thọ",
    addressLocality: "Phường Thông Tây Hội",
    addressRegion: "TP.HCM",
    addressCountry: "VN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "17:30",
    },
  ],
  sameAs: [SHOPEE_SHOP_URL, "https://vinprint.vn"],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Dịch vụ in tem nhãn VinPrint",
  itemListElement: products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image.startsWith("http") ? product.image : `https://vinprint.vn${product.image}`,
      url: `https://vinprint.vn/san-pham/${product.slug}`,
      ...(product.price
        ? {
            offers: {
              "@type": "Offer",
              priceCurrency: "VND",
              price: product.price,
              availability: "https://schema.org/InStock",
              url: product.source,
            },
          }
        : {}),
    },
  })),
};

// Câu hỏi PHẢI khớp với danh sách đang hiển thị trong FAQAndMockup.tsx
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      q: "Có nhận in số lượng ít không?",
      a: "Có. Một số nhóm tem nhận từ 2 tờ A4, phù hợp shop mới cần thử mẫu trước khi tăng số lượng sản xuất.",
    },
    {
      q: "Thời gian sản xuất và giao hàng là bao lâu?",
      a: "Thời gian phụ thuộc số lượng và loại tem. Sau khi xem file, nhân viên sẽ xác nhận thời gian sản xuất và giao hàng cụ thể qua Zalo trước khi anh/chị đặt cọc.",
    },
    {
      q: "Tem có chống nước không?",
      a: "Tem nhựa (PVC) chống nước tốt, phù hợp chai lọ, mỹ phẩm, đồ uống và hàng đông lạnh. Tem giấy phù hợp bao bì khô và tối ưu chi phí hơn.",
    },
    {
      q: "Có hỗ trợ thiết kế không?",
      a: "Có. VinPrint hỗ trợ chỉnh sửa file và xem thử tem trên sản phẩm bằng AI Mockup trước khi in. Gửi nội dung hoặc logo qua Zalo để được hỗ trợ.",
    },
    {
      q: "Có xuất hóa đơn VAT không?",
      a: "Có. Anh/chị vui lòng báo nhu cầu xuất hóa đơn và gửi thông tin công ty khi đặt hàng để được hỗ trợ.",
    },
    {
      q: "Tôi cần chuẩn bị file như thế nào?",
      a: "File thiết kế định dạng ảnh, PDF hoặc AI với độ phân giải cao. Nếu chưa có file, gửi nội dung và logo để được hỗ trợ dựng file trước khi in.",
    },
  ].map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
