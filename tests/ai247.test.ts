import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("AI247 has a public video collection and a managed upload path", async () => {
  const [collections, page, gallery, admin, worker, sitemap] = await Promise.all([
    readFile("app/lib/media-collections.ts", "utf8"),
    readFile("app/ai247/page.tsx", "utf8"),
    readFile("app/components/ai247/Ai247VideoGallery.tsx", "utf8"),
    readFile("app/components/admin/VideoAdmin.tsx", "utf8"),
    readFile("worker/index.ts", "utf8"),
    readFile("app/sitemap.ts", "utf8"),
  ]);

  assert.match(collections, /"ai247"/);
  assert.match(collections, /Video AI247/);
  assert.match(page, /canonical: "\/ai247"/);
  assert.match(page, /CollectionPage/);
  assert.match(gallery, /collection=ai247/);
  assert.match(gallery, /controls playsInline preload="metadata"/);
  assert.match(admin, /ai247: \{ width: 1080, height: 1350 \}/);
  assert.match(worker, /collection !== "hot-products" && collection !== "ai247"/);
  assert.match(sitemap, /`\$\{baseUrl\}\/ai247`/);
});
