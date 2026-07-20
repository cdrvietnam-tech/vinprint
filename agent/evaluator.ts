import rubric from "./rubric.json" with { type: "json" };
import { articleSchema, type BlogArticleRecord } from "../app/lib/blog-schema.ts";

type EvaluationOptions = {
  existingArticles: BlogArticleRecord[];
  assetExists: (imagePath: string) => boolean;
  validRelatedProductSlugs?: Set<string>;
  enforcePublishTime?: boolean;
  now?: Date;
};

export type ArticleEvaluation = {
  score: number;
  publishable: boolean;
  failures: string[];
  dimensions: BlogArticleRecord["quality"]["scores"];
};

function normalizeIntent(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function tokens(value: string) {
  return new Set(normalizeIntent(value).split(" ").filter((token) => token.length > 2));
}

function overlap(left: string, right: string) {
  const leftTokens = tokens(left);
  const rightTokens = tokens(right);
  if (!leftTokens.size || !rightTokens.size) return 0;
  const shared = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  return shared / Math.min(leftTokens.size, rightTokens.size);
}

function deterministicCaps(article: BlogArticleRecord, options: EvaluationOptions) {
  const evidenceHrefs = new Set(article.sources.map((source) => source.href));
  const evidenceIdsMatch = article.quality.evidenceIds.length === evidenceHrefs.size
    && article.quality.evidenceIds.every((id) => evidenceHrefs.has(id));
  const claimChecksMatch = article.quality.claimChecks.every((check) => check.sourceIds.every((id) => evidenceHrefs.has(id)));
  const hasPrimaryEvidence = article.sources.some((source) => source.kind === "primary" || source.kind === "first-party");
  const hasCitableStructure = article.sections.some((section) => section.bullets?.length || section.table?.rows.length);
  const keywordAligned = overlap(article.primaryKeyword, `${article.title} ${article.description} ${article.directAnswer}`) >= 0.6;
  const originalEnough = !options.existingArticles.some((existing) => existing.slug !== article.slug
    && overlap(existing.directAnswer, article.directAnswer) >= 0.8);

  return {
    searchIntent: keywordAligned ? 20 : 15,
    originality: originalEnough ? 20 : 15,
    evidence: evidenceIdsMatch && claimChecksMatch && hasPrimaryEvidence ? 20 : 15,
    citability: hasCitableStructure && article.sections.length >= 2 ? 15 : 11,
    authority: article.authorId === article.reviewedBy && article.sources.every((source) => source.note.length >= 3) ? 10 : 7,
    internalLinks: article.relatedProductSlugs.length > 0
      && (!options.validRelatedProductSlugs || article.relatedProductSlugs.every((slug) => options.validRelatedProductSlugs?.has(slug))) ? 10 : 7,
    technical: options.assetExists(article.image) && article.imageAlt.length >= 10 ? 5 : 3,
  } satisfies BlogArticleRecord["quality"]["scores"];
}

export function evaluateArticleRecord(input: unknown, options: EvaluationOptions): ArticleEvaluation {
  const parsed = articleSchema.safeParse(input);
  if (!parsed.success) {
    return {
      score: 0,
      publishable: false,
      failures: parsed.error.issues.map((issue) => `schema: ${issue.path.join(".")} ${issue.message}`),
      dimensions: { searchIntent: 0, originality: 0, evidence: 0, citability: 0, authority: 0, internalLinks: 0, technical: 0 },
    };
  }

  const article = parsed.data;
  const failures: string[] = [];
  const declaredScores = article.quality.scores;
  const caps = deterministicCaps(article, options);
  const scores = Object.fromEntries(Object.entries(declaredScores).map(([dimension, declared]) => [
    dimension,
    Math.min(declared, caps[dimension as keyof typeof caps]),
  ])) as BlogArticleRecord["quality"]["scores"];
  const score = Object.values(scores).reduce((total, value) => total + value, 0);

  for (const [dimension, maximum] of Object.entries(rubric.dimensions)) {
    const actual = scores[dimension as keyof typeof scores];
    if (actual < maximum * rubric.minimumDimensionRatio) failures.push(`dimension below 80%: ${dimension}`);
  }
  if (score < rubric.publishThreshold) failures.push(`score below ${rubric.publishThreshold}`);
  if (!options.assetExists(article.image)) failures.push(`thumbnail missing: ${article.image}`);
  if (!article.sources.some((source) => source.kind === "primary" || source.kind === "first-party")) failures.push("primary or first-party source missing");
  if (article.quality.evidenceIds.length < 2) failures.push("at least two evidence records are required");
  const sourceHrefs = new Set(article.sources.map((source) => source.href));
  if (article.quality.evidenceIds.length !== sourceHrefs.size || article.quality.evidenceIds.some((id) => !sourceHrefs.has(id))) {
    failures.push("evidence records must match the verified source list");
  }
  if (article.quality.claimChecks.some((check) => check.sourceIds.some((id) => !sourceHrefs.has(id)))) {
    failures.push("claim checks must reference verified sources");
  }
  if (options.validRelatedProductSlugs && article.relatedProductSlugs.some((slug) => !options.validRelatedProductSlugs?.has(slug))) {
    failures.push("related product link does not exist");
  }

  const normalizedIntent = normalizeIntent(article.searchIntent);
  const normalizedKeyword = normalizeIntent(article.primaryKeyword);
  const duplicate = options.existingArticles.some((existing) => existing.slug !== article.slug && (
    normalizeIntent(existing.searchIntent) === normalizedIntent
    || normalizeIntent(existing.primaryKeyword) === normalizedKeyword
    || overlap(existing.searchIntent, article.searchIntent) >= 0.8
    || overlap(existing.primaryKeyword, article.primaryKeyword) >= 0.8
  ));
  if (duplicate) failures.push("duplicate search intent");

  const now = options.now ?? new Date();
  if (options.enforcePublishTime !== false && article.status === "published" && new Date(article.publishAt) > now) {
    failures.push("published article has a future publish time");
  }

  return { score, publishable: failures.length === 0, failures, dimensions: scores };
}
