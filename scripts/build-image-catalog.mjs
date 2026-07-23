import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { imageSize } from "image-size";

const root = process.cwd();
const publicImages = path.join(root, "public", "images");
const sourceRoot = path.join(root, "app");
const imagePattern = /\.(?:png|jpe?g|webp|avif)$/i;
const sourcePattern = /\.(?:ts|tsx|js|jsx|mjs)$/i;

async function walk(directory, pattern) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath, pattern));
    else if (pattern.test(entry.name)) files.push(fullPath);
  }
  return files;
}

function categoryFor(publicPath) {
  if (publicPath.includes("/hero-admin/")) return { id: "hero", label: "Ảnh hero", route: "/" };
  if (publicPath.includes("/hot-products/")) return { id: "hot-products", label: "Sản phẩm hot", route: "/#san-pham-noi-bat" };
  if (publicPath.includes("/products/") || publicPath.includes("/mockups/") || /\/(application-photo|materials-flatlay|holographic_sticker|hero-products)\./.test(publicPath)) return { id: "products", label: "Ảnh sản phẩm", route: "/san-pham" };
  if (publicPath.includes("/blog/")) return { id: "blog", label: "Ảnh bài viết", route: "/blog" };
  if (publicPath.includes("/reviews/") || publicPath.includes("/avatars/")) return { id: "reviews", label: "Đánh giá & khách hàng", route: "/#danh-gia" };
  if (publicPath.includes("/ai-design/")) return { id: "design", label: "Thiết kế & tư liệu", route: "/" };
  if (publicPath.includes("zalo") || publicPath.includes("logo")) return { id: "brand", label: "Thương hiệu & liên hệ", route: "/#lien-he" };
  return { id: "other", label: "Ảnh khác", route: "/" };
}

function routeForSource(relativeSource, fallbackRoute) {
  const normalized = relativeSource.replaceAll("\\", "/");
  if (normalized.includes("/blog/") || normalized.includes("articles")) return { href: "/blog", label: "Cẩm nang" };
  if (normalized.includes("products") || normalized.includes("catalog") || normalized.includes("san-pham")) return { href: "/san-pham", label: "Sản phẩm" };
  if (normalized.includes("components/home") || normalized === "app/page.tsx") return { href: "/", label: "Trang chủ" };
  return { href: fallbackRoute, label: fallbackRoute === "/" ? "Trang chủ" : "Xem vị trí dùng" };
}

function titleFor(publicPath) {
  const filename = path.basename(publicPath, path.extname(publicPath));
  return filename.replaceAll(/[-_]+/g, " ").replaceAll(/\b\w/g, (letter) => letter.toUpperCase());
}

const [imageFiles, sourceFiles] = await Promise.all([
  walk(publicImages, imagePattern),
  walk(sourceRoot, sourcePattern),
]);
const sources = await Promise.all(sourceFiles.map(async (file) => ({
  file,
  relative: path.relative(root, file),
  content: await readFile(file, "utf8"),
})));

const items = [];
for (const file of imageFiles.sort((a, b) => a.localeCompare(b))) {
  const relative = path.relative(path.join(root, "public"), file).replaceAll("\\", "/");
  const publicPath = `/${relative}`;
  const category = categoryFor(publicPath);
  const buffer = await readFile(file);
  const dimensions = imageSize(buffer);
  const fileStat = await stat(file);
  const usages = sources
    .filter((source) => source.content.includes(publicPath))
    .map((source) => routeForSource(source.relative, category.route));
  usages.push({ href: category.route, label: category.route === "/" ? "Trang chủ" : "Trang liên quan" });

  items.push({
    path: publicPath,
    title: titleFor(publicPath),
    category: category.id,
    categoryLabel: category.label,
    width: dimensions.width || null,
    height: dimensions.height || null,
    bytes: fileStat.size,
    usages: [...new Map(usages.map((usage) => [usage.href, usage])).values()],
  });
}

await writeFile(path.join(root, "public", "image-catalog.json"), `${JSON.stringify({ version: 1, items }, null, 2)}\n`, "utf8");
console.log(`Image catalog updated: ${items.length} images.`);
