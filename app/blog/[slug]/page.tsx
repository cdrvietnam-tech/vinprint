import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import BlogCard from "../../components/blog/BlogCard";
import ConversionLink from "../../components/ConversionLink";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import { blogPosts, getBlogArticle, getBlogCategoryLabel } from "../../lib/blog-posts";
import { productBySlug } from "../../lib/products";

type BlogArticlePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `/blog/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ["VinPrint"],
      images: [{ url: article.image, alt: article.imageAlt }],
    },
  };
}

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("http")) {
    return <a href={href} target="_blank" rel="noreferrer" className="font-black text-[#4933D4] underline decoration-2 underline-offset-4">{children} <ArrowUpRight aria-hidden="true" className="inline h-4 w-4" /></a>;
  }
  return <Link href={href} className="font-black text-[#4933D4] underline decoration-2 underline-offset-4">{children}</Link>;
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  const relatedProducts = article.relatedProductSlugs.map((productSlug) => productBySlug[productSlug]).filter(Boolean);
  const relatedPosts = blogPosts.filter((post) => post.slug !== article.slug && post.category === article.category).slice(0, 2);
  const fallbackRelatedPosts = relatedPosts.length >= 2
    ? relatedPosts
    : [...relatedPosts, ...blogPosts.filter((post) => post.slug !== article.slug && !relatedPosts.includes(post))].slice(0, 2);
  const articleText = [article.directAnswer, ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])])].join(" ");
  const wordCount = articleText.trim().split(/\s+/).length;
  const canonicalUrl = `https://vinprint.vn/blog/${article.slug}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    headline: article.title,
    description: article.description,
    image: `https://vinprint.vn${article.image}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: canonicalUrl,
    author: { "@type": "Organization", name: "Đội ngũ VinPrint", url: "https://vinprint.vn/gioi-thieu" },
    publisher: { "@type": "Organization", name: "VinPrint", url: "https://vinprint.vn", logo: { "@type": "ImageObject", url: "https://vinprint.vn/favicon.svg" } },
    articleSection: getBlogCategoryLabel(article.category),
    wordCount,
    inLanguage: "vi-VN",
    citation: article.sources.map((source) => source.href.startsWith("http") ? source.href : `https://vinprint.vn${source.href}`),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://vinprint.vn/" },
      { "@type": "ListItem", position: 2, name: "Cẩm nang tem nhãn", item: "https://vinprint.vn/blog" },
      { "@type": "ListItem", position: 3, name: article.title, item: canonicalUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-gray-950">
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        <article>
          <header className="border-b border-black/10 bg-[#171310] px-4 py-12 text-white sm:py-16">
            <div className="mx-auto max-w-5xl">
              <nav aria-label="Đường dẫn bài viết" className="flex flex-wrap items-center gap-2 text-sm font-bold text-white/70">
                <Link href="/" className="inline-flex min-h-11 items-center hover:text-white">Trang chủ</Link><span aria-hidden="true">/</span>
                <Link href="/blog" className="inline-flex min-h-11 items-center hover:text-white">Cẩm nang</Link>
              </nav>
              <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-[#D5FF43]">{getBlogCategoryLabel(article.category)}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{article.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">{article.description}</p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-white/70">
                <time dateTime={article.updatedAt} className="inline-flex items-center gap-2"><CalendarDays aria-hidden="true" className="h-4 w-4" /> Cập nhật 20/07/2026</time>
                <span className="inline-flex items-center gap-2"><Clock3 aria-hidden="true" className="h-4 w-4" /> {article.readingMinutes} phút đọc</span>
                <span>Biên tập: <Link href="/gioi-thieu" className="underline underline-offset-4 hover:text-white">Đội ngũ VinPrint</Link></span>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
            <div className="relative aspect-[16/8] overflow-hidden rounded-[32px] bg-white shadow-sm">
              <Image src={article.image} alt={article.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
            </div>

            <section aria-labelledby="short-answer" className="mt-8 rounded-[32px] border-2 border-[#D83B00] bg-orange-50 p-6 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D83B00]">Câu trả lời ngắn</p>
              <h2 id="short-answer" className="mt-3 text-2xl font-black sm:text-3xl">Điểm cần nhớ trước khi đặt in</h2>
              <p className="mt-5 text-lg leading-8 text-gray-800">{article.directAnswer}</p>
            </section>

            <div className="mt-8 space-y-8">
              {article.sections.map((section) => (
                <section key={section.heading} className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-9">
                  <h2 className="text-2xl font-black leading-tight sm:text-3xl">{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-5 text-base leading-8 text-gray-700 sm:text-lg">{paragraph}</p>)}
                  {section.bullets && <ul className="mt-6 grid gap-3 sm:grid-cols-2">{section.bullets.map((item) => <li key={item} className="rounded-2xl bg-[#F7F4EE] px-5 py-4 font-semibold leading-7 text-gray-900">✓ {item}</li>)}</ul>}
                  {section.table && (
                    <div className="mt-7 overflow-x-auto rounded-2xl border border-black/10">
                      <table className="w-full min-w-[640px] border-collapse text-left">
                        <thead className="bg-[#171310] text-white"><tr>{section.table.headers.map((header) => <th key={header} scope="col" className="px-5 py-4 text-sm font-black uppercase tracking-wide">{header}</th>)}</tr></thead>
                        <tbody>{section.table.rows.map((row) => <tr key={row.join("|")} className="border-t border-black/10">{row.map((cell, index) => <td key={cell} className={`px-5 py-4 align-top leading-7 ${index === 0 ? "font-black text-gray-950" : "text-gray-700"}`}>{cell}</td>)}</tr>)}</tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}
            </div>

            <section className="mt-8 rounded-[28px] bg-[#EDE8FF] p-6 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4933D4]">Minh bạch nội dung</p>
              <h2 className="mt-3 text-2xl font-black">Nguồn và phương pháp biên soạn</h2>
              <p className="mt-4 leading-8 text-gray-700">Đội ngũ VinPrint tổng hợp bài viết từ dữ liệu sản phẩm đang công khai, hướng dẫn kỹ thuật nội bộ trên website và các nguồn chuyên môn được liệt kê dưới đây. AI hỗ trợ sắp xếp cấu trúc; nội dung cần được rà soát lại khi vật liệu, thiết bị hoặc quy cách sản xuất thay đổi.</p>
              <ul className="mt-6 space-y-4">
                {article.sources.map((source) => <li key={source.href} className="rounded-2xl bg-white p-5"><SourceLink href={source.href}>{source.title}</SourceLink><p className="mt-2 leading-7 text-gray-600">{source.note}</p></li>)}
              </ul>
            </section>

            <section className="mt-8 rounded-[28px] border border-black/10 bg-white p-6 sm:p-9">
              <h2 className="text-2xl font-black">Sản phẩm liên quan</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {relatedProducts.map((product) => <Link key={product.slug} href={`/san-pham/${product.slug}`} className="rounded-2xl border border-black/10 bg-[#F7F4EE] p-5 hover:border-[#D83B00]"><small className="font-black uppercase tracking-wide text-[#D83B00]">{product.eyebrow}</small><strong className="mt-2 block text-lg">{product.name}</strong><span className="mt-2 block text-sm leading-6 text-gray-600">{product.benefit}</span></Link>)}
              </div>
            </section>

            <aside className="mt-8 rounded-[32px] bg-[#6545ED] p-7 text-white sm:flex sm:items-center sm:justify-between sm:p-10">
              <div><h2 className="text-2xl font-black">Cần kiểm tra trên sản phẩm thật?</h2><p className="mt-2 max-w-xl leading-7 text-white/80">Gửi ảnh bao bì, kích thước và số lượng để xưởng tư vấn vật liệu hoặc dựng mẫu phù hợp.</p></div>
              <ConversionLink href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" eventName="click_zalo" eventPosition={`blog_${article.slug}`} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 font-black text-[#3D28BC] sm:mt-0">Nhắn Zalo nhận tư vấn</ConversionLink>
            </aside>

            <section className="mt-14">
              <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#D83B00]">Đọc tiếp</p><h2 className="mt-2 text-3xl font-black">Bài viết liên quan</h2></div><Link href="/blog" className="inline-flex min-h-11 items-center font-black text-[#4933D4]">Xem tất cả</Link></div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">{fallbackRelatedPosts.map((post) => <BlogCard key={post.slug} post={post} />)}</div>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
