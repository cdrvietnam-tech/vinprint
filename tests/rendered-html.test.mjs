import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function render(pathname = "/", origin = "http://localhost") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${origin}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(new URL(pathname, origin), {
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

test("does not expose development preview metadata", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.doesNotMatch(html, /<meta[^>]+\bname=["']keywords["']/i);
});

test("renders the new storefront homepage with key sections", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /XƯỞNG IN SIÊU TỐC/i);
  assert.match(html, /Bảng giá combo tem giấy/i);
  assert.match(html, /Chốt in Zalo/i);
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
  assert.doesNotMatch(html, /"@type":"Offer"/);
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



test("security policy upgrades insecure requests only on HTTPS origins", async () => {
  const localResponse = await render("/", "http://localhost");
  const productionResponse = await render("/", "https://vinprint.vn");

  assert.doesNotMatch(
    localResponse.headers.get("content-security-policy") ?? "",
    /upgrade-insecure-requests/,
  );
  assert.match(
    productionResponse.headers.get("content-security-policy") ?? "",
    /upgrade-insecure-requests/,
  );
});

test("homepage exposes an accessible mobile menu and a large automatic hero slider", async () => {
  const response = await render();
  const html = await response.text();
  const hero = html.match(/<section[^>]*id="trang-chu"[\s\S]*?<\/section>/i)?.[0] ?? "";

  assert.match(html, /aria-controls="mobile-navigation"/);
  assert.match(html, /id="mau-thuc-te"/);
  assert.match(html, /id="case-study"/);
  assert.match(html, /data-hero-carousel="large-auto-drag"/);
  assert.match(html, /(?:\/|%2F)images(?:\/|%2F)hero-admin(?:\/|%2F)hero-1\.png/i);
  assert.match(html, /In nhanh - Chuẩn đẹp - Giá tốt/i);
  assert.match(html, /_vinext\/image/);
  assert.doesNotMatch(html, /\/images\/hero-collage\.(?:png|webp)/);
  assert.doesNotMatch(html, /complete_ai_mockup/);
  assert.match(hero, /object-contain/);
  assert.doesNotMatch(hero, /review-hong\.webp/);
  assert.doesNotMatch(hero, /review-tuan\.webp/);
  assert.doesNotMatch(hero, /review-yen\.webp/);
  assert.doesNotMatch(hero, /hero-customer-4\.webp/);
  assert.doesNotMatch(hero, /Hơn 32000 lượt đánh giá cho shop ở Shopee/);
  assert.doesNotMatch(hero, /4\.9\/5/);
  assert.doesNotMatch(hero, /90\.000|211\.000|100K/);
  assert.match(hero, /Từ 200\.000đ[\s\S]*Hỗ trợ thiết kế/i);
  assert.doesNotMatch(hero, /Xem đánh giá trên Shopee/);

  const heroSource = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/components/home/Hero.tsx", import.meta.url), "utf8"));
  assert.match(heroSource, /}, 1500\);/);
  assert.match(heroSource, /x: \{ duration: 0\.5/);
  assert.match(heroSource, /drag="x"/);
  assert.match(heroSource, /onDragEnd=/);
  assert.match(heroSource, /onDragStart=/);
  assert.match(heroSource, /isInteracting/);
  assert.match(heroSource, /hero-sparkle-star/);
  assert.match(heroSource, /DEFAULT_MEDIA_COLLECTIONS/);
  assert.match(heroSource, /api\/media\/collections\?collection=hero/);
  assert.match(heroSource, /unoptimized/);
  assert.doesNotMatch(heroSource, /Kéo trái \/ phải/);
  assert.doesNotMatch(heroSource, /figcaption/);
});

test("image library is available locally and protected in production", async () => {
  const localResponse = await render("/admin/hinh-anh");
  const productionResponse = await render("/admin/hinh-anh", "https://vinprint.vn");

  assert.equal(localResponse.status, 200);
  assert.match(await localResponse.text(), /Quản trị toàn bộ hình ảnh/i);
  assert.equal(productionResponse.status, 401);
});

test("homepage keeps the Zalo QR without unverifiable review avatars", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.doesNotMatch(html, /Avatar minh họa/i);
  assert.doesNotMatch(html, /review-hong\.webp/);
  assert.doesNotMatch(html, /review-tuan\.webp/);
  assert.doesNotMatch(html, /review-yen\.webp/);
  assert.doesNotMatch(html, /chaucay_senda/i);
  assert.match(html, /zalo-qr\.png/);
  assert.match(html, /alt="Mã QR Zalo VinPrint"/);
});

test("homepage publishes the supplied paper label combo prices and wholesale path", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Combo ưu đãi/);
  assert.match(html, /Bảng giá combo tem giấy/i);
  assert.match(html, /Tròn 3 cm \(đường kính\)/);
  assert.match(html, /99\.000đ/);
  assert.match(html, /Tròn 4 cm \(đường kính\)/);
  assert.match(html, /141\.000đ/);
  assert.match(html, /Tròn 5 cm \(đường kính\)/);
  assert.match(html, /229\.000đ/);
  assert.match(html, /Tròn 6 cm \(đường kính\)/);
  assert.match(html, /320\.000đ/);
  assert.match(html, /Nhận báo giá sỉ/i);
  assert.match(html, /id="nhan-bao-gia"/);
  assert.doesNotMatch(html, /299\.000đ|499\.000đ|699\.000đ|849\.000đ/);
  assert.doesNotMatch(html, /Giá demo/);
  assert.doesNotMatch(html, /Gợi ý combo để anh xem trước bố cục/i);
  assert.match(html, /Hỗ trợ thiết kế đơn từ 200\.000đ/);
  assert.match(html, /tối đa 3 lần chỉnh sửa/);
  assert.doesNotMatch(html, /id="ai-thiet-ke"/);
  assert.doesNotMatch(html, /data-ai-design-showcases/);
  assert.doesNotMatch(html, /images\/ai-design/);
  assert.doesNotMatch(html, /Một chiếc tem nhỏ/i);
  assert.doesNotMatch(html, /Trước khi dán tem/i);
  assert.doesNotMatch(html, /Các loại tem nhãn phổ biến/i);
  assert.match(html, /Các sản phẩm[^<]*<span[^>]*>đang hot/i);
  assert.match(html, /Xem tất cả sản phẩm của shop/i);
});

test("final quote CTA collects pricing details without requiring a file", async () => {
  const response = await render();
  const html = await response.text();
  const ctaStart = html.indexOf("Cần báo giá ngay?");
  const finalCta = html.slice(ctaStart, ctaStart + 16000);

  assert.notEqual(ctaStart, -1);
  assert.match(finalCta, /name="customerName"/);
  assert.match(finalCta, /name="phone"/);
  assert.match(finalCta, /name="material"/);
  assert.match(finalCta, /name="widthMm"/);
  assert.match(finalCta, /name="heightMm"/);
  assert.match(finalCta, /name="quantity"/);
  assert.match(finalCta, /name="priceTier"/);
  assert.doesNotMatch(finalCta, /name="artwork"/);
  assert.match(finalCta, /Giá lẻ/i);
  assert.match(finalCta, /Giá sỉ/i);
  assert.doesNotMatch(finalCta, /90\.000/);
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
  const header = html.match(/<header[\s\S]*?<\/header>/i)?.[0] ?? "";

  assert.equal(response.status, 200);
  assert.match(html, /Tem UV DTF nổi/i);
  assert.match(html, /QUY TRÌNH ĐẶT IN/i);
  assert.match(html, /Xem nguồn/i);
  assert.match(html, /data-product-showcase="premium"/i);
  assert.match(html, /Phù hợp với/i);
  assert.match(html, /Không cần gửi file để báo giá/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(header, /href="\/blog"/i);
  assert.match(header, /href="\/gioi-thieu"/i);
  assert.match(header, /href="\/lien-he"/i);
  assert.match(html, /href="\/#bang-gia"/i);
  assert.doesNotMatch(html, /href="(?:https:\/\/vinprint\.vn\/)?#(?:pricing|products)"/i);
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.match(html, /aria-label="Breadcrumb"/i);
  assert.match(html, /Trang chủ[\s\S]*Sản phẩm[\s\S]*Tem UV DTF nổi/i);
  assert.match(html, /Câu hỏi về [\s\S]{0,60}Tem UV DTF nổi/i);
  assert.match(html, /"@type":"FAQPage"/i);
  assert.doesNotMatch(html, /"@type":"Offer"/i);
  assert.match(html, /name="customerName"/);
  assert.match(html, /name="phone"/);
  assert.match(html, /name="material"/);
  assert.match(html, /name="widthMm"/);
  assert.match(html, /name="heightMm"/);
  assert.match(html, /name="quantity"/);
  assert.match(html, /name="priceTier"/);
  assert.doesNotMatch(html, /name="artwork"/);
});

test("homepage promotes verifiable case-study scenarios instead of illustrative reviews", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Tình huống ứng dụng/i);
  assert.match(html, /href="\/case-study"/i);
  assert.match(html, /data-case-study-grid="six"/i);
  assert.equal((html.match(/data-case-scenario=/gi) || []).length, 6);
  assert.doesNotMatch(html, /Avatar minh họa/i);
});

test("renders representative images before every product catalog tag", async () => {
  const response = await render("/san-pham");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /data-catalog-thumbnail="Tem giấy"/i);
  assert.match(html, /data-catalog-thumbnail="In catalog"/i);
  assert.match(html, /data-catalog-thumbnail="In túi giấy"/i);
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
    "/san-pham",
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
    "/khu-vuc/go-vap",
    "/khu-vuc/quan-12",
    "/khu-vuc/tan-binh",
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
  assert.match(xml, /https:\/\/vinprint\.vn\/khu-vuc\/go-vap<\/loc>/i);
  assert.match(xml, /https:\/\/vinprint\.vn\/khu-vuc\/quan-12<\/loc>/i);
  assert.match(xml, /https:\/\/vinprint\.vn\/khu-vuc\/tan-binh<\/loc>/i);
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
    assert.equal(remoteResponse.status, 400);

    const blockedResponse = await worker.fetch(
      new Request("http://localhost/_vinext/image?url=https%3A%2F%2Fexample.com%2Ftracking.gif&w=640&q=82"),
      {},
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(blockedResponse.status, 400);
    assert.deepEqual(fetchedPaths, []);
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
