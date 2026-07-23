import type { Metadata } from "next";
import { ArrowRight, Layers3 } from "lucide-react";
import ProductCatalogTabs from "../components/catalog/ProductCatalogTabs";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import MobileActionBar from "../components/home/MobileActionBar";
import ScrollToTop from "../components/home/ScrollToTop";

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

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f1] text-gray-950">
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-20">
        <section className="relative overflow-hidden bg-[#24104f] py-16 text-white sm:py-20">
          <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-orange-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-violet-400/30 blur-3xl" />
          <div className="relative mx-auto max-w-[1440px] px-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-orange-200">
              <Layers3 className="h-4 w-4" /> Danh mục đầy đủ
            </span>
            <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl">Tất cả sản phẩm của VinPrint</h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-purple-100 sm:text-lg">
              Chọn đúng nhóm sản phẩm, xem các mẫu đang có hoặc nhắn Zalo để xưởng tư vấn quy cách phù hợp với ngân sách.
            </p>
            <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#D83B00] px-7 text-sm font-black text-white shadow-xl hover:bg-[#B83200]">
              Nhắn Zalo chốt in <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-12 sm:py-16">
          <ProductCatalogTabs />
        </section>
      </main>
      <Footer hasMobileActionBar />
      <MobileActionBar />
      <ScrollToTop />
    </div>
  );
}
