import type { Metadata } from "next";
import BlogListing from "../components/blog/BlogListing";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import { paginateBlogPosts } from "../lib/blog-pagination";
import { getManagedBlogPosts } from "../lib/content-overrides.server";

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

export default async function BlogIndexPage() {
  const managedBlogPosts = await getManagedBlogPosts();
  const pagination = paginateBlogPosts(managedBlogPosts, 1);
  const latestUpdatedAt = managedBlogPosts.reduce((latest, post) => post.updatedAt > latest ? post.updatedAt : latest, managedBlogPosts[0]?.updatedAt ?? "2026-07-20");

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-gray-950">
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-20">
        <BlogListing posts={pagination.items} totalItems={pagination.totalItems} latestUpdatedAt={latestUpdatedAt} totalPages={pagination.totalPages} />
      </main>
      <Footer />
    </div>
  );
}
