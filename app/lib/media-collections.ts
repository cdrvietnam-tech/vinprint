export type MediaKind = "image" | "gif" | "video";

export type ManagedMediaItem = {
  id: string;
  kind: MediaKind;
  src: string;
  poster?: string;
  title: string;
  category: string;
  href: string;
};

export type MediaCollectionId = "hero" | "hot-products" | "gallery" | "ai247";

export const MEDIA_COLLECTIONS: Array<{ id: MediaCollectionId; title: string; description: string; allowVideo: boolean }> = [
  { id: "hero", title: "Ảnh hero trang chủ", description: "Trình chiếu lớn ở đầu trang", allowVideo: false },
  { id: "hot-products", title: "Sản phẩm đang hot", description: "Dải tự chạy, phóng lớn ảnh, GIF hoặc video ở giữa", allowVideo: true },
  { id: "gallery", title: "Thành phẩm thực tế", description: "Lưới mẫu sản phẩm trên trang chủ", allowVideo: false },
  { id: "ai247", title: "Video AI247", description: "Thư viện video marketing tại vinprint.vn/ai247", allowVideo: true },
];

export const DEFAULT_MEDIA_COLLECTIONS: Record<MediaCollectionId, ManagedMediaItem[]> = {
  hero: [
    { id: "hero-1", kind: "image", src: "/images/tet-2027/products/tem-nhua-trong.webp", title: "Bộ mỹ phẩm thảo mộc", category: "Hero", href: "/san-pham" },
    { id: "hero-2", kind: "image", src: "/images/tet-2027/products/tem-kraft.webp", title: "Bộ trà sạch", category: "Hero", href: "/san-pham" },
    { id: "hero-3", kind: "image", src: "/images/tet-2027/products/tem-kraft.webp", title: "Bộ trà gừng", category: "Hero", href: "/san-pham" },
    { id: "hero-4", kind: "image", src: "/images/tet-2027/products/tem-vang.webp", title: "Tem ánh kim quà Tết", category: "Hero", href: "/san-pham" },
  ],
  "hot-products": [
    { id: "hot-1", kind: "image", src: "/images/tet-2027/products/tem-nhua-chong-nuoc.webp", title: "Tem nhãn đồ uống Tết", category: "Tem đồ uống", href: "/san-pham/sticker-trang-tri" },
    { id: "hot-2", kind: "image", src: "/images/tet-2027/products/tem-nhua-trong.webp", title: "Tem nhãn mỹ phẩm Tết", category: "Tem mỹ phẩm", href: "/san-pham/tem-nhua-chong-nuoc" },
    { id: "hot-3", kind: "image", src: "/images/tet-2027/products/tem-vang.webp", title: "Tem ánh kim quà Tết", category: "Tem thực phẩm", href: "/san-pham/tem-vang" },
    { id: "hot-4", kind: "image", src: "/images/tet-2027/products/tem-nhua-chong-nuoc.webp", title: "Ly đồ uống nổi bật", category: "Sticker chống nước", href: "/san-pham/tem-nhua-chong-nuoc" },
    { id: "hot-5", kind: "image", src: "/images/tet-2027/products/tem-nhua-trong.webp", title: "Hũ mỹ phẩm cao cấp", category: "Tem nhựa", href: "/san-pham/tem-nhua-trong" },
    { id: "hot-6", kind: "image", src: "/images/tet-2027/products/tem-vang.webp", title: "Hũ quà tặng ánh kim", category: "Tem vàng", href: "/san-pham/tem-vang" },
  ],
  gallery: [
    { src: "/images/tet-2027/products/tem-nhua-trong.webp", title: "Tem nhãn trên chai serum mỹ phẩm", href: "/nganh/my-pham" },
    { src: "/images/tet-2027/products/tem-kraft.webp", title: "Tem nhãn trên túi zip đựng trà", href: "/nganh/thuc-pham" },
    { src: "/images/tet-2027/products/tem-vang.webp", title: "Tem nhãn trên hũ thủy tinh mật ong", href: "/nganh/chai-lo" },
    { src: "/images/tet-2027/products/tem-giay.webp", title: "Tem giấy dán hộp kraft", href: "/san-pham/tem-giay" },
    { src: "/images/tet-2027/products/tem-nhua-chong-nuoc.webp", title: "Tem chống nước trên ly nhựa đồ uống", href: "/nganh/do-uong" },
    { src: "/images/tet-2027/products/tem-phu-san-pham.webp", title: "Tem nhãn trên hộp giấy mỹ phẩm", href: "/nganh/my-pham" },
    { src: "/images/tet-2027/products/tem-7-mau.webp", title: "Tem hologram 7 màu", href: "/san-pham/tem-7-mau" },
    { src: "/images/tet-2027/products/tem-uv-dtf.webp", title: "Tem UV DTF nổi", href: "/san-pham/tem-uv-dtf" },
    { src: "/images/tet-2027/products/tem-giay.webp", title: "Tem nhãn giấy", href: "/san-pham/tem-giay" },
    { src: "/images/tet-2027/products/tem-vang.webp", title: "Tem vàng ánh kim", href: "/san-pham/tem-vang" },
  ].map((item, index) => ({ id: `gallery-${index + 1}`, kind: "image" as const, category: "Thành phẩm", ...item })),
  ai247: [],
};
