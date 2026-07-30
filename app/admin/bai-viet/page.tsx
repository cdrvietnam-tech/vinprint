import type { Metadata } from "next";
import BlogDashboard, { type BlogRow } from "../../components/admin/BlogDashboard";
import { allBlogArticles, selectPublicArticles, getBlogCategoryLabel } from "../../lib/blog-posts";

export const metadata: Metadata = {
  title: "Theo dõi bài viết | VinPrint",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function BlogAdminPage() {
  const liveSlugs = new Set(selectPublicArticles(allBlogArticles, new Date()).map((article) => article.slug));

  const rows: BlogRow[] = allBlogArticles
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      category: article.category,
      categoryLabel: getBlogCategoryLabel(article.category),
      status: article.status,
      publishAt: article.publishAt,
      updatedAt: article.updatedAt,
      readingMinutes: article.readingMinutes,
      qualityTotal: Object.values(article.quality.scores).reduce((sum, value) => sum + value, 0),
      isLive: liveSlugs.has(article.slug),
    }))
    .sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime());

  return <BlogDashboard rows={rows} />;
}
