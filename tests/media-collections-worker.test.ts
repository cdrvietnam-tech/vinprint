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

function encodeJwtPart(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

async function createAccessFixture(email: string, audience: string, issuer: string) {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
  const kid = "vinprint-test-key";
  const now = Math.floor(Date.now() / 1000);
  const header = encodeJwtPart({ alg: "RS256", kid, typ: "JWT" });
  const payload = encodeJwtPart({
    aud: [audience],
    email,
    exp: now + 300,
    iat: now,
    iss: issuer,
    nbf: now - 5,
  });
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    keyPair.privateKey,
    new TextEncoder().encode(`${header}.${payload}`),
  );
  const publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  return {
    assertion: `${header}.${payload}.${Buffer.from(signature).toString("base64url")}`,
    publicKey: { ...publicKey, kid },
  };
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
    async put(
      key: string,
      value: BodyInit,
      options: {
        httpMetadata?: StoredObject["httpMetadata"];
        onlyIf?: { etagDoesNotMatch?: string };
      } = {},
    ) {
      const conditionalCreate = options.onlyIf?.etagDoesNotMatch === "*";
      if (conditionalCreate && storedObjects.has(key)) return null;
      if (conditionalCreate) storedObjects.set(key, { body: new Uint8Array(), httpMetadata: options.httpMetadata });
      try {
        const body = new Uint8Array(await new Response(value).arrayBuffer());
        storedObjects.set(key, { body, httpMetadata: options.httpMetadata });
        return { key };
      } catch (error) {
        if (conditionalCreate) storedObjects.delete(key);
        throw error;
      }
    },
    async delete(key: string) {
      storedObjects.delete(key);
    },
    async list({
      prefix = "",
      limit = 1000,
      cursor,
    }: {
      prefix?: string;
      limit?: number;
      cursor?: string;
    } = {}) {
      const keys = [...storedObjects.keys()].filter((key) => key.startsWith(prefix)).sort();
      const offset = cursor ? Number(cursor) : 0;
      const page = keys.slice(offset, offset + limit);
      const nextOffset = offset + page.length;
      return {
        objects: page.map((key) => ({ key })),
        truncated: nextOffset < keys.length,
        cursor: nextOffset < keys.length ? String(nextOffset) : undefined,
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

test("production admin APIs verify the signed Cloudflare Access assertion", async () => {
  const worker = await loadWorker("admin-access");
  const bucket = createMemoryBucket();
  const issuer = "https://vinprint.cloudflareaccess.com";
  const audience = "vinprint-admin-audience";
  const access = await createAccessFixture("admin@vinprint.vn", audience, issuer);
  const env = {
    HERO_IMAGES: bucket,
    ADMIN_EMAIL: "admin@vinprint.vn",
    CF_ACCESS_AUD: audience,
    CF_ACCESS_TEAM_DOMAIN: issuer,
  };
  const context = { waitUntil() {}, passThroughOnException() {} };
  const endpoint = "https://vinprint.vn/api/admin/content?type=products";

  const missingAssertion = await worker.fetch(
    new Request(endpoint, { headers: { "cf-access-authenticated-user-email": "admin@vinprint.vn" } }),
    env,
    context,
  );
  assert.equal(missingAssertion.status, 401);

  const forged = await worker.fetch(
    new Request(endpoint, {
      headers: {
        "cf-access-authenticated-user-email": "admin@vinprint.vn",
        "cf-access-jwt-assertion": "signed-by-cloudflare-access",
      },
    }),
    env,
    context,
  );
  assert.equal(forged.status, 401);

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    assert.equal(String(input), `${issuer}/cdn-cgi/access/certs`);
    return Response.json({ keys: [access.publicKey] });
  };
  try {
    const allowed = await worker.fetch(
      new Request(endpoint, {
        headers: { "cf-access-jwt-assertion": access.assertion },
      }),
      env,
      context,
    );
    assert.equal(allowed.status, 200);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("customers can submit a print file and admin can download then delete the quote request", async () => {
  const worker = await loadWorker("quote-request-lifecycle");
  const bucket = createMemoryBucket();
  const env = { HERO_IMAGES: bucket };
  const context = { waitUntil() {}, passThroughOnException() {} };
  const form = new FormData();
  form.set("customerName", "Nguyễn An");
  form.set("phone", "0901234567");
  form.set("quantity", "1000");
  form.set("productSlug", "tem-uv-dtf");
  form.set("productTitle", "Tem UV DTF nổi");
  form.set("artwork", new Blob(["%PDF-1.4 vinprint"], { type: "application/pdf" }), "mau-tem.pdf");

  const submitResponse = await worker.fetch(
    new Request("http://localhost/api/quote-requests", { method: "POST", body: form }),
    env,
    context,
  );
  assert.equal(submitResponse.status, 201);
  const submitted = await submitResponse.json() as { id: string; code: string };
  assert.match(submitted.id, /^[a-z0-9-]+$/);
  assert.match(submitted.code, /^VP-/);

  const listResponse = await worker.fetch(
    new Request("http://localhost/api/admin/quote-requests"),
    env,
    context,
  );
  assert.equal(listResponse.status, 200);
  const listed = await listResponse.json() as {
    items: Array<{ id: string; customerName: string; phone: string; quantity: number; fileName: string }>;
  };
  assert.equal(listed.items.length, 1);
  assert.equal(listed.items[0].customerName, "Nguyễn An");
  assert.equal(listed.items[0].phone, "0901234567");
  assert.equal(listed.items[0].quantity, 1000);
  assert.equal(listed.items[0].fileName, "mau-tem.pdf");

  const fileResponse = await worker.fetch(
    new Request(`http://localhost/api/admin/quote-requests?id=${submitted.id}&file=1`),
    env,
    context,
  );
  assert.equal(fileResponse.status, 200);
  assert.equal(fileResponse.headers.get("content-type"), "application/pdf");
  assert.equal(await fileResponse.text(), "%PDF-1.4 vinprint");

  const deleteResponse = await worker.fetch(
    new Request(`http://localhost/api/admin/quote-requests?id=${submitted.id}`, { method: "DELETE" }),
    env,
    context,
  );
  assert.equal(deleteResponse.status, 200);

  const emptyListResponse = await worker.fetch(
    new Request("http://localhost/api/admin/quote-requests"),
    env,
    context,
  );
  assert.deepEqual((await emptyListResponse.json() as { items: unknown[] }).items, []);
});

test("quote request validation rejects invalid phone numbers and unsupported files", async () => {
  const worker = await loadWorker("quote-request-validation");
  const bucket = createMemoryBucket();
  const env = { HERO_IMAGES: bucket };
  const context = { waitUntil() {}, passThroughOnException() {} };
  const form = new FormData();
  form.set("customerName", "Khách thử");
  form.set("phone", "123");
  form.set("quantity", "500");
  form.set("artwork", new Blob(["bad"], { type: "application/x-msdownload" }), "virus.exe");

  const response = await worker.fetch(
    new Request("http://localhost/api/quote-requests", { method: "POST", body: form }),
    env,
    context,
  );
  assert.equal(response.status, 400);
  assert.match((await response.json() as { error: string }).error, /invalid_phone|invalid_file/i);

  const crossOriginResponse = await worker.fetch(
    new Request("http://localhost/api/quote-requests", {
      method: "POST",
      headers: { origin: "https://example.com" },
      body: form,
    }),
    env,
    context,
  );
  assert.equal(crossOriginResponse.status, 403);

  const disguisedForm = new FormData();
  disguisedForm.set("customerName", "Khách thử");
  disguisedForm.set("phone", "0901234567");
  disguisedForm.set("quantity", "500");
  disguisedForm.set("artwork", new Blob(["not really a pdf"], { type: "application/pdf" }), "mau-tem.pdf");
  const disguisedResponse = await worker.fetch(
    new Request("http://localhost/api/quote-requests", { method: "POST", body: disguisedForm }),
    env,
    context,
  );
  assert.equal(disguisedResponse.status, 400);
  assert.equal((await disguisedResponse.json() as { error: string }).error, "invalid_file");
});

test("quote request admin endpoint remains protected by Cloudflare Access in production", async () => {
  const worker = await loadWorker("quote-request-access");
  const bucket = createMemoryBucket();
  const env = { HERO_IMAGES: bucket, ADMIN_EMAIL: "admin@vinprint.vn" };
  const context = { waitUntil() {}, passThroughOnException() {} };

  const response = await worker.fetch(
    new Request("https://vinprint.vn/api/admin/quote-requests"),
    env,
    context,
  );
  assert.equal(response.status, 401);
});

test("public quote intake atomically limits concurrent submissions from one production IP", async () => {
  const worker = await loadWorker("quote-request-rate-limit");
  const bucket = createMemoryBucket();
  const env = { HERO_IMAGES: bucket };
  const context = { waitUntil() {}, passThroughOnException() {} };

  const responses = await Promise.all(Array.from({ length: 6 }, async (_, index) => {
    const attempt = index + 1;
    const form = new FormData();
    form.set("customerName", "Khách hợp lệ");
    form.set("phone", "0901234567");
    form.set("quantity", "500");
    form.set("artwork", new Blob(["%PDF-1.4 vinprint"], { type: "application/pdf" }), `mau-${attempt}.pdf`);
    const response = await worker.fetch(
      new Request("https://vinprint.vn/api/quote-requests", {
        method: "POST",
        headers: {
          origin: "https://vinprint.vn",
          "cf-connecting-ip": "203.0.113.20",
        },
        body: form,
      }),
      env,
      context,
    );
    return response.status;
  }));
  assert.deepEqual(responses.toSorted(), [201, 201, 201, 201, 201, 429]);
});
