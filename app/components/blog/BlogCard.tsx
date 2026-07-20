import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getBlogCategoryLabel, type BlogPost } from "../../lib/blog-posts";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm transition-transform hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-orange-50">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#D83B00]">
            <span>{getBlogCategoryLabel(post.category)}</span>
            <span aria-hidden="true">·</span>
            <span className="text-gray-600">{post.readingMinutes} phút đọc</span>
          </div>
          <h3 className="mt-3 text-xl font-black leading-snug text-gray-950 sm:text-2xl">{post.title}</h3>
          <p className="mt-3 line-clamp-3 leading-7 text-gray-700">{post.description}</p>
          <span className="mt-5 inline-flex min-h-11 items-center gap-2 font-black text-[#4933D4]">
            Đọc hướng dẫn <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}
