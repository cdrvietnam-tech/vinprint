import type { Metadata } from "next";
import ContentAdmin from "../../components/admin/ContentAdmin";
import { allBlogArticles } from "../../lib/blog-posts";
import { products } from "../../lib/products";

export const metadata: Metadata = {
  title: "Quản trị nội dung | VinPrint",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ContentAdminPage() {
  return (
    <ContentAdmin
      products={products.map(({ slug, name, eyebrow, description, benefit, uses }) => ({
        slug, name, eyebrow, description, benefit, uses,
      }))}
      articles={allBlogArticles.map(({ slug, title, description, directAnswer, sections }) => ({
        slug, title, description, directAnswer, sections,
      }))}
    />
  );
}
