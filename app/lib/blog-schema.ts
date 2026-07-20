import { z } from "zod";

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export const blogCategorySlugs = ["chat-lieu", "thiet-ke", "theo-nganh", "ky-thuat-in"] as const;

const sourceSchema = z.object({
  title: z.string().min(3),
  href: z.string().min(1),
  note: z.string().min(3),
  kind: z.enum(["primary", "first-party", "secondary"]),
  verifiedAt: z.string().regex(isoDate),
});

const sectionSchema = z.object({
  heading: z.string().min(5),
  paragraphs: z.array(z.string().min(20)).min(1),
  bullets: z.array(z.string().min(2)).min(1).optional(),
  table: z.object({
    headers: z.array(z.string().min(1)).min(2),
    rows: z.array(z.array(z.string().min(1)).min(2)).min(1),
  }).optional(),
});

export const articleSchema = z.object({
  schemaVersion: z.literal(1),
  status: z.enum(["draft", "rejected", "scheduled", "published"]),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(20).max(90),
  description: z.string().min(60).max(180),
  category: z.enum(blogCategorySlugs),
  image: z.string().regex(/^\/images\/blog\/[a-z0-9-]+\.webp$/),
  imageAlt: z.string().min(10).max(180),
  publishedAt: z.string().regex(isoDate),
  updatedAt: z.string().regex(isoDate),
  publishAt: z.string().datetime({ offset: true }),
  readingMinutes: z.number().int().min(2).max(30),
  primaryKeyword: z.string().min(3).max(120),
  searchIntent: z.string().min(10).max(180),
  buyerStage: z.enum(["awareness", "consideration", "decision", "implementation"]),
  contentType: z.enum(["conversion", "authority"]),
  authorId: z.literal("editorial-team"),
  reviewedBy: z.literal("editorial-team"),
  promptVersion: z.string().min(3),
  revisionCount: z.number().int().min(0).max(3),
  directAnswer: z.string().min(120).max(1400),
  sections: z.array(sectionSchema).min(2),
  relatedProductSlugs: z.array(z.string().min(1)).min(1),
  sources: z.array(sourceSchema).min(2),
  quality: z.object({
    scores: z.object({
      searchIntent: z.number().int().min(0).max(20),
      originality: z.number().int().min(0).max(20),
      evidence: z.number().int().min(0).max(20),
      citability: z.number().int().min(0).max(15),
      authority: z.number().int().min(0).max(10),
      internalLinks: z.number().int().min(0).max(10),
      technical: z.number().int().min(0).max(5),
    }),
    evidenceIds: z.array(z.string().min(1)).min(2),
    claimsVerified: z.literal(true),
    duplicateIntentChecked: z.literal(true),
    commercialClaims: z.literal("none"),
    claimChecks: z.array(z.object({
      claim: z.string().min(20),
      sourceIds: z.array(z.string().min(1)).min(1),
    })).min(1),
    attempts: z.array(z.object({
      attempt: z.number().int().min(1).max(3),
      recordedAt: z.string().datetime({ offset: true }),
      score: z.number().int().min(0).max(100),
      outcome: z.enum(["revised", "accepted", "rejected"]),
    })).max(3),
  }),
}).superRefine((article, context) => {
  if (article.revisionCount !== article.quality.attempts.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["quality", "attempts"],
      message: "revisionCount must equal the append-only attempt history length",
    });
  }
  article.quality.attempts.forEach((attempt, index) => {
    if (attempt.attempt !== index + 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quality", "attempts", index, "attempt"],
        message: "attempt numbers must be sequential",
      });
    }
  });
});

export type BlogArticleRecord = z.infer<typeof articleSchema>;
export type BlogCategorySlug = BlogArticleRecord["category"];
export type BlogArticleSection = BlogArticleRecord["sections"][number];
export type BlogSource = BlogArticleRecord["sources"][number];
