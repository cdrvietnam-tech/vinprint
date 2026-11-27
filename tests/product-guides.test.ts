import assert from "node:assert/strict";
import test from "node:test";
import { products } from "../app/lib/products.ts";
import { productGuides } from "../app/lib/product-guides.ts";
import { blogPostBySlug } from "../app/lib/blog-posts.ts";
import { companyPages, guidePages, industryPages } from "../app/lib/content-pages.ts";
import { DEFAULT_MEDIA_COLLECTIONS } from "../app/lib/media-collections.ts";

const knownRoutes = new Set([
  "/san-pham",
  ...products.map((product) => `/san-pham/${product.slug}`),
  ...Object.keys(companyPages).map((slug) => `/${slug}`),
  ...Object.keys(industryPages).map((slug) => `/nganh/${slug}`),
  ...Object.keys(guidePages).map((slug) => `/huong-dan/${slug}`),
]);

test("every product has a buying guide with FAQs", () => {
  for (const product of products) {
    const guide = productGuides[product.slug];
    assert.ok(guide, `${product.slug} is missing a guide`);
    assert.ok(guide.paragraphs.length >= 2 && guide.faqs.length >= 3, `${product.slug} guide is too thin`);
    assert.ok(guide.chooseWhen.length >= 3 && guide.watchOut.length >= 3);
  }
  assert.deepEqual(Object.keys(productGuides).sort(), products.map((product) => product.slug).sort());
});

test("guide links point to pages and articles that exist", () => {
  for (const [slug, guide] of Object.entries(productGuides)) {
    for (const link of guide.links) assert.ok(knownRoutes.has(link.href), `${slug}: unknown link ${link.href}`);
    for (const post of guide.posts) assert.ok(blogPostBySlug[post], `${slug}: unknown article ${post}`);
  }
});

test("gallery items have descriptive titles and specific destinations", () => {
  for (const item of DEFAULT_MEDIA_COLLECTIONS.gallery) {
    assert.doesNotMatch(item.title, /^Mẫu tem VinPrint \d+$/);
    assert.ok(knownRoutes.has(item.href) && item.href !== "/san-pham", `${item.id}: ${item.href}`);
  }
});
