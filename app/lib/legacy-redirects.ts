const LEGACY_REDIRECTS = new Map<string, string>([
  [
    "/product/sticker-trang-tri-pvc-chong-nuoc-sieu-ben-boc-khong-de-lai-keo-1000-mau-hot-trend-doc-la",
    "/san-pham/sticker-trang-tri",
  ],
]);

export function resolveLegacyRedirect(requestUrl: URL): URL | null {
  const sourcePath =
    requestUrl.pathname === "/" ? "/" : requestUrl.pathname.replace(/\/+$/, "");
  const targetPath = LEGACY_REDIRECTS.get(sourcePath);
  if (!targetPath) return null;

  const targetUrl = new URL(targetPath, requestUrl);
  targetUrl.search = requestUrl.search;
  return targetUrl;
}
