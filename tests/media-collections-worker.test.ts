import assert from "node:assert/strict";
import { test } from "node:test";

type StoredObject = {
  body: Uint8Array;
  httpMetadata?: { contentType?: string; cacheControl?: string };
};

async function loadWorker(scenario: string) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${scenario}`);
  return (await import(workerUrl.href)).default;
}

function createMemoryBucket() {
  const storedObjects = new Map<string, StoredObject>();
  return {
    async get(key: string) {
      const stored = storedObjects.get(key);
      if (!stored) return null;
      return {
        body: new Response(stored.body).body,
        httpMetadata: stored.httpMetadata,
        size: stored.body.byteLength,
        async json() {
          return JSON.parse(new TextDecoder().decode(stored.body));
        },
      };
    },
    async put(key: string, value: BodyInit, options: { httpMetadata?: StoredObject["httpMetadata"] } = {}) {
      const body = new Uint8Array(await new Response(value).arrayBuffer());
      storedObjects.set(key, { body, httpMetadata: options.httpMetadata });
    },
    async delete(key: string) {
      storedObjects.delete(key);
    },
  };
}

test("admin can delete bundled media items and the deletion survives a fresh collection read", async () => {
  const worker = await loadWorker("delete-bundled-media");
  const bucket = createMemoryBucket();
  const env = { HERO_IMAGES: bucket };
  const context = { waitUntil() {}, passThroughOnException() {} };
  const endpoint = "http://localhost/api/admin/media-collections?collection=hot-products";

  const deleteResponse = await worker.fetch(
    new Request(`${endpoint}&id=hot-1`, { method: "DELETE" }),
    env,
    context,
  );
  assert.equal(deleteResponse.status, 200);
  assert.equal((await deleteResponse.json()).items.length, 5);

  const freshRead = await worker.fetch(new Request(endpoint), env, context);
  const freshItems = (await freshRead.json()).items;
  assert.equal(freshItems.length, 5);
  assert.equal(freshItems.some((item: { id: string }) => item.id === "hot-1"), false);

  const unsafeDelete = await worker.fetch(
    new Request(`${endpoint}&id=${encodeURIComponent("../hot-1")}`, { method: "DELETE" }),
    env,
    context,
  );
  assert.equal(unsafeDelete.status, 400);
});

test("replacing one product tag thumbnail does not change hero media", async () => {
  const worker = await loadWorker("independent-product-thumbnail");
  const bucket = createMemoryBucket();
  const env = { HERO_IMAGES: bucket };
  const context = { waitUntil() {}, passThroughOnException() {} };
  const thumbnailEndpoint = "http://localhost/api/admin/media-collections?collection=product-thumbnails&id=catalog-in-catalog&title=In%20catalog&category=Ấn%20phẩm%20văn%20phòng&href=/san-pham";

  const replaceResponse = await worker.fetch(
    new Request(thumbnailEndpoint, {
      method: "PUT",
      headers: { "content-type": "image/webp" },
      body: new Uint8Array([0x52, 0x49, 0x46, 0x46]),
    }),
    env,
    context,
  );
  assert.equal(replaceResponse.status, 200);
  const thumbnailItems = (await replaceResponse.json()).items;
  const replaced = thumbnailItems.find((item: { id: string }) => item.id === "catalog-in-catalog");
  assert.equal(replaced.src, "/media/collections/product-thumbnails/catalog-in-catalog");

  const heroResponse = await worker.fetch(
    new Request("http://localhost/api/admin/media-collections?collection=hero"),
    env,
    context,
  );
  const heroItems = (await heroResponse.json()).items;
  assert.equal(heroItems[0].src, "/images/hero-admin/hero-1.png?managed=2");
});
