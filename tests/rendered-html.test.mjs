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

test("homepage keeps the print guide in the header instead of an inline section", async () => {
  const response = await render();
  const html = await response.text();
  const header = html.match(/<header[\s\S]*?<\/header>/i)?.[0] ?? "";

  assert.equal(response.status, 200);
  assert.match(header, /href="\/blog"/i);
  assert.match(header, /Cẩm nang in ấn/i);
  assert.doesNotMatch(html, /id="cam-nang-tem-nhan"/i);
  assert.doesNotMatch(html, /Xem toàn bộ cẩm nang/i);
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
  assert.doesNotMatch(html, /Xem thử tem trên sản phẩm/i);
  assert.doesNotMatch(html, /Gửi mẫu để dựng mockup/i);
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

test("renders a crawlable blog index with category navigation", async () => {
  const response = await render("/blog");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Cẩm nang tem nhãn/i);
  assert.match(html, /aria-label="Lọc bài viết theo chuyên mục"/i);
  assert.match(html, /href="\/blog\/chuyen-muc\/chat-lieu"/i);
  assert.match(html, /href="\/blog\/tem-giay-va-tem-nhua-nen-chon-loai-nao"/i);
  assert.match(html, /href="\/blog\/loi-thiet-ke-tem-nhan"/i);
  assert.match(html, /data-blog-thumbnail="compact"/i);
  assert.match(html, /object-fit:contain/i);
  assert.match(html, /\/images\/blog\/tem-giay-va-tem-nhua\.webp/i);
  assert.match(html, /\/images\/blog\/tem-uv-dtf-la-gi\.webp/i);
  assert.match(html, /\/images\/blog\/cach-chon-kich-thuoc-tem\.webp/i);
  assert.match(html, /\/images\/blog\/chuan-bi-file-in-tem\.webp/i);
  assert.match(html, /\/images\/blog\/tem-chong-nuoc\.webp/i);
  assert.match(html, /\/images\/blog\/loi-thiet-ke-tem\.webp/i);
});

test("renders clean blog category pages", async () => {
  const response = await render("/blog/chuyen-muc/chat-lieu");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Chọn chất liệu/i);
  assert.match(html, /href="\/blog\/tem-giay-va-tem-nhua-nen-chon-loai-nao"/i);
  assert.doesNotMatch(html, /href="\/blog\/tem-uv-dtf-la-gi"/i);
});

test("publishes an RSS feed for public blog articles", async () => {
  const response = await render("/feed.xml");
  const xml = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/rss\+xml/i);
  assert.match(xml, /<rss version="2.0">/i);
  assert.match(xml, /https:\/\/vinprint\.vn\/blog\/tem-uv-dtf-la-gi/i);
});

test("renders GEO-ready blog articles with citable answers and BlogPosting schema", async () => {
  const response = await render("/blog/tem-giay-va-tem-nhua-nen-chon-loai-nao");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Tem giấy và tem nhựa: nên chọn loại nào\?/i);
  assert.match(html, /Câu trả lời ngắn/i);
  assert.match(html, /Không có một chất liệu tốt nhất cho mọi sản phẩm/i);
  assert.match(html, /Nguồn và phương pháp biên soạn/i);
  assert.match(html, /Đội ngũ VinPrint/i);
  assert.match(html, /href="\/quy-trinh-bien-soan"/i);
  assert.match(html, /https:\/\/vinprint\.vn\/quy-trinh-bien-soan#editorial-team/i);
  assert.match(html, /href="\/san-pham\/tem-giay"/i);
  assert.match(html, /href="\/san-pham\/tem-nhua-chong-nuoc"/i);
  assert.match(html, /"@type":"BlogPosting"/i);
  assert.match(html, /"datePublished":"2026-07-20"/i);
  assert.match(html, /"dateModified":"2026-07-20"/i);
  assert.match(html, /"@type":"BreadcrumbList"/i);
});

test("publishes a transparent editorial process and author entity", async () => {
  const response = await render("/quy-trinh-bien-soan");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Quy trình biên soạn nội dung/i);
  assert.match(html, /Ai chịu trách nhiệm cho nội dung/i);
  assert.match(html, /AI được sử dụng như thế nào/i);
  assert.match(html, /"@type":"AboutPage"/i);
  assert.match(html, /"@id":"https:\/\/vinprint\.vn\/quy-trinh-bien-soan#editorial-team"/i);
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
    "/quy-trinh-bien-soan",
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
    "/blog",
    "/blog/chuyen-muc/chat-lieu",
    "/blog/tem-giay-va-tem-nhua-nen-chon-loai-nao",
    "/blog/tem-uv-dtf-la-gi",
    "/blog/cach-chon-kich-thuoc-tem-nhan",
    "/blog/chuan-bi-file-in-tem-khong-bi-mo",
    "/blog/tem-chong-nuoc-cho-my-pham-va-do-uong",
    "/blog/loi-thiet-ke-tem-nhan",
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
  assert.match(text, /\/blog\/tem-giay-va-tem-nhua-nen-chon-loai-nao/);
  assert.match(text, /\/quy-trinh-bien-soan/);
});

test("sitemap publishes the blog hub and every GEO article", async () => {
  const response = await render("/sitemap.xml");
  const xml = await response.text();

  assert.equal(response.status, 200);
  assert.match(xml, /https:\/\/vinprint\.vn\/blog<\/loc>/i);
  assert.match(xml, /https:\/\/vinprint\.vn\/blog\/chuyen-muc\/chat-lieu<\/loc>/i);
  assert.match(xml, /https:\/\/vinprint\.vn\/blog\/tem-uv-dtf-la-gi<\/loc>/i);
  assert.match(xml, /https:\/\/vinprint\.vn\/blog\/loi-thiet-ke-tem-nhan<\/loc>/i);
  assert.match(xml, /<image:image>[\s\S]*tem-uv-dtf-la-gi\.webp[\s\S]*<\/image:image>/i);
  assert.match(xml, /https:\/\/vinprint\.vn\/quy-trinh-bien-soan<\/loc>/i);
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

test("image endpoint redirects to the raw local asset when preview bindings are unavailable", async () => {
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

    assert.equal(response.status, 302);
    assert.equal(
      response.headers.get("location"),
      "http://localhost/images/hero-products.webp",
    );

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
    assert.deepEqual(fetchedPaths, ["/file/sample"]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("image endpoint falls back when Cloudflare image transformation fails", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-failed-image-transform`);
  const { default: worker } = await import(workerUrl.href);
  const rawImage = new Uint8Array([0x52, 0x49, 0x46, 0x46]);
  const env = {
    ASSETS: {
      fetch: async () => new Response(rawImage, {
        status: 200,
        headers: { "Content-Type": "image/webp" },
      }),
    },
    IMAGES: {
      input: () => ({
        transform: () => ({
          output: async () => ({
            response: () => new Response("Image service unavailable", { status: 522 }),
          }),
        }),
      }),
    },
  };

  const response = await worker.fetch(
    new Request("http://localhost/_vinext/image?url=%2Fimages%2Fhero-products.webp&w=640&q=82"),
    env,
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/webp");
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), rawImage);
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
