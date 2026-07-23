import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { DEFAULT_MEDIA_COLLECTIONS, MEDIA_COLLECTIONS } from "../app/lib/media-collections";
import { PRODUCT_CATALOG_GROUPS } from "../app/lib/product-catalog";

const projectRoot = process.cwd();

test("every product catalog tag has one independently managed thumbnail id", () => {
  const catalogItems = PRODUCT_CATALOG_GROUPS.flatMap((group) => group.items);
  const thumbnailItems = DEFAULT_MEDIA_COLLECTIONS["product-thumbnails"];
  const catalogIds = catalogItems.map((item) => item.id);

  assert.equal(catalogItems.length, 29);
  assert.equal(new Set(catalogIds).size, catalogItems.length);
  assert.deepEqual(
    thumbnailItems.map((item) => item.id).sort(),
    [...catalogIds].sort(),
  );
});

test("product thumbnail collection is fixed and clearly labeled in admin", () => {
  const definition = MEDIA_COLLECTIONS.find((collection) => collection.id === "product-thumbnails");
  const adminSource = readFileSync(path.join(projectRoot, "app/components/admin/VideoAdmin.tsx"), "utf8");

  assert.equal(definition?.title, "Ảnh đại diện danh mục sản phẩm");
  assert.equal(definition?.allowAdd, false);
  assert.equal(definition?.allowDelete, false);
  assert.match(adminSource, /product-thumbnails/);
  assert.match(adminSource, /Thay ảnh – Cắt\/căn – Khôi phục/);
});

test("product catalog resolves managed thumbnails by stable tag id", () => {
  const source = readFileSync(path.join(projectRoot, "app/components/catalog/ProductCatalogTabs.tsx"), "utf8");

  assert.match(source, /collection=product-thumbnails/);
  assert.match(source, /managedThumbnails/);
  assert.match(source, /managed\?\.title \|\| item\.name/);
  assert.match(source, /item\.id/);
  assert.match(source, /item\.image/);
});

test("product catalog prioritizes large imagery in a five-column desktop grid", () => {
  const source = readFileSync(path.join(projectRoot, "app/components/catalog/ProductCatalogTabs.tsx"), "utf8");

  assert.match(source, /lg:grid-cols-5/);
  assert.match(source, /group\.items\.slice\(0, 15\)/);
  assert.match(source, /aspect-\[4\/3\]/);
  assert.match(source, /sizes="\(max-width: 639px\) 100vw, \(max-width: 1023px\) 50vw, 20vw"/);
  assert.match(source, /data-catalog-card/);
  assert.doesNotMatch(source, /h-16 w-16/);
  assert.doesNotMatch(source, /Xem chi tiết/);
});

test("product catalog cards distinguish detail pages from Zalo quotes accessibly", () => {
  const source = readFileSync(path.join(projectRoot, "app/components/catalog/ProductCatalogTabs.tsx"), "utf8");

  assert.match(source, /alt=""/);
  assert.match(source, /aria-label=\{`Xem \$\{name\}`\}/);
  assert.match(source, /aria-label=\{`Nhắn Zalo nhận giá \$\{name\}`\}/);
  assert.match(source, />\s*Nhận giá\s*</);
});
