import assert from "node:assert/strict";
import test from "node:test";
import type { BlogArticleRecord } from "../app/lib/blog-schema.ts";
import { articleSchema } from "../app/lib/blog-schema.ts";
import { evaluateArticleRecord } from "../agent/evaluator.ts";
import { assertAgentChangesAuthorized, assertAppendOnly } from "../agent/guardrails.ts";
import rubric from "../agent/rubric.json" with { type: "json" };
import { evaluatePilot, productionErrorsByPilotDay, type PilotRun } from "../agent/pilot.ts";
import { publicationBatchSchema } from "../agent/batch.ts";
import { rawBlogArticles } from "../content/blog/index.ts";
import { selectPublicArticles } from "../app/lib/blog-posts.ts";
import { paginateBlogPosts } from "../app/lib/blog-pagination.ts";

function makeArticle(overrides: Partial<BlogArticleRecord> = {}): BlogArticleRecord {
  return {
    schemaVersion: 1,
    status: "published",
    slug: "tem-nhua-trong-cho-chai-my-pham",
    title: "Tem nhựa trong cho chai mỹ phẩm: khi nào nên dùng?",
    description: "Cách chọn tem nhựa trong theo bề mặt chai, màu sản phẩm và điều kiện sử dụng thực tế.",
    category: "chat-lieu",
    image: "/images/blog/tem-nhua-trong.webp",
    imageAlt: "Tem nhựa trong trên chai mỹ phẩm",
    publishedAt: "2026-07-20",
    updatedAt: "2026-07-20",
    publishAt: "2026-07-20T06:30:00+07:00",
    readingMinutes: 6,
    primaryKeyword: "tem nhựa trong cho chai mỹ phẩm",
    searchIntent: "Chọn tem trong phù hợp cho chai mỹ phẩm",
    buyerStage: "consideration",
    contentType: "conversion",
    authorId: "editorial-team",
    reviewedBy: "editorial-team",
    promptVersion: "vinprint-content-v1",
    revisionCount: 1,
    directAnswer: "Tem nhựa trong phù hợp với chai mỹ phẩm có bề mặt nhẵn, sạch và cần giữ cảm giác nhìn xuyên nền. Thiết kế cần đủ tương phản với màu sản phẩm, có lớp mực trắng lót khi logo hoặc chữ dễ chìm, và phải được dán thử trên đúng loại chai trước khi sản xuất số lượng lớn.",
    sections: [
      {
        heading: "Khi nào tem nhựa trong phù hợp với chai mỹ phẩm?",
        paragraphs: [
          "Tem trong phù hợp nhất khi bao bì có bề mặt nhẵn và phần nền chai là một phần của thiết kế.",
          "Mẫu thử giúp kiểm tra độ tương phản, bọt khí và khả năng bám trên sản phẩm thật.",
        ],
        bullets: ["Bề mặt nhẵn", "Thiết kế đủ tương phản"],
      },
      {
        heading: "Cần kiểm tra gì trước khi đặt in?",
        paragraphs: ["Kiểm tra màu nền, vùng cong, điều kiện ẩm và vị trí cầm nắm trước khi chốt vật liệu."],
        table: {
          headers: ["Tiêu chí", "Cách kiểm tra"],
          rows: [["Độ bám", "Dán thử trên chai thật"]],
        },
      },
    ],
    relatedProductSlugs: ["tem-nhua-trong"],
    sources: [
      {
        title: "Trang sản phẩm tem nhựa trong VinPrint",
        href: "/san-pham/tem-nhua-trong",
        note: "Thông tin ứng dụng và bề mặt phù hợp.",
        kind: "first-party",
        verifiedAt: "2026-07-20",
      },
      {
        title: "Hướng dẫn chọn chất liệu VinPrint",
        href: "/huong-dan/chon-chat-lieu-tem",
        note: "Tiêu chí lựa chọn theo môi trường sử dụng.",
        kind: "first-party",
        verifiedAt: "2026-07-20",
      },
    ],
    quality: {
      scores: {
        searchIntent: 20,
        originality: 19,
        evidence: 19,
        citability: 15,
        authority: 10,
        internalLinks: 10,
        technical: 5,
      },
      evidenceIds: ["/san-pham/tem-nhua-trong", "/huong-dan/chon-chat-lieu-tem"],
      claimsVerified: true,
      duplicateIntentChecked: true,
      commercialClaims: "none",
      claimChecks: [{
        claim: "Tem trong cần được thử trên đúng bề mặt chai trước khi sản xuất.",
        sourceIds: ["/san-pham/tem-nhua-trong"],
      }],
      attempts: [{
        attempt: 1,
        recordedAt: "2026-07-20T04:30:00+07:00",
        score: 98,
        outcome: "accepted",
      }],
    },
    ...overrides,
  };
}

test("article schema accepts a complete versioned article record", () => {
  const parsed = articleSchema.parse(makeArticle());
  assert.equal(parsed.slug, "tem-nhua-trong-cho-chai-my-pham");
});

test("locked rubric totals 100, requires 95, and gives llms.txt no weight", () => {
  assert.equal(Object.values(rubric.dimensions).reduce((total, value) => total + value, 0), 100);
  assert.equal(rubric.publishThreshold, 95);
  assert.ok(rubric.excludedSignals.includes("llms.txt"));
});

test("quality gate publishes only records scoring at least 95 with every dimension at 80%", () => {
  const result = evaluateArticleRecord(makeArticle(), {
    existingArticles: [],
    assetExists: () => true,
    now: new Date("2026-07-21T00:00:00+07:00"),
  });

  assert.equal(result.score, 98);
  assert.equal(result.publishable, true);
  assert.deepEqual(result.failures, []);
});

test("quality gate fails closed for a low total, weak dimension, or duplicate intent", () => {
  const lowScore = makeArticle({
    quality: {
      ...makeArticle().quality,
      scores: { ...makeArticle().quality.scores, originality: 15 },
    },
  });
  const weakDimension = makeArticle({
    quality: {
      ...makeArticle().quality,
      scores: { ...makeArticle().quality.scores, technical: 3 },
    },
  });
  const duplicate = makeArticle({ slug: "another-slug" });

  assert.equal(evaluateArticleRecord(lowScore, { existingArticles: [], assetExists: () => true }).publishable, false);
  assert.equal(evaluateArticleRecord(weakDimension, { existingArticles: [], assetExists: () => true }).publishable, false);
  assert.equal(evaluateArticleRecord(duplicate, { existingArticles: [makeArticle()], assetExists: () => true }).publishable, false);
});

test("quality gate caps self-declared scores when evidence is not independently supported", () => {
  const article = makeArticle({
    quality: {
      ...makeArticle().quality,
      evidenceIds: ["invented-1", "invented-2"],
      scores: { searchIntent: 20, originality: 20, evidence: 20, citability: 15, authority: 10, internalLinks: 10, technical: 5 },
    },
  });
  const result = evaluateArticleRecord(article, { existingArticles: [], assetExists: () => true });
  assert.equal(result.publishable, false);
  assert.ok(result.dimensions.evidence < 16);
  assert.match(result.failures.join(" "), /evidence records must match/i);
});

test("article schema requires revision count to match sequential attempt history", () => {
  const article = makeArticle({ revisionCount: 2 });
  assert.equal(articleSchema.safeParse(article).success, false);
});

test("content automation can edit content surfaces but cannot edit locked or code surfaces", () => {
  assert.doesNotThrow(() => assertAgentChangesAuthorized([
    "content/blog/drafts/example.json",
    "content/blog/published/example.json",
    "content/blog/index.ts",
    "public/images/blog/example.webp",
    "agent/memory/experiments.jsonl",
  ], "content-publish"));

  assert.throws(() => assertAgentChangesAuthorized(["agent/rubric.json"], "content-publish"), /locked/i);
  assert.throws(() => assertAgentChangesAuthorized(["app/page.tsx"], "content-publish"), /locked|not authorized/i);
});

test("memory logs are append-only", () => {
  const before = '{"id":"memory-1"}\n';
  assert.doesNotThrow(() => assertAppendOnly(before, `${before}{"id":"memory-2"}\n`));
  assert.throws(() => assertAppendOnly(before, '{"id":"rewritten"}\n'), /append-only/i);
});

test("every migrated article passes schema and the locked 95-point gate", () => {
  const parsed = rawBlogArticles.map((article) => articleSchema.parse(article));
  for (const article of parsed) {
    const result = evaluateArticleRecord(article, {
      existingArticles: parsed,
      assetExists: () => true,
      enforcePublishTime: false,
    });
    assert.equal(result.publishable, true, `${article.slug}: ${result.failures.join(", ")}`);
  }
});

test("public selector excludes drafts, rejected, future and sub-95 articles", () => {
  const good = makeArticle();
  const draft = makeArticle({ slug: "draft-article", status: "draft" });
  const rejected = makeArticle({ slug: "rejected-article", status: "rejected" });
  const future = makeArticle({ slug: "future-article", publishAt: "2026-07-25T06:30:00+07:00" });
  const weak = makeArticle({
    slug: "weak-article",
    quality: { ...good.quality, scores: { ...good.quality.scores, originality: 15 } },
  });

  const selected = selectPublicArticles([good, draft, rejected, future, weak], new Date("2026-07-21T00:00:00+07:00"));
  assert.deepEqual(selected.map((article) => article.slug), [good.slug]);
});

test("published content does not depend on a Cloudflare global-scope clock", () => {
  const SystemDate = globalThis.Date;
  class EpochDate extends SystemDate {
    constructor(value?: string | number | Date) {
      super(value === undefined ? 0 : value instanceof SystemDate ? value.getTime() : value);
    }
    static now() { return 0; }
  }

  globalThis.Date = EpochDate as DateConstructor;
  try {
    assert.deepEqual(selectPublicArticles([makeArticle()]).map((article) => article.slug), [makeArticle().slug]);
  } finally {
    globalThis.Date = SystemDate;
  }
});

test("blog pagination exposes twelve articles per page", () => {
  const posts = Array.from({ length: 25 }, (_, index) => ({ ...makeArticle(), slug: `article-${index + 1}` }));
  const page = paginateBlogPosts(posts, 2);

  assert.equal(page.totalPages, 3);
  assert.equal(page.items.length, 12);
  assert.equal(page.items[0]?.slug, "article-13");
  assert.equal(page.items[11]?.slug, "article-24");
});

test("seven-day pilot continues only with at least 80% pass rate and no production errors", () => {
  const healthy: PilotRun[] = Array.from({ length: 7 }, (_, index) => ({ day: index + 1, candidates: 7, passed: 6, productionErrors: 0 }));
  const weak: PilotRun[] = healthy.map((run, index) => index === 0 ? { ...run, passed: 0 } : run);
  const broken: PilotRun[] = healthy.map((run, index) => index === 6 ? { ...run, productionErrors: 1 } : run);

  assert.equal(evaluatePilot(healthy).status, "continue");
  assert.equal(evaluatePilot(weak).status, "pause");
  assert.equal(evaluatePilot(broken).status, "pause");
  assert.equal(evaluatePilot(healthy.slice(0, 6)).status, "active");
  assert.equal(evaluatePilot([{ day: 1, candidates: 7, passed: 7, productionErrors: 1 }]).status, "pause");
  assert.throws(() => evaluatePilot([{ day: 1, candidates: 6, passed: 6, productionErrors: 0 }]), /literal/i);
  assert.throws(() => evaluatePilot([healthy[0], healthy[0]]), /unique/i);
});

test("post-production pilot errors are additive and cannot be hidden by duplicate day records", () => {
  const base = { type: "pilot-run" as const, day: 1, reportDate: "2026-07-20", recordedAt: "2026-07-20T07:00:00+07:00", candidates: 7 as const, passed: 6 };
  const errors = productionErrorsByPilotDay([
    { ...base, productionErrors: 1 },
    { ...base, recordedAt: "2026-07-20T08:00:00+07:00", productionErrors: 0 },
  ]);
  assert.equal(errors.get(1), 1);
});

test("daily publication batches require seven candidates and cap publication at a 3/2 mix", () => {
  const healthy = {
    schemaVersion: 1 as const,
    date: "2026-07-20",
    productionErrors: 0,
    candidates: Array.from({ length: 7 }, (_, index) => ({
      slug: `candidate-${index + 1}`,
      contentType: index < 3 ? "conversion" as const : "authority" as const,
      outcome: index < 5 ? "published" as const : "held" as const,
      score: index < 5 ? 96 : 92,
      revisionCount: index < 5 ? 1 : 3,
      failures: [],
    })),
  };
  assert.equal(publicationBatchSchema.safeParse(healthy).success, true);
  assert.equal(publicationBatchSchema.safeParse({
    ...healthy,
    candidates: healthy.candidates.map((candidate, index) => index === 5 ? { ...candidate, outcome: "published" as const, score: 96 } : candidate),
  }).success, false);
  assert.equal(publicationBatchSchema.safeParse({
    ...healthy,
    candidates: healthy.candidates.map((candidate, index) => index === 3 ? { ...candidate, contentType: "conversion" as const } : candidate),
  }).success, false);
});
