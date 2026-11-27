import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { ADMIN_NAV_ITEMS, filterAdminNav, getAdminPageTitle } from "../app/components/admin/admin-nav.ts";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

test("admin nav is a single source with unique ids and valid links", () => {
  const ids = ADMIN_NAV_ITEMS.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const item of ADMIN_NAV_ITEMS) {
    assert.match(item.href, /^(\/|https:\/\/)/, `${item.id} has an unsupported href`);
    if (item.href.startsWith("https://")) assert.equal(item.external, true, `${item.id} must open in a new tab`);
  }
  assert.equal(getAdminPageTitle("noi-dung"), "Nội dung trang chủ");
});

test("quick search ignores Vietnamese diacritics", () => {
  assert.deepEqual(filterAdminNav("hinh anh").map((item) => item.id), ["hinh-anh"]);
  assert.deepEqual(filterAdminNav("Bài viết").map((item) => item.id), ["bai-viet"]);
  assert.equal(filterAdminNav("").length, ADMIN_NAV_ITEMS.length);
  assert.equal(filterAdminNav("khong-co-muc-nay").length, 0);
});

test("every admin page is wrapped in the shared shell with its own nav key", () => {
  const pages: Record<string, string> = {
    "app/admin/page.tsx": "home",
    "app/admin/noi-dung/page.tsx": "noi-dung",
    "app/admin/hinh-anh/page.tsx": "hinh-anh",
    "app/admin/bai-viet/page.tsx": "bai-viet",
  };
  for (const [file, key] of Object.entries(pages)) {
    assert.match(read(file), new RegExp(`<AdminShell active="${key}">`), `${file} must use AdminShell`);
    assert.ok(ADMIN_NAV_ITEMS.some((item) => item.id === key), `${key} missing from admin nav`);
  }
});
