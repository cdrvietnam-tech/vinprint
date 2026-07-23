/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { resolveLegacyRedirect } from "../app/lib/legacy-redirects";
import { DEFAULT_MEDIA_COLLECTIONS, isValidManagedMediaItemId, type ManagedMediaItem, type MediaCollectionId } from "../app/lib/media-collections";
import { isManagedContentType, parseManagedContentOverride, type ManagedContentType } from "../app/lib/content-management";
import { QUOTE_FILE_EXTENSIONS, QUOTE_FILE_MAX_BYTES, type QuoteRequestRecord } from "../app/lib/quote-requests";

interface Env {
  ASSETS?: Fetcher;
  DB: D1Database;
  HERO_IMAGES?: R2Bucket;
  ADMIN_EMAIL?: string;
  CF_ACCESS_AUD?: string;
  CF_ACCESS_TEAM_DOMAIN?: string;
  IMAGES?: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

type AccessJwtHeader = {
  alg?: string;
  kid?: string;
};

type AccessJwtPayload = {
  aud?: string | string[];
  email?: string;
  exp?: number;
  iss?: string;
  nbf?: number;
};

type AccessJwk = JsonWebKey & { kid?: string };

let accessKeyCache: { expiresAt: number; issuer: string; keys: AccessJwk[] } | null = null;

function decodeJwtPart<T>(value: string): T | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

function decodeJwtSignature(value: string) {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function getAccessIssuer(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value.startsWith("https://") ? value : `https://${value}`);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".cloudflareaccess.com")) return null;
    return url.origin;
  } catch {
    return null;
  }
}

async function getAccessKeys(issuer: string) {
  if (accessKeyCache?.issuer === issuer && accessKeyCache.expiresAt > Date.now()) {
    return accessKeyCache.keys;
  }
  const response = await fetch(`${issuer}/cdn-cgi/access/certs`, {
    headers: { accept: "application/json" },
  });
  if (!response.ok) return [];
  const result = await response.json<{ keys?: AccessJwk[] }>();
  const keys = Array.isArray(result.keys) ? result.keys : [];
  accessKeyCache = { issuer, keys, expiresAt: Date.now() + 5 * 60 * 1000 };
  return keys;
}

async function verifyAccessAssertion(assertion: string, env: Env) {
  const issuer = getAccessIssuer(env.CF_ACCESS_TEAM_DOMAIN);
  const allowedAudiences = (env.CF_ACCESS_AUD || "").split(",").map((value) => value.trim()).filter(Boolean);
  if (!issuer || !allowedAudiences.length) return null;

  const parts = assertion.split(".");
  if (parts.length !== 3) return null;
  const header = decodeJwtPart<AccessJwtHeader>(parts[0]);
  const payload = decodeJwtPart<AccessJwtPayload>(parts[1]);
  const signature = decodeJwtSignature(parts[2]);
  if (!header || !payload || !signature || header.alg !== "RS256" || !header.kid) return null;

  const now = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(payload.aud) ? payload.aud : payload.aud ? [payload.aud] : [];
  if (
    payload.iss !== issuer
    || typeof payload.exp !== "number"
    || payload.exp <= now
    || (typeof payload.nbf === "number" && payload.nbf > now)
    || !audiences.some((audience) => allowedAudiences.includes(audience))
  ) {
    return null;
  }

  try {
    const keys = await getAccessKeys(issuer);
    const key = keys.find((candidate) => candidate.kid === header.kid);
    if (!key) return null;
    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      key,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      signature,
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
    return valid && typeof payload.email === "string" ? payload.email.trim().toLowerCase() : null;
  } catch {
    return null;
  }
}

async function isAdminRequest(request: Request, env: Env) {
  const url = new URL(request.url);
  if (url.hostname === "127.0.0.1" || url.hostname === "localhost") return true;

  const accessAssertion = request.headers.get("cf-access-jwt-assertion");
  const allowedEmail = env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!accessAssertion || !allowedEmail) return false;
  const verifiedEmail = await verifyAccessAssertion(accessAssertion, env);
  return Boolean(verifiedEmail && verifiedEmail === allowedEmail);
}

function normalizeManagedImagePath(value: string | null) {
  if (!value || !value.startsWith("/images/") || value.includes("..")) return null;
  return /^\/images\/[a-zA-Z0-9/_\-.]+\.(?:png|jpe?g|webp|avif)$/i.test(value) ? value : null;
}

const managedImageTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/avif"]);
const maxManagedImageSize = 8 * 1024 * 1024;
const managedVideoTypes = new Set(["video/mp4", "video/webm"]);
const managedVideoSlots = new Set(["hero-showcase", "hot-product-showcase", "print-process", "customer-review"]);
const maxManagedVideoSize = 95 * 1024 * 1024;
const managedCollectionMediaTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif", "video/mp4", "video/webm"]);
const managedCollectionIds = new Set(Object.keys(DEFAULT_MEDIA_COLLECTIONS));
const maxManagedCollectionImageSize = 12 * 1024 * 1024;
const allowedQuoteFileExtensions = new Set<string>(QUOTE_FILE_EXTENSIONS);
let cachedOverridePaths: Set<string> | null = null;
let overridePathsExpireAt = 0;

function getQuoteRequestId(value: string | null) {
  return value && /^[a-z0-9-]{8,64}$/i.test(value) ? value : null;
}

function getQuoteField(form: FormData, name: string, maxLength: number) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function getQuoteFileExtension(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot + 1).toLowerCase() : "";
}

function safeDownloadFileName(value: string) {
  return value.replace(/[\r\n"]/g, "").slice(0, 180) || "vinprint-file";
}

function startsWithBytes(bytes: Uint8Array, expected: number[]) {
  return expected.every((value, index) => bytes[index] === value);
}

async function validateQuoteFile(file: File) {
  const extension = getQuoteFileExtension(file.name);
  if (!allowedQuoteFileExtensions.has(extension)) return null;

  const bytes = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes).replace(/^\uFEFF/, "").trimStart();
  const isPdf = text.startsWith("%PDF-");
  const isPostScript = text.startsWith("%!PS");
  const isZip = startsWithBytes(bytes, [0x50, 0x4b, 0x03, 0x04])
    || startsWithBytes(bytes, [0x50, 0x4b, 0x05, 0x06])
    || startsWithBytes(bytes, [0x50, 0x4b, 0x07, 0x08]);
  const isRiff = startsWithBytes(bytes, [0x52, 0x49, 0x46, 0x46]);
  const isValid = {
    pdf: isPdf,
    png: startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    jpg: startsWithBytes(bytes, [0xff, 0xd8, 0xff]),
    jpeg: startsWithBytes(bytes, [0xff, 0xd8, 0xff]),
    webp: isRiff && startsWithBytes(bytes.slice(8), [0x57, 0x45, 0x42, 0x50]),
    zip: isZip,
    svg: /^<\?xml[\s\S]{0,300}<svg\b/i.test(text) || /^<svg\b/i.test(text),
    ai: isPdf || isPostScript,
    eps: isPostScript,
    cdr: isRiff || isZip,
  }[extension];
  if (!isValid) return null;

  if (extension === "pdf") return "application/pdf";
  if (extension === "png") return "image/png";
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "webp") return "image/webp";
  if (extension === "zip") return "application/zip";
  return "application/octet-stream";
}

async function parseBoundedMultipartForm(request: Request, maxBytes: number) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data") || !request.body) {
    return { error: "invalid_form" as const };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      return { error: "file_too_large" as const };
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const form = await new Response(body, { headers: { "content-type": contentType } }).formData();
    return { form };
  } catch {
    return { error: "invalid_form" as const };
  }
}

async function consumeQuoteRateLimit(bucket: R2Bucket, request: Request) {
  const url = new URL(request.url);
  if (url.hostname === "127.0.0.1" || url.hostname === "localhost") return true;

  const clientIp = request.headers.get("cf-connecting-ip")?.trim() || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(clientIp));
  const clientKey = [...new Uint8Array(digest)].slice(0, 12).map((value) => value.toString(16).padStart(2, "0")).join("");
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const windowStart = Math.floor(now / windowMs) * windowMs;

  // Keys begin with the fixed window timestamp, so stale windows are listed
  // first and can be cleaned incrementally without retaining one object per IP.
  const stale = await bucket.list({ prefix: "quote-requests/rate/", limit: 100 });
  const staleKeys = stale.objects
    .filter((object) => {
      const timestamp = Number(object.key.split("/")[2]);
      return Number.isFinite(timestamp) && timestamp < windowStart;
    })
    .map((object) => object.key);
  if (staleKeys.length) await Promise.allSettled(staleKeys.map((key) => bucket.delete(key)));

  for (let slot = 0; slot < 5; slot += 1) {
    const claimed = await bucket.put(
      `quote-requests/rate/${windowStart}/${clientKey}/${slot}`,
      new Uint8Array(),
      {
        onlyIf: { etagDoesNotMatch: "*" },
        httpMetadata: { contentType: "application/octet-stream", cacheControl: "no-store" },
      },
    );
    if (claimed) return true;
  }
  return false;
}

async function getQuoteRequests(bucket: R2Bucket, cursor?: string) {
  const listed = await bucket.list({
    prefix: "quote-requests/records/",
    limit: 48,
    cursor: cursor || undefined,
  });
  const records = await Promise.all(listed.objects.map(async (entry) => {
    const object = await bucket.get(entry.key);
    if (!object) return null;
    try {
      return await object.json<QuoteRequestRecord>();
    } catch {
      return null;
    }
  }));
  const items = records
    .filter((record): record is QuoteRequestRecord => Boolean(record?.id && record?.createdAt))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  return {
    items,
    cursor: listed.truncated && listed.cursor ? listed.cursor : null,
  };
}

async function getOverridePaths(bucket: R2Bucket, force = false) {
  if (!force && cachedOverridePaths && Date.now() < overridePathsExpireAt) return cachedOverridePaths;
  const listed = await bucket.list({ prefix: "overrides/images/", limit: 1000 });
  cachedOverridePaths = new Set(listed.objects.map((object) => object.key));
  overridePathsExpireAt = Date.now() + 60_000;
  return cachedOverridePaths;
}

async function getManagedImageOverride(pathname: string, bucket?: R2Bucket) {
  if (!bucket) return null;
  const objectKey = `overrides${pathname}`;
  const overridePaths = await getOverridePaths(bucket);
  if (!overridePaths.has(objectKey)) return null;

  const object = await bucket.get(objectKey);
  if (!object) {
    overridePaths.delete(objectKey);
    return null;
  }

  return new Response(object.body, {
    headers: {
      "cache-control": "no-store",
      "content-type": object.httpMetadata?.contentType || "image/png",
      etag: object.httpEtag,
    },
  });
}

function withNoStore(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("cache-control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function normalizeManagedVideoSlot(value: string | null) {
  return value && managedVideoSlots.has(value) ? value : null;
}

function resolveByteRange(rangeHeader: string | null | undefined, totalSize: number) {
  const match = rangeHeader?.match(/^bytes=(\d*)-(\d*)$/i);
  if (!match) return null;
  if (match[1]) {
    const offset = Math.min(Number(match[1]), Math.max(0, totalSize - 1));
    const end = match[2] ? Math.min(Number(match[2]), totalSize - 1) : totalSize - 1;
    return { offset, length: Math.max(0, end - offset + 1) };
  }
  const suffix = Math.min(Number(match[2] || 0), totalSize);
  return { offset: Math.max(0, totalSize - suffix), length: suffix };
}

async function getManagedVideo(slot: string, bucket?: R2Bucket, rangeHeader?: string | null) {
  if (!bucket) return null;
  const rangeHeaders = rangeHeader ? new Headers({ range: rangeHeader }) : undefined;
  const object = await bucket.get(`overrides/videos/${slot}`, rangeHeaders ? { range: rangeHeaders } : undefined);
  if (!object) return null;
  const headers = new Headers({
    "accept-ranges": "bytes",
    "cache-control": "no-store",
    "content-type": object.httpMetadata?.contentType || "video/mp4",
    etag: object.httpEtag,
  });
  let status = 200;
  let responseLength = object.size;
  const responseRange = object.range ? resolveByteRange(rangeHeader, object.size) : null;
  if (responseRange) {
    const { offset, length } = responseRange;
    headers.set("content-range", `bytes ${offset}-${Math.max(offset, offset + length - 1)}/${object.size}`);
    responseLength = length;
    status = 206;
  }
  headers.set("content-length", String(responseLength));
  return new Response(object.body, {
    status,
    headers,
  });
}

function normalizeMediaCollection(value: string | null) {
  return value && managedCollectionIds.has(value) ? value as MediaCollectionId : null;
}

function normalizeMediaItemId(value: string | null) {
  return isValidManagedMediaItemId(value) ? value : null;
}

async function getMediaCollection(collection: MediaCollectionId, bucket: R2Bucket) {
  const manifest = await bucket.get(`collections/manifests/${collection}.json`);
  if (!manifest) return DEFAULT_MEDIA_COLLECTIONS[collection].map((item) => ({ ...item }));
  try {
    const items = await manifest.json<ManagedMediaItem[]>();
    return Array.isArray(items) ? items.filter((item) => item && typeof item.id === "string" && typeof item.src === "string") : [];
  } catch {
    return DEFAULT_MEDIA_COLLECTIONS[collection].map((item) => ({ ...item }));
  }
}

async function saveMediaCollection(collection: MediaCollectionId, items: ManagedMediaItem[], bucket: R2Bucket) {
  await bucket.put(`collections/manifests/${collection}.json`, JSON.stringify(items), {
    httpMetadata: { contentType: "application/json", cacheControl: "no-store" },
  });
}

async function getContentOverrides(type: ManagedContentType, bucket: R2Bucket) {
  const prefix = `content/overrides/${type}/`;
  const listed = await bucket.list({ prefix, limit: 200 });
  const objects = await Promise.all(listed.objects.map((entry) => bucket.get(entry.key)));
  const items = await Promise.all(objects.map(async (object) => {
    if (!object) return null;
    try {
      return parseManagedContentOverride(type, await object.json<unknown>());
    } catch {
      return null;
    }
  }));
  const validItems = items.filter((item) => item !== null);
  if (validItems.length || listed.objects.length) return validItems;

  // Read the original manifest format once so existing deployments migrate
  // without losing edits. New writes are per slug to avoid lost updates.
  const legacyObject = await bucket.get(`content/overrides/${type}.json`);
  if (!legacyObject) return [];
  try {
    const values = await legacyObject.json<unknown[]>();
    if (!Array.isArray(values)) return [];
    const migratedItems = values.flatMap((value) => {
      try {
        return [parseManagedContentOverride(type, value)];
      } catch {
        return [];
      }
    });
    await Promise.all(migratedItems.map((item) => saveContentOverride(type, item, bucket)));
    await bucket.delete(`content/overrides/${type}.json`);
    return migratedItems;
  } catch {
    return [];
  }
}

async function saveContentOverride(type: ManagedContentType, item: { slug: string }, bucket: R2Bucket) {
  await bucket.put(`content/overrides/${type}/${item.slug}.json`, JSON.stringify(item), {
    httpMetadata: { contentType: "application/json", cacheControl: "no-store" },
  });
}

async function getCollectionMedia(collection: MediaCollectionId, id: string, bucket?: R2Bucket, rangeHeader?: string | null) {
  if (!bucket) return null;
  const rangeHeaders = rangeHeader ? new Headers({ range: rangeHeader }) : undefined;
  const object = await bucket.get(`collections/assets/${collection}/${id}`, rangeHeaders ? { range: rangeHeaders } : undefined);
  if (!object) return null;
  const headers = new Headers({
    "cache-control": "no-store",
    "content-type": object.httpMetadata?.contentType || "application/octet-stream",
    etag: object.httpEtag,
  });
  let status = 200;
  let responseLength = object.size;
  if (object.httpMetadata?.contentType?.startsWith("video/")) headers.set("accept-ranges", "bytes");
  const responseRange = object.range ? resolveByteRange(rangeHeader, object.size) : null;
  if (responseRange) {
    const { offset, length } = responseRange;
    headers.set("content-range", `bytes ${offset}-${Math.max(offset, offset + length - 1)}/${object.size}`);
    responseLength = length;
    status = 206;
  }
  headers.set("content-length", String(responseLength));
  return new Response(object.body, { status, headers });
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

function resolvePreviewImageUrl(value: string | null, requestUrl: string) {
  if (!value) return null;

  try {
    if (value.startsWith("/") && !value.startsWith("//")) {
      const localUrl = new URL(value, requestUrl);
      return localUrl.pathname.startsWith("/images/") ? localUrl : null;
    }

  } catch {
    return null;
  }

  return null;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const legacyRedirect = resolveLegacyRedirect(url);

    if (url.pathname.startsWith("/admin") && !await isAdminRequest(request, env)) {
      return new Response("Khu vực quản trị yêu cầu đăng nhập qua Cloudflare Access.", {
        status: 401,
        headers: { "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" },
      });
    }

    if (url.pathname === "/api/quote-requests") {
      if (request.method !== "POST") {
        return new Response(null, { status: 405, headers: { allow: "POST" } });
      }
      const requestOrigin = request.headers.get("origin");
      if (requestOrigin && requestOrigin !== url.origin) {
        return Response.json({ error: "cross_origin_request" }, { status: 403 });
      }
      const declaredSize = Number(request.headers.get("content-length") || 0);
      if (declaredSize > QUOTE_FILE_MAX_BYTES + 1024 * 1024) {
        return Response.json({ error: "file_too_large" }, { status: 413 });
      }
      if (!env.HERO_IMAGES) {
        return Response.json({ error: "storage_unavailable" }, { status: 503 });
      }
      try {
        if (!await consumeQuoteRateLimit(env.HERO_IMAGES, request)) {
          return Response.json(
            { error: "rate_limited" },
            { status: 429, headers: { "retry-after": "600", "cache-control": "no-store" } },
          );
        }
      } catch {
        return Response.json({ error: "rate_limit_unavailable" }, { status: 503 });
      }

      const parsedForm = await parseBoundedMultipartForm(request, QUOTE_FILE_MAX_BYTES + 1024 * 1024);
      if ("error" in parsedForm) {
        return Response.json(
          { error: parsedForm.error },
          { status: parsedForm.error === "file_too_large" ? 413 : 400 },
        );
      }
      const form = parsedForm.form;

      if (getQuoteField(form, "companyWebsite", 200)) {
        return Response.json({ ok: true, code: "VP-RECEIVED" }, { status: 201 });
      }

      const customerName = getQuoteField(form, "customerName", 80);
      const phone = getQuoteField(form, "phone", 20);
      const phoneDigits = phone.replace(/\D/g, "");
      const quantity = Number(getQuoteField(form, "quantity", 12));
      const productSlug = getQuoteField(form, "productSlug", 80);
      const productTitle = getQuoteField(form, "productTitle", 120);
      const artwork = form.get("artwork");

      if (customerName.length < 2) {
        return Response.json({ error: "invalid_customer_name" }, { status: 400 });
      }
      if (phoneDigits.length < 9 || phoneDigits.length > 15) {
        return Response.json({ error: "invalid_phone" }, { status: 400 });
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10_000_000) {
        return Response.json({ error: "invalid_quantity" }, { status: 400 });
      }
      if (!(artwork instanceof File) || !artwork.size) {
        return Response.json({ error: "invalid_file" }, { status: 400 });
      }
      if (artwork.size > QUOTE_FILE_MAX_BYTES) {
        return Response.json({ error: "file_too_large" }, { status: 413 });
      }
      const safeFileType = await validateQuoteFile(artwork);
      if (!safeFileType) {
        return Response.json({ error: "invalid_file" }, { status: 400 });
      }

      const id = crypto.randomUUID();
      const now = new Date();
      const code = `VP-${now.toISOString().slice(0, 10).replaceAll("-", "")}-${id.slice(0, 6).toUpperCase()}`;
      const record: QuoteRequestRecord = {
        id,
        code,
        customerName,
        phone,
        quantity,
        productSlug,
        productTitle,
        fileName: safeDownloadFileName(artwork.name),
        fileType: safeFileType,
        fileSize: artwork.size,
        createdAt: now.toISOString(),
      };

      const recordKey = `quote-requests/records/${id}.json`;
      const fileKey = `quote-requests/files/${id}/artwork`;
      try {
        await env.HERO_IMAGES.put(fileKey, artwork.stream(), {
          httpMetadata: { contentType: record.fileType, cacheControl: "private, no-store" },
        });
        await env.HERO_IMAGES.put(recordKey, JSON.stringify(record), {
          httpMetadata: { contentType: "application/json", cacheControl: "no-store" },
        });
      } catch {
        await Promise.allSettled([
          env.HERO_IMAGES.delete(recordKey),
          env.HERO_IMAGES.delete(fileKey),
        ]);
        return Response.json({ error: "storage_failed" }, { status: 503 });
      }

      return Response.json(
        { ok: true, id, code },
        { status: 201, headers: { "cache-control": "no-store" } },
      );
    }

    if (url.pathname === "/api/admin/quote-requests") {
      if (!await isAdminRequest(request, env)) {
        return Response.json({ error: "unauthorized" }, { status: 401 });
      }
      if (!env.HERO_IMAGES) {
        return Response.json({ error: "storage_unavailable" }, { status: 503 });
      }

      const id = getQuoteRequestId(url.searchParams.get("id"));
      if (request.method === "GET" && url.searchParams.get("file") === "1") {
        if (!id) return Response.json({ error: "invalid_request_id" }, { status: 400 });
        const [recordObject, fileObject] = await Promise.all([
          env.HERO_IMAGES.get(`quote-requests/records/${id}.json`),
          env.HERO_IMAGES.get(`quote-requests/files/${id}/artwork`),
        ]);
        if (!recordObject || !fileObject) return new Response(null, { status: 404 });
        const record = await recordObject.json<QuoteRequestRecord>();
        return new Response(fileObject.body, {
          headers: {
            "cache-control": "private, no-store",
            "content-type": record.fileType || "application/octet-stream",
            "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(record.fileName)}`,
            "content-security-policy": "sandbox",
            "x-content-type-options": "nosniff",
          },
        });
      }

      if (request.method === "GET") {
        const cursor = url.searchParams.get("cursor")?.slice(0, 1024) || undefined;
        const page = await getQuoteRequests(env.HERO_IMAGES, cursor);
        return Response.json(page, { headers: { "cache-control": "no-store" } });
      }

      if (request.method === "DELETE") {
        if (!id) return Response.json({ error: "invalid_request_id" }, { status: 400 });
        try {
          await env.HERO_IMAGES.delete(`quote-requests/files/${id}/artwork`);
          await env.HERO_IMAGES.delete(`quote-requests/records/${id}.json`);
        } catch {
          return Response.json({ error: "delete_failed" }, { status: 503 });
        }
        return Response.json({ ok: true, id }, { headers: { "cache-control": "no-store" } });
      }

      return new Response(null, { status: 405, headers: { allow: "GET, DELETE" } });
    }

    if (url.pathname === "/api/admin/images") {
      if (!await isAdminRequest(request, env)) {
        return Response.json({ error: "unauthorized" }, { status: 401 });
      }

      if (!env.HERO_IMAGES) {
        return Response.json({ error: "storage_unavailable" }, { status: 503 });
      }

      if (request.method === "GET") {
        if (url.searchParams.has("path")) {
          const currentPath = normalizeManagedImagePath(url.searchParams.get("path"));
          if (!currentPath) return Response.json({ error: "invalid_image_path" }, { status: 400 });

          const override = await getManagedImageOverride(currentPath, env.HERO_IMAGES);
          if (override) return override;

          const staticAssetUrl = new URL(currentPath, request.url);
          staticAssetUrl.searchParams.set("vinprint_asset", "1");
          if (env.ASSETS?.fetch) {
            return withNoStore(await env.ASSETS.fetch(new Request(staticAssetUrl)));
          }
          return new Response(null, {
            status: 302,
            headers: { location: staticAssetUrl.toString(), "cache-control": "no-store" },
          });
        }

        const listed = await env.HERO_IMAGES.list({ prefix: "overrides/images/", limit: 1000, include: ["customMetadata", "httpMetadata"] });
        return Response.json({
          items: listed.objects.map((object) => ({
            path: `/${object.key.slice("overrides/".length)}`,
            bytes: object.size,
            uploadedAt: object.customMetadata?.uploadedAt || object.uploaded.toISOString(),
            uploadedBy: object.customMetadata?.uploadedBy || "",
          })),
        }, { headers: { "cache-control": "no-store" } });
      }

      const managedPath = normalizeManagedImagePath(url.searchParams.get("path"));
      if (!managedPath) {
        return Response.json({ error: "invalid_image_path" }, { status: 400 });
      }
      const objectKey = `overrides${managedPath}`;

      if (request.method === "DELETE") {
        await env.HERO_IMAGES.delete(objectKey);
        cachedOverridePaths?.delete(objectKey);
        return Response.json({ ok: true, path: managedPath }, { headers: { "cache-control": "no-store" } });
      }

      if (request.method !== "PUT") {
        return new Response(null, { status: 405, headers: { allow: "GET, PUT, DELETE" } });
      }

      const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() || "";
      if (!managedImageTypes.has(contentType)) {
        return Response.json({ error: "invalid_image_type" }, { status: 415 });
      }

      const declaredSize = Number(request.headers.get("content-length") || 0);
      if (declaredSize > maxManagedImageSize) {
        return Response.json({ error: "image_too_large" }, { status: 413 });
      }

      const bytes = await request.arrayBuffer();
      if (!bytes.byteLength || bytes.byteLength > maxManagedImageSize) {
        return Response.json({ error: "image_too_large" }, { status: 413 });
      }

      const uploadedBy = (request.headers.get("cf-access-authenticated-user-email") || request.headers.get("oai-authenticated-user-email") || "local-preview").trim().toLowerCase();
      await env.HERO_IMAGES.put(objectKey, bytes, {
        httpMetadata: { contentType, cacheControl: "no-store" },
        customMetadata: { uploadedAt: new Date().toISOString(), uploadedBy },
      });
      cachedOverridePaths?.add(objectKey);

      return Response.json({ ok: true, path: managedPath, version: Date.now() }, { headers: { "cache-control": "no-store" } });
    }

    if (url.pathname === "/api/media/collections" && request.method === "GET") {
      if (!env.HERO_IMAGES) return Response.json({ error: "storage_unavailable" }, { status: 503 });
      const collection = normalizeMediaCollection(url.searchParams.get("collection"));
      if (!collection) return Response.json({ error: "invalid_collection" }, { status: 400 });
      const items = await getMediaCollection(collection, env.HERO_IMAGES);
      return Response.json({ collection, items }, { headers: { "cache-control": "no-store" } });
    }

    if (url.pathname === "/api/content/overrides" && request.method === "GET") {
      if (!env.HERO_IMAGES) return Response.json({ items: [] }, { headers: { "cache-control": "no-store" } });
      const type = url.searchParams.get("type");
      if (!isManagedContentType(type)) return Response.json({ error: "invalid_content_type" }, { status: 400 });
      const items = await getContentOverrides(type, env.HERO_IMAGES);
      return Response.json({ type, items }, { headers: { "cache-control": "no-store" } });
    }

    if (url.pathname === "/api/admin/content") {
      if (!await isAdminRequest(request, env)) return Response.json({ error: "unauthorized" }, { status: 401 });
      if (!env.HERO_IMAGES) return Response.json({ error: "storage_unavailable" }, { status: 503 });
      const type = url.searchParams.get("type");
      if (!isManagedContentType(type)) return Response.json({ error: "invalid_content_type" }, { status: 400 });
      const items = await getContentOverrides(type, env.HERO_IMAGES);

      if (request.method === "GET") {
        return Response.json({ type, items }, { headers: { "cache-control": "no-store" } });
      }

      if (request.method === "DELETE") {
        const slug = url.searchParams.get("slug");
        if (!slug) return Response.json({ error: "invalid_slug" }, { status: 400 });
        await env.HERO_IMAGES.delete(`content/overrides/${type}/${slug}.json`);
        const nextItems = items.filter((item) => item.slug !== slug);
        return Response.json({ ok: true, type, items: nextItems }, { headers: { "cache-control": "no-store" } });
      }

      if (request.method === "PATCH") {
        try {
          const item = parseManagedContentOverride(type, await request.json());
          const nextItems = items.some((entry) => entry.slug === item.slug)
            ? items.map((entry) => entry.slug === item.slug ? item : entry)
            : [...items, item];
          await saveContentOverride(type, item, env.HERO_IMAGES);
          return Response.json({ ok: true, type, item, items: nextItems }, { headers: { "cache-control": "no-store" } });
        } catch {
          return Response.json({ error: "invalid_content" }, { status: 400 });
        }
      }

      return new Response(null, { status: 405, headers: { allow: "GET, PATCH, DELETE" } });
    }

    if (url.pathname === "/api/admin/media-collections") {
      if (!await isAdminRequest(request, env)) return Response.json({ error: "unauthorized" }, { status: 401 });
      if (!env.HERO_IMAGES) return Response.json({ error: "storage_unavailable" }, { status: 503 });

      const collection = normalizeMediaCollection(url.searchParams.get("collection"));
      if (!collection) return Response.json({ error: "invalid_collection" }, { status: 400 });

      if (request.method === "GET") {
        const items = await getMediaCollection(collection, env.HERO_IMAGES);
        return Response.json({ collection, items }, { headers: { "cache-control": "no-store" } });
      }

      if (request.method === "POST") {
        const action = url.searchParams.get("action");
        const items = await getMediaCollection(collection, env.HERO_IMAGES);

        if (action === "restore-missing") {
          const existingIds = new Set(items.map((item) => item.id));
          const restored = DEFAULT_MEDIA_COLLECTIONS[collection].filter((item) => !existingIds.has(item.id)).map((item) => ({ ...item }));
          const nextItems = [...items, ...restored];
          await saveMediaCollection(collection, nextItems, env.HERO_IMAGES);
          return Response.json({ ok: true, collection, items: nextItems }, { headers: { "cache-control": "no-store" } });
        }

        if (action === "restore-item") {
          const id = normalizeMediaItemId(url.searchParams.get("id"));
          const original = id ? DEFAULT_MEDIA_COLLECTIONS[collection].find((item) => item.id === id) : undefined;
          if (!id || !original) return Response.json({ error: "original_media_not_found" }, { status: 400 });
          await env.HERO_IMAGES.delete(`collections/assets/${collection}/${id}`);
          const currentIndex = items.findIndex((item) => item.id === id);
          const nextItems = currentIndex >= 0
            ? items.map((item, index) => index === currentIndex ? { ...original } : item)
            : [...items, { ...original }];
          await saveMediaCollection(collection, nextItems, env.HERO_IMAGES);
          return Response.json({ ok: true, collection, item: original, items: nextItems }, { headers: { "cache-control": "no-store" } });
        }

        return Response.json({ error: "invalid_action" }, { status: 400 });
      }

      const id = normalizeMediaItemId(url.searchParams.get("id"));
      if (!id) return Response.json({ error: "invalid_media_id" }, { status: 400 });

      if (request.method === "PATCH") {
        const title = (url.searchParams.get("title") || "").trim().slice(0, 120);
        if (!title) return Response.json({ error: "invalid_title" }, { status: 400 });
        const items = await getMediaCollection(collection, env.HERO_IMAGES);
        if (!items.some((item) => item.id === id)) return Response.json({ error: "media_not_found" }, { status: 404 });
        const nextItems = items.map((item) => item.id === id ? { ...item, title } : item);
        await saveMediaCollection(collection, nextItems, env.HERO_IMAGES);
        return Response.json({ ok: true, collection, items: nextItems }, { headers: { "cache-control": "no-store" } });
      }

      if (request.method === "DELETE") {
        const items = await getMediaCollection(collection, env.HERO_IMAGES);
        const removed = items.find((item) => item.id === id);
        const nextItems = items.filter((item) => item.id !== id);
        if (removed?.src.startsWith(`/media/collections/${collection}/`)) {
          await env.HERO_IMAGES.delete(`collections/assets/${collection}/${id}`);
        }
        await saveMediaCollection(collection, nextItems, env.HERO_IMAGES);
        return Response.json({ ok: true, collection, id, items: nextItems }, { headers: { "cache-control": "no-store" } });
      }

      if (request.method !== "PUT") return new Response(null, { status: 405, headers: { allow: "GET, PUT, PATCH, POST, DELETE" } });
      const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() || "";
      if (!managedCollectionMediaTypes.has(contentType)) return Response.json({ error: "invalid_media_type" }, { status: 415 });
      if (contentType.startsWith("video/") && collection !== "hot-products") return Response.json({ error: "video_not_allowed" }, { status: 415 });
      const declaredSize = Number(request.headers.get("content-length") || 0);
      const sizeLimit = contentType.startsWith("video/") ? maxManagedVideoSize : maxManagedCollectionImageSize;
      if (!request.body || declaredSize > sizeLimit) return Response.json({ error: "media_too_large" }, { status: 413 });

      const title = (url.searchParams.get("title") || "Mẫu sản phẩm mới").trim().slice(0, 120);
      const category = (url.searchParams.get("category") || "Sản phẩm VinPrint").trim().slice(0, 80);
      const hrefValue = url.searchParams.get("href") || "/san-pham";
      const href = hrefValue.startsWith("/") && !hrefValue.startsWith("//") ? hrefValue.slice(0, 200) : "/san-pham";
      const kind = contentType === "image/gif" ? "gif" : contentType.startsWith("video/") ? "video" : "image";
      const item: ManagedMediaItem = { id, kind, src: `/media/collections/${collection}/${id}`, title, category, href };

      await env.HERO_IMAGES.put(`collections/assets/${collection}/${id}`, request.body, {
        httpMetadata: { contentType, cacheControl: "no-store" },
        customMetadata: { uploadedAt: new Date().toISOString(), collection, id },
      });
      const items = await getMediaCollection(collection, env.HERO_IMAGES);
      const existingIndex = items.findIndex((entry) => entry.id === id);
      const nextItems = existingIndex >= 0
        ? items.map((entry, index) => index === existingIndex ? item : entry)
        : [...items, item];
      await saveMediaCollection(collection, nextItems, env.HERO_IMAGES);
      return Response.json({ ok: true, collection, item, items: nextItems, version: Date.now() }, { headers: { "cache-control": "no-store" } });
    }

    if (request.method === "GET" && url.pathname.startsWith("/media/collections/")) {
      const parts = url.pathname.slice("/media/collections/".length).split("/");
      const collection = normalizeMediaCollection(parts[0] || null);
      const id = normalizeMediaItemId(parts[1] || null);
      if (!collection || !id) return new Response(null, { status: 404, headers: { "cache-control": "no-store" } });
      const media = await getCollectionMedia(collection, id, env.HERO_IMAGES, request.headers.get("range"));
      return media || new Response(null, { status: 404, headers: { "cache-control": "no-store" } });
    }

    if (url.pathname === "/api/admin/videos") {
      if (!await isAdminRequest(request, env)) {
        return Response.json({ error: "unauthorized" }, { status: 401 });
      }
      if (!env.HERO_IMAGES) {
        return Response.json({ error: "storage_unavailable" }, { status: 503 });
      }

      const slot = normalizeManagedVideoSlot(url.searchParams.get("slot"));
      if (request.method === "GET") {
        if (url.searchParams.has("slot")) {
          if (!slot) return Response.json({ error: "invalid_video_slot" }, { status: 400 });
          const video = await getManagedVideo(slot, env.HERO_IMAGES, request.headers.get("range"));
          return video || new Response(null, { status: 404, headers: { "cache-control": "no-store" } });
        }

        const listed = await env.HERO_IMAGES.list({ prefix: "overrides/videos/", limit: 100 });
        return Response.json({
          items: listed.objects.map((object) => ({
            slot: object.key.slice("overrides/videos/".length),
            bytes: object.size,
            uploadedAt: object.customMetadata?.uploadedAt || object.uploaded.toISOString(),
            uploadedBy: object.customMetadata?.uploadedBy || "",
            contentType: object.httpMetadata?.contentType || "video/mp4",
          })),
        }, { headers: { "cache-control": "no-store" } });
      }

      if (!slot) return Response.json({ error: "invalid_video_slot" }, { status: 400 });
      const objectKey = `overrides/videos/${slot}`;

      if (request.method === "DELETE") {
        await env.HERO_IMAGES.delete(objectKey);
        return Response.json({ ok: true, slot }, { headers: { "cache-control": "no-store" } });
      }
      if (request.method !== "PUT") {
        return new Response(null, { status: 405, headers: { allow: "GET, PUT, DELETE" } });
      }

      const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() || "";
      if (!managedVideoTypes.has(contentType)) {
        return Response.json({ error: "invalid_video_type" }, { status: 415 });
      }
      const declaredSize = Number(request.headers.get("content-length") || 0);
      if (!request.body || declaredSize > maxManagedVideoSize) {
        return Response.json({ error: "video_too_large" }, { status: 413 });
      }

      const uploadedBy = (request.headers.get("cf-access-authenticated-user-email") || request.headers.get("oai-authenticated-user-email") || "local-preview").trim().toLowerCase();
      await env.HERO_IMAGES.put(objectKey, request.body, {
        httpMetadata: { contentType, cacheControl: "no-store" },
        customMetadata: { uploadedAt: new Date().toISOString(), uploadedBy },
      });
      return Response.json({ ok: true, slot, version: Date.now() }, { headers: { "cache-control": "no-store" } });
    }

    if (request.method === "GET" && url.pathname.startsWith("/media/videos/")) {
      const slot = normalizeManagedVideoSlot(url.pathname.slice("/media/videos/".length));
      if (!slot) return new Response(null, { status: 404, headers: { "cache-control": "no-store" } });
      const video = await getManagedVideo(slot, env.HERO_IMAGES, request.headers.get("range"));
      return video || new Response(null, { status: 404, headers: { "cache-control": "no-store" } });
    }

    if (request.method === "GET" && url.pathname.startsWith("/images/") && env.HERO_IMAGES) {
      const override = await getManagedImageOverride(url.pathname, env.HERO_IMAGES);
      if (override) return override;

      // Keep every admin-manageable image URL revalidatable. Without this
      // redirect, a browser can retain the original static file and never ask
      // the Worker for a newly uploaded override at the same pathname.
      if (url.searchParams.get("vinprint_asset") !== "1") {
        const staticAssetUrl = new URL(url);
        staticAssetUrl.searchParams.set("vinprint_asset", "1");
        return new Response(null, {
          status: 307,
          headers: {
            location: staticAssetUrl.toString(),
            "cache-control": "no-store",
          },
        });
      }
    }

    if (legacyRedirect) {
      return new Response(null, {
        status: 301,
        headers: {
          location: legacyRedirect.toString(),
          "cache-control": "public, max-age=3600",
        },
      });
    }

    if (url.pathname === "/_vinext/image") {
      const fetchSourceAsset = async (path: string) => {
        const assetRequest = new Request(new URL(path, request.url));
        const assetUrl = new URL(assetRequest.url);
        if (assetUrl.pathname.startsWith("/images/")) {
          const override = await getManagedImageOverride(assetUrl.pathname, env.HERO_IMAGES);
          if (override) return override;
        }
        return env.ASSETS?.fetch
          ? env.ASSETS.fetch(assetRequest)
          : fetch(assetRequest);
      };
      const imageUrl = resolvePreviewImageUrl(url.searchParams.get("url"), request.url);
      if (!imageUrl) {
        return new Response("Invalid image URL", { status: 400 });
      }
      const fetchFallbackImage = async () => {
        if (imageUrl.origin !== url.origin) {
          return fetch(new Request(imageUrl));
        }

        const override = await getManagedImageOverride(imageUrl.pathname, env.HERO_IMAGES);
        if (override) return override;

        if (env.ASSETS?.fetch) {
          return fetchSourceAsset(`${imageUrl.pathname}${imageUrl.search}`);
        }

        // Cloudflare production builds can serve static assets without exposing
        // an ASSETS binding to the Worker. Fetching the same zone from here
        // triggers error 1042, so let the browser request the verified raw path.
        return Response.redirect(imageUrl.toString(), 302);
      };
      const images = env.IMAGES;

      if (!images) {
        return withNoStore(await fetchFallbackImage());
      }

      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      try {
        const optimizedResponse = await handleImageOptimization(request, {
          fetchAsset: fetchSourceAsset,
          transformImage: async (body, { width, format, quality }) => {
            const result = await images.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
            const transformedResponse = result.response();
            if (!transformedResponse.ok) {
              throw new Error(`Image transformation failed with status ${transformedResponse.status}`);
            }
            return transformedResponse;
          },
        }, allowedWidths);

        const response = optimizedResponse.ok || optimizedResponse.status < 500
          ? optimizedResponse
          : await fetchFallbackImage();
        return withNoStore(response);
      } catch {
        return withNoStore(await fetchFallbackImage());
      }
    }

    const response = await handler.fetch(request, env, ctx);
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("X-Frame-Options", "SAMEORIGIN");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    const contentSecurityPolicy =
      "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-src https://www.google.com https://www.google.com.vn https://www.googletagmanager.com; manifest-src 'self' https://vinprint.vn";
    headers.set(
      "Content-Security-Policy",
      url.protocol === "https:"
        ? `${contentSecurityPolicy}; upgrade-insecure-requests`
        : contentSecurityPolicy,
    );

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
