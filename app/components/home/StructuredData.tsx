import { products, SHOPEE_SHOP_URL } from "../../lib/products";
import { GOOGLE_BUSINESS_PROFILE_URL } from "../../lib/business-info";

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
    streetAddress: "Số 13, Đường Thạnh Lộc 42",
    addressLocality: "An Phú Đông",
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
  sameAs: [SHOPEE_SHOP_URL, GOOGLE_BUSINESS_PROFILE_URL],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Dịch vụ in tem nhãn VinPrint",
  itemListElement: products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: product.name,
    url: `https://vinprint.vn/san-pham/${product.slug}`,
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
    </>
  );
}
