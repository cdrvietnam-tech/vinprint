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
    async list({ prefix = "" }: { prefix?: string } = {}) {
      return {
        objects: [...storedObjects.keys()]
          .filter((key) => key.startsWith(prefix))
          .map((key) => ({ key })),
      };
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

test("admin can rename media without replacing its file", async () => {
  const worker = await loadWorker("rename-media");
  const bucket = createMemoryBucket();
  const env = { HERO_IMAGES: bucket };
  const context = { waitUntil() {}, passThroughOnException() {} };
  const endpoint = "http://localhost/api/admin/media-collections?collection=hot-products&id=hot-1";

  const response = await worker.fetch(
    new Request(`${endpoint}&title=${encodeURIComponent("Tem UV nổi bán chạy")}`, { method: "PATCH" }),
    env,
    context,
  );
  assert.equal(response.status, 200);
  const items = (await response.json()).items;
  const renamed = items.find((item: { id: string }) => item.id === "hot-1");
  assert.equal(renamed.title, "Tem UV nổi bán chạy");
  assert.match(renamed.src, /^\/images\//);
});

test("content overrides persist and can be restored independently", async () => {
  const worker = await loadWorker("content-overrides");
  const bucket = createMemoryBucket();
  const env = { HERO_IMAGES: bucket };
  const context = { waitUntil() {}, passThroughOnException() {} };
  const endpoint = "http://localhost/api/admin/content?type=products";
  const product = {
    slug: "tem-giay",
    name: "Tem giấy tiết kiệm",
    eyebrow: "In nhanh · Sắc nét",
    description: "Mô tả sản phẩm cập nhật đủ rõ ràng để khách hàng lựa chọn.",
    benefit: "Lợi ích nổi bật và dễ hiểu.",
    uses: ["Hộp giấy", "Túi kraft"],
  };

  const saveResponse = await worker.fetch(
    new Request(endpoint, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(product),
    }),
    env,
    context,
  );
  assert.equal(saveResponse.status, 200);

  const publicResponse = await worker.fetch(
    new Request("http://localhost/api/content/overrides?type=products"),
    env,
    context,
  );
  assert.deepEqual((await publicResponse.json()).items, [product]);

  const restoreResponse = await worker.fetch(
    new Request(`${endpoint}&slug=tem-giay`, { method: "DELETE" }),
    env,
    context,
  );
  assert.equal(restoreResponse.status, 200);
  assert.deepEqual((await restoreResponse.json()).items, []);
});

test("production admin APIs require the configured Access identity and assertion", async () => {
  const worker = await loadWorker("admin-access");
  const bucket = createMemoryBucket();
  const env = { HERO_IMAGES: bucket, ADMIN_EMAIL: "admin@vinprint.vn" };
  const context = { waitUntil() {}, passThroughOnException() {} };
  const endpoint = "https://vinprint.vn/api/admin/content?type=products";

  const missingAssertion = await worker.fetch(
    new Request(endpoint, { headers: { "cf-access-authenticated-user-email": "admin@vinprint.vn" } }),
    env,
    context,
  );
  assert.equal(missingAssertion.status, 401);

  const allowed = await worker.fetch(
    new Request(endpoint, {
      headers: {
        "cf-access-authenticated-user-email": "admin@vinprint.vn",
        "cf-access-jwt-assertion": "signed-by-cloudflare-access",
      },
    }),
    env,
    context,
  );
  assert.equal(allowed.status, 200);
});
