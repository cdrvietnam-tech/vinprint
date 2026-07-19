import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders development preview metadata", async () => {
  const response = await render();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("renders the new storefront homepage with key sections", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /XƯỞNG IN SIÊU TỐC/i);
  assert.match(html, /BẢNG GIÁ THAM KHẢO/i);
  assert.match(html, /Chốt đơn Zalo/i);
  assert.match(html, /Câu hỏi thường gặp/i);
  assert.doesNotMatch(html, /Tải Order Pack ZIP/i);
  assert.match(html, /https:\/\/vinprint\.vn/);
  assert.doesNotMatch(html, /vinprint-ai\.cdrvietnam\.chatgpt\.site/i);
  assert.match(html, /Thứ 2–Thứ 7/);
  assert.match(html, /Phường Thông Tây Hội/);
  assert.doesNotMatch(html, /images\.unsplash\.com/i);
});

test("homepage includes JSON-LD structured data", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /"@type":"LocalBusiness"/);
  assert.match(html, /"@type":"ItemList"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"hasMap":"https:\/\/maps\.app\.goo\.gl\/gqrqcsTp6CHHGi73A"/);
  assert.match(html, /"sameAs":\[[^\]]*https:\/\/maps\.app\.goo\.gl\/gqrqcsTp6CHHGi73A/);
  assert.match(html, /"areaServed"/);
});

test("public HTML responses include production security headers", async () => {
  const response = await render();

  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'self'/);
  assert.match(response.headers.get("permissions-policy") ?? "", /camera=\(\)/);
});

test("homepage exposes an accessible mobile menu and optimized hero image", async () => {
  const response = await render();
  const html = await response.text();
  const hero = html.match(/<section[^>]*id="trang-chu"[\s\S]*?<\/section>/i)?.[0] ?? "";

  assert.match(html, /aria-controls="mobile-navigation"/);
  assert.match(html, /\/images\/hero-products\.webp/);
  assert.match(html, /_vinext\/image/);
  assert.doesNotMatch(html, /\/images\/hero-collage\.(?:png|webp)/);
  assert.doesNotMatch(html, /complete_ai_mockup/);
  assert.match(hero, /review-hong\.webp/);
  assert.match(hero, /review-tuan\.webp/);
  assert.match(hero, /review-yen\.webp/);
  assert.match(hero, /hero-customer-4\.webp/);
});

test("homepage renders local review avatars and the Zalo QR image", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /review-hong\.webp/);
  assert.match(html, /review-tuan\.webp/);
  assert.match(html, /review-yen\.webp/);
  assert.match(html, /zalo-qr\.png/);
  assert.match(html, /alt="Mã QR Zalo VinPrint"/);
});

test("AI Design flow exposes all approved label transformations", async () => {
  const response = await render();
  const html = await response.text();
  const section = html.match(/<section[^>]*id="ai-thiet-ke"[\s\S]*?<\/section>/i)?.[0] ?? "";
  const mockupStart = html.indexOf("Xem thử tem trên sản phẩm");
  const mockupPanel = html.slice(mockupStart, mockupStart + 12000);

  assert.equal(response.status, 200);
  assert.match(section, /milk-tea-old\.webp/);
  assert.match(section, /milk-tea-ai\.webp/);
  assert.match(section, /milk-tea-final\.webp/);
  assert.match(section, /Tem cũ Kim Hiếu/);
  assert.match(section, /Thiết kế AI Kim Hiếu/);
  assert.match(section, /Thành phẩm tem trà sữa Kim Hiếu/);
  assert.match(section, /data-ai-design-showcases="3"/);
  assert.match(section, /aria-label="Xem combo Kim Hiếu"/);
  assert.match(section, /aria-label="Xem combo Mina Honey"/);
  assert.match(section, /aria-label="Xem combo Thy Kiều"/);
  assert.notEqual(mockupStart, -1);
  assert.match(mockupPanel, /milk-tea-old\.webp/);
  assert.match(mockupPanel, /milk-tea-final\.webp/);
  assert.doesNotMatch(html, /(?:honey|coffee)_(?:old|ai|final)\.webp/);
});

test("final quote CTA renders customer avatars instead of numeric placeholders", async () => {
  const response = await render();
  const html = await response.text();
  const ctaStart = html.indexOf("Bạn đã có file thiết kế?");
  const finalCta = html.slice(ctaStart, ctaStart + 8000);

  assert.notEqual(ctaStart, -1);
  assert.match(finalCta, /review-hong\.webp/);
  assert.match(finalCta, /review-tuan\.webp/);
  assert.match(finalCta, /review-yen\.webp/);
  assert.match(finalCta, /hero-customer-4\.webp/);
  assert.doesNotMatch(finalCta, />[2-5]<\/span>/);
});

test("homepage keeps the workshop map collapsed and the footer customer-facing", async () => {
  const response = await render();
  const html = await response.text();
  const footer = html.match(/<footer[\s\S]*?<\/footer>/i)?.[0] ?? "";

  assert.equal(response.status, 200);
  assert.doesNotMatch(html, /Ghé thăm VinPrint/i);
  assert.doesNotMatch(html, /Bản đồ chỉ được tải/i);
  assert.match(html, /<button[^>]*aria-expanded="false"[^>]*aria-controls="vinprint-map-panel"/);
  assert.match(html, /id="vinprint-map-panel"[^>]*hidden=""[^>]*aria-hidden="true"/);
  assert.doesNotMatch(html, /<iframe[^>]*title="Địa chỉ xưởng VinPrint trên Google Maps"/i);
  assert.match(html, /Chủ nhật và ngày lễ/i);
  assert.doesNotMatch(footer, />Shopee</i);
  assert.doesNotMatch(footer, />Google Maps</i);
  assert.doesNotMatch(footer, />llms\.txt</i);
  assert.match(footer, /aria-label="Liên kết pháp lý"/i);
});

test("renders product detail pages with source and order process", async () => {
  const response = await render("/san-pham/tem-uv-dtf");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Tem UV DTF nổi/i);
  assert.match(html, /QUY TRÌNH ĐẶT IN/i);
  assert.match(html, /Xem nguồn/i);
  assert.match(html, /application\/ld\+json/i);
});

test("all public routes render successfully", async () => {
  const routes = [
    "/",
    "/san-pham/tem-uv-dtf",
    "/san-pham/tem-giay",
    "/san-pham/tem-nhua-chong-nuoc",
    "/san-pham/tem-nhua-trong",
    "/san-pham/tem-bac",
    "/san-pham/tem-vang",
    "/san-pham/tem-7-mau",
    "/san-pham/tem-bao-hanh",
    "/san-pham/tem-phu-san-pham",
    "/san-pham/sticker-trang-tri",
    "/gioi-thieu",
    "/lien-he",
    "/chinh-sach",
    "/bao-hanh",
    "/case-study",
    "/nganh/my-pham",
    "/nganh/thuc-pham",
    "/nganh/do-uong",
    "/nganh/chai-lo",
    "/nganh/handmade",
    "/huong-dan/chon-chat-lieu-tem",
    "/huong-dan/chon-kich-thuoc-tem",
    "/huong-dan/ky-thuat-in-tem",
  ];

  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, `expected ${route} to render`);
  }
});

test("AI discovery file is published", async () => {
  const response = await render("/llms.txt");
  const text = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/plain/i);
  assert.match(text, /# VinPrint/);
  assert.match(text, /\/san-pham\/tem-uv-dtf/);
});

test("robots policy allows AI search but blocks model-training crawlers", async () => {
  const response = await render("/robots.txt");
  const text = await response.text();

  assert.match(text, /User-Agent: OAI-SearchBot[\s\S]*Allow: \//);
  assert.match(text, /User-Agent: GPTBot[\s\S]*Disallow: \//);
  assert.match(text, /User-Agent: Google-Extended[\s\S]*Disallow: \//);
});

test("conversion endpoint accepts known events and rejects unknown events", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-analytics`);
  const { default: worker } = await import(workerUrl.href);
  const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const ctx = { waitUntil() {}, passThroughOnException() {} };

  const accepted = await worker.fetch(new Request("http://localhost/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "click_zalo", detail: { position: "test" } }),
  }), env, ctx);
  assert.equal(accepted.status, 204);

  const rejected = await worker.fetch(new Request("http://localhost/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "made_up_event" }),
  }), env, ctx);
  assert.equal(rejected.status, 400);
});

test("image endpoint falls back to the raw asset when preview bindings are unavailable", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-preview-image`);
  const { default: worker } = await import(workerUrl.href);
  const originalFetch = globalThis.fetch;
  const fetchedPaths = [];

  globalThis.fetch = async (input) => {
    const request = input instanceof Request ? input : new Request(input);
    fetchedPaths.push(new URL(request.url).pathname);
    return new Response(new Uint8Array([0x52, 0x49, 0x46, 0x46]), {
      status: 200,
      headers: { "Content-Type": "image/webp" },
    });
  };

  try {
    const response = await worker.fetch(
      new Request("http://localhost/_vinext/image?url=%2Fimages%2Fhero-products.webp&w=640&q=82"),
      {},
      { waitUntil() {}, passThroughOnException() {} },
    );

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/webp");

    const remoteResponse = await worker.fetch(
      new Request("http://localhost/_vinext/image?url=https%3A%2F%2Fdown-vn.img.susercontent.com%2Ffile%2Fsample&w=640&q=82"),
      {},
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(remoteResponse.status, 200);

    const blockedResponse = await worker.fetch(
      new Request("http://localhost/_vinext/image?url=https%3A%2F%2Fexample.com%2Ftracking.gif&w=640&q=82"),
      {},
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(blockedResponse.status, 400);
    assert.deepEqual(fetchedPaths, [
      "/images/hero-products.webp",
      "/file/sample",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
