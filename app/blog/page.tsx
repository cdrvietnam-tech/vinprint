import type { Metadata } from "next";
import BlogListing from "../components/blog/BlogListing";
import BlogFrame from "../components/blog/BlogFrame";
import { paginateBlogPosts } from "../lib/blog-pagination";
import { blogPosts } from "../lib/blog-posts";

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

export default function BlogIndexPage() {
  const pagination = paginateBlogPosts(blogPosts, 1);
  const latestUpdatedAt = blogPosts.reduce((latest, post) => post.updatedAt > latest ? post.updatedAt : latest, blogPosts[0]?.updatedAt ?? "2026-07-20");

  return (
    <BlogFrame>

      <main id="main-content" tabIndex={-1} className="vp-blog-content">
        <BlogListing posts={pagination.items} totalItems={pagination.totalItems} latestUpdatedAt={latestUpdatedAt} totalPages={pagination.totalPages} />
      </main>

    </BlogFrame>
  );
}
