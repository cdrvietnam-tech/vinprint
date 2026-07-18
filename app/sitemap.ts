import type { MetadataRoute } from "next";
import { products } from "./lib/products";
import { companyPages, guidePages, industryPages } from "./lib/content-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vinprint.vn";
  const lastModified = new Date("2026-07-16T00:00:00+07:00");

  const contentRoutes = [
    ...Object.keys(companyPages).map((slug) => `/${slug}`),
    ...Object.keys(industryPages).map((slug) => `/nganh/${slug}`),
    ...Object.keys(guidePages).map((slug) => `/huong-dan/${slug}`),
  ];

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...products.map((product) => ({
      url: `${baseUrl}/san-pham/${product.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...contentRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route.startsWith("/huong-dan/") ? 0.7 : 0.75,
    })),
  ];
}
