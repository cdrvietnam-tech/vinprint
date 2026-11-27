import type { Metadata } from "next";
import { Bot, Clapperboard, Sparkles } from "lucide-react";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import Ai247VideoGallery from "../components/ai247/Ai247VideoGallery";

export const metadata: Metadata = {
  title: "AI247 | Video AI Marketing từ VinPrint",
  description: "Thư viện video AI marketing, ý tưởng quảng bá và nội dung sáng tạo do VinPrint cập nhật.",
  alternates: { canonical: "/ai247" },
  openGraph: {
    title: "AI247 | Video AI Marketing từ VinPrint",
    description: "Xem video AI marketing và ý tưởng nội dung mới từ VinPrint.",
    url: "/ai247",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "AI247 | Video AI Marketing từ VinPrint",
  description: "Thư viện video AI marketing và nội dung sáng tạo do VinPrint cập nhật.",
  url: "https://vinprint.vn/ai247",
  isPartOf: { "@type": "WebSite", name: "VinPrint", url: "https://vinprint.vn" },
};

export default function Ai247Page() {
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-20">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.24),transparent_36%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.22),transparent_38%)]" />
          <div className="relative mx-auto max-w-[1180px] px-4 py-16 sm:py-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm font-black text-orange-200">
              <Sparkles className="h-4 w-4" /> AI247 by VinPrint
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">Video AI marketing, cập nhật tại một nơi</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Khám phá video quảng bá, ý tưởng hình ảnh và nội dung sáng tạo ứng dụng AI cho sản phẩm và thương hiệu.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><Clapperboard className="h-4 w-4 text-orange-300" /> Video dễ xem trên điện thoại</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><Bot className="h-4 w-4 text-indigo-300" /> Nội dung AI chọn lọc</span>
            </div>
          </div>
        </section>

        <section aria-labelledby="video-ai247" className="mx-auto max-w-[1180px] px-4 py-14 sm:py-20">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">Thư viện mới nhất</p>
            <h2 id="video-ai247" className="mt-2 text-3xl font-black sm:text-4xl">Video AI marketing</h2>
          </div>
          <Ai247VideoGallery />
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}
