import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();

test("the complete categorized image library and admin are present", () => {
  for (const slot of [1, 2, 3, 4]) {
    assert.ok(existsSync(path.join(projectRoot, `public/images/hero-admin/hero-${slot}.png`)));
  }

  const hero = readFileSync(path.join(projectRoot, "app/components/home/Hero.tsx"), "utf8");
  const admin = readFileSync(path.join(projectRoot, "app/components/admin/HeroImageAdmin.tsx"), "utf8");
  const cropEditor = readFileSync(path.join(projectRoot, "app/components/admin/ImageCropEditor.tsx"), "utf8");
  const videoAdmin = readFileSync(path.join(projectRoot, "app/components/admin/VideoAdmin.tsx"), "utf8");
  const worker = readFileSync(path.join(projectRoot, "worker/index.ts"), "utf8");
  const mediaCollections = readFileSync(path.join(projectRoot, "app/lib/media-collections.ts"), "utf8");
  const catalog = JSON.parse(readFileSync(path.join(projectRoot, "public/image-catalog.json"), "utf8")) as { items: Array<{ category: string }> };

  assert.match(hero, /object-contain/);
  assert.match(hero, /DEFAULT_MEDIA_COLLECTIONS/);
  assert.match(mediaCollections, /\/images\/hero-admin\/hero-4\.png/);
  assert.match(admin, /Quản trị toàn bộ hình ảnh/);
  assert.match(admin, /Khôi phục/);
  assert.match(admin, /previewUrls/);
  assert.match(admin, /openCurrentImageInCropper/);
  assert.match(admin, /\/api\/admin\/images\?path=/);
  assert.match(admin, /Cắt & căn/);
  assert.match(admin, /<details/);
  assert.match(admin, /Ảnh hệ thống khác/);
  assert.match(admin, /nâng cao/);
  assert.match(cropEditor, /Giữ trọn ảnh/);
  assert.match(cropEditor, /Lấp đầy khung/);
  assert.match(cropEditor, /toBlob/);
  assert.match(cropEditor, /useState\(0\.85\)/);
  assert.match(cropEditor, /onPointerDown=\{startDrag\}/);
  assert.match(cropEditor, /setPointerCapture/);
  assert.match(videoAdmin, /video\/mp4/);
  assert.match(videoAdmin, /video\/webm/);
  assert.match(videoAdmin, /maxVideoSize/);
  assert.match(videoAdmin, /\/api\/admin\/media-collections/);
  assert.match(videoAdmin, /Đăng thêm/);
  assert.match(videoAdmin, /image\/gif/);
  assert.match(videoAdmin, /ImageCropEditor/);
  assert.match(videoAdmin, /Cắt–căn/);
  assert.match(videoAdmin, /Khôi phục/);
  assert.match(videoAdmin, /restore-item/);
  assert.match(videoAdmin, /restore-missing/);
  assert.ok(catalog.items.length >= 60);
  assert.ok(new Set(catalog.items.map((item) => item.category)).size >= 6);
  assert.match(worker, /HERO_IMAGES/);
  assert.match(worker, /maxManagedImageSize/);
  assert.match(worker, /overrides\/images/);
  assert.match(worker, /url\.searchParams\.has\("path"\)/);
  assert.match(worker, /managedVideoTypes/);
  assert.match(worker, /maxManagedVideoSize/);
  assert.match(worker, /\/api\/admin\/videos/);
  assert.match(worker, /\/media\/videos\//);
  assert.match(worker, /\/api\/admin\/media-collections/);
  assert.match(worker, /\/api\/media\/collections/);
  assert.match(worker, /managedCollectionMediaTypes/);
  assert.match(worker, /action === "restore-item"/);
  assert.match(worker, /action === "restore-missing"/);
  assert.match(worker, /existingIndex >= 0/);
});
