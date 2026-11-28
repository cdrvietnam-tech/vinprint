import type { MetadataRoute } from "next";
import { products } from "./lib/products";
import { companyPages, guidePages, industryPages } from "./lib/content-pages";
import { blogCategories, blogPosts } from "./lib/blog-posts";
import { facebookPosts } from "./lib/facebook-posts";
import { productOrderContext, productOrderUpdatedAt } from "./lib/product-order-context";

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
      lastModified: new Date("2026-11-28T00:00:00+07:00"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {url:`${baseUrl}/cong-cu-mien-phi`,lastModified:new Date("2026-11-27T00:00:00+07:00"),changeFrequency:"monthly",priority:0.7},
    ...products.map((product) => ({
      url: `${baseUrl}/san-pham/${product.slug}`,
      lastModified: productOrderContext[product.slug] ? new Date(`${productOrderUpdatedAt}T00:00:00+07:00`) : lastModified,
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
    {
      url: `${baseUrl}/mau-tem-moi`,
      lastModified: new Date(facebookPosts[0]?.syncedAt ?? "2026-09-22T00:00:00+07:00"),
      changeFrequency: "daily",
      priority: 0.7,
      images: facebookPosts.map((post) => `${baseUrl}${post.image}`),
    },
    {
      url: `${baseUrl}/ai247`,
      lastModified: new Date("2026-09-26T00:00:00+07:00"),
      changeFrequency: "daily",
      priority: 0.75,
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
