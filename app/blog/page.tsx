import type { Metadata } from "next";
import BlogCard from "../components/blog/BlogCard";
import BlogCategoryNav from "../components/blog/BlogCategoryNav";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import { blogCategories, blogPosts, formatBlogDate } from "../lib/blog-posts";

export const metadata: Metadata = {
  title: "Cẩm nang tem nhãn: vật liệu, thiết kế và kỹ thuật in",
  description: "Hướng dẫn chọn chất liệu, kích thước, chuẩn bị file và sử dụng tem nhãn trên sản phẩm thật từ VinPrint.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Cẩm nang tem nhãn | VinPrint",
    description: "Câu trả lời thực tế về vật liệu, thiết kế và kỹ thuật in tem nhãn.",
    url: "/blog",
    images: [{ url: "/images/hero-products.webp", alt: "Cẩm nang tem nhãn VinPrint" }],
  },
};

type BlogIndexPageProps = {
  searchParams: Promise<{ "chuyen-muc"?: string }>;
};

export default async function BlogIndexPage({ searchParams }: BlogIndexPageProps) {
  const { "chuyen-muc": requestedCategory } = await searchParams;
  const knownCategory = blogCategories.find((category) => category.slug === requestedCategory);
  const selectedCategory = knownCategory?.slug ?? "tat-ca";
  const visiblePosts = selectedCategory === "tat-ca"
    ? blogPosts
    : blogPosts.filter((post) => post.category === selectedCategory);
  const latestUpdatedAt = blogPosts.reduce((latest, post) => post.updatedAt > latest ? post.updatedAt : latest, blogPosts[0]?.updatedAt ?? "2026-07-20");

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-gray-950">
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-20">
        <section className="border-b border-black/10 bg-[#171310] px-4 py-12 text-white">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D5FF43]">Kiến thức từ xưởng</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">Cẩm nang tem nhãn</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">Giải thích ngắn gọn, có phương pháp và liên kết tới sản phẩm thực tế để bạn chọn đúng trước khi in.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-12">
          <BlogCategoryNav ariaLabel="Lọc bài viết theo chuyên mục" selectedCategory={selectedCategory} />

          <p className="mt-5 text-sm font-bold text-gray-600">{visiblePosts.length} bài viết · Cập nhật ngày {formatBlogDate(latestUpdatedAt)}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visiblePosts.map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
