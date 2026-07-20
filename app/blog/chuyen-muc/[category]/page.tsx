import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListing from "../../../components/blog/BlogListing";
import Footer from "../../../components/home/Footer";
import Header from "../../../components/home/Header";
import { blogCategories, blogPosts, getBlogCategoryLabel, type BlogCategorySlug } from "../../../lib/blog-posts";

const categorySlugs = blogCategories.filter((category) => category.slug !== "tat-ca").map((category) => category.slug) as BlogCategorySlug[];

export function generateStaticParams() {
  return categorySlugs.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const category = (await params).category as BlogCategorySlug;
  if (!categorySlugs.includes(category)) return {};
  const label = getBlogCategoryLabel(category);
  return {
    title: `${label} – Cẩm nang tem nhãn`,
    description: `Các bài hướng dẫn ${label.toLocaleLowerCase("vi-VN")} từ VinPrint.`,
    alternates: { canonical: `/blog/chuyen-muc/${category}` },
  };
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const category = (await params).category as BlogCategorySlug;
  if (!categorySlugs.includes(category)) notFound();
  const posts = blogPosts.filter((post) => post.category === category);
  const latestUpdatedAt = posts.reduce((latest, post) => post.updatedAt > latest ? post.updatedAt : latest, posts[0]?.updatedAt ?? "2026-07-20");

  return <div className="min-h-screen bg-[#F7F4EE] text-gray-950"><Header /><main id="main-content" tabIndex={-1} className="pt-20"><BlogListing posts={posts} totalItems={posts.length} latestUpdatedAt={latestUpdatedAt} selectedCategory={category} eyebrow="Chuyên mục tem nhãn" title={getBlogCategoryLabel(category)} description={`Kiến thức thực tế về ${getBlogCategoryLabel(category).toLocaleLowerCase("vi-VN")} từ đội ngũ VinPrint.`} pageBasePath={`/blog/chuyen-muc/${category}`} /></main><Footer /></div>;
}

