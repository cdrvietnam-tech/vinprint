import { rawBlogArticles } from "../../content/blog/index";
import { evaluateArticleRecord } from "../../agent/evaluator";
import { products } from "./products";
import {
  articleSchema,
  blogCategorySlugs,
  type BlogArticleRecord,
  type BlogArticleSection,
  type BlogCategorySlug,
} from "./blog-schema";

const categoryLabels: Record<BlogCategorySlug, string> = {
  "chat-lieu": "Chọn chất liệu",
  "thiet-ke": "Thiết kế tem",
  "theo-nganh": "Theo ngành",
  "ky-thuat-in": "Kỹ thuật in",
};

export const blogCategories = [
  { slug: "tat-ca", label: "Tất cả" },
  ...blogCategorySlugs.map((slug) => ({ slug, label: categoryLabels[slug] })),
] as const;

export type { BlogArticleSection, BlogCategorySlug };

export type BlogPost = Pick<BlogArticleRecord,
  "slug" | "title" | "description" | "category" | "image" | "imageAlt" |
  "publishedAt" | "updatedAt" | "readingMinutes"
>;

export type BlogArticleDetails = Pick<BlogArticleRecord,
  "directAnswer" | "sections" | "relatedProductSlugs" | "sources"
>;

export type BlogArticle = BlogPost & BlogArticleDetails;

export const allBlogArticles: BlogArticleRecord[] = rawBlogArticles.map((article) => articleSchema.parse(article));

export function selectPublicArticles(records: BlogArticleRecord[], now = new Date()): BlogArticleRecord[] {
  const candidates = records
    .filter((article) => article.status === "published" && new Date(article.publishAt) <= now)
    .sort((a, b) => new Date(a.publishAt).getTime() - new Date(b.publishAt).getTime());
  const accepted: BlogArticleRecord[] = [];

  for (const article of candidates) {
    const evaluation = evaluateArticleRecord(article, {
      existingArticles: accepted,
      assetExists: () => true,
      validRelatedProductSlugs: new Set(products.map((product) => product.slug)),
      now,
    });
    if (evaluation.publishable) accepted.push(article);
  }

  return accepted.sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime());
}

const publicArticles = selectPublicArticles(allBlogArticles);

export const blogPosts: BlogPost[] = publicArticles.map((article) => ({
  slug: article.slug,
  title: article.title,
  description: article.description,
  category: article.category,
  image: article.image,
  imageAlt: article.imageAlt,
  publishedAt: article.publishedAt,
  updatedAt: article.updatedAt,
  readingMinutes: article.readingMinutes,
}));

export const blogPostBySlug = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post]),
) as Record<string, BlogPost>;

const blogArticleBySlug = Object.fromEntries(
  publicArticles.map((article) => [article.slug, article]),
) as Record<string, BlogArticleRecord>;

export function getBlogArticle(slug: string): BlogArticle | undefined {
  const article = blogArticleBySlug[slug];
  if (!article) return undefined;
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category,
    image: article.image,
    imageAlt: article.imageAlt,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    readingMinutes: article.readingMinutes,
    directAnswer: article.directAnswer,
    sections: article.sections,
    relatedProductSlugs: article.relatedProductSlugs,
    sources: article.sources,
  };
}

export function getBlogCategoryLabel(slug: BlogCategorySlug) {
  return blogCategories.find((category) => category.slug === slug)?.label ?? slug;
}

export function formatBlogDate(date: string) {
  const [year, month, day] = date.split("-");
  return [day, month, year].filter(Boolean).join("/");
}
