import type { Metadata } from "next";
import Image from "next/image";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import { facebookPosts } from "../lib/facebook-posts";

export const metadata: Metadata = {
  title: "Mẫu tem mới từ xưởng VinPrint",
  description: "Các mẫu tem, sticker và ứng dụng bao bì mới được đồng bộ từ fanpage chính thức VinPrint.",
  alternates: { canonical: "/mau-tem-moi" },
  openGraph: {
    title: "Mẫu tem mới từ VinPrint",
    description: "Xem các mẫu tem và ứng dụng bao bì mới tại xưởng VinPrint.",
    url: "/mau-tem-moi",
    images: [{ url: "/images/hero-products.webp", alt: "Mẫu tem mới từ VinPrint" }],
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "long", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value));
}

export default function LatestLabelsPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-gray-950">
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-20">
        <section className="mx-auto max-w-[1180px] px-4 py-14 sm:py-20">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#D83B00]">Cập nhật từ fanpage VinPrint</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Mẫu tem mới từ xưởng</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-700">
            Hình ảnh và nội dung dưới đây được đồng bộ từ fanpage chính thức. Mỗi bài đều dẫn về bài đăng gốc để anh chị kiểm tra thông tin và xem thêm chi tiết.
          </p>

          {facebookPosts.length ? (
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {facebookPosts.map((post) => (
                <article key={post.postId} className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <Image src={post.image} alt={post.imageAlt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="text-xs font-black uppercase tracking-wider text-[#D83B00]">{formatDate(post.publishedAt)}</p>
                    <h2 className="mt-3 text-2xl font-black leading-tight">{post.headline}</h2>
                    <p className="mt-4 whitespace-pre-line text-base leading-7 text-gray-700">{post.message}</p>
                    <a className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#1A1A2E] px-5 text-sm font-black text-white hover:bg-[#D83B00]" href={post.permalink} target="_blank" rel="noreferrer">
                      Xem bài gốc trên Facebook
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-[28px] border border-dashed border-gray-300 bg-white p-10 text-gray-700">
              Chưa có bài nào được đồng bộ. Workflow chỉ đưa bài lên sau khi kiểm tra trùng và hoàn tất cổng duyệt của website.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
