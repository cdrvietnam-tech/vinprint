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

function structuredData(html) {
  return Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
    (match) => JSON.parse(match[1]));
}

test("material guide exposes an original comparison table and crawlable product choices", async () => {
  const response = await render("/huong-dan/chon-chat-lieu-tem");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<table/);
  assert.match(html, /<caption[^>]*>Chọn tem theo bao bì/);
  assert.equal((html.match(/scope="row"/g) || []).length, 5);
  assert.match(html, /không suy ra khả năng chịu đông sâu/);
  assert.match(html, /dateTime="2026-11-28"/i);
  assert.match(html, /href="\/san-pham\/tem-nhua-chong-nuoc"/);
  assert.match(html, /rel="canonical" href="https:\/\/vinprint.vn\/huong-dan\/chon-chat-lieu-tem"/);
  const article = structuredData(html).find(item => item["@type"] === "Article");
  assert.equal(article.dateModified, "2026-11-28");
});

test("homepage omits hardcoded FAQ claims and links to intent owners", async () => {
  const html = await (await render()).text();
  assert.ok(!structuredData(html).some(item => item["@type"] === "FAQPage"));
  for (const path of ["/huong-dan/chon-chat-lieu-tem", "/blog/chuan-bi-file-in-tem-khong-bi-mo", "/blog/gia-in-tem-so-luong-it-phu-thuoc-gi"])
    assert.ok(html.includes(`href="${path}"`));
  assert.doesNotMatch(html, /content="[^"]*ảnh thật/);
  assert.match(html, /Câu hỏi thường gặp/);
});

test("technical guide distinguishes cut formats and product pages label illustrative images", async () => {
  const guide = await (await render("/huong-dan/ky-thuat-in-tem")).text();
  assert.match(guide, /Bế demi và cắt rời khác nhau ở đâu/);
  assert.match(guide, /giữ lớp đế/);
  const product = await (await render("/san-pham/tem-uv-dtf")).text();
  assert.match(product, /Ảnh mẫu minh họa/);
  assert.doesNotMatch(product, /ẢNH SẢN PHẨM CÔNG KHAI/);
});

test("homepage lists services without emitting incomplete product rich results", async () => {
  const data = structuredData(await (await render()).text());
  const list = data.find((item) => item["@type"] === "ItemList");
  assert.equal(list.itemListElement.length, 10);
  assert.ok(list.itemListElement.every((item) => item.name && item.url.startsWith("https://vinprint.vn/san-pham/")));
  assert.doesNotMatch(JSON.stringify(data), /"@type":"Product"/);
});

test("product detail schema reflects priced products and quote-only printing services", async () => {
  for (const [slug, type, price] of [["tem-giay", "Product", 10000], ["tem-nhua-trong", "Service", null]]) {
    const data = structuredData(await (await render(`/san-pham/${slug}`)).text());
    const entity = data.find((item) => item["@type"] === type);
    assert.ok(entity);
    assert.equal(entity.url, `https://vinprint.vn/san-pham/${slug}`);
    assert.match(entity.image, /^https:\/\/vinprint\.vn\//);
    if (price) assert.equal(entity.offers.price, price);
    else {
      assert.equal(entity.offers, undefined);
      assert.equal(entity.review, undefined);
      assert.equal(entity.aggregateRating, undefined);
      assert.equal(entity.provider.name, "VinPrint");
      assert.ok(!data.some((item) => item["@type"] === "Product"));
    }
  }
});

test("all ten product pages publish distinct order checks and relevant alternatives", async () => {
  const slugs = ["tem-giay","tem-nhua-chong-nuoc","tem-nhua-trong","tem-uv-dtf","tem-bac","tem-vang","tem-7-mau","tem-bao-hanh","tem-phu-san-pham","sticker-trang-tri"];
  const sections = new Set();
  for (const slug of slugs) {
    const response = await render(`/san-pham/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    const checklist = html.slice(html.indexOf(`data-product-checklist="${slug}"`)).split("</section>")[0];
    assert.ok(checklist.includes('id="order-checklist-title"'));
    assert.equal((checklist.match(/<dt[ >]/g) || []).length, 3);
    assert.ok(checklist.includes('/blog/chuan-bi-file-in-tem-khong-bi-mo'));
    sections.add(checklist);
    const related = html.slice(html.indexOf('class="related-products')).split('</section>')[0];
    assert.equal((related.match(/href="\/san-pham\//g) || []).length, 3);
    assert.ok(!related.includes(`href="/san-pham/${slug}"`));
  }
  assert.equal(sections.size, 10);
});

test("catalog renders all ten products and preserves other printing groups without JavaScript", async () => {
  const response = await render("/san-pham");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal((html.match(/data-catalog-item=/g) || []).length, 10);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.match(html, /Từ 25.000đ \/ A5/);
  assert.match(html, /Từ 10.000đ \/ tờ/);
  for (const group of ["office", "advertising", "packaging"])
    assert.ok(html.includes(`data-category="${group}"`));
  assert.match(html, /rel="canonical" href="https:\/\/vinprint.vn\/san-pham"/);
  assert.match(html, /href="\/huong-dan\/chon-chat-lieu-tem"/);
  assert.ok(html.includes('class="vinprint-storefront vp-product-storefront"'));
});

test("three guides share the approved storefront frame and expose section anchors in HTML", async () => {
  for (const [slug, count] of [["chon-chat-lieu-tem",5],["chon-kich-thuoc-tem",3],["ky-thuat-in-tem",4]]) {
    const response = await render(`/huong-dan/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes('class="vp-guide-page"'));
    assert.ok(html.includes('aria-label="Mục lục hướng dẫn"'));
    assert.equal((html.match(/id="guide-section-/g)||[]).length,count);
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
    const article = structuredData(html).find(item=>item["@type"]==="Article");
    assert.equal(article.mainEntityOfPage,`https://vinprint.vn/huong-dan/${slug}`);
  }
});

test("material comparison includes selectable photos and an honest illustration notice in server HTML", async () => {
  const html = await (await render("/huong-dan/chon-chat-lieu-tem")).text();
  assert.ok(html.includes('id="compare-left"'));
  assert.ok(html.includes('id="compare-right"'));
  assert.equal((html.match(/class="vp-visual-photo"/g)||[]).length,2);
  assert.match(html,/Ảnh mẫu minh họa Decal giấy/);
  assert.match(html,/Ảnh mẫu minh họa Decal nhựa chống nước/);
  assert.match(html,/không phải kết quả thử vật liệu/);
  assert.match(html,/id="visual-zoom-title"/);
  assert.equal((html.match(/scope="row"/g)||[]).length,5);
});

test("production HTTP redirects directly to HTTPS and preserves path and query", async () => {
  for (const path of ["/", "/san-pham/tem-giay?utm_source=test", "/robots.txt"]) {
    const response = await render(path, "http://vinprint.vn");
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `https://vinprint.vn${path}`);
  }
  const oldPath = "/product/sticker-trang-tri-pvc-chong-nuoc-sieu-ben-boc-khong-de-lai-keo-1000-mau-hot-trend-doc-la";
  const legacy = await render(`${oldPath}/?utm_source=test`, "http://vinprint.vn");
  assert.equal(legacy.status, 308);
  assert.equal(legacy.headers.get("location"), "https://vinprint.vn/san-pham/sticker-trang-tri?utm_source=test");
  assert.equal((await render("/", "https://vinprint.vn")).status, 200);
});

test("approved Facebook content renders on its distinct intent owners", async () => {
  const article = await render("/blog/tem-nhan-trung-thu-hop-qua");
  assert.equal(article.status, 200);
  const html = await article.text();
  assert.match(html, /Tem nhãn Trung thu: dấu ấn riêng trên từng hộp quà/);
  assert.match(html, /tem-trung-thu\.webp/);
  assert.match(html, /Ba ý tưởng tem cho mùa quà tặng/);
  assert.doesNotMatch(html, /Hồ sơ biên tập|Caption gốc/);
  const cosmetics = await render("/nganh/my-pham");
  assert.equal(cosmetics.status, 200);
  const page = await cosmetics.text();
  assert.match(page, /Chất liệu nên cân nhắc/);
  assert.match(page, /Tem UV DTF cho chai lọ mỹ phẩm: điểm nhấn từ logo riêng/);
  assert.match(page, /uv-dtf-chai-lo-my-pham\.webp/);
  assert.match(page, /Hình minh họa AI từ fanpage VinPrint/);
  assert.match(page, /href="\/san-pham\/tem-uv-dtf"/);
  assert.equal((page.match(/<h1[ >]/g) ?? []).length, 1);
});

test("does not expose development preview metadata", async () => {
  const response = await render();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.doesNotMatch(await response.text(), developmentPreviewMeta);
});

test("AI247 renders a crawlable video hub with canonical metadata", async () => {
  const response = await render("/ai247", "https://vinprint.vn");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<h1[^>]*>Video AI marketing, cập nhật tại một nơi<\/h1>/i);
  assert.match(html, /rel="canonical" href="https:\/\/vinprint\.vn\/ai247"/i);
  assert.match(html, /"@type":"CollectionPage"/);
  assert.match(html, /Video đầu tiên đang được chuẩn bị|Đang tải video/);
});

test("renders the new storefront homepage with key sections", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /In ấn chuẩn Tết/i);
  assert.match(html, /Bảng giá in tem nhãn/i);
  assert.match(html, /Nhắn Zalo chốt in/i);
  assert.match(html, /Câu hỏi thường gặp/i);
  assert.doesNotMatch(html, /Tải Order Pack ZIP/i);
  assert.match(html, /https:\/\/vinprint\.vn/);
  assert.doesNotMatch(html, /vinprint-ai\.cdrvietnam\.chatgpt\.site/i);
  assert.match(html, /Thứ 2–Thứ 7/);
  assert.match(html, /An Phú Đông/);
  assert.doesNotMatch(html, /images\.unsplash\.com/i);
});

test("homepage keeps the print guide in navigation instead of an inline section", async () => {
  const response = await render();
  const html = await response.text();
  const header = (html.match(/<header[\s\S]*?<\/header>/i)?.[0] ?? "") + (html.match(/<aside[\s\S]*?<\/aside>/i)?.[0] ?? "");

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
  assert.doesNotMatch(html, /"@type":"FAQPage"/);
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const business = schemas.find((schema) => schema["@type"] === "LocalBusiness");
  const map = new URL(business.hasMap);
  assert.equal(map.protocol, "https:");
  assert.equal(map.hostname, "www.google.com");
  assert.ok(map.searchParams.get("query").includes(business.address.streetAddress));
  assert.ok(business.sameAs.includes(business.hasMap));
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

test("homepage preserves the approved seasonal composition with live semantic controls", async () => {
  const html = await (await render()).text();
  const hero = html.match(/<section[^>]*id="trang-chu"[\s\S]*?<\/section>/i)?.[0] ?? "";
  assert.match(html, /aria-controls="sidebar"/);
  assert.match(html, /id="mau-thuc-te"/);
  assert.match(html, /id="danh-gia"/);
  assert.match(hero, /viewBox="244 90 1516 335"/);
  assert.match(hero, /images\/tet-2027\/artwork\.png/);
  assert.match(hero, /In ấn chuẩn Tết/);
  assert.match(hero, /Nâng tầm thương hiệu/);
  assert.match(hero, /href="#nhan-bao-gia"/);
  assert.match(html, /viewBox="244 500 1516 74"/);
  assert.doesNotMatch(html, /4\.949 Xu|Tài khoản khách hàng|data-hero-carousel/);
});
test("image library is available locally and protected in production", async () => {
  const localResponse = await render("/admin/hinh-anh");
  const productionResponse = await render("/admin/hinh-anh", "https://vinprint.vn");

  assert.equal(localResponse.status, 200);
  assert.match(await localResponse.text(), /Quản trị toàn bộ hình ảnh/i);
  assert.equal(productionResponse.status, 401);
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

test("homepage publishes four detailed pricing posters with a wholesale path", async () => {
  const response = await render();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Combo ưu đãi/);
  assert.match(html, /Bảng giá in tem nhãn/i);
  assert.equal((html.match(/data-pricing-poster/g) ?? []).length, 4);




  assert.match(html, /bang-gia-tem-nhan-tong-hop\.webp/);
  assert.match(html, /bang-gia-tem-nhan-tham-khao\.webp/);
  assert.match(html, /bang-gia-tem-tron\.webp/);
  assert.match(html, /bang-gia-sticker-uv-dtf\.webp/);
  assert.match(html, /alt="Bảng giá tem nhãn tổng hợp"/);
  assert.match(html, /alt="Bảng giá sticker UV DTF"/);
  assert.match(html, /aria-label="Xem rõ Bảng giá tem nhãn tổng hợp"/);
  assert.match(html, /1\.000 tem tròn 3 cm: 99\.000đ/);
  assert.match(html, /1\.000 tem tròn 6 cm: 320\.000đ/);
  assert.match(html, /Tờ A5: 25\.000đ/);
  assert.match(html, /5 mét: 185\.000đ\/m/);
  assert.match(html, /Đơn giá chưa bao gồm VAT và phí vận chuyển/);
  assert.match(html, /Hỗ trợ thiết kế miễn phí cho đơn từ 1 mét trở lên/);
  assert.match(html, /Giá và ưu đãi được xác nhận lại theo vật liệu, quy cách, số lượng và thời điểm đặt in/i);
  assert.match(html, /Nhận báo giá sỉ/i);
  assert.match(html, /id="nhan-bao-gia"/);
  assert.doesNotMatch(html, /Tròn 3 cm \(đường kính\)|Tròn 4 cm \(đường kính\)|Tròn 5 cm \(đường kính\)|Tròn 6 cm \(đường kính\)/);
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
  assert.doesNotMatch(html, /id="(?:hot-title|san-pham-noi-bat)"/);
  assert.equal((html.match(/data-catalog-product=/g) || []).length, 10);
  assert.equal((html.match(/class="vp-catalog-photo"/g) || []).length, 7);
  assert.match(html, /Xem tất cả sản phẩm/i);
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
  assert.match(html, /Xem sản phẩm tại shop/i);
  assert.match(html, /application\/ld\+json/i);
});

test("renders a crawlable blog index with category navigation", async () => {
  const response = await render("/blog");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Cẩm nang tem nhãn/i);
  assert.match(html, /aria-label="Lọc bài viết theo chuyên mục"/i);
  assert.match(html, /href="\/blog\/chuyen-muc\/chat-lieu"/i);
  assert.match(html, /href="\/blog\/tem-nhieu-vi-san-pham"/i);
  assert.match(html, /href="\/blog\/tem-hologram-7-mau"/i);
  assert.match(html, /href="\/blog\/tem-qr-cho-shop"/i);
  assert.match(html, /data-blog-thumbnail="compact"/i);
  assert.match(html, /object-fit:contain/i);
  assert.match(html, /\/images\/blog\/tem-nhieu-vi-san-pham\.webp/i);
  assert.match(html, /\/images\/blog\/tem-hologram-7-mau\.webp/i);
  assert.match(html, /\/images\/blog\/tem-qr-cho-shop\.webp/i);
  assert.match(html, /\/images\/blog\/card-visit-va-tem-nhan-dong-bo\.webp/i);
  assert.match(html, /href="\/blog\/card-visit-va-tem-nhan-dong-bo"/i);
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
  assert.match(xml, /https:\/\/vinprint\.vn\/blog\/tem-qr-cho-shop/i);
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
    "/nganh/tem-nhan-tet",
    "/nganh/tem-banh-mut-tet",
    "/nganh/sticker-hop-qua-tet",
    "/huong-dan/chon-chat-lieu-tem",
    "/huong-dan/chon-kich-thuoc-tem",
    "/huong-dan/ky-thuat-in-tem",
    "/blog",
    "/blog/chuyen-muc/chat-lieu",
    "/blog/tem-giay-va-tem-nhua-nen-chon-loai-nao",
    "/blog/tem-uv-dtf-la-gi",
    "/blog/tem-qr-cho-shop",
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

test("product pages render the buying guide, FAQ schema and related articles", async () => {
  const response = await render("/san-pham/tem-nhua-chong-nuoc");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /khi nào nên chọn\?/);
  assert.match(html, /Câu hỏi thường gặp về tem nhựa chống nước/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /href="\/blog\/tem-ly-ca-phe-chong-nuoc"/);
});

test("unknown URLs return a helpful 404 page", async () => {
  const response = await render("/trang-khong-ton-tai-xyz");
  const html = await response.text();

  assert.equal(response.status, 404);
  assert.match(html, /Trang này không còn hoặc đã đổi địa chỉ/);
  assert.match(html, /href="\/san-pham"/);
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
  assert.match(xml, /https:\/\/vinprint\.vn\/blog\/tem-qr-cho-shop<\/loc>/i);
  assert.match(xml, /https:\/\/vinprint\.vn\/blog\/loi-thiet-ke-tem-nhan<\/loc>/i);
  assert.match(xml, /<image:image>[\s\S]*tem-uv-dtf-ly-goc-nghieng\.webp[\s\S]*<\/image:image>/i);
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
