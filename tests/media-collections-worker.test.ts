import assert from "node:assert/strict";
import { test } from "node:test";

type StoredObject = {
  body: Uint8Array;
  httpMetadata?: { contentType?: string; cacheControl?: string };
};

test("admin can delete bundled media items and the deletion survives a fresh collection read", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-delete-bundled-media`);
  const { default: worker } = await import(workerUrl.href);
  const storedObjects = new Map<string, StoredObject>();
  const bucket = {
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
