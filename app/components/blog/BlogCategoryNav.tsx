import Link from "next/link";
import { blogCategories } from "../../lib/blog-posts";

type BlogCategoryNavProps = {
  ariaLabel: string;
  selectedCategory?: (typeof blogCategories)[number]["slug"];
};

export default function BlogCategoryNav({ ariaLabel, selectedCategory }: BlogCategoryNavProps) {
  return (
    <nav aria-label={ariaLabel} className="flex gap-3 overflow-x-auto pb-3">
      {blogCategories.map((category) => {
        const active = category.slug === selectedCategory;
        const href = category.slug === "tat-ca" ? "/blog" : `/blog?chuyen-muc=${category.slug}`;
        return (
          <Link
            key={category.slug}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-5 text-sm font-black ${active ? "border-[#D83B00] bg-[#D83B00] text-white" : "border-black/15 bg-white text-gray-900 hover:border-[#D83B00] hover:text-[#D83B00]"}`}
          >
            {category.label}
          </Link>
        );
      })}
    </nav>
  );
}
