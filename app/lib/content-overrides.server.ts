import { headers } from "next/headers";
import {
  parseManagedArticleOverride,
  parseManagedProductOverride,
  type ManagedArticleOverride,
  type ManagedContentType,
  type ManagedProductOverride,
} from "./content-management";
import { blogPosts, getBlogArticle, type BlogArticle, type BlogPost } from "./blog-posts";
import { productBySlug, products, type Product } from "./products";

async function readOverrides(type: "products"): Promise<ManagedProductOverride[]>;
async function readOverrides(type: "articles"): Promise<ManagedArticleOverride[]>;
async function readOverrides(type: ManagedContentType) {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
    if (!host) return [];
    const hostname = host.split(":", 1)[0].toLowerCase();
    if (!["vinprint.vn", "www.vinprint.vn", "localhost", "127.0.0.1"].includes(hostname)) return [];
    const protocol = hostname === "localhost" || hostname === "127.0.0.1" ? "http" : "https";
    const response = await fetch(`${protocol}://${host}/api/content/overrides?type=${type}`, { cache: "no-store" });
    if (!response.ok) return [];
    const result = await response.json() as { items?: unknown[] };
    const values = result.items;
    if (!Array.isArray(values)) return [];
    return values.flatMap((value) => {
      try {
        return [type === "products" ? parseManagedProductOverride(value) : parseManagedArticleOverride(value)];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
}

export async function getManagedProducts(): Promise<Product[]> {
  const overrides = new Map((await readOverrides("products")).map((item) => [item.slug, item]));
  return products.map((product) => ({ ...product, ...overrides.get(product.slug) }));
}

export async function getManagedProduct(slug: string): Promise<Product | undefined> {
  const product = productBySlug[slug];
  if (!product) return undefined;
  const override = (await readOverrides("products")).find((item) => item.slug === slug);
  return override ? { ...product, ...override } : product;
}

export async function getManagedBlogPosts(): Promise<BlogPost[]> {
  const overrides = new Map((await readOverrides("articles")).map((item) => [item.slug, item]));
  return blogPosts.map((post) => {
    const override = overrides.get(post.slug);
    return override ? { ...post, title: override.title, description: override.description } : post;
  });
}

export async function getManagedBlogArticle(slug: string): Promise<BlogArticle | undefined> {
  const article = getBlogArticle(slug);
  if (!article) return undefined;
  const override = (await readOverrides("articles")).find((item) => item.slug === slug);
  return override
    ? { ...article, title: override.title, description: override.description, directAnswer: override.directAnswer, sections: override.sections }
    : article;
}
