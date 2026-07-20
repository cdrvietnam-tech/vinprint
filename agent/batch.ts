import { z } from "zod";

const candidateSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  contentType: z.enum(["conversion", "authority"]),
  outcome: z.enum(["published", "held", "rejected"]),
  score: z.number().int().min(0).max(100),
  revisionCount: z.number().int().min(0).max(3),
  failures: z.array(z.string()),
});

export const publicationBatchSchema = z.object({
  schemaVersion: z.literal(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  candidates: z.array(candidateSchema).length(7),
  productionErrors: z.number().int().min(0),
}).superRefine((batch, context) => {
  const slugs = batch.candidates.map((candidate) => candidate.slug);
  if (new Set(slugs).size !== slugs.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["candidates"], message: "candidate slugs must be unique" });
  }

  const published = batch.candidates.filter((candidate) => candidate.outcome === "published");
  if (published.length > 5) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["candidates"], message: "a daily batch may publish at most five articles" });
  }
  published.forEach((candidate, index) => {
    if (candidate.score < 95) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["candidates", index, "score"], message: "published candidates must score at least 95" });
    }
  });

  if (published.length === 5) {
    const conversion = published.filter((candidate) => candidate.contentType === "conversion").length;
    const authority = published.filter((candidate) => candidate.contentType === "authority").length;
    if (conversion !== 3 || authority !== 2) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["candidates"], message: "five-article batches require three conversion and two authority articles" });
    }
  }
});

export type PublicationBatch = z.infer<typeof publicationBatchSchema>;

export function validatePublicationBatch(input: unknown) {
  return publicationBatchSchema.parse(input);
}
