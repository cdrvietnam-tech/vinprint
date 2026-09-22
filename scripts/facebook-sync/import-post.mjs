import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const PAGE_ID = "105514821740093";
const MAX_POSTS_PER_RUN = 2;
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const allowedImageHost = (hostname) => hostname === "facebook.com" || hostname.endsWith(".facebook.com") || hostname.endsWith(".fbcdn.net");

export function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function slugify(value) {
  return normalizeText(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase()
    .replace(/https?:\/\/\S+/g, " ").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 58).replace(/-+$/g, "");
}

export function detectTopic(message) {
  const text = slugify(message);
  if (/uv-dtf/.test(text)) return "uv-dtf";
  if (/bao-hanh|niem-phong|tem-vo/.test(text)) return "tem-bao-hanh";
  if (/tem-trong|decal-trong|nhua-trong/.test(text)) return "tem-trong";
  if (/tem-bac|tem-vang|anh-kim|ep-kim|hologram|7-mau/.test(text)) return "tem-anh-kim";
  if (/sticker|trang-tri/.test(text)) return "sticker";
  if (/chong-nuoc|tem-nhua|decal-nhua/.test(text)) return "tem-nhua";
  if (/tem-giay|decal-giay|tui-kraft|hop-giay/.test(text)) return "tem-giay";
  return "tem-nhan";
}

function shortLine(message) {
  const candidate = message.split("\n").map((line) => line.replace(/https?:\/\/\S+/g, "").replace(/(^|\s)#[\p{L}\p{N}_-]+/gu, "").trim()).find((line) => line.length >= 8) ?? "Mẫu tem mới từ VinPrint";
  const headline = candidate.length > 84 ? `${candidate.slice(0, 81).trim()}…` : candidate;
  return headline.length >= 20 ? headline : `Mẫu tem mới tại VinPrint: ${headline}`.slice(0, 90);
}

function summaryFor(message) {
  const oneLine = message.replace(/\s+/g, " ").replace(/https?:\/\/\S+/g, "").trim();
  const summary = `Mẫu thực tế được VinPrint chia sẻ trên fanpage: ${oneLine}`;
  return summary.length > 240 ? `${summary.slice(0, 237).trim()}…` : summary.padEnd(40, ".");
}

function validateUrl(value, kind) {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error(`${kind} must use HTTPS`);
  if (kind === "permalink" && !(url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com"))) throw new Error("permalink must point to Facebook");
  if (kind === "image" && !allowedImageHost(url.hostname)) throw new Error("image must come from Facebook CDN");
  return url;
}

async function existingRecords() {
  const directory = "content/facebook/published";
  await mkdir(directory, { recursive: true });
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json"));
  return Promise.all(files.map(async (file) => JSON.parse(await readFile(path.join(directory, file), "utf8"))));
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "User-Agent": "VinPrintFacebookSync/1.0" } });
  if (!response.ok) throw new Error(`image download failed with HTTP ${response.status}`);
  const type = response.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) throw new Error("Facebook attachment is not an image");
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_IMAGE_BYTES) throw new Error("Facebook image exceeds 12 MB");
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > MAX_IMAGE_BYTES) throw new Error("Facebook image exceeds 12 MB");
  await sharp(bytes).rotate().resize(1400, 1050, { fit: "inside", withoutEnlargement: true }).webp({ quality: 86 }).toFile(outputPath);
}

export function validateBatch(payload) {
  if (payload?.source !== "n8n-vinprint-v1") throw new Error("untrusted dispatch source");
  if (String(payload?.page_id) !== PAGE_ID) throw new Error("unexpected Facebook page");
  if (!Array.isArray(payload.posts) || payload.posts.length < 1 || payload.posts.length > MAX_POSTS_PER_RUN) throw new Error("a batch must contain one or two posts");
  return payload.posts.map((post) => {
    const postId = String(post.id ?? "");
    if (!/^\d+(?:_\d+)?$/.test(postId)) throw new Error("invalid Facebook post id");
    const message = normalizeText(post.message);
    if (message.length < 20 || message.length > 5000) throw new Error(`post ${postId} has an unsupported caption length`);
    const permalink = validateUrl(post.permalink_url, "permalink").toString();
    const imageUrl = validateUrl(post.full_picture, "image").toString();
    const publishedAt = new Date(post.created_time);
    if (Number.isNaN(publishedAt.valueOf())) throw new Error(`post ${postId} has an invalid timestamp`);
    return { postId, message, permalink, imageUrl, publishedAt: publishedAt.toISOString() };
  });
}

export async function importBatch(payload, now = new Date()) {
  const posts = validateBatch(payload);
  const existing = await existingRecords();
  const seenIds = new Set(existing.map((record) => record.postId));
  const seenHashes = new Set(existing.map((record) => record.contentHash));
  const created = [];

  await mkdir("public/images/facebook", { recursive: true });
  for (const post of posts) {
    const contentHash = createHash("sha256").update(JSON.stringify([PAGE_ID, post.message])).digest("hex");
    if (seenIds.has(post.postId) || seenHashes.has(contentHash)) continue;
    const postSuffix = post.postId.split("_").at(-1).slice(-8);
    const baseSlug = slugify(shortLine(post.message)) || "mau-tem-vinprint";
    const slug = `${baseSlug}-${postSuffix}`.slice(0, 72).replace(/-+$/g, "");
    const image = `/images/facebook/${slug}.webp`;
    await downloadImage(post.imageUrl, path.join("public", image.replace(/^\//, "")));
    const record = {
      schemaVersion: 1,
      pageId: PAGE_ID,
      postId: post.postId,
      contentHash,
      slug,
      headline: shortLine(post.message),
      summary: summaryFor(post.message),
      message: post.message,
      image,
      imageAlt: `Mẫu tem VinPrint trong bài đăng ${post.postId.split("_").at(-1)}`,
      permalink: post.permalink,
      publishedAt: post.publishedAt,
      syncedAt: now.toISOString(),
      topic: detectTopic(post.message),
    };
    await writeFile(`content/facebook/published/${slug}.json`, `${JSON.stringify(record, null, 2)}\n`, "utf8");
    created.push(record);
    seenIds.add(post.postId);
    seenHashes.add(contentHash);
  }
  return created;
}

async function main() {
  const eventIndex = process.argv.indexOf("--event");
  if (eventIndex < 0 || !process.argv[eventIndex + 1]) throw new Error("usage: import-post.mjs --event <github-event.json>");
  const event = JSON.parse(await readFile(process.argv[eventIndex + 1], "utf8"));
  const created = await importBatch(event.client_payload);
  const output = process.env.GITHUB_OUTPUT;
  if (output) {
    await appendFile(output, `created_count=${created.length}\npost_ids=${created.map((post) => post.postId).join(",")}\nslugs=${created.map((post) => post.slug).join(",")}\n`, "utf8");
  }
  console.log(created.length ? `Prepared ${created.length} Facebook post(s): ${created.map((post) => post.slug).join(", ")}` : "No new Facebook posts to import.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
}
