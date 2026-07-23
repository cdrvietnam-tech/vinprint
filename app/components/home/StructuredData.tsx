import { products } from "../../lib/products";
import { GOOGLE_BUSINESS_PROFILE_URL } from "../../lib/business-info";
import { homeFaqs } from "../../lib/home-faqs";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "VinPrint - Xưởng in nhanh TP.HCM",
  "@id": "https://vinprint.vn/#localbusiness",
  url: "https://vinprint.vn",
  telephone: "+84844998499",
  image: "https://vinprint.vn/images/hero-products.webp",
  priceRange: "₫₫",
  hasMap: GOOGLE_BUSINESS_PROFILE_URL,
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
  sameAs: [GOOGLE_BUSINESS_PROFILE_URL],
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
    },
  })),
};

// Câu hỏi PHẢI khớp với danh sách đang hiển thị trong FAQAndZaloCTA.tsx
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((item) => ({
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
