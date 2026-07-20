import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { rawBlogArticles } from "../../content/blog/index.ts";
import { articleSchema } from "../../app/lib/blog-schema.ts";
import { companyPages, guidePages, industryPages } from "../../app/lib/content-pages.ts";
import { products } from "../../app/lib/products.ts";
import { evaluateArticleRecord } from "../../agent/evaluator.ts";

const root = process.cwd();
const checkLinks = process.argv.includes("--check-links");
const files = readdirSync(path.join(root, "content/blog/published")).filter((file) => file.endsWith(".json")).sort();
const articles = rawBlogArticles.map((record) => articleSchema.parse(record));
const failures = [];
const validRelatedProductSlugs = new Set(products.map((product) => product.slug));

if (files.length !== articles.length) failures.push(`content index has ${articles.length} records but published directory has ${files.length} files`);

const knownRoutes = new Set([
  "/", "/blog", "/quy-trinh-bien-soan", "/case-study",
  ...products.map((product) => `/san-pham/${product.slug}`),
  ...Object.keys(companyPages).map((slug) => `/${slug}`),
  ...Object.keys(guidePages).map((slug) => `/huong-dan/${slug}`),
  ...Object.keys(industryPages).map((slug) => `/nganh/${slug}`),
  ...articles.map((article) => `/blog/${article.slug}`),
]);

for (const article of articles) {
  const evaluation = evaluateArticleRecord(article, {
    existingArticles: articles,
    assetExists: (imagePath) => existsSync(path.join(root, "public", imagePath.replace(/^\//, ""))),
    validRelatedProductSlugs,
  });
  if (!evaluation.publishable) failures.push(`${article.slug}: ${evaluation.failures.join("; ")}`);
  if (!files.includes(`${article.slug}.json`)) failures.push(`${article.slug}: filename does not match slug`);

  for (const source of article.sources) {
    if (source.href.startsWith("/")) {
      const localPath = source.href.split(/[?#]/, 1)[0];
      if (!knownRoutes.has(localPath)) failures.push(`${article.slug}: unknown internal source ${source.href}`);
    } else if (!/^https:\/\//.test(source.href)) {
      failures.push(`${article.slug}: unsupported source URL ${source.href}`);
    }
  }
}

if (checkLinks) {
  const externalSources = [...new Set(articles.flatMap((article) => article.sources.map((source) => source.href)).filter((href) => href.startsWith("https://")))];
  for (const href of externalSources) {
    try {
      const response = await fetch(href, { signal: AbortSignal.timeout(12000), headers: { "User-Agent": "VinPrintContentAudit/1.0" } });
      if (!response.ok) failures.push(`external source returned ${response.status}: ${href}`);
      await response.body?.cancel();
    } catch (error) {
      failures.push(`external source unavailable: ${href} (${error instanceof Error ? error.message : String(error)})`);
    }
  }
}

if (failures.length) {
  console.error(`SEO-GEO content audit failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`SEO-GEO content audit passed: ${articles.length} articles, all >=95, schema/assets/sources valid${checkLinks ? ", external links reachable" : ""}.`);
}
