import type { Metadata } from "next";
import ProductCatalog from "../components/storefront/ProductCatalog";
import { products } from "../lib/products";

export const metadata: Metadata = {
  title: "Các loại tem nhãn | Chất liệu, mẫu và giá tham khảo",
  description: "Danh mục tem nhãn VinPrint: tem giấy, tem nhựa chống nước, tem trong, tem ánh kim, UV DTF và sticker. Xem trang riêng, quy cách và giá tham khảo từng loại.",
  alternates: { canonical: "/san-pham" },
  openGraph: {
    title: "Tất cả sản phẩm in ấn | VinPrint",
    description: "Chọn chất liệu tem nhãn phù hợp; xem trang riêng, mẫu minh họa, quy cách và giá tham khảo.",
    url: "/san-pham",
    images: [{ url: "/images/hero-products.webp", alt: "Danh mục sản phẩm in ấn VinPrint" }],
  },
};

export default function ProductsPage() { return <ProductCatalog products={products}/>; }
