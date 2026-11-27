import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { detectTopic, importBatch, normalizeText, slugify, validateBatch } from "../scripts/facebook-sync/import-post.mjs";

const validPost = {
  id: "105514821740093_1390130326606961",
  message: "Tem UV DTF cho chai mỹ phẩm: logo nổi gọn và dễ dán trên bề mặt cứng.",
  permalink_url: "https://www.facebook.com/105514821740093/posts/1390130326606961",
  full_picture: "https://scontent.fsgn2-9.fna.fbcdn.net/example.jpg",
  created_time: "2026-09-22T08:00:00+07:00",
};

test("normalizes Facebook captions without executing or expanding content", () => {
  assert.equal(normalizeText("  Dòng 1\r\n\r\n\r\nDòng 2\u0000  "), "Dòng 1\n\nDòng 2");
  assert.equal(slugify("Tem nhựa trong – Chai mỹ phẩm"), "tem-nhua-trong-chai-my-pham");
  assert.equal(detectTopic(validPost.message), "uv-dtf");
});

test("accepts only the configured page and at most two safe image posts", () => {
  const result = validateBatch({ source: "n8n-vinprint-v1", page_id: "105514821740093", posts: [validPost] });
  assert.equal(result[0].postId, validPost.id);
  assert.throws(() => validateBatch({ source: "n8n-vinprint-v1", page_id: "1", posts: [validPost] }), /unexpected Facebook page/);
  assert.throws(() => validateBatch({ source: "n8n-vinprint-v1", page_id: "105514821740093", posts: [validPost, validPost, validPost] }), /one or two/);
  assert.throws(() => validateBatch({ source: "n8n-vinprint-v1", page_id: "105514821740093", posts: [{ ...validPost, full_picture: "https://example.com/a.jpg" }] }), /Facebook CDN/);
});

test("the n8n workflow is importable JSON and contains no AI node", async () => {
  const workflow = JSON.parse(await readFile("automation/n8n/vinprint-facebook-to-web.json", "utf8"));
  assert.equal(workflow.settings.timezone, "Asia/Bangkok");
  assert.match(JSON.stringify(workflow), /105514821740093/);
  assert.doesNotMatch(JSON.stringify(workflow).toLowerCase(), /openai|chatgpt|langchain/);
  assert.ok(workflow.nodes.some((node) => node.type === "n8n-nodes-base.scheduleTrigger"));
  assert.ok(workflow.nodes.some((node) => node.name === "Gửi gói sang GitHub"));
});

test("imports an image post once and deduplicates the same post", { concurrency: false }, async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "vinprint-facebook-sync-"));
  const previousDirectory = process.cwd();
  const previousFetch = globalThis.fetch;
  try {
    process.chdir(directory);
    const fixture = await sharp({ create: { width: 40, height: 30, channels: 3, background: "#f97316" } }).png().toBuffer();
    globalThis.fetch = async () => new Response(fixture, { status: 200, headers: { "content-type": "image/png", "content-length": String(fixture.length) } });
    const payload = { source: "n8n-vinprint-v1", page_id: "105514821740093", posts: [validPost] };
    const first = await importBatch(payload, new Date("2026-09-22T02:00:00Z"));
    const second = await importBatch(payload, new Date("2026-09-22T02:05:00Z"));
    const repeatedCaption = await importBatch({ ...payload, posts: [{ ...validPost, id: "105514821740093_1390130326606999" }] }, new Date("2026-09-22T02:10:00Z"));
    assert.equal(first.length, 1);
    assert.equal(second.length, 0);
    assert.equal(repeatedCaption.length, 0);
    assert.equal(JSON.parse(await readFile(`content/facebook/published/${first[0].slug}.json`, "utf8")).postId, validPost.id);
    assert.equal((await sharp(await readFile(`public${first[0].image}`)).metadata()).format, "webp");
  } finally {
    process.chdir(previousDirectory);
    globalThis.fetch = previousFetch;
    await rm(directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
});
