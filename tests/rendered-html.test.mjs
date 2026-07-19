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
  ];

  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, `expected ${route} to render`);
  }
});

test("permanently redirects the verified WordPress sticker URL in one hop", async () => {
  const cases = [
    {
      source:
        "/product/sticker-trang-tri-pvc-chong-nuoc-sieu-ben-boc-khong-de-lai-keo-1000-mau-hot-trend-doc-la",
      target: "http://localhost/san-pham/sticker-trang-tri",
    },
    {
      source:
        "/product/sticker-trang-tri-pvc-chong-nuoc-sieu-ben-boc-khong-de-lai-keo-1000-mau-hot-trend-doc-la/?utm_source=google",
      target:
        "http://localhost/san-pham/sticker-trang-tri?utm_source=google",
    },
  ];

  for (const { source, target } of cases) {
    const response = await render(source);
    assert.equal(response.status, 301, source);
    assert.equal(response.headers.get("location"), target, source);
  }
});
