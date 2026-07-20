import Link from "next/link";
import BlogCard from "./BlogCard";
import BlogCategoryNav from "./BlogCategoryNav";
import { formatBlogDate, type BlogCategorySlug, type BlogPost } from "../../lib/blog-posts";

type BlogListingProps = {
  posts: BlogPost[];
  totalItems: number;
  latestUpdatedAt: string;
  selectedCategory?: BlogCategorySlug | "tat-ca";
  eyebrow?: string;
  title?: string;
  description?: string;
  currentPage?: number;
  totalPages?: number;
  pageBasePath?: string;
};

export default function BlogListing({
  posts,
  totalItems,
  latestUpdatedAt,
  selectedCategory = "tat-ca",
  eyebrow = "Kiến thức từ xưởng",
  title = "Cẩm nang tem nhãn",
  description = "Giải thích ngắn gọn, có phương pháp và liên kết tới sản phẩm thực tế để bạn chọn đúng trước khi in.",
  currentPage = 1,
  totalPages = 1,
  pageBasePath = "/blog",
}: BlogListingProps) {
  return (
    <>
      <section className="border-b border-black/10 bg-[#171310] px-4 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#D5FF43]">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">{description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12">
        <BlogCategoryNav ariaLabel="Lọc bài viết theo chuyên mục" selectedCategory={selectedCategory} />
        <p className="mt-5 text-sm font-bold text-gray-600">{totalItems} bài viết · Cập nhật ngày {formatBlogDate(latestUpdatedAt)}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>

        {totalPages > 1 && (
          <nav aria-label="Phân trang bài viết" className="mt-12 flex flex-wrap justify-center gap-3">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
              const href = page === 1 ? pageBasePath : `${pageBasePath}/trang/${page}`;
              return <Link key={page} href={href} aria-current={page === currentPage ? "page" : undefined} className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-4 font-black ${page === currentPage ? "border-[#D83B00] bg-[#D83B00] text-white" : "border-black/15 bg-white hover:border-[#D83B00]"}`}>{page}</Link>;
            })}
          </nav>
        )}
      </section>
    </>
  );
}

