import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getBlogCategoryLabel, type BlogPost } from "../../lib/blog-posts";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm transition-transform hover:-translate-y-1">
      <Link
        href={`/blog/${post.slug}`}
        className="grid grid-cols-[112px_minmax(0,1fr)] items-start sm:grid-cols-[180px_minmax(0,1fr)] md:block"
      >
        <div
          data-blog-thumbnail="compact"
          className="relative m-3 mr-0 aspect-square overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_top_left,#FFF2D8_0%,#F6E7D6_55%,#EDE3D8_100%)] sm:m-4 sm:mr-0 md:m-0 md:h-48 md:aspect-auto md:rounded-none xl:h-52"
        >
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(max-width: 639px) 112px, (max-width: 767px) 180px, (max-width: 1279px) 50vw, 33vw"
            style={{ objectFit: "contain" }}
            className="object-contain p-2.5 transition-transform duration-500 group-hover:scale-105 md:p-4"
          />
        </div>
        <div className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#D83B00] sm:text-xs">
            <span>{getBlogCategoryLabel(post.category)}</span>
            <span aria-hidden="true">·</span>
            <span className="text-gray-600">{post.readingMinutes} phút đọc</span>
          </div>
          <h3 className="mt-2 text-base font-black leading-snug text-gray-950 sm:text-xl md:mt-3 xl:text-2xl">{post.title}</h3>
          <p className="mt-2 hidden leading-7 text-gray-700 sm:line-clamp-2 md:mt-3 md:line-clamp-3">{post.description}</p>
          <span className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-black text-[#4933D4] sm:mt-4 md:mt-5 md:min-h-11 md:text-base">
            Đọc hướng dẫn <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}
