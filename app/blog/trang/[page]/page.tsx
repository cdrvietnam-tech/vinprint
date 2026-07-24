import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListing from "../../../components/blog/BlogListing";
import Footer from "../../../components/home/Footer";
import Header from "../../../components/home/Header";
import { paginateBlogPosts } from "../../../lib/blog-pagination";
import { blogPosts } from "../../../lib/blog-posts";
import { getManagedBlogPosts } from "../../../lib/content-overrides.server";

export function generateStaticParams() {
  const { totalPages } = paginateBlogPosts(blogPosts, 1);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const page = Number((await params).page);
  return {
    title: `Cẩm nang tem nhãn – Trang ${page}`,
    description: `Các bài hướng dẫn tem nhãn của VinPrint, trang ${page}.`,
    alternates: { canonical: `/blog/trang/${page}` },
  };
}

export default async function PaginatedBlogPage({ params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  const managedBlogPosts = await getManagedBlogPosts();
  const pagination = paginateBlogPosts(managedBlogPosts, page);
  if (!Number.isInteger(page) || page < 2 || page > pagination.totalPages) notFound();
  const latestUpdatedAt = managedBlogPosts.reduce((latest, post) => post.updatedAt > latest ? post.updatedAt : latest, managedBlogPosts[0]?.updatedAt ?? "2026-07-20");

  return <div className="min-h-screen bg-[#F7F4EE] text-gray-950"><Header /><main id="main-content" tabIndex={-1} className="pt-20"><BlogListing posts={pagination.items} totalItems={pagination.totalItems} latestUpdatedAt={latestUpdatedAt} currentPage={page} totalPages={pagination.totalPages} /></main><Footer /></div>;
}

