import type { Metadata } from "next";
import ProductCatalog from "../components/storefront/ProductCatalog";
import { products } from "../lib/products";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm in ấn | Tem nhãn, catalog, card, túi giấy",
  description: "Danh mục tem nhãn và ấn phẩm tại VinPrint: tem giấy, tem nhựa, tem trong, sticker, catalog, card visit, voucher, bao thư, tờ rơi, folder và túi giấy.",
  alternates: { canonical: "/san-pham" },
  openGraph: {
    title: "Tất cả sản phẩm in ấn | VinPrint",
    description: "Chọn nhanh loại tem nhãn, ấn phẩm văn phòng, quảng cáo và bao bì phù hợp với shop.",
    url: "/san-pham",
    images: [{ url: "/images/hero-products.webp", alt: "Danh mục sản phẩm in ấn VinPrint" }],
  },
};

export default function ProductsPage() { return <ProductCatalog products={products}/>; }
