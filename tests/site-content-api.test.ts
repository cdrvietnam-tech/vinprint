import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_SITE_CONTENT, SITE_CONTENT_KEY } from "../app/lib/site-content";

// Nạp worker đã build (dist) — chạy sau bước build trong `npm test`.
async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("t", String(Date.now()));
  const mod = await import(workerUrl.href);
  return mod.default as {
    fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response>;
  };
}

type StoredValue = string;
function createMockBucket(initial?: string) {
  const store = new Map<string, StoredValue>();
  if (initial !== undefined) store.set(SITE_CONTENT_KEY, initial);
  return {
    store,
    async get(key: string) {
      if (!store.has(key)) return null;
      const value = store.get(key) as string;
      return { text: async () => value, body: value };
    },
    async put(key: string, value: unknown) {
      store.set(key, typeof value === "string" ? value : String(value));
    },
    async delete(key: string) {
      store.delete(key);
    },
  };
}

const ctx = { waitUntil() {}, passThroughOnException() {} };
const adminUrl = "http://localhost/api/admin/site-content";
const publicUrl = "http://localhost/api/site-content";

test("PUT valid content is accepted and stored", async () => {
  const worker = await loadWorker();
  const bucket = createMockBucket();
  const response = await worker.fetch(
    new Request(adminUrl, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(DEFAULT_SITE_CONTENT) }),
    { HERO_IMAGES: bucket },
    ctx,
  );
  assert.equal(response.status, 200);
  assert.ok(bucket.store.has(SITE_CONTENT_KEY));
});

test("PUT with wrong structure is rejected (422)", async () => {
  const worker = await loadWorker();
  const bucket = createMockBucket();
  const badShape = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
  badShape.header.menu = "not-an-array";
  const response = await worker.fetch(
    new Request(adminUrl, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(badShape) }),
    { HERO_IMAGES: bucket },
    ctx,
  );
  assert.equal(response.status, 422);
  assert.equal(bucket.store.has(SITE_CONTENT_KEY), false);
});

test("PUT with invalid JSON is rejected (400)", async () => {
  const worker = await loadWorker();
  const bucket = createMockBucket();
  const response = await worker.fetch(
    new Request(adminUrl, { method: "PUT", headers: { "content-type": "application/json" }, body: "{not valid json" }),
    { HERO_IMAGES: bucket },
    ctx,
  );
  assert.equal(response.status, 400);
});

test("public GET falls back to {} when stored R2 data is corrupt", async () => {
  const worker = await loadWorker();
  const bucket = createMockBucket('{"header": 123, "hero": "broken"}');
  const response = await worker.fetch(new Request(publicUrl), { HERO_IMAGES: bucket }, ctx);
  assert.equal(response.status, 200);
  assert.equal((await response.text()).trim(), "{}");
});

test("public GET falls back to {} when stored data is not JSON", async () => {
  const worker = await loadWorker();
  const bucket = createMockBucket("total garbage not json");
  const response = await worker.fetch(new Request(publicUrl), { HERO_IMAGES: bucket }, ctx);
  assert.equal((await response.text()).trim(), "{}");
});

test("public GET returns stored content when it is valid", async () => {
  const worker = await loadWorker();
  const bucket = createMockBucket(JSON.stringify(DEFAULT_SITE_CONTENT));
  const response = await worker.fetch(new Request(publicUrl), { HERO_IMAGES: bucket }, ctx);
  const parsed = JSON.parse(await response.text());
  assert.equal(parsed.hero.titleLine1, DEFAULT_SITE_CONTENT.hero.titleLine1);
});
