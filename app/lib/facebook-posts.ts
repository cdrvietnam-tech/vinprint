import { z } from "zod";
import { rawFacebookPosts } from "../../content/facebook/index";

const facebookPostSchema = z.object({
  schemaVersion: z.literal(1),
  pageId: z.literal("105514821740093"),
  postId: z.string().regex(/^[0-9_]+$/),
  contentHash: z.string().regex(/^[0-9a-f]{64}$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  headline: z.string().min(20).max(90),
  summary: z.string().min(40).max(240),
  message: z.string().min(20).max(5000),
  image: z.string().regex(/^\/images\/facebook\/[a-z0-9-]+\.webp$/),
  imageAlt: z.string().min(10).max(180),
  permalink: z.string().url().refine((value) => {
    const hostname = new URL(value).hostname;
    return hostname === "facebook.com" || hostname.endsWith(".facebook.com");
  }),
  publishedAt: z.string().datetime({ offset: true }),
  syncedAt: z.string().datetime({ offset: true }),
  topic: z.enum(["uv-dtf", "tem-giay", "tem-nhua", "tem-trong", "tem-bao-hanh", "tem-anh-kim", "sticker", "tem-nhan"]),
});

export type FacebookPostRecord = z.infer<typeof facebookPostSchema>;
export const facebookPosts = rawFacebookPosts
  .map((post) => facebookPostSchema.parse(post))
  .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
