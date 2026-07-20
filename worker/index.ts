/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { resolveLegacyRedirect } from "../app/lib/legacy-redirects";

interface Env {
  ASSETS?: Fetcher;
  DB: D1Database;
  IMAGES?: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const PREVIEW_REMOTE_IMAGE_HOSTS = new Set([
  "down-vn.img.susercontent.com",
]);

function resolvePreviewImageUrl(value: string | null, requestUrl: string) {
  if (!value) return null;

  try {
    if (value.startsWith("/") && !value.startsWith("//")) {
      const localUrl = new URL(value, requestUrl);
      return localUrl.pathname.startsWith("/images/") ? localUrl : null;
    }

    const remoteUrl = new URL(value);
    if (
      remoteUrl.protocol === "https:" &&
      PREVIEW_REMOTE_IMAGE_HOSTS.has(remoteUrl.hostname)
    ) {
      return remoteUrl;
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
      const fetchSourceAsset = (path: string) => {
        const assetRequest = new Request(new URL(path, request.url));
        return env.ASSETS?.fetch
          ? env.ASSETS.fetch(assetRequest)
          : fetch(assetRequest);
      };
      const images = env.IMAGES;

      if (!images) {
        const imageUrl = resolvePreviewImageUrl(url.searchParams.get("url"), request.url);
        if (!imageUrl) {
          return new Response("Invalid image URL", { status: 400 });
        }
        return imageUrl.origin === url.origin
          ? fetchSourceAsset(`${imageUrl.pathname}${imageUrl.search}`)
          : fetch(new Request(imageUrl));
      }

      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: fetchSourceAsset,
        transformImage: async (body, { width, format, quality }) => {
          const result = await images.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    const response = await handler.fetch(request, env, ctx);
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("X-Frame-Options", "SAMEORIGIN");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    headers.set(
      "Content-Security-Policy",
      "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-src https://www.google.com https://www.google.com.vn; manifest-src 'self' https://vinprint.vn; upgrade-insecure-requests",
    );

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
