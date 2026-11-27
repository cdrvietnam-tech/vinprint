import type { MetadataRoute } from "next";
import { products } from "./lib/products";
import { companyPages, guidePages, industryPages } from "./lib/content-pages";
import { blogCategories, blogPosts } from "./lib/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vinprint.vn";
  const lastModified = new Date("2026-07-16T00:00:00+07:00");

  const pageDate = (page: { updatedAt?: string }) =>
    page.updatedAt ? new Date(`${page.updatedAt}T00:00:00+07:00`) : lastModified;

  const contentRoutes = [
    ...Object.entries(companyPages).map(([slug, page]) => ({ route: `/${slug}`, modified: pageDate(page) })),
    ...Object.entries(industryPages).map(([slug, page]) => ({ route: `/nganh/${slug}`, modified: pageDate(page) })),
    ...Object.entries(guidePages).map(([slug, page]) => ({ route: `/huong-dan/${slug}`, modified: pageDate(page) })),
  ];

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...products.map((product) => ({
      url: `${baseUrl}/san-pham/${product.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...contentRoutes.map(({ route, modified }) => ({
      url: `${baseUrl}${route}`,
      lastModified: modified,
      changeFrequency: "monthly" as const,
      priority: route.startsWith("/huong-dan/") ? 0.7 : 0.75,
    })),
    {
      url: `${baseUrl}/quy-trinh-bien-soan`,
      lastModified: new Date("2026-07-20T00:00:00+07:00"),
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2026-07-20T00:00:00+07:00"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogCategories.filter((category) => category.slug !== "tat-ca").map((category) => ({
      url: `${baseUrl}/blog/chuyen-muc/${category.slug}`,
      lastModified: new Date("2026-07-20T00:00:00+07:00"),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(`${post.updatedAt}T00:00:00+07:00`),
      changeFrequency: "monthly" as const,
      priority: 0.75,
      images: [`${baseUrl}${post.image}`],
    })),
  ];
}
