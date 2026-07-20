import Link from "next/link";
import BlogCard from "../blog/BlogCard";
import BlogCategoryNav from "../blog/BlogCategoryNav";
import { blogPosts } from "../../lib/blog-posts";

export default function BlogHighlights() {
  return (
    <section id="cam-nang-tem-nhan" className="bg-[#F7F4EE] py-12">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#D83B00]">Kiến thức từ xưởng</p>
          <h2 className="mt-3 text-3xl font-black uppercase leading-tight text-gray-950 sm:text-5xl">Cẩm nang tem nhãn</h2>
          <p className="mt-4 text-lg leading-8 text-gray-700">Câu trả lời rõ ràng về vật liệu, kích thước, file in và cách dùng tem trên sản phẩm thật.</p>
        </div>

        <div className="mt-8"><BlogCategoryNav ariaLabel="Chuyên mục cẩm nang tem nhãn" /></div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.slice(0, 6).map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>

        <div className="mt-10 text-center">
          <Link href="/blog" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#171310] px-7 font-black text-white hover:bg-[#D83B00]">
            Xem toàn bộ cẩm nang
          </Link>
        </div>
      </div>
    </section>
  );
}
