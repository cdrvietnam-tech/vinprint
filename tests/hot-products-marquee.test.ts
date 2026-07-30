import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import path from "node:path";

const projectRoot = process.cwd();
const componentPath = path.join(projectRoot, "app/components/home/HotProductsMarquee.tsx");

test("hot products use transparent PNG assets in a 2-row grid without cropping", () => {
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

  // Lưới responsive, hiển thị đủ ảnh (không cắt) và có hiệu ứng hover.
  assert.match(source, /grid-cols-2/);
  assert.match(source, /sm:grid-cols-3/);
  assert.match(source, /lg:grid-cols-5/);
  assert.match(source, /object-contain/);
  assert.doesNotMatch(source, /object-cover/);
  assert.match(source, /group-hover:/);
  // 2 hàng + nút xem thêm / thu gọn.
  assert.match(source, /useColumns/);
  assert.match(source, /const twoRows = columns \* 2/);
  assert.match(source, /setExpanded/);
  assert.match(source, /Xem thêm/);
  assert.match(source, /Thu gọn/);
  // Vẫn hỗ trợ ảnh/GIF/video và click mở sản phẩm.
  assert.match(source, /product\.category/);
  assert.match(source, /product\.title/);
  assert.match(source, /product\.kind === "video"/);
  assert.match(source, /image\/gif|kind === "gif"/);
  assert.match(source, /href=\{product\.href\}/);
  // Xóa hết thì ẩn khối, không tự hiện lại mẫu mặc định.
  assert.match(source, /loaded && hotProducts\.length === 0/);
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
  const source = readFileSync(catalogPath, "utf8");

  for (const category of ["Tem giấy", "Tem nhựa chống nước", "Tem giấy kraft", "Tem trong", "Sticker trang trí", "Tem vàng", "Tem bạc", "In catalog", "In card visit", "In voucher", "In bao thư", "In tờ rơi", "In folder", "In túi giấy", "In hóa đơn"]) {
    assert.match(source, new RegExp(category, "i"));
  }
});
