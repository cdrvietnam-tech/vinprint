import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import path from "node:path";

const projectRoot = process.cwd();
const componentPath = path.join(projectRoot, "app/components/home/HotProductsMarquee.tsx");

test("hot products use transparent PNG assets and an automatic infinite track", () => {
  const source = readFileSync(componentPath, "utf8");
  const mediaSource = readFileSync(path.join(projectRoot, "app/lib/media-collections.ts"), "utf8");
  const images = [...mediaSource.matchAll(/src:\s*"([^"]+\.png)"/g)].map((match) => match[1]);

  assert.ok(images.length >= 3);
  for (const image of new Set(images)) {
    const filePath = path.join(projectRoot, "public", image);
    assert.ok(existsSync(filePath), `Missing ${image}`);
    const png = readFileSync(filePath);
    assert.ok(png[25] === 4 || png[25] === 6, `${image} must preserve an alpha channel`);
  }

  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /track\.scrollWidth \/ 2/);
  assert.match(source, /translate3d/);
  assert.match(source, /scale = 0\.68 \+ influence \* 0\.38/);
  assert.doesNotMatch(source, /hot-product-glow/);
  assert.match(source, /data-centered/);
  assert.match(source, /product\.category/);
  assert.match(source, /product\.title/);
  assert.match(source, /dynamic-image-gif-video/);
  assert.match(source, /product\.kind === "video"/);
  assert.match(source, /video\.play\(\)/);
  assert.match(source, /video\.pause\(\)/);
  assert.match(source, /image\/gif|kind === "gif"/);
  assert.match(source, /elapsed \* 0\.05/);
  assert.match(source, /isPausedRef\.current/);
  assert.match(source, /onMouseEnter/);
  assert.match(source, /visualInfluenceRefs/);
  assert.match(source, /visualRefs/);
  assert.match(source, /previousInfluence/);
  assert.match(source, /Math\.exp\(-elapsed \/ 90\)/);
  assert.match(source, /w-\[120px\]/);
  assert.match(source, /lg:w-\[180px\]/);
  assert.match(source, /Array\.isArray\(result\?\.items\)/);
  assert.doesNotMatch(source, /result\?\.items\.length/);
  assert.match(source, /data-media-fit="contain"/);
  assert.match(source, /Chưa có sản phẩm hot/);
  assert.doesNotMatch(source, /three|WebGLRenderer|CylinderGeometry|rotateY/i);
});

test("hot products section keeps the all-products call to action", () => {
  const source = readFileSync(componentPath, "utf8");

  assert.match(source, /Các sản phẩm/);
  assert.match(source, /đang hot/);
  assert.match(source, /href="\/san-pham"/);
  assert.match(source, /Xem tất cả sản phẩm của shop/);
});

test("product catalog contains the requested print categories", () => {
  const catalogPath = path.join(projectRoot, "app/components/catalog/ProductCatalogTabs.tsx");
  const source = `${readFileSync(catalogPath, "utf8")}\n${readFileSync(path.join(projectRoot, "app/lib/product-catalog.ts"), "utf8")}`;

  for (const category of ["Tem giấy", "Tem nhựa chống nước", "Tem giấy kraft", "Tem trong", "Sticker trang trí", "Tem vàng", "Tem bạc", "In catalog", "In card visit", "In voucher", "In bao thư", "In tờ rơi", "In folder", "In túi giấy", "In hóa đơn"]) {
    assert.match(source, new RegExp(category, "i"));
  }
});
