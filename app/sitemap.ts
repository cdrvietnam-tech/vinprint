import type { MetadataRoute } from "next";
import { products } from "./lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vinprint.vn";
  const lastModified = new Date("2026-07-16T00:00:00+07:00");

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
  ];
}
