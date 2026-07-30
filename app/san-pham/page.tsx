import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Layers3 } from "lucide-react";
import ProductCatalogTabs from "../components/catalog/ProductCatalogTabs";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import MobileActionBar from "../components/home/MobileActionBar";
import ScrollToTop from "../components/home/ScrollToTop";
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
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black uppercase text-gray-950 sm:text-3xl">Sản phẩm nổi bật</h2>
            <p className="mt-2 text-sm font-medium text-gray-600">Bấm vào ảnh để xem chi tiết và nhận báo giá qua Zalo.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/san-pham/${product.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_20px_45px_-15px_rgba(216,59,0,0.35)]"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-orange-700">{product.eyebrow}</span>
                  <h3 className="mt-1 text-base font-black leading-tight text-gray-950 group-hover:text-[#D83B00] sm:text-lg">{product.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-gray-500 group-hover:text-[#D83B00]">
                    Xem chi tiết <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-12 sm:pb-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black uppercase text-gray-950 sm:text-3xl">Xem theo danh mục</h2>
          </div>
          <ProductCatalogTabs />
        </section>
      </main>
      <Footer hasMobileActionBar />
      <MobileActionBar />
      <ScrollToTop />
    </div>
  );
}
