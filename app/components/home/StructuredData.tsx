import { products, SHOPEE_SHOP_URL } from "../../lib/products";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=VinPrint%2C%20254%2F5%2F40%20L%C3%AA%20V%C4%83n%20Th%E1%BB%8D%2C%20TP.HCM";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "VinPrint - Xưởng in nhanh TP.HCM",
  "@id": "https://vinprint.vn/#localbusiness",
  url: "https://vinprint.vn",
  telephone: "+84844998499",
  image: "https://vinprint.vn/images/hero-collage.webp",
  priceRange: "₫₫",
  hasMap: GOOGLE_MAPS_URL,
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.8284534,
    longitude: 106.6631853,
  },
  areaServed: [
    { "@type": "City", name: "Thành phố Hồ Chí Minh" },
    { "@type": "Country", name: "Việt Nam" },
  ],
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
  sameAs: [SHOPEE_SHOP_URL],
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
      q: "Có in tem số lượng ít không?",
      a: "Có. VinPrint hỗ trợ in từ số lượng ít (chỉ từ vài chục tem), giúp các shop nhỏ tiết kiệm chi phí ban đầu và dễ dàng thử mẫu trước khi sản xuất số lượng lớn.",
    },
    {
      q: "Thời gian hoàn thành là bao lâu?",
      a: "Chỉ từ 1–2 ngày làm việc sau khi chốt thiết kế. Có hỗ trợ in nhanh lấy ngay trong ngày nếu cần gấp — liên hệ Zalo để xác nhận.",
    },
    {
      q: "Tem nhãn có chống nước không?",
      a: "Tem nhựa PVC dẻo dai chống nước 100%, bền màu, phù hợp chai lọ, mỹ phẩm và đồ uống. Tem giấy rẻ hơn nhưng không chống nước, phù hợp bao bì khô.",
    },
    {
      q: "Chưa có file thiết kế thì sao?",
      a: "Không cần lo! Chỉ cần gửi ý tưởng hoặc logo. AI & Designer của VinPrint sẽ dựng mẫu thiết kế hoàn toàn miễn phí và cho xem trước kết quả trên sản phẩm thật.",
    },
    {
      q: "Có giao hàng toàn quốc không?",
      a: "VinPrint hỗ trợ giao hàng nhanh toàn quốc qua các đơn vị vận chuyển uy tín. Tem được đóng gói chống nước cẩn thận, đảm bảo nguyên vẹn khi đến tay bạn.",
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
