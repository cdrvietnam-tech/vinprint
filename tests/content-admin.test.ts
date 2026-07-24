import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import {
  parseManagedArticleOverride,
  parseManagedProductOverride,
} from "../app/lib/content-management";

const projectRoot = process.cwd();

test("desktop hero keeps the main printing headline on one row", () => {
  const source = readFileSync(path.join(projectRoot, "app/components/home/Hero.tsx"), "utf8");
  assert.match(source, /XƯỞNG IN SIÊU TỐC/);
  assert.match(source, /lg:whitespace-nowrap/);
});

test("content admin exposes separate article and product management", () => {
  assert.ok(existsSync(path.join(projectRoot, "app/admin/noi-dung/page.tsx")));
  const admin = readFileSync(path.join(projectRoot, "app/components/admin/ContentAdmin.tsx"), "utf8");
  const worker = readFileSync(path.join(projectRoot, "worker/index.ts"), "utf8");

  assert.match(admin, /Quản trị bài viết/);
  assert.match(admin, /Quản trị sản phẩm/);
  assert.match(admin, /\/api\/admin\/content/);
  assert.match(admin, /method: "PATCH"/);
  assert.match(admin, /method: "DELETE"/);
  assert.match(worker, /\/api\/admin\/content/);
  assert.match(worker, /\/api\/content\/overrides/);
});

test("managed product and article overrides validate editable content", () => {
  assert.equal(parseManagedProductOverride({
    slug: "tem-giay",
    name: "Tem giấy mới",
    eyebrow: "Tiết kiệm",
    description: "Mô tả sản phẩm được cập nhật rõ ràng cho khách hàng.",
    benefit: "Lợi ích nổi bật của sản phẩm.",
    uses: ["Hộp giấy", "Túi kraft"],
    priceLabel: "Liên hệ báo giá",
  }).slug, "tem-giay");

  assert.equal(parseManagedArticleOverride({
    slug: "tem-giay-va-tem-nhua-nen-chon-loai-nao",
    title: "Tiêu đề bài viết được cập nhật",
    description: "Mô tả bài viết đủ rõ ràng để hiển thị trên trang cẩm nang và công cụ tìm kiếm.",
    directAnswer: "Nội dung trả lời chính được biên tập lại để khách hàng có thể đọc và áp dụng ngay khi chọn vật liệu in.",
    sections: [
      { heading: "Phần nội dung thứ nhất", paragraphs: ["Đây là đoạn nội dung đầy đủ để kiểm tra phần quản trị bài viết hoạt động đúng."] },
      { heading: "Phần nội dung thứ hai", paragraphs: ["Đây là đoạn nội dung tiếp theo đủ dài để vượt qua điều kiện kiểm tra dữ liệu."] },
    ],
  }).slug, "tem-giay-va-tem-nhua-nen-chon-loai-nao");

  assert.throws(() => parseManagedProductOverride({ slug: "../bad" }));
  assert.throws(() => parseManagedArticleOverride({ slug: "bad slug" }));
});
