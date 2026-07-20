import { rawBlogArticles } from "../../content/blog/index.ts";
import { articleSchema } from "../../app/lib/blog-schema.ts";
import { evaluateArticleRecord } from "../../agent/evaluator.ts";

const articles = rawBlogArticles.map((record) => articleSchema.parse(record));
const evaluations = articles.map((article) => ({
  article,
  evaluation: evaluateArticleRecord(article, { existingArticles: articles, assetExists: () => true }),
}));
const latestDate = articles.reduce((latest, article) => article.publishedAt > latest ? article.publishedAt : latest, "");
const latest = evaluations.filter(({ article }) => article.publishedAt === latestDate);
const report = {
  generatedAt: new Date().toISOString(),
  latestPublishingDate: latestDate,
  publishedTotal: articles.length,
  latestBatch: latest.length,
  latestConversion: latest.filter(({ article }) => article.contentType === "conversion").length,
  latestAuthority: latest.filter(({ article }) => article.contentType === "authority").length,
  passRate: latest.length ? latest.filter(({ evaluation }) => evaluation.publishable).length / latest.length : 0,
  failures: latest.filter(({ evaluation }) => !evaluation.publishable).map(({ article, evaluation }) => ({ slug: article.slug, failures: evaluation.failures })),
};

console.log(JSON.stringify(report, null, 2));

