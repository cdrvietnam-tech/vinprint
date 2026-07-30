import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import {
  DEFAULT_SITE_CONTENT,
  isValidSiteContent,
  mergeSiteContent,
} from "../app/lib/site-content";

const projectRoot = process.cwd();
const read = (relative: string) => readFileSync(path.join(projectRoot, relative), "utf8");

test("isValidSiteContent accepts the full default content", () => {
  assert.equal(isValidSiteContent(DEFAULT_SITE_CONTENT), true);
  // Bản sao đầy đủ (giống payload admin gửi) cũng hợp lệ.
  assert.equal(isValidSiteContent(JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT))), true);
});

test("isValidSiteContent rejects malformed data that could break the UI", () => {
  assert.equal(isValidSiteContent(null), false);
  assert.equal(isValidSiteContent("nope"), false);
  assert.equal(isValidSiteContent([]), false);
  assert.equal(isValidSiteContent({}), false); // thiếu key
  // menu phải là mảng đối tượng {label, href}
  const badMenu = { ...JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)) };
  badMenu.header.menu = "oops";
  assert.equal(isValidSiteContent(badMenu), false);
  // phần tử stats thiếu trường
  const badStat = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
  badStat.stats = [{ value: "1" }];
  assert.equal(isValidSiteContent(badStat), false);
  // sai kiểu (badge.ok phải boolean)
  const badBadge = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
  badBadge.finalCta.badges = [{ text: "x", ok: "yes" }];
  assert.equal(isValidSiteContent(badBadge), false);
});

test("mergeSiteContent falls back to defaults for missing or wrong-typed fields", () => {
  const merged = mergeSiteContent({});
  assert.ok(Array.isArray(merged.header.menu));
  assert.equal(merged.hero.titleLine1, DEFAULT_SITE_CONTENT.hero.titleLine1);
  // menu sai kiểu -> dùng menu mặc định
  const merged2 = mergeSiteContent({ header: { menu: "bad" } });
  assert.ok(Array.isArray(merged2.header.menu));
  assert.equal(merged2.header.menu.length, DEFAULT_SITE_CONTENT.header.menu.length);
});

test("analytics uses a single GA4 path (gtag) and no duplicate dataLayer push", () => {
  const analytics = read("app/lib/analytics.ts");
  assert.match(analytics, /window\.gtag\?\.\("event"/);
  assert.doesNotMatch(analytics, /window\.dataLayer\?\.push/);
});

test("layout does not render Google Tag Manager (avoids double counting)", () => {
  const layout = read("app/layout.tsx");
  assert.doesNotMatch(layout, /GoogleTagManager/);
  assert.match(layout, /GoogleAnalytics/);
});

test("content admin checks response.ok on load and reset (no false success)", () => {
  const admin = read("app/components/admin/ContentAdmin.tsx");
  const okChecks = admin.match(/response\.ok/g) ?? [];
  assert.ok(okChecks.length >= 3, "expected response.ok checks in load, save and reset");
});

test("mobile action bar reads contact from admin content, not hardcoded", () => {
  const bar = read("app/components/home/MobileActionBar.tsx");
  assert.match(bar, /useSiteContent/);
  assert.match(bar, /contact\.zaloUrl/);
  assert.match(bar, /contact\.phone/);
  assert.doesNotMatch(bar, /https:\/\/zalo\.me\/0844998499/);
});
